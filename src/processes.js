import {reactionFrame} from './molecules.js';
const biology='https://openstax.org/details/books/biology-2e';
export const processes=[
 {id:'sn2',name:'SN2 亲核取代',category:'化学机理',equation:'Nu⁻ + CH₃–X → Nu–CH₃ + X⁻',stages:['背面进攻','协同过渡态','离去完成'],note:'甲基中心无手性。构型变化仅帮助理解进攻方向，不作为手性反转证据；未模拟真实反应速率。',source:'https://openstax.org/books/organic-chemistry/pages/11-2-the-sn2-reaction'},
 {id:'proton',name:'酸碱反应 · 质子转移',category:'化学机理',equation:'HCl + H₂O → Cl⁻ + H₃O⁺',stages:['溶剂与溶质接近','质子转移示意','形成溶剂化离子'],note:'示意酸向水转移质子，不模拟真实的溶剂化壳层、氢键网络和超快质子动力学。',source:'https://openstax.org/details/books/chemistry-2e'},
 {id:'enzyme',name:'酶与底物 · 结合及催化',category:'生物过程',equation:'E + S ⇌ ES → E + P',stages:['底物接近活性位点','形成复合物','产物释放，酶再利用'],note:'酶轮廓和底物为符号示意。酶降低活化势垒，不改变同一净反应的 ΔG 或平衡常数。',source:'https://openstax.org/books/biology-2e/pages/6-5-enzymes'},
 {id:'diffusion',name:'粒子扩散 · 浓度梯度',category:'物理过程',equation:'J = −D∇c',stages:['粒子初始集中','分布逐渐展宽','趋于更均匀的分布'],note:'预设路径展示分布变化，不是随机游走数值模拟；平衡时微观运动仍存在。',source:'https://openstax.org/books/college-physics-2e/pages/12-7-molecular-transport-phenomena-diffusion-osmosis-and-related-processes'},
 {id:'osmosis',name:'渗透 · 半透膜与水迁移',category:'生物过程',equation:'水的净迁移与水势差相关',stages:['膜两侧条件不同','水分子穿过半透膜','高溶质侧水量增加的示意'],note:'该膜允许水通过而阻挡图示溶质。未计入静水压、活度和膜力学；不表示无限单向流动。',source:'https://openstax.org/books/biology-2e/pages/5-2-passive-transport'},
 {id:'replication',name:'DNA 半保留复制',category:'生物过程',equation:'每个子代双链含一条亲代链与一条新链',stages:['亲代双链','两条链分离并作为模板','产生两个半保留双链'],note:'仅展示半保留结果，未模拟复制叉、冈崎片段或酶的实际结构；新链合成方向均为 5′→3′。',source:'https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication'},
 {id:'transcription',name:'转录 · DNA 到 RNA',category:'生物过程',equation:'读取 DNA 模板 3′→5′，合成 RNA 5′→3′',stages:['聚合酶结合模板','RNA 链延伸','形成 RNA 产物'],note:'只示意方向与信息转移，省略启动、终止和真核 RNA 加工；不是特定基因的结构或序列。',source:biology},
 {id:'translation',name:'翻译 · 密码子与肽链',category:'生物过程',equation:'mRNA → 多肽；终止密码子不编码氨基酸',stages:['从起始密码子开始','核糖体逐密码子延伸','遇终止信号释放肽链'],note:'所示短序列只作教学。实际过程包含 tRNA、因子、能量消耗与校对；没有模拟真实核糖体结构。',source:biology},
 {id:'atp',name:'ATP 合酶 · 化学渗透耦联',category:'生物过程',equation:'质子电化学势差 → 转动与构象变化 → ATP 合成',stages:['存在跨膜质子驱动力','质子通过与转子耦联','ADP 与 Pi 形成 ATP'],note:'质子位置、数目和转角是示意，不代表固定 H⁺/ATP 计量；未模拟完整电子传递链。',source:biology},
 {id:'mitosis',name:'有丝分裂 · 染色体分配',category:'生物过程',equation:'复制后的姐妹染色单体分离，分配到子细胞',stages:['复制后的染色体','姐妹染色单体分离','形成两个子细胞'],note:'仅演示核内遗传物质的分配，不模拟细胞器与纺锤体的全部细节。DNA 复制发生在有丝分裂之前的 S 期。',source:biology}
];
const text=(x,y,label,size=16,color='#526e48')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}">${label}</text>`;
const line=(x1,y1,x2,y2,color='#8ba37a',width=4,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const ball=(x,y,label,color='#d8e7c8',r=25)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>${label?text(x,y+5,label,16):''}`;
const clamp=x=>Math.max(0,Math.min(1,x));
export function processFrame(id,value){
 const t=clamp(value/100);if(id==='sn2')return reactionFrame(t*100);let svg='';
 if(id==='proton'){
  const p=200+200*clamp((t-.2)/.6);svg=ball(145,140,t>.75?'Cl⁻':'Cl','#d4dfb5',34)+ball(455,140,t>.75?'H₃O⁺':'H₂O','#e6c5b4',39)+ball(p,140,'H⁺','#eee2b2',19)+line(178,140,p-20,140,'#b0bfa0',3,t>.3?'5 5':'')+line(p+20,140,415,140,'#b0bfa0',3,t<.7?'5 5':'')+text(305,55,'质子转移的简化示意',14);
 }else if(id==='enzyme'){
  const x=t<.4?100+210*t/.4:t<.65?310:310+180*(t-.65)/.35;
  svg='<path d="M320 77 C240 15 140 68 153 151 C160 235 273 239 325 181 L280 150 L320 120Z" fill="#cddfbb" stroke="#89a16d" stroke-width="2"/>'+text(220,151,'E',28)+ball(x,150,t<.65?'S':'P',t<.65?'#e7c89b':'#a4c9bb',23)+text(315,252,t<.4?'底物接近':t<.65?'ES 复合物':'酶在反应后可再次参与催化',14);
 }else if(id==='diffusion'){
  svg='<rect x="65" y="40" width="510" height="195" rx="10" fill="#f3f6e9" stroke="#d7e2c8"/>';
  for(let i=0;i<40;i++){const initial=90+(i*31%95),target=85+(i*127%470),x=initial*(1-t)+target*t,y=62+(i*53%150)+Math.sin(i+t*9)*5;svg+=ball(x,y,'',i%3?'#91ae79':'#d0b574',5);}
  svg+=text(140,265,'初始高浓度侧',12)+text(470,265,'净分布趋于均匀',12);
 }else if(id==='osmosis'){
  svg='<rect x="55" y="35" width="535" height="210" rx="10" fill="#f0f5e8" stroke="#d6e0c9"/>'+line(320,40,320,240,'#a0b184',5,'8 9');
  for(let i=0;i<10;i++)svg+=ball(366+i*67%180,70+i*47%140,'','#b9a273',9);
  for(let i=0;i<24;i++){const moving=i<8,x=moving?100+i*23+t*220:80+i*139%470;svg+=ball(x,67+i*43%150,'','#84aca7',5);}
  svg+=text(170,270,'较低溶质侧',12)+text(450,270,'较高溶质侧',12)+text(320,22,'只允许水通过的膜',11);
 }else if(id==='replication'){
  const gap=16+75*t;
  for(const side of [-1,1]){const y=145+side*gap;svg+=line(100,y,525,y,'#6e9981',6)+text(75,y+5,side===-1?'5′':'3′',12)+text(550,y+5,side===-1?'3′':'5′',12);if(t>.1){const ny=y-side*18;svg+=line(side===-1?525:100,ny,side===-1?525-425*t:100+425*t,ny,'#d8b574',5);}}
  svg+=text(320,280,'绿色：亲代链　金色：新链；新链均沿 5′→3′ 合成',12);
 }else if(id==='transcription'){
  const x=140+t*365;svg=line(85,90,560,90,'#779780',5)+line(85,110,560,110,'#779780',5)+text(60,114,'3′',12)+text(585,114,'5′',12);
  svg+=line(130,190,Math.max(133,x),190,'#c7a85f',6)+ball(x,132,'RNA 聚合酶','#cddcb8',40)+text(115,218,'5′',12)+text(Math.max(150,x),218,'3′（延伸端）',11)+text(320,260,'新生 RNA：5′ → 3′',13);
 }else if(id==='translation'){
  const n=Math.min(5,Math.floor(t*6)),x=120+n*73;svg=line(65,174,585,174,'#8fa774',4)+text(45,178,'5′',12)+text(605,178,'3′',12);
  ['AUG','GCU','GAA','UUU','GGU','UAA'].forEach((c,i)=>svg+=text(120+i*73,204,c,13));
  svg+=`<ellipse cx="${x}" cy="156" rx="43" ry="31" fill="#d8dfb9" stroke="#9caf80"/>`+text(x,160,'核糖体',11);
  ['Met','Ala','Glu','Phe','Gly'].slice(0,Math.min(5,n+1)).forEach((a,i)=>{const bx=x-25-i*35,by=97-(i%2)*15;svg+=i?line(bx+16,by,bx+34,97-((i-1)%2)*15,'#b69c69',3):'';svg+=ball(bx,by,a,'#e2c891',16);});
  svg+=text(320,265,t>.85?'终止密码子 UAA：不增加氨基酸':'mRNA 按 5′→3′ 被读取',13);
 }else if(id==='atp'){
  svg='<rect x="45" y="120" width="550" height="28" fill="#dde6cd"/>'+line(320,70,320,190,'#709178',14);
  for(let i=0;i<8;i++)svg+=ball(130+i*52,40+(i%2)*22,'+','#c9ddba',10);
  svg+=ball(320,55+clamp(t)*154,'H⁺','#e4c78d',14);
  const angle=t*360;svg+=`<g transform="rotate(${angle} 320 193)"><circle cx="320" cy="193" r="35" fill="#bccfa9"/>${line(320,165,320,221,'#7f9a66',4)}${line(293,193,347,193,'#7f9a66',4)}</g>`+text(440,205,t>.7?'ATP':'ADP + Pi',20)+text(320,275,'质子驱动力通过结构变化耦联到 ATP 合成',12);
 }else if(id==='mitosis'){
  const separation=70*t;svg=`<ellipse cx="320" cy="145" rx="${145+30*t}" ry="95" fill="#f0f4e5" stroke="#c0d0ad" stroke-width="3"/>`;
  if(t>.7)svg+=line(320,60,320,230,'#b8c9a4',3,'6 7');
  for(const side of [-1,1])for(let i=0;i<2;i++){const x=320+side*separation,y=120+i*48;svg+=line(x-side*11,y-13,x+side*11,y+13,side===1?'#c7aa70':'#7d9d89',6);}
  svg+=text(320,267,t<.35?'复制后的染色体':t<.75?'姐妹染色单体分离':'子细胞各获得一组遗传物质',13);
 }
 const name=processes.find(p=>p.id===id)?.name||'过程示意';return `<svg viewBox="0 0 640 300" role="img" aria-label="${name}教学动画">${svg}</svg>`;
}
