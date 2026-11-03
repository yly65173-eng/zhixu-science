export function analyzeProtocol(text){
 const lines=text.split(/\n/).map((s,i)=>({text:s.trim(),line:i+1})).filter(s=>s.text);
 const steps=lines.filter(s=>/^\s*(?:\d+[.、)）]|[一二三四五六七八九十]+[、.])/.test(s.text));
 const actionLines=steps.length?steps:lines.filter(s=>/加入|配制|称取|测量|测定|离心|滴定|洗涤|干燥|孵育|加热|冷却|取样|记录/.test(s.text));
 const principles=lines.filter(s=>/原理|定律|方程|反应式|平衡|=|→|⇌/.test(s.text));
 const numeric=lines.filter(s=>/\d\s*(?:[–—~-]|至|到)\s*\d|线性范围|标准曲线范围|取值范围|合格范围/.test(s.text));
 const notes=lines.filter(s=>/注意|禁止|必须|勿|不可|气泡|洁净|调零|平行|重复|对照|空白/.test(s.text));
 const waits=actionLines.filter(s=>/离心|孵育|静置|等待|冷却|干燥/.test(s.text));
 const checks=[{title:'重复性与读数',cause:'样品不均一、读数时机或操作差异',effect:'增大组内离散；方向不一定固定',action:'保留原始读数，按教师规定做平行样、空白和质控；均值不能代替异常原因调查。'}];
 if(/分光|吸光|比色/.test(text))checks.push({title:'光学测量',cause:'比色皿污染、气泡、空白不匹配或超出线性范围',effect:'可能引入散射、基线偏移或非线性，不能统一假定偏高或偏低',action:'核对空白、光程与波长；检查标准曲线残差。未知样超出验证范围时按原课件要求处理。'});
 if(/离心/.test(text))checks.push({title:'离心分离',cause:'未配平、误把 rpm 当 RCF、取上清时扰动沉淀',effect:'安全风险、分离不足或交叉混入；回收率和纯度可能改变',action:'按设备和课件配平，核对转子半径、RCF、温度、时间；停稳后取样。不能只凭 rpm 比较两台设备。'});
 if(/滴定/.test(text))checks.push({title:'终点与计量',cause:'过滴、滴定管气泡、标定偏差或指示剂选择不适用',effect:'体积或当量关系偏离；误差方向依计算式和具体原因判断',action:'确认终点判据与反应计量，保留初末读数，复核标定结果。'});
 return {steps:actionLines,principles,numeric,notes,waits,checks,limitations:[
  '这是有来源行号的规则预习草稿，不是通用 AI 生成的实验方案。未在材料中说明的反应机理、现象与合格数值不会补写。',
  '改进建议须与原方案做对照验证，不能在正式实验中自动更改试剂用量、温度、次序或设备参数。'
 ]};
}

// Conservative scheduler: one bench operator and one shared waiting instrument.
// All durations are explicitly entered by the user; no invented timings.
export function scheduleGroups(count,prep,wait,finish){
 if(!Number.isInteger(count)||count<1||count>12||![prep,wait,finish].every(n=>Number.isFinite(n)&&n>0&&n<=1440))throw new Error('组数为 1–12；每段时间需大于 0 且不超过 1440 分钟。');
 const bench=[],instrument=[],tasks=[];
 const freeAt=(slots,earliest,duration)=>{let t=earliest;for(const s of [...slots].sort((a,b)=>a.start-b.start)){if(t+duration<=s.start)break;if(t<s.end)t=s.end;}return t;};
 for(let g=1;g<=count;g++){
  const p=freeAt(bench,0,prep);bench.push({start:p,end:p+prep});tasks.push({group:g,name:'准备',start:p,end:p+prep,resource:'操作台'});
  const w=freeAt(instrument,p+prep,wait);instrument.push({start:w,end:w+wait});tasks.push({group:g,name:'等待/设备占用',start:w,end:w+wait,resource:'等待设备'});
  const f=freeAt(bench,w+wait,finish);bench.push({start:f,end:f+finish});tasks.push({group:g,name:'后处理',start:f,end:f+finish,resource:'操作台'});
 }
 return {tasks:tasks.sort((a,b)=>a.start-b.start),total:Math.max(...tasks.map(t=>t.end)),sequential:count*(prep+wait+finish)};
}
