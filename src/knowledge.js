// Curated vocabulary, intentionally small and editable. Never pretend this is unrestricted translation.
export const vocabulary = [
 ['solubility','溶解度',['solubility','molar solubility'],['溶解度','溶解性']],
 ['ksp','溶度积',['solubility product','Ksp'],['溶度积','Ksp']],
 ['precipitation','沉淀',['precipitation','precipitate'],['沉淀']],
 ['kinetics','反应动力学',['reaction kinetics','chemical kinetics'],['反应动力学','反应速率','动力学']],
 ['catalysis','催化',['catalysis','catalytic'],['催化']],
 ['photo','光催化',['photocatalysis','photocatalytic'],['光催化']],
 ['nano','纳米颗粒',['nanoparticle','nanoparticles'],['纳米颗粒','纳米粒子']],
 ['diffusion','扩散',['diffusion','diffusive'],['扩散']],
 ['entropy','熵',['entropy'],['熵']],
 ['freeenergy','吉布斯自由能',['Gibbs free energy','Gibbs energy'],['自由能','吉布斯']],
 ['equilibrium','化学平衡',['chemical equilibrium','equilibrium constant'],['化学平衡','平衡常数']],
 ['protein','蛋白质',['protein','proteins'],['蛋白质','蛋白']],
 ['folding','蛋白质折叠',['protein folding','folding'],['蛋白质折叠','蛋白折叠']],
 ['enzyme','酶动力学',['enzyme kinetics','Michaelis-Menten'],['酶动力学','米氏','酶促']],
 ['electro','电化学',['electrochemistry','electrochemical'],['电化学']],
 ['battery','锂离子电池',['lithium-ion battery','lithium ion batteries'],['锂离子电池','锂电池']],
 ['perovskite','钙钛矿',['perovskite','perovskites'],['钙钛矿']],
 ['solar','太阳能电池',['solar cell','photovoltaic'],['太阳能电池','光伏']],
 ['adsorption','吸附',['adsorption','adsorbent'],['吸附']],
 ['membrane','膜分离',['membrane separation','membrane filtration'],['膜分离','膜过滤']],
 ['centrifuge','离心',['centrifugation','centrifuge'],['离心']],
 ['spectro','分光光度法',['spectrophotometry','spectrophotometric'],['分光光度','吸光度']],
 ['titration','滴定',['titration','titrimetric'],['滴定']],
 ['crystal','结晶',['crystallization','crystallisation'],['结晶']],
 ['brownian','布朗运动',['Brownian motion'],['布朗运动']],
 ['oxidative','氧化应激',['oxidative stress'],['氧化应激']],
 ['cell','细胞',['cell','cells'],['细胞']],
 ['sn2','亲核取代',['nucleophilic substitution','SN2'],['亲核取代','SN2']],
 ['uncertainty','不确定度',['measurement uncertainty','error analysis'],['不确定度','误差分析']],
 ['thermal','热力学',['thermodynamics','thermodynamic'],['热力学']]
].map(([id,zh,en,aliases])=>({id,zh,en,aliases}));
vocabulary.push(...[
 ['nernst','膜电位',['membrane potential','Nernst equation'],['膜电位','能斯特','Nernst']],
 ['osmosis','渗透作用',['osmosis','osmotic pressure'],['渗透压','渗透作用','半透膜']],
 ['potential','化学势',['chemical potential','electrochemical potential'],['化学势','电化学势']],
 ['binding','配体结合',['ligand binding','dissociation constant'],['配体结合','受体结合','解离常数']],
 ['logistic','种群增长',['population growth','logistic growth'],['种群','Logistic','逻辑斯蒂']],
 ['fourier','傅里叶分析',['Fourier transform','spectral analysis'],['傅里叶','频谱']],
 ['poisson','泊松统计',['Poisson distribution','photon counting'],['泊松','光子计数']],
 ['rc','RC 电路',['RC circuit','membrane capacitance'],['RC电路','RC 电路','膜电容']],
 ['electrophoresis','电泳',['electrophoresis','electrophoretic mobility'],['电泳','迁移率']],
 ['surface','表面张力',['surface tension','capillary pressure'],['表面张力','毛细']],
 ['dna','DNA 复制',['DNA replication','semiconservative replication'],['DNA','半保留复制']],
 ['translation','蛋白质合成',['protein synthesis','translation'],['转录','翻译','蛋白质合成']],
 ['stoichiometry','反应计量',['stoichiometry','mass balance'],['计量','质量守恒','代谢网络']],
 ['buffer','酸碱缓冲',['buffer capacity','acid-base equilibrium'],['缓冲','pKa']],
 ['oscillation','振动',['oscillation','molecular vibration'],['振动','振荡','共振']]
].map(([id,zh,en,aliases])=>({id,zh,en,aliases})));

