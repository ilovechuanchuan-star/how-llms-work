/* Glossary tooltip — non-intrusive hover/focus explanations for tricky terms.
   Skips common terms (HTML/CSS/LLM/URL/API ...). Auto-wraps text nodes inside
   .body-text, .pn-detail, .ps-desc, .psych-text, .rag-flow-content, p, li. */
(function(){
  const TERMS = {
    'FineWeb': {full:'FineWeb', desc:'HuggingFace 团队基于 Common Crawl 过滤、去重、清洗后发布的高质量公开预训练数据集，常用基线规模约 15 万亿 token。'},
    'Common Crawl': {full:'Common Crawl', desc:'非营利组织，自 2007 年起持续抓取整个公开互联网，免费提供 PB 级原始网页存档，是几乎所有大模型预训练语料的源头。'},
    'WARC': {full:'Web ARChive format', desc:'Common Crawl 等爬虫使用的标准化打包格式，把多个原始 HTTP 响应（含原始 HTML、头部、元数据）连续存入一个 gzip 压缩文件。'},
    'PII': {full:'Personally Identifiable Information', desc:'可识别个人身份的信息，例如姓名、电话、邮箱、身份证号、住址等；预训练语料里通常会被遮蔽或整页丢弃以避免隐私泄漏。'},
    'Trafilatura': {full:'Trafilatura', desc:'一个开源的网页正文提取库，可从 HTML 中剥离导航/广告/页脚，保留主要文章文本，是 FineWeb 之类管线常用的提取工具。'},
    'BPE': {full:'Byte-Pair Encoding（字节对编码）', desc:'一种词元分词算法：从单字节开始，反复把出现频率最高的相邻符号对合并成新符号，直到达到目标词表大小；GPT 系列等模型使用其字节级变体。'},
    'cl100k_base': {full:'cl100k_base', desc:'OpenAI 在 GPT-3.5 / GPT-4 时代使用的 BPE 词表名称，约含 10 万个 token，可在 tiktoken 库中加载。'},
    'token': {full:'token（词元）', desc:'语言模型处理的最小单元，通常是一个词元片段（不一定是完整单词），由分词器把原文切分得到，每个 token 对应一个整数 ID。'},
    'Transformer': {full:'Transformer', desc:'2017 年 Google 提出的神经网络架构，核心是自注意力机制（self-attention），是几乎所有现代大语言模型的基础结构。'},
    'embedding': {full:'embedding（嵌入向量）', desc:'把离散的 token ID 映射成的高维稠密向量（通常几千维），用作神经网络的输入；语义相近的 token 在该空间中距离更近。'},
    'attention': {full:'attention（注意力机制）', desc:'Transformer 的核心算子：让序列中每个 token 通过加权聚合的方式"看到"其他 token，从而把上下文信息融合进自己的表示。'},
    'logits': {full:'logits', desc:'神经网络输出层在做 softmax 之前的原始分数向量；对语言模型而言，是词表中每个 token 作为下一个 token 的未归一化"得分"。'},
    'softmax': {full:'softmax', desc:'把一组任意实数转换为合法概率分布的函数（指数化后归一化），常用于将 logits 转成下一个 token 的概率。'},
    'SFT': {full:'Supervised Fine-Tuning（监督微调）', desc:'后训练第一阶段：用人工或合成的"问题-理想回答"对继续训练基础模型，让它学会以助手风格作答。'},
    'RLHF': {full:'Reinforcement Learning from Human Feedback', desc:'基于人类反馈的强化学习：先训练一个奖励模型来打分，再用 PPO 等强化学习算法优化模型，让回答更符合人类偏好。'},
    'InstructGPT': {full:'InstructGPT', desc:'OpenAI 2022 年论文中提出的指令微调方法与模型，被视作 ChatGPT 的直接前身，引入了 SFT + RLHF 的标准流程。'},
    'UltraChat': {full:'UltraChat', desc:'清华团队发布的大规模合成多轮对话数据集，常用于开源模型的 SFT 阶段。'},
    'nanoGPT': {full:'nanoGPT', desc:'Andrej Karpathy 公开的极简 GPT 训练实现，用几百行 PyTorch 代码就能从零复现 GPT-2 量级的训练流程，常用于教学与小规模复现。'},
    'GPT-2': {full:'GPT-2', desc:'OpenAI 2019 年发布的第二代生成式预训练 Transformer，最大版本 15 亿参数，是首个被广泛复现的大模型基线。'},
    'GPT-4': {full:'GPT-4', desc:'OpenAI 2023 年发布的旗舰大模型，参数与训练细节未公开；很多教程引用其分词器与能力作为基准。'},
    'GPT-4o': {full:'GPT-4 omni', desc:'OpenAI 2024 年发布的多模态旗舰模型，原生支持文本、图像、音频输入输出，是 ChatGPT 默认模型之一。'},
    'Llama 3': {full:'Llama 3', desc:'Meta 2024 年开源的大模型系列，最大 4050 亿参数、训练量 15 万亿 token，是开源社区主流基础模型之一。'},
    'Claude Sonnet': {full:'Claude Sonnet', desc:'Anthropic 推出的 Claude 系列中等规模模型，定位是平衡能力与成本的"日常主力"模型。'},
    'o1 Pro': {full:'o1 Pro', desc:'OpenAI 推出的强推理模型 o1 的高算力版本，回答前会进行更长链路的"思考"，适合数学、代码等硬推理任务。'},
    'RAG': {full:'Retrieval-Augmented Generation（检索增强生成）', desc:'在生成前先用向量检索找到相关文档片段，再把它们拼进上下文让模型作答；用于让模型基于最新或私有资料回答问题。'},
    'MLP': {full:'Multi-Layer Perceptron（多层感知机）', desc:'最基础的全连接前馈神经网络：若干层，每层做"加权求和 + 偏置 + 非线性激活"，是 Transformer 中前馈子层的具体形式。'},
    'tanh': {full:'hyperbolic tangent（双曲正切）', desc:'常用的非线性激活函数，把任意实数挤压到 (-1, 1) 区间；引入非线性才能让多层网络拟合复杂函数。'},
    '反向传播': {full:'backpropagation（反向传播）', desc:'通过链式法则，从损失函数沿计算图反向逐层计算每个参数的梯度，是训练神经网络更新权重的核心算法。'},
    'micrograd': {full:'micrograd', desc:'Andrej Karpathy 写的极小自动求导引擎（约 100 行 Python），用标量演示反向传播原理，是理解 PyTorch 等框架的入门项目。'},
    'gzip': {full:'gzip', desc:'广泛使用的无损压缩格式与工具；Common Crawl 的 WARC 文件以 gzip 形式存储以节省体积。'},
    'UTF-8': {full:'UTF-8', desc:'当前互联网最主流的 Unicode 字符编码，把任意字符变成 1–4 字节序列；BPE 分词通常以 UTF-8 字节为最小单元。'},
    'ChatGPT': {full:'ChatGPT', desc:'OpenAI 2022 年底发布的对话产品，基于 GPT 系列模型加 SFT + RLHF 训练，是把大模型带入大众视野的标志性产品。'},
  };

  // Sort by length desc so longer matches win (e.g., "Common Crawl" before "Crawl").
  const KEYS = Object.keys(TERMS).sort((a,b)=>b.length-a.length);
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const PATTERN = new RegExp('('+KEYS.map(escapeRe).join('|')+')','g');

  // Containers whose text should be scanned. Skip code/links/already-wrapped.
  const SCAN_SELECTOR = '.body-text, .pn-detail, .ps-desc, .psych-text, .rag-flow-content, .callout, .insight, .note';
  const SKIP_PARENT = new Set(['CODE','PRE','SCRIPT','STYLE','A','BUTTON','TEXTAREA','INPUT','SVG']);

  function shouldSkipNode(node){
    let p = node.parentNode;
    while(p && p !== document.body){
      if (p.classList && p.classList.contains('glossary-term')) return true;
      if (SKIP_PARENT.has(p.nodeName)) return true;
      p = p.parentNode;
    }
    return false;
  }

  function wrapTextNode(node, seenInDoc){
    const text = node.nodeValue;
    if (!text || !PATTERN.test(text)) return;
    PATTERN.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = PATTERN.exec(text)) !== null){
      const term = m[1];
      // Only wrap the first occurrence of each term per document to avoid noise.
      if (seenInDoc.has(term)){
        continue;
      }
      seenInDoc.add(term);
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const span = document.createElement('span');
      span.className = 'glossary-term';
      span.tabIndex = 0;
      span.dataset.term = term;
      span.setAttribute('role','button');
      span.setAttribute('aria-label', term + '：术语解释');
      span.textContent = term;
      frag.appendChild(span);
      last = m.index + term.length;
    }
    if (last === 0) return; // nothing wrapped
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }

  function scan(){
    const seen = new Set();
    const containers = document.querySelectorAll(SCAN_SELECTOR);
    containers.forEach(c => {
      const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT, {
        acceptNode: n => (n.nodeValue && n.nodeValue.trim() && !shouldSkipNode(n))
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      });
      const nodes = [];
      let n; while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(node => wrapTextNode(node, seen));
    });
  }

  // ── popover ──
  let pop;
  function ensurePop(){
    if (pop) return pop;
    pop = document.createElement('div');
    pop.id = 'glossary-pop';
    pop.setAttribute('role','tooltip');
    document.body.appendChild(pop);
    pop.addEventListener('mouseenter', ()=>clearTimeout(hideTimer));
    pop.addEventListener('mouseleave', schedHide);
    return pop;
  }

  let hideTimer;
  function schedHide(){
    clearTimeout(hideTimer);
    hideTimer = setTimeout(()=>{ if (pop) pop.classList.remove('show'); }, 120);
  }

  function show(target){
    const term = target.dataset.term;
    const info = TERMS[term];
    if (!info) return;
    const p = ensurePop();
    p.innerHTML = '<div class="gp-term">'+term+'</div>'
      + (info.full && info.full !== term ? '<div class="gp-full">'+info.full+'</div>' : '')
      + '<div class="gp-desc">'+info.desc+'</div>';
    p.classList.remove('below');
    // Position: under or above the term, page-coordinate based.
    const r = target.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    p.style.visibility = 'hidden';
    p.classList.add('show');
    const pw = p.offsetWidth, ph = p.offsetHeight;
    let left = r.left + scrollX;
    let top = r.bottom + scrollY + 8;
    const maxLeft = scrollX + document.documentElement.clientWidth - pw - 12;
    if (left > maxLeft) left = maxLeft;
    if (left < scrollX + 8) left = scrollX + 8;
    // If would overflow viewport bottom, place above.
    if (r.bottom + ph + 16 > document.documentElement.clientHeight){
      top = r.top + scrollY - ph - 8;
      p.classList.add('below');
    }
    p.style.left = left + 'px';
    p.style.top = top + 'px';
    p.style.visibility = 'visible';
    clearTimeout(hideTimer);
  }

  function bind(){
    document.addEventListener('mouseover', e => {
      const t = e.target.closest && e.target.closest('.glossary-term');
      if (t) show(t);
    });
    document.addEventListener('mouseout', e => {
      const t = e.target.closest && e.target.closest('.glossary-term');
      if (t) schedHide();
    });
    document.addEventListener('focusin', e => {
      const t = e.target.closest && e.target.closest('.glossary-term');
      if (t) show(t);
    });
    document.addEventListener('focusout', e => {
      const t = e.target.closest && e.target.closest('.glossary-term');
      if (t) schedHide();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && pop) pop.classList.remove('show');
    });
    // Touch / click toggle
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('.glossary-term');
      if (t){ show(t); e.stopPropagation(); }
      else if (pop && pop.classList.contains('show')) pop.classList.remove('show');
    });
    window.addEventListener('scroll', ()=>{ if (pop) pop.classList.remove('show'); }, {passive:true});
  }

  function init(){ scan(); bind(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
