import {booleanQuery,deduplicate,matchDocument} from './core.js';
const EPMC='https://www.ebi.ac.uk/europepmc/webservices/rest/';
async function request(url,type='json',signal){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),18000);
 const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
 try{if(signal?.aborted)throw new Error('检索已取消');const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw new Error('HTTP '+r.status);return await (type==='json'?r.json():r.text());}
 finally{clearTimeout(timeout);signal?.removeEventListener('abort',abort);}
}
export function bodyFromXML(xml){
 const dom=new DOMParser().parseFromString(xml,'application/xml');
 if(dom.querySelector('parsererror'))throw new Error('无法解析全文 XML');
 const body=dom.querySelector('body');if(!body)return [];
 body.querySelectorAll('ref-list,table-wrap,fig').forEach(x=>x.remove());
 return [...body.querySelectorAll('p')].map((p,i)=>({label:(p.closest('sec')?.querySelector('title')?.textContent||'正文')+' · 段落 '+(i+1),text:p.textContent.replace(/\s+/g,' ').trim(),kind:'body'})).filter(x=>x.text);
}
export async function searchLiterature(concepts,{onProgress=()=>{},signal}={}){
 const ready=concepts.filter(c=>c.en.length).slice(0,6);
 if(!ready.length)throw new Error('至少需要一个英文概念，请编辑概念词表。');
 const docs=[],errors=[];let done=0;
 const jobs=ready.flatMap(c=>[
  async()=>{
   const data=await request(EPMC+'search?'+new URLSearchParams({query:booleanQuery([c]),format:'json',resultType:'core',pageSize:'5'}),'json',signal);
   for(const r of data.resultList?.result||[])docs.push({id:'epmc-'+r.source+'-'+r.id,title:plain(r.title||'无标题'),source:'Europe PMC',doi:r.doi,pmcid:r.pmcid,fullTextLinks:r.fullTextUrlList?.fullTextUrl||[],year:r.pubYear,authors:r.authorString,url:r.doi?'https://doi.org/'+r.doi:'https://europepmc.org/article/'+r.source+'/'+r.id,retracted:r.isRetracted==='Y',sections:[{label:'摘要',kind:'abstract',text:plain(r.abstractText||'')},{label:'标题',kind:'metadata',text:plain(r.title||'')}].filter(s=>s.text)});
  },
  async()=>{
   const data=await request('https://api.crossref.org/works?'+new URLSearchParams({'query.bibliographic':c.en[0],rows:'5',select:'DOI,title,author,published,abstract,URL'}),'json',signal);
   for(const r of data.message?.items||[])docs.push({id:'doi-'+r.DOI,title:plain(r.title?.[0]||'无标题'),source:'Crossref',doi:r.DOI,year:r.published?.['date-parts']?.[0]?.[0]||'',authors:(r.author||[]).slice(0,4).map(a=>[a.given,a.family].filter(Boolean).join(' ')).join(', '),url:'https://doi.org/'+r.DOI,sections:[{label:'摘要',kind:'abstract',text:plain(r.abstract||'')},{label:'标题',kind:'metadata',text:plain(r.title?.[0]||'')}].filter(s=>s.text)});
  }
 ].map((run,i)=>({run,name:c.zh+' · '+(i?'Crossref':'Europe PMC')})));
 await pool(jobs,3,async job=>{try{await job.run();}catch(e){errors.push(job.name+'：'+(e.name==='AbortError'?'超时或取消':e.message));}onProgress('召回 '+(++done)+'/'+jobs.length+' 个概念来源');},signal);
 if(signal?.aborted)throw new Error('检索已取消');
 const merged=deduplicate(docs),full=merged.filter(d=>d.pmcid).slice(0,12);let fullDone=0;
 await pool(full,3,async d=>{try{const xml=await request(EPMC+d.pmcid+'/fullTextXML','text',signal);const sections=bodyFromXML(xml);d.sections.push(...sections);d.bodyStatus=sections.length?'全文已获取':'全文中无可解析正文';}catch{d.bodyStatus='正文未获取（访问限制或网络错误）';}onProgress('验证开放正文 '+(++fullDone)+'/'+full.length);},signal);
 if(signal?.aborted)throw new Error('检索已取消');
 return {documents:merged.map(d=>matchDocument(d,concepts)).sort((a,b)=>b.score-a.score),errors,stats:{candidates:merged.length,bodyChecked:full.length,concepts:ready.length}};
}
function plain(html){const parser=new DOMParser();return parser.parseFromString(parser.parseFromString(html,'text/html').body.textContent,'text/html').body.textContent.trim();}
async function pool(items,limit,run,signal){let i=0;await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(i<items.length&&!signal?.aborted){const item=items[i++];await run(item);}}));}
export function externalLinks(concepts,join){
 const en=booleanQuery(concepts,join),zh=booleanQuery(concepts,join,'zh');
 return [
 ['Google Scholar','https://scholar.google.com/scholar?q='+encodeURIComponent(en)],
 ['ResearchGate','https://www.researchgate.net/search/publication?q='+encodeURIComponent(en)],
 ['知网（检索入口）','https://kns.cnki.net/kns8s/defaultresult/index?kw='+encodeURIComponent(zh)],
 ['Europe PMC','https://europepmc.org/search?query='+encodeURIComponent(en)]
 ];
}
