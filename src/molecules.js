const molecules={
 water:{name:'水 H₂O',geometry:'弯曲形 · H–O–H 约 104.5°',atoms:[['O',0,0,0],['H',.76,.59,0],['H',-.76,.59,0]],bonds:[[0,1],[0,2]],note:'两个成键电子域与两对孤电子对。这里是近似静态几何的球棍模型，不计算电子密度。'},
 methane:{name:'甲烷 CH₄',geometry:'正四面体 · 键角约 109.5°',atoms:[['C',0,0,0],['H',.63,.63,.63],['H',-.63,-.63,.63],['H',-.63,.63,-.63],['H',.63,-.63,-.63]],bonds:[[0,1],[0,2],[0,3],[0,4]],note:'四条 C–H 键指向四面体顶点。拖动模型可以观察空间几何，键长仅作教学比例示意。'},
 co2:{name:'二氧化碳 CO₂',geometry:'直线形 · O–C–O 180°',atoms:[['C',0,0,0],['O',-1.16,0,0],['O',1.16,0,0]],bonds:[[0,1,2],[0,2,2]],note:'碳原子周围有两个电子域。双键用双棍表示；原子半径与颜色为视觉约定。'},
 ammonia:{name:'氨 NH₃',geometry:'三角锥形 · H–N–H 约 107°',atoms:[['N',0,.2,0],['H',.94,-.18,0],['H',-.47,-.18,.81],['H',-.47,-.18,-.81]],bonds:[[0,1],[0,2],[0,3]],note:'三个成键电子域与一对孤电子对。孤电子对未绘出；与甲烷对比观察几何差别。'}
};
export {molecules};
export function mountMolecule(canvas,key){
 const model=molecules[key],ctx=canvas.getContext('2d');let yaw=.4,pitch=.25,drag=false,last,raf,alive=true,spin=true;
 const colors={O:'#dd715b',C:'#385c54',H:'#eee9dc',N:'#7898b7'};
 function draw(){
  if(!alive)return;
  const box=canvas.getBoundingClientRect(),w=box.width,h=box.height,dpr=Math.min(window.devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(spin&&!drag)yaw+=.004;
  const scale=Math.min(w,h)*.22;
  const pts=model.atoms.map(([el,x,y,z])=>{const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw),yy=y*Math.cos(pitch)-zz*Math.sin(pitch),depth=y*Math.sin(pitch)+zz*Math.cos(pitch);return {el,x:w/2+xx*scale,y:h/2-yy*scale,z:depth,r:(el==='H'?18:30)*(1+depth*.08)};});
  for(const [a,b,double] of model.bonds){const p=pts[a],q=pts[b];ctx.lineCap='round';for(const offset of double?[-5,5]:[0]){ctx.beginPath();ctx.moveTo(p.x,p.y+offset);ctx.lineTo(q.x,q.y+offset);ctx.strokeStyle='#a9b5a5';ctx.lineWidth=double?7:13;ctx.stroke();}}
  for(const p of [...pts].sort((a,b)=>a.z-b.z)){const g=ctx.createRadialGradient(p.x-p.r*.35,p.y-p.r*.35,2,p.x,p.y,p.r);g.addColorStop(0,p.el==='H'?'#ffffff':colors[p.el]);g.addColorStop(1,p.el==='H'?'#cecbbf':p.el==='O'?'#ac443a':p.el==='N'?'#436a90':'#173e35');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.fillStyle=p.el==='H'?'#48594b':'#fff';ctx.font='500 15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.el,p.x,p.y);}
  raf=requestAnimationFrame(draw);
 }
 canvas.onpointerdown=e=>{drag=true;last=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{if(drag){yaw+=(e.clientX-last[0])*.01;pitch+=(e.clientY-last[1])*.01;last=[e.clientX,e.clientY];}};
 canvas.onpointerup=()=>{drag=false;};canvas.onpointercancel=()=>{drag=false;};draw();
 return {toggle:()=>spin=!spin,cleanup:()=>{alive=false;cancelAnimationFrame(raf);}};
}

export function reactionFrame(value){
 const t=value/100,nu=75+205*t,x=400+120*t,bondA=Math.max(0,1-2*t),bondB=Math.max(0,2*t-1),transition=Math.sin(Math.PI*t);
 return `<svg viewBox="0 0 640 260" role="img" aria-label="SN2 亲核进攻和离去的教学示意">
 <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#407565"/></marker></defs>
 <line x1="${nu+28}" y1="130" x2="292" y2="130" stroke="#669b87" stroke-width="${2+bondB*4}" stroke-dasharray="${t<.6?'6 6':'0'}" opacity="${.25+t*.75}"/>
 <line x1="328" y1="130" x2="${x-24}" y2="130" stroke="#b29264" stroke-width="${2+bondA*4}" stroke-dasharray="${t>.4?'6 6':'0'}" opacity="${1-t*.7}"/>
 <path d="M${nu+5},98 Q210,42 293,104" fill="none" stroke="#407565" stroke-width="2" marker-end="url(#arrow)" opacity="${1-t}"/>
 <path d="M350,113 Q395,65 ${x-4},98" fill="none" stroke="#a28b60" stroke-width="2" marker-end="url(#arrow)" opacity="${1-t}"/>
 <circle cx="${nu}" cy="130" r="29" fill="#d8e8ce"/><text x="${nu}" y="136" text-anchor="middle" fill="#285244" font-size="21">Nu${t>.7?'':'⁻'}</text>
 <circle cx="310" cy="130" r="25" fill="#345f50"/><text x="310" y="137" text-anchor="middle" fill="white" font-size="21">C</text>
 <circle cx="${x}" cy="130" r="27" fill="#eadcc1"/><text x="${x}" y="136" text-anchor="middle" fill="#715536" font-size="21">X${t>.7?'⁻':''}</text>
 ${[-Math.PI/2,Math.PI/6,5*Math.PI/6].map(a=>`<line x1="310" y1="130" x2="${310+(1-2*t)*42+Math.cos(a)*15}" y2="${130+Math.sin(a)*68}" stroke="#aeb6a4" stroke-width="4"/><text x="${310+(1-2*t)*48+Math.cos(a)*18}" y="${136+Math.sin(a)*83}" fill="#6f7968" text-anchor="middle" font-size="17">H</text>`).join('')}
 <text x="310" y="242" text-anchor="middle" fill="#798272" font-size="13">${t<.3?'背面进攻':t<.7?'过渡态：成键与断键同时发生':'离去完成 · 构型翻转示意'}</text>
 <path d="M280,55 L340,55" stroke="#477561" stroke-width="2" opacity="${transition}"/>
 </svg>`;
}
