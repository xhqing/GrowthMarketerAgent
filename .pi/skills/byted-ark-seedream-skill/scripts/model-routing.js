'use strict';

const LITE = 'doubao-seedream-5.0-lite';
const PRO = 'doubao-seedream-5.0-pro';
const MODELS = {
  [LITE]: { sizes: ['2K', '3K', '4K'], maxReferences: 14 },
  [PRO]: { sizes: ['1K', '1.5K', '2K'], maxReferences: 10 }
};

function boolean(value, name) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  throw new Error(`${name} 必须是 true 或 false`);
}

function references(value) {
  if (value === undefined) return [];
  let refs = value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) refs = JSON.parse(trimmed);
    else refs = trimmed.startsWith('data:image/') ? [trimmed] : trimmed.split(',');
  }
  if (!Array.isArray(refs) || !refs.length || refs.some(r => typeof r !== 'string' || !/^(https?:\/\/\S+|data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+)$/.test(r.trim()))) {
    throw new Error('reference_images 必须是非空的图片 URL / Base64 数组');
  }
  return refs.map(r => r.trim());
}

function prepareParams(input, environmentModel) {
  const p = { ...input };
  for (const key of ['sequential', 'watermark', 'stream', 'optimize', 'enable_web_search', 'layer_decomposition', 'interactive_edit']) {
    if (p[key] !== undefined) p[key] = boolean(p[key], key);
  }
  const refs = references(p.reference_images);
  if (p.prompt !== undefined && typeof p.prompt !== 'string') throw new Error('prompt 必须是字符串');
  const prompt = p.prompt || '';
  if (p.count !== undefined) {
    p.count = Number(p.count);
    if (!Number.isInteger(p.count) || p.count < 1 || p.count > 15) throw new Error('count 必须是 1-15 之间的整数');
    if (p.count > 1 && p.sequential === false) throw new Error('count > 1 与 sequential=false 冲突');
    if (p.count > 1 && p.sequential === undefined) p.sequential = true;
  }
  p.mode = p.mode || (refs.length ? 'image-to-image' : 'text-to-image');
  if (!['text-to-image', 'image-to-image'].includes(p.mode)) throw new Error('mode 必须是 text-to-image / image-to-image');
  if (p.mode === 'image-to-image' && !refs.length) throw new Error('图生图需要 reference_images');
  if (p.mode === 'text-to-image' && refs.length) throw new Error('text-to-image 与 reference_images 冲突');
  if (p.size) p.size = p.size.toUpperCase().replace('X', 'x').replace('AUTO', 'auto');
  if (p.output_format && p.response_format && p.output_format !== p.response_format) throw new Error('output_format 与旧版 response_format 图片格式冲突');
  p.output_format = p.output_format || p.response_format;
  if (p.output_format && !['png', 'jpeg'].includes(p.output_format)) throw new Error('output_format 必须是 png / jpeg（返回方式固定 url）');
  if (p.background !== undefined && !['opaque', 'transparent'].includes(p.background)) throw new Error('background 必须是 opaque / transparent');
  if (p.optimize_prompt_mode !== undefined && !['standard', 'fast'].includes(p.optimize_prompt_mode)) throw new Error('optimize_prompt_mode 必须是 standard / fast');

  // Agent 负责语义提取；脚本仅用明确参数和坐标标签判断硬性能力需求。
  const preciseEdit = p.interactive_edit || /<(bbox|point)>/i.test(prompt);
  const proRequired = p.layer_decomposition || preciseEdit || p.background !== undefined || p.optimize_prompt_mode === 'fast' || ['1K', '1.5K', 'auto'].includes(p.size);
  const liteRequired = p.sequential || p.stream || p.enable_web_search || ['3K', '4K'].includes(p.size) || refs.length > 10;
  if (proRequired && liteRequired) throw new Error('需求冲突：Pro 专属能力不能同时使用组图、流式、联网搜索、3K/4K 或超过 10 张参考图；请拆分需求');
  const selected = p.model !== undefined ? p.model : (environmentModel || 'auto');
  const aliases = { lite: LITE, pro: PRO, [LITE]: LITE, [PRO]: PRO };
  if (selected !== 'auto' && !aliases[selected]) throw new Error(`未知模型 ${selected}；仅支持 auto、lite、pro 和两个 AgentPlan 模型 ID`);
  if (selected !== 'auto') {
    p.model = aliases[selected];
    p.routing_reason = '显式模型选择';
  } else if (proRequired) {
    p.model = PRO; p.routing_reason = '需要 Pro 专属能力或尺寸';
  } else if (liteRequired) {
    p.model = LITE; p.routing_reason = '需要 Lite 组图、流式、联网、大尺寸或更多参考图能力';
  } else {
    // 这是本 skill 的任务偏好规则，不代表性能或价格基准。
    const highPrecision = /高精度|精准编辑|精确编辑|多语种|多语言|印刷排版/.test(prompt);
    p.model = highPrecision ? PRO : LITE;
    p.routing_reason = highPrecision ? '高精度或多语种单图偏好' : '普通生图默认沿用 Lite';
  }
  if (p.model === PRO && liteRequired) throw new Error('Pro 不支持组图、流式、联网搜索、3K/4K 或超过 10 张参考图');
  if (p.model === LITE && proRequired) throw new Error('Lite 不支持所请求的 Pro 专属能力或尺寸');
  if (!p.layer_decomposition && !prompt.trim()) throw new Error('prompt 不能为空');
  if (prompt.length > 3000) throw new Error('prompt 长度不能超过 3000 字符（本 skill 限制）');
  if (preciseEdit && !refs.length) throw new Error('交互编辑需要参考图');
  if (p.layer_decomposition && refs.length !== 1) throw new Error('图层拆分必须且只能传 1 张参考图');
  if (refs.length > MODELS[p.model].maxReferences) throw new Error('参考图数量超出模型限制');
  if (p.model === LITE && refs.length + (p.sequential ? (p.count || 4) : 1) > 15) throw new Error('Lite 参考图 + 生成图数量不能超过 15');
  if (p.background === 'transparent') {
    if (refs.length !== 1) throw new Error('透明背景编辑需要 1 张带透明通道的参考图');
    if (p.output_format === 'jpeg') throw new Error('透明背景不能使用 jpeg');
    if (/^data:image\/jpe?g;/i.test(refs[0]) || /\.jpe?g(?:\?|$)/i.test(refs[0])) throw new Error('透明背景输入不能是 JPEG；需要实际带透明通道的图片');
  }
  if (p.layer_decomposition && refs.some(r => /^data:image\/(?!png;|jpeg;)/i.test(r))) throw new Error('拆图输入仅支持 png/jpeg');
  p.size = p.size || (p.layer_decomposition ? 'auto' : '2K');
  const sizes = [...MODELS[p.model].sizes, ...(p.layer_decomposition ? ['auto'] : [])];
  if (!sizes.includes(p.size)) {
    const match = /^(\d+)x(\d+)$/.exec(p.size);
    if (!match || p.layer_decomposition) throw new Error(`该模式 size 支持 ${sizes.join('/')}，普通生成另支持宽x高`);
    const w = Number(match[1]), h = Number(match[2]);
    if (!Number.isSafeInteger(w * h) || w <= 0 || h <= 0) throw new Error('像素尺寸无效');
    if (p.model === PRO && (w * h < 921600 || w * h > 4624220 || w / h < 1 / 16 || w / h > 16)) throw new Error('Pro 总像素需在 921600-4624220，宽高比需在 1/16-16');
  }
  if (p.reference_strength !== undefined) {
    if (p.model === PRO) throw new Error('提供的 Pro 文档未定义 reference_strength，请移除此参数');
    const strength = Number(p.reference_strength);
    if (!Number.isFinite(strength) || strength < 0 || strength > 1) throw new Error('reference_strength 必须在 0-1');
    p.reference_strength = strength;
  }
  p.output_format = p.output_format || (p.background === 'transparent' ? 'png' : 'jpeg');
  p.response_format = p.output_format; // 兼容旧版脚本的图片文件格式参数
  p.stream = p.stream ?? !!p.sequential;
  p.optimize = p.optimize ?? !(p.layer_decomposition || preciseEdit || p.background === 'transparent');
  p.reference_images = refs.length ? JSON.stringify(refs) : undefined;
  return p;
}

