import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const root=new URL("../",import.meta.url);
const html=readFileSync(new URL("index.html",root),"utf8");
const loader=readFileSync(new URL("phoenix-adsterra-loader.js",root),"utf8");
const now=Date.now();
const choice=(advertising=true,rev="adsterra-2026-11",age=0)=>
  ({version:1,partnerRevision:rev,advertising,analytics:false,timestamp:now-age*86400000});

function simulate(unit,width,height,decision,hostname="phoenix-arcade.appsandgames.org"){
  const written=[];
  const slot={hidden:true,classList:{contains:cl=>cl==="phoenix-ad-unit"},insertBefore(){}};
  const currentScript={dataset:{unit},parentElement:slot};
  const document={
    readyState:"loading",currentScript,
    body:{classList:{contains:cl=>cl==="menu-active"}},
    cookie: decision ? "ag_privacy_choices_v1="+encodeURIComponent(JSON.stringify(decision)) : "",
    createElement:()=>({}),write:s=>written.push(s)
  };
  const matchMedia=query=>({
    matches:(!query.includes("min-width: 320px")||width>=320)&&
            (!query.includes("min-width: 1024px")||width>=1024)&&
            (!query.includes("min-height: 800px")||height>=800)
  });
  runInNewContext(loader,{document,matchMedia,location:{hostname},Date});
  return {written,hidden:slot.hidden};
}
test("no ad request without active consent, on an unapproved hostname or with expired consent",()=>{
 for(const screen of [[390,840],[1024,768],[1440,900]]){
  for(const unit of ["mobile","desktop"]){
    const [w,h]=screen;
    assert.equal(simulate(unit,w,h,null).written.length,0);
    assert.equal(simulate(unit,w,h,choice(false)).written.length,0);
    assert.equal(simulate(unit,w,h,choice(true,"wrong-revision")).written.length,0);
    assert.equal(simulate(unit,w,h,choice(true,"adsterra-2026-11",181)).written.length,0);
    assert.equal(simulate(unit,w,h,choice(true,"adsterra-2026-11",0),"other.example").written.length,0);
  }
 }
});
test("exactly one correctly sized Phoenix ad per mobile/tablet/desktop viewport",()=>{
 for(const [w,h,unit,key] of [
  [390,840,"mobile","82977f105f694f9d1f6f9a73fd17e623"],
  [768,1024,"mobile","82977f105f694f9d1f6f9a73fd17e623"],
  [1024,768,"mobile","82977f105f694f9d1f6f9a73fd17e623"],
  [1024,800,"desktop","82f2ec7d4d36d4b13fc13d46af67d79d"],
  [1440,900,"desktop","82f2ec7d4d36d4b13fc13d46af67d79d"]
 ]) {
  const a=simulate("desktop",w,h,choice()),b=simulate("mobile",w,h,choice());
  const codes=[...a.written,...b.written];
  assert.equal(codes.length,1,w+"x"+h);
  assert.match(codes[0],new RegExp(key));
  assert.match(codes[0],/format' : 'iframe'/);
  assert.match(codes[0],/https:\/\/bauval\.org\/22\//);
  assert.equal(simulate(unit,w,h,choice()).hidden,false);
 }
});
test("banner scripts live inside the start menu and keep gameplay controls unchanged",()=>{
 assert.equal((html.match(/src="\.\/phoenix-adsterra-loader\.js"/g)||[]).length,2);
 const start=html.indexOf('id="startOverlay"'),end=html.indexOf('id="pauseOverlay"');
 assert.ok(start>=0&&end>start);
 assert.ok(html.indexOf('data-unit="desktop"')>start && html.indexOf('data-unit="desktop"')<end);
 assert.ok(html.indexOf('data-unit="mobile"')>start && html.indexOf('data-unit="mobile"')<end);
 for(const id of ['id="playBtn"','id="resumeBtn"','id="leftBtn"','id="rightBtn"','id="fireBtn"']) assert.match(html,new RegExp(id));
 assert.match(html,/window\.AppsGamesPrivacy\?\.openPreferences\?\.\(\)/);
 assert.match(html,/body:not\(\.menu-active\) \.phoenix-ad-unit\{display:none!important\}/);
});
