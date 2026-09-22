const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { LITE, PRO, prepareParams: prepare, buildRequestBody: body, outputDetails } = require('../scripts/model-routing');
const image = 'https://example.com/image.png';
const base = { prompt: '画一只猫' };
for (const [name, input, model] of [
  ['普通默认', base, LITE], ['明确Pro', {...base, model:'pro'}, PRO],
  ['组图', {...base, count:'4'}, LITE], ['联网', {...base, enable_web_search:true}, LITE],
  ['流式', {...base, stream:true}, LITE], ['4K', {...base, size:'4k'}, LITE],
  ['高精度', {prompt:'高精度产品海报'}, PRO], ['1.5K', {...base,size:'1.5k'}, PRO],
  ['标记编辑', {...base, reference_images:[image], interactive_edit:true}, PRO],
  ['坐标编辑', {prompt:'修改<bbox>1 2 3 4</bbox>', reference_images:[image]}, PRO],
  ['自动拆图', {layer_decomposition:true,reference_images:[image]}, PRO],
  ['透明编辑', {...base,background:'transparent',reference_images:[image]}, PRO],
  ['更多参考图', {...base,reference_images:Array(11).fill(image)}, LITE]
]) test(name, () => assert.equal(prepare(input).model, model));

for (const [name,input] of [
 ['Pro组图',{...base,model:'pro',sequential:true}], ['Pro联网',{...base,model:'pro',enable_web_search:true}],
 ['Pro流式',{...base,model:'pro',stream:true}], ['Pro3K',{...base,model:'pro',size:'3K'}],
 ['Lite拆图',{model:'lite',layer_decomposition:true,reference_images:[image]}],
 ['混合能力',{layer_decomposition:true,reference_images:[image],stream:true}],
 ['小尺寸',{...base,model:'pro',size:'512x512'}], ['宽高比',{...base,model:'pro',size:'32000x32'}],
 ['拆图像素尺寸',{layer_decomposition:true,reference_images:[image],size:'2048x2048'}],
 ['拆图多输入',{layer_decomposition:true,reference_images:[image,image]}],
 ['无图透明',{...base,background:'transparent'}], ['透明JPEG',{...base,background:'transparent',reference_images:[image],output_format:'jpeg'}],
 ['Lite合计超限',{...base,sequential:true,count:4,reference_images:Array(12).fill(image)}],
 ['未知模型',{...base,model:'doubao-seedream-5-0-pro-260628'}],
 ['非整数',{...base,count:'2.5'}], ['非法布尔',{...base,stream:'yes'}],
 ['参考图被忽略',{...base,mode:'text-to-image',reference_images:[image]}]
]) test(`拒绝${name}`, () => assert.throws(() => prepare(input)));

test('模型优先级及auto覆盖', () => {
 assert.equal(prepare({...base,model:'lite'},PRO).model,LITE);
 assert.equal(prepare(base,PRO).model,PRO);
 assert.equal(prepare({...base,model:'auto'},PRO).model,LITE);
});
test('Pro请求隔离、拆图默认值、空prompt不被补写', () => {
 const p=prepare({layer_decomposition:true,reference_images:[image]});
 assert.equal(p.optimize,false);
 assert.deepEqual(body(p),{model:PRO,size:'auto',response_format:'url',output_format:'jpeg',watermark:true,image,layer_decomposition:true});
});
test('服务端优化与旧格式别名', () => {
 const b=body(prepare({...base,model:'pro',optimize_prompt_mode:'fast',response_format:'png'}));
 assert.equal(b.output_format,'png'); assert.equal(b.response_format,'url');
 assert.deepEqual(b.optimize_prompt_options,{mode:'fast'});
});
test('Lite组图不透传max_images', () => {
 const b=body(prepare({...base,sequential:true,count:4}));
 assert.equal(b.stream,true);assert.equal(b.sequential_image_generation,'auto');
 assert.equal(b.sequential_image_generation_options,undefined);
});
test('图层格式与位置保留，不依赖数组顺序', () => {
 const item={z_index:3,bounding_box:{absolute:[1,2,3,4]},name:'标题',description:'字'};
 assert.deepEqual(outputDetails(item,{layer_decomposition:true,output_format:'jpeg'}),{output_format:'png',...item});
 assert.equal(outputDetails({z_index:0},{layer_decomposition:true,output_format:'jpeg'}).output_format,'jpeg');
});
test('CLI dry-run无需Key，精准编辑保留原prompt', () => {
 const prompt='移动<bbox>1 2 3 4</bbox>中的物体';
 const run=spawnSync(process.execPath,[path.resolve(__dirname,'../scripts/generate.js'),'--model','auto','--prompt',prompt,'--reference_images',JSON.stringify([image]),'--dry-run'],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 const result=JSON.parse(run.stdout);
 assert.equal(result.model,PRO);assert.equal(result.request.prompt,prompt);
});
test('完整CLI：拆图下载扩展名、结果和落盘metadata', () => {
 const fs=require('node:fs');
 const tmp=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'seedream-test-'));
 try {
  const run=spawnSync(process.execPath,['--require',path.resolve(__dirname,'mock-api.cjs'),path.resolve(__dirname,'../scripts/generate.js'),'--model','pro','--layer_decomposition','true','--reference_images',JSON.stringify([image]),'--api_key','ark-offline-test','--save_api_key','false'],{encoding:'utf8',env:{...process.env,ARK_SEEDREAM_SAVE_PATH:tmp,ARK_SEEDREAM_API_BASE_URL:'https://ark.cn-beijing.volces.com/api/plan/v3'}});
  assert.equal(run.status,0,run.stderr);
  const result=JSON.parse(run.stdout);
  assert.equal(result.metadata.model,PRO);assert.equal(result.images.length,2);
  assert.match(result.images[0].local_path,/\.png$/);assert.match(result.images[1].local_path,/\.jpg$/);
  assert.equal(result.images[0].download_success,true);
  assert.equal(result.images[0].z_index,1);
  const metadata=JSON.parse(fs.readFileSync(result.metadata.metadata_path,'utf8'));
  assert.equal(metadata.images[0].name,'标题');
  assert.deepEqual(metadata.images[0].bounding_box,{absolute:[1,2,3,4]});
  assert.equal(fs.existsSync(path.join(tmp,'.claude')),false);
 } finally {fs.rmSync(tmp,{recursive:true,force:true});}
});