function buildRequestBody(p) {
  const body = { model: p.model, size: p.size, response_format: 'url', output_format: p.output_format, watermark: p.watermark !== false };
  if (p.prompt !== undefined && p.prompt !== '') body.prompt = p.prompt;
  const refs = references(p.reference_images);
  if (refs.length) body.image = refs.length === 1 ? refs[0] : refs;
  if (p.model === LITE) {
    body.sequential_image_generation = p.sequential ? 'auto' : 'disabled';
    body.stream = p.stream;
    if (p.enable_web_search) body.tools = [{ type: 'web_search' }];
    if (p.reference_strength !== undefined) body.reference_strength = p.reference_strength;
  } else {
    if (p.layer_decomposition !== undefined) body.layer_decomposition = p.layer_decomposition;
    if (p.background !== undefined) body.background = p.background;
  }
  if (p.optimize_prompt_mode) body.optimize_prompt_options = { mode: p.optimize_prompt_mode };
  // AgentPlan 组图数量由 prompt 控制，不透传后付费 max_images。
  return body;
}

function outputDetails(item, p) {
  const format = item.output_format || (p.layer_decomposition && item.z_index > 0 ? 'png' : p.output_format);
  const details = { output_format: format };
  for (const key of ['z_index', 'bounding_box', 'name', 'description', 'size']) {
    if (item[key] !== undefined) details[key] = item[key];
  }
  return details;
}

module.exports = { LITE, PRO, prepareParams, buildRequestBody, outputDetails };
