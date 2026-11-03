// Per-page memory only. Never serialize this configuration into exports or source.
let configuration={endpoint:'',model:'',key:''};
export function aiConfiguration(){return {...configuration};}
export function configureAI(input){
 const endpoint=normalizeEndpoint(input.endpoint);
 if(!input.model?.trim())throw new Error('请填写模型名称');
 configuration={endpoint,model:input.model.trim(),key:(input.key||'').trim()};return true;
}
export function clearAI(){configuration={endpoint:'',model:'',key:''};}
export function normalizeEndpoint(value){
 let u;try{u=new URL(value.trim());}catch{throw new Error('请输入完整的 API 地址');}
 if(u.username||u.password||u.search||u.hash)throw new Error('API 地址不能包含密码、查询参数或锚点');
 if(u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)))throw new Error('远程 API 必须使用 HTTPS；本地服务可使用 HTTP');
 u.pathname=u.pathname.replace(/\/+$/,'');if(!u.pathname.endsWith('/chat/completions'))u.pathname+='/chat/completions';return u.href;
}
export async function askAI(system,prompt,{signal,fetcher=fetch}={}){
 const c={...configuration};if(!c.endpoint||!c.model)throw new Error('请先配置自定义 AI 接口，或使用内置知识库');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),60000),abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
 try{
  if(signal?.aborted)throw new Error('请求已取消');
  const r=await fetcher(c.endpoint,{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json',...(c.key?{Authorization:'Bearer '+c.key}:{})},body:JSON.stringify({model:c.model,messages:[{role:'system',content:system},{role:'user',content:prompt}],stream:false})});
  if(!r.ok)throw new Error('AI 服务返回 HTTP '+r.status+'，请核对接口、模型或额度');
  const data=await r.json(),answer=data.choices?.[0]?.message?.content;
  if(typeof answer!=='string'||!answer.trim())throw new Error('服务未返回兼容的文本回答');return answer.trim();
 }catch(e){if(e.name==='AbortError')throw new Error('AI 请求已取消或超过 60 秒');if(e instanceof TypeError)throw new Error('无法连接 AI 接口：请检查网络与服务的浏览器跨域（CORS）支持');throw e;}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
