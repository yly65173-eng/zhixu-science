const molecules={
 water:{name:'水 H₂O',geometry:'弯曲形 · H–O–H 约 104.5°',atoms:[['O',0,0,0],['H',.76,.59,0],['H',-.76,.59,0]],bonds:[[0,1],[0,2]],note:'两个成键电子域与两对孤电子对。这里是近似静态几何的球棍模型，不计算电子密度。'},
 methane:{name:'甲烷 CH₄',geometry:'正四面体 · 键角约 109.5°',atoms:[['C',0,0,0],['H',.63,.63,.63],['H',-.63,-.63,.63],['H',-.63,.63,-.63],['H',.63,-.63,-.63]],bonds:[[0,1],[0,2],[0,3],[0,4]],note:'四条 C–H 键指向四面体顶点。拖动模型可以观察空间几何，键长仅作教学比例示意。'},
 co2:{name:'二氧化碳 CO₂',geometry:'直线形 · O–C–O 180°',atoms:[['C',0,0,0],['O',-1.16,0,0],['O',1.16,0,0]],bonds:[[0,1,2],[0,2,2]],note:'碳原子周围有两个电子域。双键用双棍表示；原子半径与颜色为视觉约定。'},
 ammonia:{name:'氨 NH₃',geometry:'三角锥形 · H–N–H 约 107°',atoms:[['N',0,.2,0],['H',.94,-.18,0],['H',-.47,-.18,.81],['H',-.47,-.18,-.81]],bonds:[[0,1],[0,2],[0,3]],note:'三个成键电子域与一对孤电子对。孤电子对未绘出；与甲烷对比观察几何差别。'}
};
Object.assign(molecules,{
 hydrogen:{name:'氢 H₂',category:'无机分子',geometry:'双原子分子',atoms:[['H',-.37,0,0],['H',.37,0,0]],bonds:[[0,1]],note:'双原子键轴示意，原子半径不是电子云边界。'},
 oxygen:{name:'氧 O₂',category:'无机分子',geometry:'双原子 · 双键示意',atoms:[['O',-.6,0,0],['O',.6,0,0]],bonds:[[0,1,2]],note:'用价键图示表示键连；没有模拟分子轨道、顺磁性或自旋。'},
 nitrogen:{name:'氮 N₂',category:'无机分子',geometry:'双原子 · 三键示意',atoms:[['N',-.55,0,0],['N',.55,0,0]],bonds:[[0,1,3]],note:'三棍代表三键，不是三个实际的独立圆柱电子分布。'},
 hcl:{name:'氯化氢 HCl',category:'无机分子',geometry:'双原子 · 极性键',atoms:[['H',-.64,0,0],['Cl',.64,0,0]],bonds:[[0,1]],note:'气相分子近似示意；水溶液中的溶剂化与解离不由此静态模型表示。'},
 ethene:{name:'乙烯 C₂H₄',category:'有机分子',geometry:'近似平面 · sp²',atoms:[['C',-.67,0,0],['C',.67,0,0],['H',-1.22,.93,0],['H',-1.22,-.93,0],['H',1.22,.93,0],['H',1.22,-.93,0]],bonds:[[0,1,2],[0,2],[0,3],[1,4],[1,5]],note:'双键附近的平面构型示意；未绘出 π 轨道。'},
 ethyne:{name:'乙炔 C₂H₂',category:'有机分子',geometry:'近似直线 · sp',atoms:[['C',-.6,0,0],['C',.6,0,0],['H',-1.66,0,0],['H',1.66,0,0]],bonds:[[0,1,3],[0,2],[1,3]],note:'直线骨架与三键示意，未模拟真实振动。'},
 ethanol:{name:'乙醇 C₂H₅OH',category:'有机分子',geometry:'一种近似构象',atoms:[['C',-.7,0,0],['C',.7,0,0],['O',1.35,1.08,0],['H',1.0,1.8,0],['H',-1.1,.8,.6],['H',-1.1,-.8,.6],['H',-1.1,0,-.9],['H',1.1,-.6,.8],['H',1.1,-.6,-.8]],bonds:[[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8]],note:'构象可以变化；这一组教学坐标不是能量优化结果。'},
 benzene:{name:'苯 C₆H₆ · 碳骨架',category:'有机分子',geometry:'平面六元环',atoms:Array.from({length:6},(_,i)=>['C',Math.cos(i*Math.PI/3)*1.4,Math.sin(i*Math.PI/3)*1.4,0]),bonds:Array.from({length:6},(_,i)=>[i,(i+1)%6,i%2?1:2]),note:'省略氢；交替单双键是 Kekulé 表示，实际芳香环的键并非固定交替的单、双键。'},
 acetic:{name:'乙酸 CH₃COOH · 重原子',category:'有机分子',geometry:'羧基与碳骨架',atoms:[['C',-1,0,0],['C',.4,0,0],['O',1,1.05,0],['O',1,-1.05,0]],bonds:[[0,1],[1,2,2],[1,3]],note:'省略所有氢，仅用重原子理解羧基；不是溶液中所有物种的完整模型。'},
 glycine:{name:'甘氨酸 · 重原子骨架',category:'生物分子',geometry:'α-氨基酸骨架',atoms:[['N',-1.5,.6,0],['C',-.5,0,.5],['C',.8,0,0],['O',1.5,.9,0],['O',1.4,-1.1,0]],bonds:[[0,1],[1,2],[2,3,2],[2,4]],note:'省略氢和形式电荷；真实质子化状态依 pH 而变，水溶液中常需考虑两性离子。'},
 peptide:{name:'二肽 · 主链骨架',category:'生物分子',geometry:'肽键与重复主链',atoms:[['N',-3,.4,0],['C',-2,0,.5],['C',-1,.4,0],['O',-1,1.6,0],['N',0,-.4,0],['C',1,0,.5],['C',2,-.4,0],['O',2,-1.6,0],['O',3,.3,0]],bonds:[[0,1],[1,2],[2,3,2],[2,4],[4,5],[5,6],[6,7,2],[6,8]],note:'省略侧链、氢和形式电荷。平面肽键与可转动主链仅作近似示意，不是具体肽的测定结构。'},
 waterDimer:{name:'水二聚体 · 氢键',category:'生物分子',geometry:'分子间氢键示意',atoms:[['O',-1.25,0,0],['H',-1.85,.7,0],['H',-.32,0,0],['O',1.45,0,0],['H',2.05,.7,0],['H',2.05,-.7,0]],bonds:[[0,1],[0,2],[2,3,'h'],[3,4],[3,5]],note:'虚线表示分子间氢键；氢键并非把两个水分子变成一个共价连接的分子。'},
 dna:{name:'DNA 双螺旋 · 粗粒化',category:'生物结构',geometry:'核苷酸节点 · 反向平行双链',kind:'coarse',atoms:Array.from({length:24},(_,i)=>{const pair=Math.floor(i/2),side=i%2,angle=pair*.62+side*Math.PI;return [['dA','dT','dG','dC'][pair%2?2+side:side],Math.cos(angle)*1.1,(pair-5.5)*.4,Math.sin(angle)*1.1];}),bonds:[...Array.from({length:12},(_,i)=>[i*2,i*2+1,'h']),...Array.from({length:22},(_,i)=>[i,i+2])],note:'每个节点代表一个核苷酸，不是一个原子；横向虚线表示配对，纵向连线简化骨架。未显示糖磷酸与真实氢键几何。'},
 helix:{name:'蛋白质 α 螺旋 · Cα 轨迹',category:'生物结构',geometry:'主链轨迹示意',kind:'coarse',atoms:Array.from({length:24},(_,i)=>['Cα',Math.cos(i*100*Math.PI/180)*.9,(i-11.5)*.15,Math.sin(i*100*Math.PI/180)*.9]),bonds:Array.from({length:23},(_,i)=>[i,i+1]),note:'节点代表 Cα 位置，连线不是实际相邻 Cα 之间的共价键；省略主链原子、侧链与氢键，不代表具体蛋白结构。'}
});
for(const m of Object.values(molecules))m.category??='无机分子';
export {molecules};
export function mountMolecule(canvas,key){
 const model=molecules[key],ctx=canvas.getContext('2d');let yaw=.4,pitch=.25,drag=false,last,raf,alive=true,spin=true;
 const colors={O:'#dd715b',C:'#385c54',H:'#eee9dc',N:'#7898b7',Cl:'#9baf65',P:'#cbb36d',dA:'#a4b87f',dT:'#d4a269',dG:'#709f9b',dC:'#a79bc1','Cα':'#789b85'};
 const extent=Math.max(1.4,...model.atoms.map(([,x,y,z])=>Math.hypot(x,y,z)));
 function draw(){
  if(!alive)return;
  const box=canvas.getBoundingClientRect(),w=box.width,h=box.height,dpr=Math.min(window.devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(spin&&!drag)yaw+=.004;
  const scale=Math.min(w,h)*.34/extent;
  const pts=model.atoms.map(([el,x,y,z])=>{const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw),yy=y*Math.cos(pitch)-zz*Math.sin(pitch),depth=y*Math.sin(pitch)+zz*Math.cos(pitch);return {el,x:w/2+xx*scale,y:h/2-yy*scale,z:depth,r:(model.kind==='coarse'?13:el==='H'?17:27)*Math.min(1,2.3/extent)*(1+depth/extent*.12)};});
  for(const [a,b,order] of model.bonds){const p=pts[a],q=pts[b];ctx.lineCap='round';ctx.setLineDash(order==='h'?[4,5]:[]);for(const offset of order===2?[-4,4]:order===3?[-6,0,6]:[0]){ctx.beginPath();ctx.moveTo(p.x,p.y+offset);ctx.lineTo(q.x,q.y+offset);ctx.strokeStyle=order==='h'?'#bda56d':'#a9b5a5';ctx.lineWidth=model.kind==='coarse'||order==='h'?2:order>1?4:8;ctx.stroke();}ctx.setLineDash([]);}
  for(const p of [...pts].sort((a,b)=>a.z-b.z)){const g=ctx.createRadialGradient(p.x-p.r*.35,p.y-p.r*.35,1,p.x,p.y,p.r);g.addColorStop(0,p.el==='H'?'#ffffff':colors[p.el]||'#96ac8d');g.addColorStop(1,p.el==='H'?'#cecbbf':p.el==='O'?'#ac443a':p.el==='N'?'#436a90':'#375f4c');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.fillStyle=p.el==='H'?'#48594b':'#fff';ctx.font='500 '+Math.max(8,Math.min(14,p.r*.8))+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.el.replace(/^d/,''),p.x,p.y);}
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
