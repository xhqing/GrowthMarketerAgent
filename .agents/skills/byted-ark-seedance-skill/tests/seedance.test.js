const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildPayload } = require('../scripts/seedance');
const { inferCapabilities, selectModel, normalizeArgs } = require('../scripts/seedance-wrapper');
const { validatePayload } = require('../scripts/seedance-validation');
const model = 'doubao-seedance-2.5';
const route = args => selectModel(inferCapabilities(args), null, '__test_no_preference__').model;
test('2.5 model ID unchanged, 30 seconds and MOV passed to API', async () => {
  const p = await buildPayload({ model, prompt: '海边', duration: '30', outputFormat: 'mov' });
  assert.equal(p.model, model); assert.equal(p.duration, 30); assert.equal(p.output_format, 'mov');
  assert.equal(p.resolution, '720p'); assert.equal(p.ratio, 'adaptive');
});
test('routes long video, MOV, audio only and larger references to 2.5', () => {
  for (const args of [['--duration','30'], ['--output-format','mov'], ['--audio-url','https://example.com/a.wav'], ['--omni-reference-task-type','edit','--video-url','https://example.com/a.mp4'], Array.from({length:10},()=>['--image-url','https://example.com/a.png']).flat()]) assert.equal(route(args), model);
  assert.equal(route(['--duration','5']), 'doubao-seedance-2.0');
  assert.equal(route(['--resolution','4k']), 'doubao-seedance-2.0');
});
test('edit/extend parameters and roles survive payload building', async () => {
  const p = await buildPayload({model, prompt:'修改 @video1 背景', videoUrl:['https://example.com/a.mov'], imageUrl:['https://example.com/a.png'], omniReferenceTaskType:'edit',outputFormat:'mov'});
  assert.equal(p.duration,-1); assert.equal(p.omni_reference_task_type,'edit');
  assert.deepEqual(p.content.slice(1).map(x=>x.role),['reference_image','reference_video']);
  await assert.rejects(buildPayload({model,prompt:'编辑视频',videoUrl:['https://example.com/a.mp4'],omniReferenceTaskType:'edit',duration:5}), /duration/);
  await assert.rejects(buildPayload({model,prompt:'延长',omniReferenceTaskType:'extend'}), /全模态/);
});
test('2.5 rejects incompatible resolution, duration and frame ratio', async () => {
  for (const duration of [3,31,4.5,'5junk']) await assert.rejects(buildPayload({model,prompt:'test',duration}));
  await assert.rejects(buildPayload({model,prompt:'test',resolution:'4k'}), /分辨率/);
  await assert.rejects(buildPayload({model,prompt:'test',imageUrl:['https://example.com/a.png'],ratio:'16:9'}), /adaptive/);
});
test('one/two images can be references; mixed file/URL forms one frame pair', async () => {
  const p = await buildPayload({model,prompt:'test',imageUrl:['https://example.com/a.png'],imageRole:'reference'});
  assert.equal(p.content[1].role,'reference_image');
  const fs=require('node:fs/promises'); const os=require('node:os'); const path=require('node:path');
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'seedance-test-'));
  try {
    const file=path.join(dir,'b.png');await fs.writeFile(file,Buffer.from('fixture'));
    const q=await buildPayload({model,prompt:'test',imageUrl:['https://example.com/a.png'],imageFile:[file]});
    assert.deepEqual(q.content.slice(1).map(x=>x.role),['first_frame','last_frame']);
  } finally {await fs.rm(dir,{recursive:true});}
});
test('50 assets accepted, per-type limits and video data rejected', async () => {
  const p=await buildPayload({model,prompt:'test',imageUrl:Array(30).fill('https://example.com/a.png'),videoUrl:Array(10).fill('https://example.com/a.mp4'),audioUrl:Array(10).fill('https://example.com/a.wav')});
  assert.equal(p.content.length,51);
  await assert.rejects(buildPayload({model,prompt:'test',imageUrl:Array(31).fill('https://example.com/a.png')}),/数量/);
  await assert.rejects(buildPayload({model,prompt:'test',videoUrl:['data:video/mp4;base64,AAAA']}),/Base64/);
  p.content.push({type:'audio_url',audio_url:{url:'https://example.com/a.wav'},role:'reference_audio'});
  assert.throws(()=>validatePayload(p),/数量/);
});
test('legacy model rejects 2.5-specific options; normalized flags work', async () => {
  await assert.rejects(buildPayload({model:'doubao-seedance-2.0',prompt:'test',outputFormat:'mov'}),/2.5/);
  assert.deepEqual(normalizeArgs(['--output_format=mov','--omni_reference_task_type','edit']),['--output-format','mov','--omni-reference-task-type','edit']);
});
test('payload file retains model, routes 30s and enforces edit constraints', async () => {
  const fs=require('node:fs/promises'), os=require('node:os'), path=require('node:path');
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'seedance-payload-'));
  const file=path.join(dir,'payload.json');
  try {
    const data={model,duration:30,content:[{type:'text',text:'海边'}]};
    await fs.writeFile(file,JSON.stringify(data));
    assert.equal(route(['--payload-file',file]),model);
    assert.equal((await buildPayload({payloadFile:file})).model,model);
    data.omni_reference_task_type='edit';
    data.content.push({type:'video_url',video_url:{url:'https://example.com/a.mp4'},role:'reference_video'});
    await fs.writeFile(file,JSON.stringify(data));
    await assert.rejects(buildPayload({payloadFile:file}),/duration/);
  } finally {await fs.rm(dir,{recursive:true});}
});
test('unsatisfiable 30s/4K is identified; explicit legacy max remains enforced',()=>{
  const {checkModelCompatibility}=require('../scripts/seedance-wrapper');
  const matrix=require('../references/seedance-model-matrix.json');
  for (const [id,info] of Object.entries(matrix)) assert.ok(checkModelCompatibility(id,info,inferCapabilities(['--duration','30','--resolution','4k'])).length);
  assert.ok(checkModelCompatibility('doubao-seedance-2.0',matrix['doubao-seedance-2.0'],inferCapabilities(['--duration','30'])).length);
});
