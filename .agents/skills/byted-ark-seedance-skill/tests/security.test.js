const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validateApiBase,validateTaskId,validateMediaUrl,isPublicAddress,publicLookup}=require('../scripts/seedance-security');
const {createClient,sanitizeApiKeys,sanitizeErrorText}=require('../scripts/seedance');
test('API credentials only go to official HTTPS origin',async()=>{
  assert.equal(validateApiBase('https://ark.cn-beijing.volces.com'),'https://ark.cn-beijing.volces.com');
  for (const url of ['http://ark.cn-beijing.volces.com','https://example.com','https://ark.cn-beijing.volces.com.example.com','https://user:pass@ark.cn-beijing.volces.com','https://ark.cn-beijing.volces.com:8443','https://ark.cn-beijing.volces.com/path']) {
    await assert.rejects(createClient({baseUrl:url,apiKey:'ark-fixture'}),/API/);
  }
});
test('task IDs cannot escape output directory',()=>{
  assert.equal(validateTaskId('cgt-20260910120000-abc12'),'cgt-20260910120000-abc12');
  for (const id of ['../outside','cgt-../../outside','cgt-abc/../../../outside','cgt-abc\\..\\outside','cgt-%2f..',null]) assert.throws(()=>validateTaskId(id));
});
test('download blocks private IPv4, IPv6, mapped and alternate IP notation',()=>{
  for (const host of ['127.0.0.1','10.1.2.3','169.254.169.254','172.16.0.1','192.168.1.1','100.64.0.1','[::1]','[::ffff:127.0.0.1]','[fe80::1]','[fc00::1]','2130706433','0x7f000001','localhost']) assert.throws(()=>validateMediaUrl(`http://${host}/x.mp4`));
  assert.equal(isPublicAddress('8.8.8.8'),true);
  assert.equal(isPublicAddress('2606:4700:4700::1111'),true);
  assert.throws(()=>validateMediaUrl('file:///etc/passwd'));
});
test('DNS results used for connection are checked, including mixed DNS answers',async()=>{
  const dns=require('node:dns'), old=dns.lookup;
  const lookup=()=>new Promise((resolve,reject)=>publicLookup('media.example.com',{all:true},(err,records)=>err?reject(err):resolve(records)));
  try {
    dns.lookup=(_host,_opts,cb)=>cb(null,[{address:'8.8.8.8',family:4},{address:'127.0.0.1',family:4}]);
    await assert.rejects(lookup(),/内网/);
    dns.lookup=(_host,_opts,cb)=>cb(null,[{address:'8.8.8.8',family:4}]);
    assert.deepEqual(await lookup(),[{address:'8.8.8.8',family:4}]);
  } finally {dns.lookup=old;}
});
test('save-api-key false never writes client configuration',async()=>{
  const fs=require('node:fs'),old=fs.writeFileSync;let writes=0;
  try {
    fs.writeFileSync=()=>{writes++;throw new Error('unexpected configuration write');};
    await createClient({apiKey:'ark-fixture-not-a-real-key',saveApiKey:'false',baseUrl:'https://ark.cn-beijing.volces.com'});
    assert.equal(writes,0);
  } finally {fs.writeFileSync=old;}
});
test('credential backups and API error output redact secrets',()=>{
  const clean=sanitizeApiKeys({env:{ANTHROPIC_AUTH_TOKEN:'fake-token'},api_key:'fake-key',nested:{password:'fake-pass'}});
  assert.ok(!JSON.stringify(clean).includes('fake-'));
  assert.ok(!sanitizeErrorText('server echoed ark-fixture-not-real data:image/png;base64,AAAA').includes('fixture'));
});
test('download checks redirect target before connecting, writes private output and cleans partials',async()=>{
  const https=require('node:https'), old=https.request;
  const {PassThrough}=require('node:stream'),{EventEmitter}=require('node:events');
  const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  const {downloadToFile}=require('../scripts/seedance');
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'seedance-security-'));
  let mode='ok',connections=0;
  https.request=(_url,_options,cb)=>{
    connections++;
    const req=new EventEmitter();
    req.end=()=>queueMicrotask(()=>{
      const res=new PassThrough();
      res.statusCode=mode==='redirect'?302:200;
      res.headers=mode==='redirect'?{location:'http://169.254.169.254/metadata'}:{'content-type':'video/mp4','content-length':mode==='oversize'?String(2*1024**3):'5'};
      cb(res);res.end(Buffer.from('video'));
    });
    return req;
  };
  try {
    const file=path.join(dir,'out.mp4');
    await downloadToFile('https://media.example.com/out.mp4',file);
    assert.equal(await fs.readFile(file,'utf8'),'video');
    assert.equal((await fs.stat(file)).mode&0o777,0o600);
    mode='redirect';const before=connections;
    await assert.rejects(downloadToFile('https://media.example.com/out.mp4',file),/公网/);
    assert.equal(connections,before+1);
    mode='oversize';await assert.rejects(downloadToFile('https://media.example.com/out.mp4',file),/1GiB/);
    assert.deepEqual(await fs.readdir(dir),['out.mp4']);
    assert.equal(await fs.readFile(file,'utf8'),'video');
  } finally {https.request=old;await fs.rm(dir,{recursive:true});}
});
