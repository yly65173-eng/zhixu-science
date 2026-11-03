export const quantities={
 Ksp:{name:'溶度积（浓度近似）',unit:'(mol/L)^(m+n)'},s:{name:'摩尔溶解度',unit:'mol/L'},massS:{name:'质量溶解度',unit:'g/L'},
 M:{name:'摩尔质量',unit:'g/mol'},dg:{name:'标准摩尔吉布斯能变',unit:'J/mol'},T:{name:'绝对温度',unit:'K'},
 K:{name:'热力学平衡常数',unit:'1'},c:{name:'物质的量浓度',unit:'mol/L'},n:{name:'物质的量',unit:'mol'},V:{name:'体积',unit:'L'},
 mass:{name:'质量',unit:'g'},N:{name:'粒子数',unit:'1'},A:{name:'吸光度',unit:'1'},eps:{name:'摩尔吸光系数',unit:'L/(mol·cm)'},l:{name:'光程',unit:'cm'},
 k:{name:'一阶速率常数',unit:'s⁻¹'},half:{name:'一阶半衰期',unit:'s'},Ea:{name:'活化能',unit:'J/mol'},pref:{name:'Arrhenius 指前因子（一阶）',unit:'s⁻¹'},
 D:{name:'扩散系数',unit:'m²/s'},t:{name:'时间',unit:'s'},rms:{name:'均方根位移',unit:'m'},radius:{name:'流体动力学半径',unit:'m'},eta:{name:'动力黏度',unit:'Pa·s'}
};
const R=8.314462618,NA=6.02214076e23,kB=1.380649e-23;
export const formulas=[
 {id:'salt',inputs:['Ksp'],output:'s',equation:'s = [Ksp / (mᵐnⁿ)]¹⁄⁽ᵐ⁺ⁿ⁾',condition:'MₘXₙ 完全解离；无同离子、络合、水解等副反应；稀溶液浓度近似。m、n 为化学计量数。',calc:(v,o)=>(v.Ksp/(o.m**o.m*o.n**o.n))**(1/(o.m+o.n)),enabled:o=>o.common===0},
 {id:'ion',inputs:['Ksp'],output:'s',equation:'s = 2Ksp / [c₀ + √(c₀² + 4Ksp)]',condition:'仅适用 1:1 盐、一种离子初始浓度 c₀ > 0；Ksp = s(s+c₀)，不考虑其他副反应。',calc:(v,o)=>2*v.Ksp/(o.common+Math.sqrt(o.common**2+4*v.Ksp)),enabled:o=>o.m===1&&o.n===1&&o.common>0},
 {id:'massS',inputs:['s','M'],output:'massS',equation:'ρₛ = sM',condition:'s 为 mol/L，M 为 g/mol；质量溶解度输出 g/L。',calc:v=>v.s*v.M},
 {id:'sFromMass',inputs:['massS','M'],output:'s',equation:'s = ρₛ/M',condition:'质量溶解度 g/L；摩尔质量 g/mol。',calc:v=>v.massS/v.M},
 {id:'kspBack',inputs:['s'],output:'Ksp',equation:'Ksp ≈ mᵐnⁿsᵐ⁺ⁿ',condition:'纯水、完全解离且无副反应；浓度近似。',calc:(v,o)=>o.m**o.m*o.n**o.n*v.s**(o.m+o.n),enabled:o=>o.common===0},
 {id:'gibbs',inputs:['K','T'],output:'dg',equation:'ΔᵣG° = −RT ln K',condition:'K 必须是无量纲的热力学平衡常数；不能直接把有量纲的浓度溶度积代入。',calc:v=>-R*v.T*Math.log(v.K)},
 {id:'equilibrium',inputs:['dg','T'],output:'K',equation:'K = exp(−ΔᵣG°/RT)',condition:'ΔᵣG° 用 J/mol，T 用 K，输出无量纲热力学常数。',calc:v=>Math.exp(-v.dg/(R*v.T))},
 {id:'moles',inputs:['mass','M'],output:'n',equation:'n = m/M',condition:'m 用 g，M 用 g/mol。',calc:v=>v.mass/v.M},
 {id:'concentration',inputs:['n','V'],output:'c',equation:'c = n/V',condition:'V 用 L；假定给定物质在溶液中的物质的量已知。',calc:v=>v.n/v.V},
 {id:'beer',inputs:['A','eps','l'],output:'c',equation:'c = A/(εl)',condition:'Beer–Lambert 线性范围、单色光、均匀介质；ε 单位 L/(mol·cm)，l 用 cm。',calc:v=>v.A/(v.eps*v.l)},
 {id:'beerA',inputs:['c','eps','l'],output:'A',equation:'A = εlc',condition:'仅在已验证的 Beer–Lambert 线性范围。',calc:v=>v.c*v.eps*v.l},
 {id:'nfromc',inputs:['c','V'],output:'n',equation:'n = cV',condition:'c 用 mol/L，V 用 L。',calc:v=>v.c*v.V},
 {id:'particles',inputs:['n'],output:'N',equation:'N = nNₐ',condition:'Nₐ = 6.02214076×10²³ mol⁻¹；须明确计数实体。',calc:v=>v.n*NA},
 {id:'half',inputs:['k'],output:'half',equation:'t½ = ln 2/k',condition:'仅适用不可逆一阶反应或单一指数衰减。',calc:v=>Math.LN2/v.k},
 {id:'rate',inputs:['half'],output:'k',equation:'k = ln 2/t½',condition:'一阶模型；半衰期用 s。',calc:v=>Math.LN2/v.half},
 {id:'arrhenius',inputs:['Ea','pref','T'],output:'k',equation:'k = A₀ exp(−Eₐ/RT)',condition:'一阶速率常数；固定温区内 Arrhenius 近似有效。',calc:v=>v.pref*Math.exp(-v.Ea/(R*v.T))},
 {id:'stokes',inputs:['T','eta','radius'],output:'D',equation:'D = kBT/(6πηr)',condition:'稀溶液球形粒子、连续牛顿流体、无滑移边界；小分子或拥挤介质可能失效。',calc:v=>kB*v.T/(6*Math.PI*v.eta*v.radius)},
 {id:'rms',inputs:['D','t'],output:'rms',equation:'rᵣₘₛ = √(2dDt)',condition:'均匀各向同性正常扩散；无漂移；d 为空间维数。',calc:(v,o)=>Math.sqrt(2*o.d*v.D*v.t)},
 {id:'time',inputs:['rms','D'],output:'t',equation:'t = rᵣₘₛ²/(2dD)',condition:'以均方位移定义的时间尺度；不是单粒子必达时间。',calc:(v,o)=>v.rms**2/(2*o.d*v.D)}
];
export function validateKnown(known){
 for(const [key,v] of Object.entries(known)){
  if(!quantities[key])throw new Error('未知物理量：'+key);
  if(!Number.isFinite(v))throw new Error(key+' 需要有限数值');
  if(key==='dg')continue;
  if(['A','c','mass','n','N','massS','s','t','rms','Ea'].includes(key)?v<0:v<=0)throw new Error(key+' 的取值超出适用范围');
 }
}
export function findPaths(known,target,options={}){
 validateKnown(known);
 if(!quantities[target])throw new Error('请选择目标物理量');
 const o={m:1,n:1,common:0,d:3,...options};
 if(!Number.isInteger(o.m)||!Number.isInteger(o.n)||o.m<1||o.n<1||o.m>6||o.n>6||![1,2,3].includes(o.d)||!Number.isFinite(o.common)||o.common<0)throw new Error('计量数需为 1–6 的整数；维数为 1–3；同离子浓度不能为负');
 const active=formulas.filter(f=>!f.enabled||f.enabled(o));
 const roots=new Set(Object.keys(known));
 function recurse(q,seen,depth){
  if(roots.has(q))return [{steps:[],missing:[],value:known[q]}];
  if(seen.has(q)||depth>5)return [];
  const next=new Set([...seen,q]),paths=[];
  for(const f of active.filter(f=>f.output===q)){
   let combos=[{steps:[],missing:[],values:{...known}}];
   for(const inp of f.inputs){
    let branches=recurse(inp,next,depth+1);
    if(!branches.length)branches=[{steps:[],missing:[inp],value:undefined}];
    combos=combos.flatMap(a=>branches.map(b=>({steps:[...a.steps,...b.steps],missing:[...a.missing,...b.missing],values:{...a.values,[inp]:b.value}}))).slice(0,40);
   }
   for(const a of combos){
    const missing=[...new Set(a.missing)];if(missing.includes(target))continue;
    let value; if(!missing.length){value=f.calc(a.values,o);if(!Number.isFinite(value))continue;}
    paths.push({steps:[...new Map([...a.steps,f].map(x=>[x.id,x])).values()],missing,value});
   }
  }
  return paths;
 }
 const paths=recurse(target,new Set(),0).filter(p=>p.steps.length||roots.has(target));
 return [...new Map(paths.map(p=>[p.steps.map(f=>f.id).sort().join(','),p])).values()].sort((a,b)=>a.missing.length-b.missing.length||a.steps.length-b.steps.length).slice(0,12);
}
