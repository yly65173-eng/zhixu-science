# 知序 · Zhixu Science

连接数物化生的开源学习工作台。v0.2 优先完善**文献正文证据检索**与**物理量推导路径**，并提供实验预习、跨学科术语桥梁、三维分子和反应示意。

**这是可运行的开源学习工具，不是全能科研 AI。** 默认无需密钥；文献术语与知识检索依赖可编辑词表和内置知识库，公式有明确条件。v0.2 增加可选的自定义 Chat Completions 接口，用于预习报告和跨学科解释；不会内置他人的密钥或自动调用收费服务。

- 在线应用：[知序工作台](https://zhixu-science-65173.yly65173.chatgpt.site)
- 源码：[yly65173-eng/zhixu-science](https://github.com/yly65173-eng/zhixu-science)
- 许可证：MIT，允许个人、教学、修改、再分发与商业使用；第三方依赖遵循其自身许可证。

## v0.2 更新

- **原文直达**：文献卡片新增显式开放全文、PDF（若来源提供）和出版社 DOI 按钮，显示主链接；来源窗口内也可打开。出版社链接可能需要机构访问权限。
- **结构与过程选择**：18 个结构模型，支持名称/分类筛选；10 个化学、生物、物理过程，支持播放、暂停、速度、循环与阶段跳转。生物粗粒化节点有单独说明。
- **跨学科检索器**：25 组知识连接，支持中文问题、英文术语、别名及多个学科同时筛选。结果含公式、例子、边界和参考；可继续到学术网站查证。
- **按名称生成预习报告**：20 类内置实验原理模板，含原理、流程提纲、记录表、误差分析等；可编辑、导出 Markdown、打印或另存 PDF。无依据的操作数值保留待核对。未知实验明确给出通用结构，不伪装成具体已验证方案。
- **实验数据处理器**：统计汇总、线性标准曲线与反算、滴定、零/一/二级动力学线性化、独立两组 Welch t；提供图表、残差、明细与 CSV/JSON/SVG 导出。所有运算在浏览器内执行。
- **可选 AI**：用户自行提供可信的 HTTPS API 基址、模型 ID 与密钥。点击对应按钮才发送界面说明的材料；密钥仅在页面内存，刷新清空，不进入导出或 localStorage。服务必须支持 CORS，可能按其规则计费。AI 结果单独标为未验证。没有设置时仍可使用全部内置功能。

## 运行

需要 Node.js >= 22.12（推荐 24 LTS）与 npm。

```sh
git clone https://github.com/yly65173-eng/zhixu-science.git
cd zhixu-science
npm ci
npm run dev
```

打开终端输出的本地地址。生产构建：

```sh
npm test
npm run build
npm run preview
```

`dist/` 为纯静态网站，可部署到支持 HTTPS 的静态主机。没有数据库或服务端密钥。GitHub Pages 子目录部署时应执行 `npm run build -- --base=/zhixu-science/`。仓库不携带作者的 Sites 项目身份，复制项目请创建自己的部署配置。

## 五个模块

### 1. 文献探索

1. 输入中文问题，或导入 PDF、DOCX、PPTX、TXT、MD 语料。
2. 从人工词表提取概念，保留原始解析文本的字符位置；重叠的专门术语优先。未识别的概念可以手工编辑。
3. 每行用 `中文名称 | English synonym; another synonym` 增补词表。**同义词组内 OR，不同概念组间 AND/OR**；可查看中英文检索式。
4. 联想检索对每个概念分别调用 Europe PMC 与 Crossref。每个来源取前 5 条，最多 6 个概念；这不是数据库的全量结果。
5. 按 DOI 规范化去重；没有 DOI 时按规范化标题回退，保留来源与正文。不同 DOI 的同名条目保留，避免把独立出版物误合并。
6. 从候选中最多选择 12 篇带 PMCID 的文献，尝试获取开放全文 XML；仅在 XML `body` 中匹配。摘要、标题、参考文献、图表说明不冒充正文证据。本地全文按解析页面/段落匹配。
7. 结果优先按正文命中概念数，再按所有证据命中概念数排序；展示概念筛选条、去重计数、段落/页码、段内字符位置。匹配代表词语出现，**不代表论文支持输入的论点**。
8. 导出包含概念、位置、来源、DOI、证据和失败记录的 JSON。

ResearchGate、Google Scholar、知网提供检索入口，**并未自动读取这些站点的全文**。不绕过登录、付费墙或访问限制。数学和物理专业数据库覆盖仍有限；可导入合法取得的全文补充。

初始的两篇文档是作者原创的教学样例，界面明确标注“非真实论文”；在线失败不会用样例伪装实际结果。上游 API 超时、CORS、限流和不可获取全文会被明确显示，部分失败仍保留已完成的来源结果。

### 2. 物理量路径

24 个物理量、19 条有条件公式，覆盖：

- 溶度积 → 摩尔/质量溶解度；一般计量比、1:1 盐的同离子情况。
- 质量 → 物质的量 → 浓度/粒子数。
- Beer–Lambert 定律与浓度。
- 标准吉布斯能与无量纲平衡常数。
- 一阶半衰期、Arrhenius 温度关系。
- Stokes–Einstein 扩散与均方根位移。

路径搜索使用多输入公式依赖递归，限制深度并排除循环。展示可计算路径与缺少量的路径；缺条件时不输出数值。数值按指定单位输入，不自动接受任意量纲。浓度近似 Ksp 与无量纲热力学 K 是分开的变量；不声称两个模型可直接互换。候选路径最多展示 12 条，不保证穷举全部科学关系。

### 3. 实验预习

- 导入老师的课件/指导书，保留解析文本和行号。
- 提取编号步骤、原理线索、注意事项、数据范围相关原文；未知内容明确留空。
- 根据离心、滴定、分光等词语给出**通用检查建议**、可能影响和验证办法；不能据此作确定失败诊断。
- 多组排程由用户输入时长，假定样品独立、一人一操作台、一台等待设备、允许阶段间等待。保证该模型内资源不重叠，不保证全局最优。
- 导出 Markdown 预习草稿。

可用 20 类内置模板按实验名称生成报告，也可显式调用自定义 AI；两者都不能替代教师方案。尚未实现可靠产率预测、从图片恢复表格或自动认可“正常数据区间”。对原方案的改进必须经过对照验证；排程前须确认样品稳定性、设备值守和转移时间要求。

### 4. 跨学科桥梁

25 组有适用边界的知识连接，覆盖电化学势、Nernst、渗透、Boltzmann、RC、泊松、Fourier、吸光度、缓冲、配体结合、Hill、Logistic、守恒、输运、表面张力、离心、电泳、不确定度、Bayes 与振荡等。支持术语/别名匹配、中文问题检索及学科交集筛选；可将主题带入文献搜索。空查询提供分批浏览，相关性阈值抑制仅含通用学科词的弱匹配。内置搜索不是全网知识或模型语义搜索。

### 5. 分子与反应示意

模型包括水、甲烷、二氧化碳、氨、氢、氧、氮、HCl、乙烯、乙炔、乙醇、苯骨架、乙酸骨架、甘氨酸、二肽、水二聚体、DNA 粗粒化与 α 螺旋 Cα 轨迹。明确标注省略的氢、形式电荷、侧链与节点含义。

过程包括 SN2、质子转移、酶催化、扩散、渗透、DNA 半保留复制、转录、翻译、ATP 合酶和有丝分裂。支持速度、循环和分阶段定位。所有模型和轨迹为独立绘制的教学示意，不是测定结构、量化计算、随机模拟或真实分子动力学。

## 隐私与文件支持

- 文件在当前浏览器内解析，无上传服务器。在线搜索只发送整理后的英文概念给 EBI/Crossref；外部检索链接会把检索式交给相应站点。
- 文档、语料、报告和数据结果仅在页面内存中，刷新会清空；需要留档时手动导出。没有账户或跨设备同步。自定义 AI 是可选的直接服务调用：报告只发送名称、模板及用户勾选的课件原文，知识解释只发送搜索问题和匹配标题。实验数值不被自动发送给 AI。
- 单文件 <=20 MB；PDF <=150 页；Office 提取文本解压后 <=40 MB。
- 支持可选中文本的 PDF、DOCX/PPTX 文本节点、UTF-8 TXT/MD。旧版 DOC/PPT 需转换。扫描件需先 OCR；图片、复杂图表、公式、上下标、分栏顺序和幻灯片备注可能丢失。
- PDF 以文件页序定位，不保证与印刷页码一致；Office 行号是提取后的文本行号，导入后应复核。
- 生产文件可本地托管；界面字体优先使用 Google Fonts（如不可达则使用系统字体）。这不传输导入文档，但会产生字体网络请求。

## 结构与扩展

```text
src/core.js          概念、布尔式、证据位置与去重
src/literature.js    开放接口与正文 XML 解析
src/quantities.js    物理量、公式与条件化路径搜索
src/files.js         本地文件文本提取
src/lab.js           原文提取与资源约束排程
src/knowledge.js     术语、桥梁知识与原创教学样例
src/molecules.js     三维绘制与反应示意
src/main.js          中文应用与交互
tests/               科学数值、边界、证据与排程测试
```

贡献术语请说明同义词和歧义；贡献公式需提供单位、适用条件、参考来源与数值测试；新增文献源需区分元数据、摘要和正文权限。推荐的后续工作：更多开放数据库适配、OCR、可编辑实验任务图、公式量纲检查、加权/非线性拟合及完整不确定度传播。任何云端模型接入都应先明确上传内容与费用。

## 开源调研与科学参考

实际采用 PDF.js、fflate 与 jStat；其余是调研候选，未复制其代码：

| 项目 | 本项目的取舍 |
| --- | --- |
| [Mozilla PDF.js](https://github.com/mozilla/pdf.js) | Apache-2.0；实际用于浏览器内提取 PDF 文本 |
| [fflate](https://github.com/101arrowz/fflate) | MIT；实际用于读取 Office 压缩包的 XML |
| [jStat](https://github.com/jstat/jstat) | MIT；用于 Student t 分布、区间与 Welch 检验 |
| [3Dmol.js](https://github.com/3dmol/3Dmol.js) | BSD-3-Clause；复杂结构、蛋白与 PDB 可在后续接入，本版使用自编轻量教学模型 |
| [Zotero](https://github.com/zotero/zotero) | AGPLv3；研究文献管理工作流，不将其源码混入本项目 MIT 部分 |
| [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | 研究本地文档/OCR 架构，本版没有部署它 |
| [ChemDataExtractor](https://github.com/mcs07/ChemDataExtractor) | 研究化学文本抽取能力，本版不引入 Python 服务 |

接口依据：[Europe PMC REST](https://europepmc.org/RestfulWebService)、[Crossref REST](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)。Crossref 是元数据服务，不是正文搜索授权。

科学依据：[OpenStax Chemistry 2e](https://openstax.org/details/books/chemistry-2e)（溶解平衡、动力学、热力学、光学与分子结构）、[OpenStax College Physics 2e](https://openstax.org/books/college-physics-2e/pages/12-7-molecular-transport-phenomena-diffusion-osmosis-and-related-processes)（扩散）、[IUPAC 化学势定义](https://goldbook.iupac.org/terms/view/C01032)、[OpenStax SN2 机理](https://openstax.org/books/organic-chemistry/pages/11-2-the-sn2-reaction)。正文为独立编写的教学解释，没有复制教材的长篇文字或插图。

测试记录见 [VALIDATION.md](VALIDATION.md)，第三方许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 数据处理的数值与适用边界

- 解析 UTF-8 数字文本、CSV/TSV。列名必须显式勾选跳过；无效/空值不静默转为零。独立分组允许不同组长的空单元格。
- 样本 SD 分母 n−1；SEM=SD/√n；均值区间用 t 分布。单次观测的 SD/区间、零均值 RSD 保留未定义。
- 标准曲线使用带截距普通最小二乘，输出 slope、intercept、R²、sqrt(SSE/(n−2)) 与 RMSE。反算 X=(Y−a)/b，再乘用户稀释倍数；标出外推和负浓度。未实现加权拟合或完整反算不确定度。斜率区间假设 X 精确、Y 满足所用线性模型的推断条件。
- 滴定采用 aA+bB→产物、B 为标准滴定剂；mL 体积同单位相除。用户需核对反应式、空白与稀释倍数。
- 动力学由用户选择零/一/二级，在线性化空间拟合并报告对应单位。不同变换下的 R² 不能直接用来证明反应级数；不自动判定机理。
- 分组采用独立样本双侧 Welch 检验；不适用于配对、重复测量、计数或多组情形。零方差时不伪造 p 值。极小 p 受数值精度限制。
- 图上最多显示 1,000 点，网页明细最多 100 行，计算和导出使用全部输入。单次最多 20,000 文本行和 50,000 数值行；不自动删离群点。
- CSV 对公式形态的字符串做转义；用户内容在报告、结果、图表和 AI 回答中按文本转义。

统计参考：[NIST 标定与模型验证](https://www.itl.nist.gov/div898/handbook/mpc/section3/mpc365.htm)、[NIST 线性标定](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/calibrat.htm)。生物原理参考：[OpenStax 酶](https://openstax.org/books/biology-2e/pages/6-5-enzymes)、[半保留复制](https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication)、[被动运输](https://openstax.org/books/biology-2e/pages/5-2-passive-transport)。
