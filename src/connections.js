import {bridges} from './knowledge.js';
const chemistry='https://openstax.org/details/books/chemistry-2e',biology='https://openstax.org/details/books/biology-2e',physics='https://openstax.org/details/books/university-physics-volume-2';
const additions=[
 ['osmosis','渗透压：从粒子数到细胞体积',['化学','物理','生物'],'渗透压 渗透作用 osmosis osmotic pressure 理想气体','Π ≈ icRT；PV = nRT','稀溶液渗透压与溶质粒子数浓度相关，形式上与理想气体状态关系相通。半透膜把粒子分布差异转化为水流的驱动力。','相同质量浓度不意味着相同渗透压：摩尔质量、解离情况和膜通透性都重要。','只在稀溶液等近似下使用；张力还取决于溶质能否跨膜，等渗不必等张。',biology],
 ['nernst','Nernst：浓度差如何对应电压',['化学','物理','生物','数学'],'膜电位 能斯特 Nernst equilibrium potential 化学平衡','E = (RT/zF) ln(a外/a内)','对单一离子，把跨膜化学势差与电势差相抵，得到平衡电位。对数把活度的倍数变化转为电压的加法变化。','浓度梯度改变十倍时，平衡电位变化量还取决于温度和离子价数。','符号取决于电位和内外侧定义；真实静息膜电位通常由多种离子及通透性共同决定。',biology],
 ['boltzmann','Boltzmann 分布：能量与概率',['数学','物理','化学','生物'],'玻尔兹曼 Boltzmann population probability 能级 配分函数','pᵢ ∝ exp(−Eᵢ/kBT)','能量较高的状态在热平衡中通常权重更低；指数函数连接能量差与占据概率。用摩尔能量时改用气体常数 R。','能量差相同，提高温度会使两个状态的相对概率差距减小。','要求对应的平衡统计假设；不同简并度需计入，不能把非平衡活性系统直接当作平衡分布。',physics],
 ['activation','活化能与平衡：快慢和方向分别由什么决定',['化学','生物','物理'],'活化能 催化 酶 Arrhenius activation energy 自发','k = A exp(−Eₐ/RT)；ΔG = ΔG° + RT ln Q','势垒影响变化速率，自由能差决定给定条件下的热力学趋势。催化可以改变途径和速率，却不改同一反应的平衡常数。','酶能加快反应达到平衡，但不能把不利的净反应凭空变成有利；耦联需另算总自由能。','Arrhenius 参数仅在特定温区和机理下有效；Eₐ 与 ΔG 不是同一个量。',biology],
 ['rc','RC 电路：从电容充放电到膜响应',['物理','数学','生物'],'RC 时间常数 电容 膜电容 exponential time constant','τ = RC；V(t) = V∞ + (V₀−V∞)exp(−t/τ)','电容储存电荷、电阻限制电流，形成一阶响应。细胞膜在一定范围也可用等效电路帮助理解短时电压变化。','经过一个时间常数，理想一阶响应完成约 63% 的总变化。','膜上离子通道常有非线性和电压依赖性；简单 RC 模型不能完整产生动作电位。',physics],
 ['poisson','计数噪声：光子、菌落与泊松统计',['数学','物理','生物','化学'],'Poisson 泊松 光子计数 菌落 计数噪声','Var(N) = λ；相对标准差约 1/√λ','独立稀疏事件在固定窗口内常可用泊松模型近似。计数越少，相对波动通常越显著。','延长曝光使平均光子计数变成四倍，理想计数噪声的相对标准差约减半。','事件成簇、死时间、背景漂移和检测效率变化会破坏简单泊松假设。',physics],
 ['fourier','Fourier：从时域波形到光谱',['数学','物理','化学','生物'],'傅里叶 Fourier 频谱 光谱 红外 NMR 信号','f(t) ↔ F(ω)','把信号表示为不同频率成分的叠加，帮助分析振动、光谱与生物电信号。时间窗口和采样方式影响能分辨什么。','记录时间更长可以改善频率分辨能力，但不能弥补不恰当的采样率。','频谱峰不自动对应一种唯一化学物；混叠、窗函数和噪声均需考虑。',physics],
 ['beer','Beer–Lambert：吸光度与对数标尺',['数学','物理','化学','生物'],'吸光度 分光光度 标准曲线 Beer Lambert optical density OD','A = −log₁₀(I/I₀) = εlc','对透射光强取对数，常可把指数衰减变成与浓度成正比的关系。标准曲线用实测数据检验适用范围。','细胞悬液的 OD 常含散射贡献，不能未经标定就当成纯吸收计算摩尔浓度。','要求适当波长、均匀介质和已验证的线性区；高浓度、杂散光与散射会导致偏离。',chemistry],
 ['buffer','缓冲：平衡的对数形式',['化学','生物','数学'],'缓冲液 pH pKa Henderson Hasselbalch 酸碱','pH ≈ pKₐ + log₁₀([A⁻]/[HA])','把弱酸解离平衡写成对数比值，可把组成比例与酸碱度联系起来。生物系统用缓冲维持适合的环境。','共轭碱与酸的比值变为十倍时，理想近似下 pH 增加 1。','活度、温度、稀释和缓冲容量都重要；极稀或极端配比时近似可能失效。',chemistry],
 ['binding','配体结合：亲和力与占据比例',['化学','生物','数学'],'Kd 解离常数 受体 ligand binding affinity receptor','θ = [L]/(Kd+[L])','单类独立位点在平衡下的占据率是饱和曲线；Kd 是半占据时的游离配体浓度。','总加入浓度与游离浓度不一定相同，配体被大量消耗时需质量守恒一起求解。','Kd 不等于一般酶反应的 Km；多位点、协同或非平衡过程需其他模型。',biology],
 ['hill','协同效应与 Hill 曲线',['生物','化学','数学'],'Hill 希尔 协同 血红蛋白 cooperative binding sigmoid','θ = [L]ⁿ/(K₀.₅ⁿ+[L]ⁿ)','相互影响的结合过程可以表现为 S 形响应。Hill 方程常作经验描述，让浓度响应的陡峭程度可比较。','同样半饱和浓度，Hill 系数不同会产生不同陡峭程度的曲线。','Hill 系数不一般等于真实结合位点数，拟合曲线本身不能证明具体协同机理。',biology],
 ['logistic','Logistic：资源约束下的增长',['数学','生物','物理'],'Logistic 逻辑斯蒂 种群 微生物增长 carrying capacity','dN/dt = rN(1−N/K)','低密度时增长近似指数，高密度时受资源约束而减慢。非线性反馈把指数曲线变成 S 形。','培养物吸光度若未校正散射与死细胞，不能直接等同于活菌数。','K 与 r 依环境而定；滞后期、死亡期及环境变化不能由简单模型自动解释。',biology],
 ['conservation','守恒：反应计量与线性代数',['数学','物理','化学','生物'],'质量守恒 电荷守恒 stoichiometry matrix 代谢网络','S·v = 0（稳态）；A·ν = 0（元素守恒）','反应式的配平可视为寻找满足守恒约束的向量；代谢网络把各反应通量组织成矩阵约束。','即使某条代谢通路的净反应可行，也要检查中间体和辅因子的守恒。','守恒是必要条件，不保证反应有利或有足够速率；开放系统还需计入边界通量。',chemistry],
 ['fick','通量：扩散、导热与导电的共同结构',['数学','物理','化学','生物'],'Fick 菲克 Fourier heat Ohm 梯度 通量 导热 导电','J = −D∇c；q = −κ∇T；j = σE','许多输运过程可由“通量与驱动力梯度成正比”描述。系数反映材料或介质的响应。','浓度更陡的区域通常有更强扩散通量，但介质的 D 也同样重要。','线性、局部平衡与常系数等条件需核实；不同通量有不同单位，不能仅凭形式互换数值。',physics],
 ['surface','表面与界面：毛细现象到生物膜',['物理','化学','生物'],'表面张力 毛细 Young Laplace 肺泡 界面','ΔP = γ(1/R₁ + 1/R₂)','弯曲界面的压差与张力和曲率相关，联系液滴、毛细管、泡与部分生物界面现象。','同样界面张力下，理想球形液滴半径越小，内外压差越大。','双界面肥皂泡与单界面液滴的系数不同；真实肺泡和细胞还涉及复杂弹性与几何。',physics],
 ['centrifuge','离心：角速度、沉降与分离',['物理','化学','生物','数学'],'RCF rpm 离心 沉降 centrifugation centrifugal','a = ω²r；RCF = 1.118×10⁻⁵·r(cm)·rpm²','转速需与转子半径一起转换为相对离心力；沉降还取决于粒子大小、密度差和黏度。','相同 rpm 的两台设备，转子半径不同时 RCF 不同，不能直接照搬参数。','此式仅作 RCF 换算；不能据此预测所有样品的分离时间。须核对设备和原方案。',physics],
 ['electrophoresis','电泳：电场驱动力与黏性阻力',['物理','化学','生物'],'电泳 electrophoresis 迁移率 DNA 凝胶 斯托克斯','v = μE','电荷在电场中受到驱动力，介质阻力限制其速度；凝胶还引入筛分效应。','DNA 片段可在凝胶中按大小表现出不同迁移距离；需用标准条带标定。','迁移率依电荷、形状、介质和条件；不能对任意蛋白照搬 DNA 的大小分离解释。',biology],
 ['error','误差传播：偏导数如何进入实验报告',['数学','物理','化学','生物'],'误差 不确定度 error propagation uncertainty covariance','u²(f) ≈ Σ(∂f/∂xᵢ)²u²(xᵢ) + 协方差项','用函数在测量点附近的局部变化率，估算输入不确定度如何影响结果。相关输入需要协方差。','稀释倍数、标准液浓度和标定曲线都可能影响最终浓度；重复测量的 SD 不是全部不确定度。','一阶近似在强非线性、大不确定度或边界附近可能不适用；系统误差不会靠重复次数自动消失。', 'https://www.itl.nist.gov/div898/handbook/mpc/section5/mpc55.htm'],
 ['bayes','Bayes：阳性结果为什么还要看先验',['数学','生物','化学'],'Bayes 贝叶斯 先验 后验 灵敏度 特异度 检测','P(H|D) = P(D|H)P(H)/P(D)','检测结果的信息量不仅依赖方法性能，还依赖假设在检测前的概率。概率推理可以帮助区分不同误判来源。','低发生率条件下，即使方法有较高特异度，阳性结果中的假阳性占比仍可能不低。','这是概率教学，不用于个人诊断；条件概率、样本选择和方法验证范围必须一致。',biology],
 ['oscillation','振荡：弹簧、分子振动与反馈系统',['数学','物理','化学','生物'],'振动 振荡 harmonic oscillator resonance 分子振动 共振','mẍ + bẋ + kx = F(t)','回复力、惯性和阻尼产生多种时间响应。分子振动的近似模型与宏观弹簧共享数学结构。','较大约化质量通常使同样力常数下的振动频率降低，帮助理解同位素效应。','经典简谐模型不能替代量子能级和光谱选择定则；非线性生物节律也不一定是简谐振荡。',physics]
].map(([id,title,fields,terms,formula,meaning,example,boundary,source])=>({id,title,fields,terms,formula,meaning,example,boundary,source}));
export const allBridges=[...bridges,...additions];
const aliases={化学势:['chemical potential','电化学势'],膜电位:['Nernst','能斯特','平衡电位'],扩散:['diffusion','随机游走','Fick'],酶:['enzyme','米氏','Michaelis','催化'],标准曲线:['标定','calibration','吸光度'],吸光度:['分光','Beer','光谱'],不确定度:['误差','uncertainty'],概率:['统计','Bayes','Boltzmann','Poisson'],时间常数:['RC','指数衰减']};
function tokens(query){
 const cleaned=query.toLowerCase().normalize('NFKC').replace(/[，。？?：:、；;()（）]/g,' '),out=new Set(cleaned.split(/\s+/).filter(Boolean));
 for(const [k,values] of Object.entries(aliases))if(cleaned.includes(k)||values.some(v=>cleaned.includes(v.toLowerCase()))){out.add(k);values.forEach(v=>out.add(v.toLowerCase()));}
 for(const chunk of cleaned.match(/[\u3400-\u9fff]+/g)||[])for(let i=0;i<chunk.length-1;i++){const t=chunk.slice(i,i+2);if(!['什么','如何','为什么','可以','之间','有关','关系','一个','实验'].includes(t))out.add(t);}
 return [...out];
}
export function searchConnections(query='',fields=[]){
 const terms=tokens(query.trim());
 const candidates=allBridges.filter(b=>fields.every(f=>b.fields.includes(f))).map(b=>{const main=(b.title+' '+b.terms).toLowerCase(),body=(b.meaning+' '+b.example+' '+b.formula+' '+b.fields.join(' ')).toLowerCase();let score=0;for(const t of terms)score+=(main.includes(t)?t.length*4:0)+(body.includes(t)?t.length:0);return {...b,score};});
 const best=Math.max(0,...candidates.map(c=>c.score)),threshold=Math.max(terms.some(t=>t.length>2)?3:1,best*.08);
 return candidates.filter(b=>!terms.length||b.score>=threshold).sort((a,b)=>b.score-a.score);
}
