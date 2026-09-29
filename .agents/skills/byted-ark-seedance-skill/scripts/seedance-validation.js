'use strict';

// 参数来源：用户提供的 Seedance 2.5 文档；模型 ID 和服务入口沿用 AgentPlan。
function validatePayload(payload) {
  const is25 = payload.model === 'doubao-seedance-2.5';
  if (!is25) {
    if (payload.omni_reference_task_type !== undefined || payload.output_format === 'mov') {
      throw new Error('omni_reference_task_type / MOV 输出需要 doubao-seedance-2.5');
    }
    return;
  }
  payload.resolution ??= '720p';
  payload.ratio ??= 'adaptive';
  payload.duration ??= -1;
  payload.output_format ??= 'mp4';
  if (!['480p', '720p', '1080p'].includes(payload.resolution)) throw new Error('Seedance 2.5 分辨率仅支持 480p / 720p / 1080p');
  if (!['adaptive', '16:9', '9:16', '1:1', '4:3', '3:4', '21:9'].includes(payload.ratio)) throw new Error('无效 ratio');
  if (!Number.isInteger(payload.duration) || (payload.duration !== -1 && (payload.duration < 4 || payload.duration > 30))) throw new Error('Seedance 2.5 duration 必须是 -1 或 4–30 整数秒');
  if (!['mp4', 'mov'].includes(payload.output_format)) throw new Error('output_format 必须为 mp4 或 mov');
  if (payload.draft === true || (payload.service_tier && payload.service_tier !== 'default')) throw new Error('Seedance 2.5 不支持 draft / flex');
  const media = { image: [], video: [], audio: [] };
  for (const item of payload.content) {
    for (const kind of Object.keys(media)) {
      if (item.type !== `${kind}_url`) continue;
      media[kind].push(item);
      if (kind !== 'image') item.role ??= `reference_${kind}`;
      const allowedRoles = kind === 'image' ? ['first_frame', 'last_frame', 'reference_image'] : [`reference_${kind}`];
      if (!allowedRoles.includes(item.role)) throw new Error(`无效 ${kind} role`);
      if (kind === 'video' && String(item.video_url?.url).startsWith('data:')) throw new Error('Seedance 2.5 视频输入请使用 --video-url（公网URL或素材ID），文档不支持视频 Base64');
    }
  }
  for (const [kind, limit] of [['image', 30], ['video', 10], ['audio', 10]]) {
    if (media[kind].length > limit) throw new Error(`Seedance 2.5 ${kind} 素材数量不能超过 ${limit}`);
  }
  if (Object.values(media).reduce((n, arr) => n + arr.length, 0) > 50) throw new Error('参考素材总数不能超过50');
  const first = media.image.filter(x => x.role === 'first_frame');
  const last = media.image.filter(x => x.role === 'last_frame');
  const refs = payload.content.filter(x => ['reference_image', 'reference_video', 'reference_audio'].includes(x.role));
  if (first.length || last.length) {
    if (first.length !== 1 || last.length > 1 || refs.length) throw new Error('首尾帧模式需要一个首帧、至多一个尾帧，不能混用全模态参考');
    if (payload.ratio !== 'adaptive') throw new Error('Seedance 2.5 首帧/首尾帧任务 ratio 必须为 adaptive');
  }
  if (refs.length) payload.omni_reference_task_type ??= 'auto';
  const taskType = payload.omni_reference_task_type;
  if (taskType !== undefined) {
    if (!['auto', 'edit', 'extend'].includes(taskType)) throw new Error('omni_reference_task_type 必须为 auto / edit / extend');
    if (!refs.length) throw new Error('omni_reference_task_type 仅用于全模态参考任务');
    if (['edit', 'extend'].includes(taskType)) {
      if (!media.video.length) throw new Error('编辑/延长任务至少需要一个 reference_video');
      if (payload.ratio !== 'adaptive') throw new Error('编辑/延长任务 ratio 必须为 adaptive');
      if (taskType === 'edit' && payload.duration !== -1) throw new Error('编辑任务 duration 必须为 -1');
    }
  }
  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > 64 * 1024 * 1024) throw new Error('请求体超过64MB，请使用素材URL或素材ID');
}
module.exports = { validatePayload };
