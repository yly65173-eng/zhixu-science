export async function readDocument(file){
 if(file.size>20*1024*1024)throw new Error('单个文件上限 20 MB，请拆分后导入。');
 const ext=file.name.split('.').pop().toLowerCase(),data=new Uint8Array(await file.arrayBuffer());let sections=[];
 if(ext==='pdf'){
  const pdfjs=await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).href;
  const pdf=await pdfjs.getDocument({data,isEvalSupported:false}).promise;
  try{
   if(pdf.numPages>150)throw new Error('第一版上限 150 页，请拆分 PDF。');
   for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),content=await page.getTextContent();sections.push({label:'PDF 第 '+i+' 页',text:content.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('').trim()});}
  }finally{await pdf.destroy();}
 }else if(['docx','pptx'].includes(ext)){
  const {Unzip,UnzipInflate,strFromU8}=await import('fflate');const selected=[];let bytes=0;
  const unzip=new Unzip(entry=>{
   if(!(ext==='docx'?/^word\/document.xml$/:/^ppt\/slides\/slide\d+\.xml$/).test(entry.name))return;
   const chunks=[];entry.ondata=(err,chunk,final)=>{if(err)throw err;bytes+=chunk.length;if(bytes>40*1024*1024)throw new Error('解压文本超过 40 MB，已停止导入');chunks.push(chunk);if(final){const result=new Uint8Array(chunks.reduce((n,c)=>n+c.length,0));let offset=0;for(const c of chunks){result.set(c,offset);offset+=c.length;}selected.push({name:entry.name,text:strFromU8(result)});}};entry.start();
  });unzip.register(UnzipInflate);unzip.push(data,true);
  selected.sort((a,b)=>Number(a.name.match(/\d+/)?.[0]||0)-Number(b.name.match(/\d+/)?.[0]||0));
  sections=selected.map((part,i)=>{
   const xml=new DOMParser().parseFromString(part.text,'application/xml');if(xml.querySelector('parsererror'))throw new Error('课件 XML 损坏');
   const paras=[...xml.getElementsByTagNameNS('*','p')];
   return {label:ext==='pptx'?'幻灯片 '+(i+1):'Word 正文',text:paras.map(p=>[...p.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('')).join('\n')};
  });
 }else if(['txt','md'].includes(ext)){
  const text=new TextDecoder().decode(data);sections=text.split(/\n\s*\n/).map((text,i)=>({label:'正文 · 段落 '+(i+1),text:text.trim()}));
 }else throw new Error('支持 PDF、DOCX、PPTX、TXT、MD；旧版 DOC/PPT 请先转换。');
 sections=sections.filter(s=>s.text);
 if(!sections.length)throw new Error('没有可提取文本。扫描件需要先 OCR；图表、公式图片与手写内容不会被识别。');
 return {id:'local-'+crypto.randomUUID(),title:file.name,source:'本地导入',sections,year:'本地'};
}
