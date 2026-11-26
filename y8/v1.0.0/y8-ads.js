/* Y8 SDK adapter — Phoenix Arcade: Neon Edition v1.0.0. No mock ads in the game build. */
(function(root){
  'use strict';
  if(root.PhoenixY8)return;
  let sdk=null,initialized=false,ready=false,pending=null,activeCount=0;
  let onChange=()=>{},onActivity=()=>{};
  const notify=()=>onChange();
  const activity=()=>onActivity(activeCount>0);
  function init(){
    if(initialized||!root.y8||typeof root.y8.sdk!=='function')return;
    initialized=true;
    try{
      sdk=root.y8.sdk();
      sdk.init({appId:'6b07e23ef313f6f4c4ac87e4',autoLogin:true},
        {gameId:'295751',preloadAdBreaks:'on',sound:'on',onReady:()=>{ready=true;notify()}});
      if(typeof sdk.onAuth==='function')sdk.onAuth(()=>{});
    }catch(e){sdk=null;ready=false;notify()}
  }
  function request(type,name){
    if(!ready||!sdk||typeof sdk.showAd!=='function'||pending||activeCount)return Promise.resolve(false);
    return new Promise(resolve=>{
      const r={done:false,active:false,viewed:false,closed:false,timer:null};
      pending=r;notify();
      const clear=()=>{if(r.timer!==null){root.clearTimeout(r.timer);r.timer=null}};
      const endActive=()=>{if(r.active){r.active=false;activeCount=Math.max(0,activeCount-1);activity()}};
      function finish(){if(r.done)return;r.done=true;clear();if(pending===r)pending=null;notify();resolve(type==='reward'&&r.viewed&&!r.closed)}
      const arm=ms=>{clear();r.timer=root.setTimeout(()=>{if(!r.active)finish()},ms)};
      // A blocked SDK can fail to call back at all; do not lock the game indefinitely.
      arm(12000);
      const options={type,name,
        beforeAd:()=>{if(!r.active){r.active=true;activeCount++;clear();activity();notify()}},
        afterAd:()=>{endActive();if(!r.done)arm(1500);notify()},
        adBreakDone:()=>{endActive();finish();notify()}
      };
      if(type==='reward')Object.assign(options,{
        beforeReward:show=>{if(!r.done&&typeof show==='function')show()},
        adViewed:()=>{if(!r.done)r.viewed=true},
        adDismissed:()=>{if(!r.done)r.closed=true}
      });
      try{Promise.resolve(sdk.showAd(options)).catch(()=>{endActive();finish()})}
      catch(e){endActive();finish()}
    });
  }
  root.PhoenixY8=Object.freeze({
    get ready(){return ready},
    get busy(){return !!pending||activeCount>0},
    subscribe(change,adActivity){onChange=change;onActivity=adActivity;notify();activity()},
    request
  });
  root.addEventListener('y8sdk.ready',init,{once:true});
  if(root.y8&&typeof root.y8.emitReadyEvent==='function')root.y8.emitReadyEvent();
})(window);
