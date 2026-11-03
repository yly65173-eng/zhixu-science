import {canonicalDOI} from './core.js';
export function safeWebURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function articleLinks(doc){
 const links=[],seen=new Set();
 const add=(label,url,access)=>{const safe=safeWebURL(url);if(safe&&!seen.has(safe)){seen.add(safe);links.push({label,url:safe,access});}};
 const pmcid=/^PMC\d+$/i.test(doc.pmcid||'')?doc.pmcid.toUpperCase():null;
 if(pmcid)add('开放全文 · PMC','https://pmc.ncbi.nlm.nih.gov/articles/'+pmcid+'/','open');
 for(const l of doc.fullTextLinks||[]){const open=l.availabilityCode==='OA'||/open access/i.test(l.availability||'');add((l.documentStyle==='pdf'?'PDF 原文':'全文页面')+(open?' · 开放':''),l.url,open?'open':'unknown');}
 const doi=canonicalDOI(doc.doi);
 if(doi)add('出版社原文 · DOI','https://doi.org/'+doi,'publisher');
 if(!links.length&&!doc.demo&&doc.source!=='本地导入'&&doc.url)add('文献来源页面',doc.url,'unknown');
 return links;
}
