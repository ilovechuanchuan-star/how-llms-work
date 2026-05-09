# LLM 实际是怎么工作的

一份可视化、可交互的指南，讲解大语言模型（LLM）是如何从原始互联网文本一步步构建为对话式助手的。

**在线站点：** https://ynarwal.github.io/how-llms-work/

内容基于 Andrej Karpathy 的 [Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) 公开课。

---

## 内容概览

- **数据采集（Data Collection）** —— 如何从网络抓取并过滤出训练数据（Common Crawl、FineWeb）
- **分词（Tokenization）** —— 如何通过字节对编码（BPE）将文本切分为子词 token
- **神经网络训练** —— 损失函数、梯度下降，以及一次前向传播的样子
- **推理与采样（Inference & Sampling）** —— 模型如何逐 token 生成文本，以及 temperature 的作用
- **基础模型（Base Model）** —— 预训练之后模型掌握了什么、还做不到什么
- **后训练（Post-Training）** —— RLHF、指令微调，以及基础模型如何蜕变为对话助手
- **LLM 心理学** —— 幻觉、上下文窗口，以及如何理解模型"知道"什么
- **RAG** —— 检索增强生成：embedding、向量检索与上下文注入
- **完整流水线总览** —— 端到端可视化每一个阶段

---

## 文件说明

| 文件 | 说明 |
|------|-------------|
| `index.html` | 主站点（v2 改版） |
| `v1.html` | 初版深色主题 |
| `transcript.txt` | Karpathy 讲座完整文稿 |
| `council.py` | LLM 委员会事实核查脚本（通过 `uv run council.py` 运行） |
| `report.html` | 最新一次委员会事实核查报告 |

---

## Hacker News 讨论

[发布到 Hacker News](https://news.ycombinator.com/item?id=47886517) 后引发了较激烈的讨论，争议主要集中在"这是 LLM 生成的内容"上。这一点没错——但文章的观点并非 AI 自己的：每一个论断、图示和叙述框架都直接溯源到 Karpathy 的讲座，而不是模型自行编造。

<span style="color:#DF1B41"><strong>科学批注：</strong>“每一个论断都直接溯源”表述过强。本轮核查发现，页面中仍有若干由转述、类比或产品时效变化引入的问题，例如 GPT-4 参数/词表、GPT-2 训练规模、RLHF 真实性、Deep Research 套餐、模型名单等；应把讲座来源与当前事实核查分开说明。</span>

## 创作立场（Vibe check）

本仓库中的代码与内容大部分由 LLM 生成（通过 Claude Code 调用 Claude）。但思路、方向与编辑决策来自我本人——实现层面主要由 AI 完成。设立 LLM 委员会事实核查器正是出于这个原因：自动化生成的内容需要自动化的验证手段。

<span style="color:#DF1B41"><strong>科学批注：</strong>LLM 委员会可以帮助发现疑点，但不能替代人工事实核查。尤其是模型规格、产品价格、可用套餐和排行榜这类时效性信息，应以官方文档或论文为准，并标注日期。</span>
