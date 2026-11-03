import {vocabulary} from './knowledge.js';
export const escapeHTML = (s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function findTerms(text,terms){
 const found=[];
 for(const term of [...new Set(terms)].filter(Boolean)){
  const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/[ -]+/g,'[\\s–—‑-]+');
  const re=new RegExp(escaped,'giu');let m;
  while((m=re.exec(text))){
   const start=m.index,end=start+m[0].length;
   if(/^[a-z0-9]/i.test(term)&&/[a-z0-9]/i.test(text[start-1]||''))continue;
   if(/[a-z0-9]$/i.test(term)&&/[a-z0-9]/i.test(text[end]||''))continue;
   if(!found.some(f=>f.start===start&&f.end===end))found.push({start,end,text:m[0]});
   if(found.length>=100)return found.sort((a,b)=>a.start-b.start);
  }
 }
 return found.filter(a=>!found.some(b=>b!==a&&b.start<=a.start&&b.end>=a.end&&(b.start<a.start||b.end>a.end))).sort((a,b)=>a.start-b.start);
}
export function extractConcepts(text){
 const concepts=vocabulary.map(c=>({...c,positions:findTerms(text,[...c.aliases,...c.en])})).filter(c=>c.positions.length);
 return concepts.filter(c=>c.positions.some(p=>!concepts.some(other=>other.id!==c.id&&other.positions.some(q=>q.start<=p.start&&q.end>=p.end&&(q.start<p.start||q.end>p.end)))));
}
export function parseConceptEditor(text,corpus){
 return text.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,8).map((line,i)=>{
  const [zh,...rest]=line.split('|');const en=rest.join('|').split(/[;；]/).map(x=>x.trim()).filter(Boolean);
  return {id:'c'+i,zh:zh.trim(),en,aliases:[zh.trim()],positions:findTerms(corpus,[zh.trim(),...en])};
 });
}
export function booleanQuery(concepts,join='AND',language='en'){
 return concepts.map(c=>[...new Set(language==='zh'?[c.zh]:c.en)].filter(Boolean))
 .filter(a=>a.length).map(a=>'('+a.map(v=>'"'+v.replace(/["\\\r\n]/g,' ').trim()+'"').join(' OR ')+')').join(join==='OR'?' OR ':' AND ');
}
export function matchDocument(doc,concepts){
 const evidence=[];
 for(const c of concepts){
  for(const [i,s] of (doc.sections||[]).entries()){
   const matches=findTerms(s.text,[c.zh,...(c.aliases||[]),...c.en]);
   if(matches.length){const from=Math.max(0,matches[0].start-85),to=Math.min(s.text.length,matches[0].end+140);evidence.push({concept:c.id,label:c.zh,section:s.label,sectionIndex:i,matches,snippet:(from?'…':'')+s.text.slice(from,to)+(to<s.text.length?'…':''),kind:s.kind||'body'});}
  }
 }
 const bodyIds=[...new Set(evidence.filter(e=>e.kind==='body').map(e=>e.concept))];
 const allIds=[...new Set(evidence.map(e=>e.concept))];
 return {...doc,evidence,bodyIds,allIds,score:bodyIds.length*100+allIds.length*10+Math.min(9,evidence.filter(e=>e.kind==='body').length)};
}
export function canonicalDOI(doi=''){return doi.toLowerCase().trim().replace(/^https?:\/\/(dx\.)?doi.org\//,'').replace(/^doi:\s*/,'');}
export function deduplicate(docs){
 const out=[];
 for(const doc of docs){
  const doi=canonicalDOI(doc.doi),title=(doc.title||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  const old=out.find(x=>(doi&&canonicalDOI(x.doi)===doi)|| (doc.source!=='本地导入'&&x.source!=='本地导入'&&title&&title===(x.title||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')&&(!doi||!x.doi)) || (doc.id&&doc.id===x.id));
  if(!old){out.push({...doc,doi,sections:[...(doc.sections||[])],sources:doc.sources||[doc.source]});continue;}
  old.sources=[...new Set([...old.sources,doc.source])]; old.doi=old.doi||doi;old.pmcid=old.pmcid||doc.pmcid;
  for(const s of doc.sections||[])if(!old.sections.some(a=>a.text===s.text))old.sections.push(s);
 }
 return out;
}
export function formatNumber(n){return Math.abs(n)<0.001||Math.abs(n)>=100000? n.toExponential(5):Number(n.toPrecision(7)).toString();}
export function download(name,content,type='text/plain;charset=utf-8'){
 const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