export const bridges = [
 {id:'potential',title:'势：变化为什么会朝一个方向发生？',fields:['物理','化学','生物','数学'],terms:'电势 · 化学势 · 电化学势 · 势函数',formula:'μ = μ° + RT ln a； μ̃ = μ + zFφ',meaning:'共同点是用一个标量刻画驱动力。电势 φ 是单位电荷的势能，化学势 μ 是吉布斯自由能对组分物质的量的偏导。离子跨膜时，两种贡献需要一起计算。',example:'离子可能逆浓度梯度跨膜：浓度项不利，但电势项有利；应比较总电化学势。',boundary:'电势单位是 V，化学势是 J/mol，二者不能直接相加，须乘 zF。化学势并不等于浓度。',source:'https://goldbook.iupac.org/terms/view/C01032'},
 {id:'diffusion',title:'随机游走，如何长成扩散方程？',fields:['数学','物理','化学','生物'],terms:'随机游走 · 布朗运动 · 扩散 · 被动运输',formula:'∂c/∂t = D∇²c；⟨r²⟩ = 2dDt',meaning:'粒子每一步随机运动，大量粒子的平均分布却遵循确定的扩散方程。数学里的概率密度，对应物理中的粒子分布或化学中的浓度场。',example:'细胞内小分子的扩散时间尺度约为 L²/(2dD)；距离翻倍，典型扩散时间变为四倍。',boundary:'这里假定均匀介质、常数 D、无整体流动；主动运输、拥挤介质和异常扩散不一定满足。',source:'https://openstax.org/books/college-physics-2e/pages/12-7-molecular-transport-phenomena-diffusion-osmosis-and-related-processes'},
 {id:'entropy',title:'熵：不确定性与微观状态的桥梁',fields:['数学','物理','化学','生物'],terms:'香农熵 · 热力学熵 · 统计熵',formula:'H = −Σpᵢ ln pᵢ；S = −kBΣpᵢ ln pᵢ',meaning:'两式共享概率加权的对数结构。香农熵描述分布的不确定性，统计物理将概率对应到微观状态，并用玻尔兹曼常数建立量纲。',example:'蛋白质折叠减少了部分构象的多样性，但还要计算溶剂熵与焓的贡献，才能判断是否自发。',boundary:'信息熵本身没有 J/K 的量纲；不能直接由一段文本的信息熵推出某个化学反应的热力学熵变。',source:'https://openstax.org/books/chemistry-2e/pages/16-2-entropy'},
 {id:'saturation',title:'饱和曲线：不同学科里的同一种形状',fields:['数学','化学','生物'],terms:'米氏方程 · Langmuir 吸附 · 双曲线',formula:'v = Vmax[S]/(Km+[S])；θ = Kc/(1+Kc)',meaning:'有限的酶活性位点与有限的吸附位点，都会产生低浓度近似线性、高浓度趋于饱和的响应。数学形式相近，可以帮助理解参数。',example:'在单一底物的米氏模型中，[S] = Km 时 v = Vmax/2；Langmuir 模型里 c = 1/K 时 θ = 1/2。',boundary:'形似不等于机理相同。米氏模型有稳态等假设，Langmuir 模型要求等价位点、单层吸附等条件。',source:'https://www.ncbi.nlm.nih.gov/books/NBK22330/'},
 {id:'exponential',title:'指数衰减：反应、放射性与微分方程',fields:['数学','物理','化学','生物'],terms:'一阶动力学 · 放射性衰变 · 指数分布',formula:'dx/dt = −kx；x(t) = x₀e⁻ᵏᵗ；t½ = ln 2/k',meaning:'只要瞬时减少速率与当前数量成正比，就得到相同的微分方程。它可以描述理想一阶反应、单一核素衰变等过程。',example:'半衰期与初始量无关。这能用来检查实验数据是否近似符合一阶模型。',boundary:'并非所有反应都是一阶；多相衰减、可逆反应、饱和消除过程不能直接套用。',source:'https://openstax.org/books/chemistry-2e/pages/12-4-integrated-rate-laws'}
];

export const sampleCorpus = '我想研究纳米颗粒对蛋白质折叠和酶动力学的影响，尤其关注扩散过程与氧化应激。';
export const sampleDocs = [
 {id:'demo-1',title:'教学样例 A：纳米颗粒表面与蛋白质行为',source:'本地教学样例',year:'示例',demo:true,sections:[{label:'正文 · 第 1 段',text:'Nanoparticles can interact with proteins at their surfaces. Protein folding depends on the local environment. Diffusion controls how quickly proteins encounter the surface.'},{label:'正文 · 第 2 段',text:'Enzyme kinetics may change after surface adsorption. This paragraph is original demonstration text, not a published scientific finding.'}]},
 {id:'demo-2',title:'教学样例 B：传输过程与氧化应激',source:'本地教学样例',year:'示例',demo:true,sections:[{label:'正文 · 第 1 段',text:'Diffusion and oxidative stress are separate concepts that may occur together in studies of nanoparticles. This demonstration illustrates concept matching and does not establish a causal relationship.'}]}
];
export const sampleProtocol = `实验：分光光度法测定溶液浓度（教学材料示例）
原理：在适用的稀溶液范围，吸光度 A = εlc。浓度过高可能偏离线性。
1. 配制空白与多组标准溶液，逐一记录各组浓度。
2. 检查比色皿洁净且无气泡，以空白溶液调零。
3. 在相同波长和光程下测定标准溶液的吸光度，每组平行测量 3 次。
4. 绘制标准曲线并检查线性和残差。
5. 测量未知溶液；若读数超出已验证的标准曲线范围，稀释后重测并记录倍数。
6. 根据标准曲线计算浓度，报告重复性和不确定度。
注意：不能将吸光度的某个通用数值区间当作本仪器的合格标准。`;
