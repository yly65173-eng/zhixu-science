import statistics from 'jstat';
const {jStat}=statistics;
const numeric=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
export function parseMeasurements(text,{columns=1,header=false,allowMissing=false}={}){
 const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).map((text,i)=>({text,line:i+1})).filter(l=>l.text.trim());
 if(header)lines.shift();if(!lines.length)throw new Error('请输入测量数据');if(lines.length>20000)throw new Error('一次最多处理 20,000 行');
 const rows=[];
 for(const l of lines){
  const cells=l.text.includes('\t')?l.text.split('\t'): /[,，;；]/.test(l.text)?l.text.split(/[,，;；]/):l.text.trim().split(/\s+/);
  const values=cells.map((raw,col)=>{const value=raw.trim().replace(/^"(.*)"$/,'$1');if(!value&&allowMissing)return null;if(!numeric.test(value))throw new Error('第 '+l.line+' 行第 '+(col+1)+' 列不是有效数字；不要附加单位或千位分隔符');const n=Number(value);if(!Number.isFinite(n)||Math.abs(n)>1e100)throw new Error('第 '+l.line+' 行数值过大或非有限值');return n;});
  if(columns===1){for(const n of values){if(n===null)continue;rows.push([n]);}}
  else{if(values.length!==columns)throw new Error('第 '+l.line+' 行需要 '+columns+' 列；缺失组数据请保留逗号或制表符');rows.push(values);}
 }
 if(rows.length>50000)throw new Error('一次最多处理 50,000 个数据行');return rows;
}
export function summarize(values){
 if(!values.length||!values.every(Number.isFinite))throw new Error('需要至少一个有限数值');
 let mean=0,m2=0,n=0;for(const v of values){n++;const d=v-mean;mean+=d/n;m2+=d*(v-mean);}
 const sd=n>1?Math.sqrt(Math.max(0,m2/(n-1))):null,sem=sd===null?null:sd/Math.sqrt(n),t=n>1?jStat.studentt.inv(.975,n-1):null;
 const sorted=[...values].sort((a,b)=>a-b),median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
 return {n,mean,median,min:sorted[0],max:sorted.at(-1),sd,sem,rsd:mean===0||sd===null?null:Math.abs(sd/mean)*100,ci95:sem===null?null:[mean-t*sem,mean+t*sem]};
}
export function linearFit(rows){
 if(rows.length<3)throw new Error('线性拟合至少需要 3 对数据（才能估计残差标准差）');
 if(rows.some(r=>r.length!==2||!r.every(Number.isFinite)))throw new Error('拟合需要完整的 X、Y 数值对');
 const x=rows.map(r=>r[0]),y=rows.map(r=>r[1]),n=x.length,mx=summarize(x).mean,my=summarize(y).mean;
 let sxx=0,sxy=0,syy=0;for(let i=0;i<n;i++){sxx+=(x[i]-mx)**2;sxy+=(x[i]-mx)*(y[i]-my);syy+=(y[i]-my)**2;}
 if(sxx===0)throw new Error('X 全部相同，无法拟合斜率');
 const slope=sxy/sxx,intercept=my-slope*mx,residuals=rows.map(([x,y])=>({x,y,fitted:intercept+slope*x,residual:y-(intercept+slope*x)}));
 const sse=residuals.reduce((s,r)=>s+r.residual**2,0),syx=Math.sqrt(sse/(n-2)),seSlope=syx/Math.sqrt(sxx),t=jStat.studentt.inv(.975,n-2);
 const out={n,slope,intercept,r2:syy===0?null:1-sse/syy,syx,rmse:Math.sqrt(sse/n),slopeCI:[slope-t*seSlope,slope+t*seSlope],residuals,xRange:[Math.min(...x),Math.max(...x)],yRange:[Math.min(...y),Math.max(...y)],mx,sxx};
 if(![slope,intercept,syx].every(Number.isFinite))throw new Error('数值尺度导致拟合溢出，请缩放单位');return out;
}
export function calibrate(rows,unknown=[],dilution=1){
 if(!Number.isFinite(dilution)||dilution<=0)throw new Error('稀释倍数必须大于 0');
 const fit=linearFit(rows);if(unknown.length&&fit.slope===0)throw new Error('斜率为零，无法反算未知样');
 const back=unknown.map(y=>{if(!Number.isFinite(y))throw new Error('未知样响应值无效');const x=(y-fit.intercept)/fit.slope;return {response:y,x,original:x*dilution,extrapolation:x<fit.xRange[0]||x>fit.xRange[1]};});
 return {...fit,dilution,unknown:back,unknownSummary:back.length?summarize(back.map(r=>r.original)):null};
}
export function titrate(rows,{standard,sampleVolume,a=1,b=1,blank=0,dilution=1}){
 if(!rows.length||rows.some(r=>r.length!==2||!r.every(Number.isFinite)))throw new Error('滴定计算需要完整且有限的初末读数');
 if(![standard,sampleVolume,dilution].every(v=>Number.isFinite(v)&&v>0)||!Number.isFinite(blank)||blank<0)throw new Error('标准液浓度、取样体积与稀释倍数需大于零；空白体积不能为负');
 if(![a,b].every(v=>Number.isInteger(v)&&v>=1&&v<=20))throw new Error('反应系数 a、b 需为 1–20 的整数');
 const results=rows.map(([initial,final],i)=>{if(initial<0||final<0)throw new Error('第 '+(i+1)+' 组滴定管读数不能为负');const volume=final-initial-blank;if(volume<=0)throw new Error('第 '+(i+1)+' 组扣除空白后的体积必须大于零');return {initial,final,volume,concentration:standard*volume/sampleVolume*(a/b)*dilution};});
 return {rows:results,summary:summarize(results.map(r=>r.concentration)),formula:'c(A) = c(B) × (V终 − V初 − V空白)/V样 × a/b × 稀释倍数'};
}
export function fitKinetics(rows,order=1){
 if(rows.some(r=>r.length!==2||!r.every(Number.isFinite)))throw new Error('动力学拟合需要完整且有限的时间/浓度对');
 if(![0,1,2].includes(order))throw new Error('请选择零、一或二级反应');
 for(const [time,c] of rows)if(time<0||c<0||(order>0&&c===0))throw new Error('时间不能为负；一级和二级拟合的浓度必须大于零');
 const transform=c=>order===0?c:order===1?Math.log(c):1/c;
 const transformed=rows.map(([t,c])=>[t,transform(c)]),fit=linearFit(transformed),k=order===2?fit.slope:-fit.slope;
 const c0=order===0?fit.intercept:order===1?Math.exp(fit.intercept):1/fit.intercept;
 const half=k>0&&c0>0?(order===0?c0/(2*k):order===1?Math.LN2/k:1/(k*c0)):null;
 return {...fit,order,k,c0,half,transformed,formula:order===0?'c = c₀ − kt':order===1?'ln c = ln c₀ − kt':'1/c = 1/c₀ + kt',warning:k<=0||c0<=0?'拟合参数不符合所选的简单不可逆耗减模型，请检查数据与机理。':null};
}
export function compareGroups(a,b){
 if(a.length<2||b.length<2)throw new Error('Welch 独立样本 t 检验要求每组至少 2 个数值');
 const A=summarize(a),B=summarize(b),va=A.sd**2/A.n,vb=B.sd**2/B.n,se=Math.sqrt(va+vb),difference=A.mean-B.mean;
 if(se===0)return {A,B,difference,se,t:null,df:null,p:null,ci95:null,warning:'两组均为零方差，t 检验无法估计抽样误差；不能据此给出显著性结论。'};
 const df=(va+vb)**2/(va**2/(A.n-1)+vb**2/(B.n-1)),t=difference/se,p=Math.max(0,Math.min(1,2*jStat.studentt.cdf(-Math.abs(t),df))),critical=jStat.studentt.inv(.975,df);
 return {A,B,difference,se,t,df,p,ci95:[difference-critical*se,difference+critical*se],warning:null};
}
export function csvCell(value){if(value===null||value===undefined)return '';let s=String(value);if(typeof value==='string'&&/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
export function csvText(rows){return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');}
