// Offline child-process fixture: no network and no real platform config.
const { EventEmitter } = require('node:events');
const { Readable } = require('node:stream');
require('node:os').homedir = () => process.env.ARK_SEEDREAM_SAVE_PATH;
const https = require('node:https');
https.request = (url, options, callback) => {
  const req = new EventEmitter();
  req.setTimeout = () => {};
  req.write = data => {
    const body = JSON.parse(data);
    if (!url.includes('/api/plan/v3/images/generations') || body.model !== 'doubao-seedream-5.0-pro' || !body.layer_decomposition || body.stream !== undefined) throw new Error('Unexpected request');
  };
  req.end = () => process.nextTick(() => {
    const res = new EventEmitter(); res.statusCode = 200; res.headers = {};
    callback(res);
    res.emit('data', JSON.stringify({data:[
      {url:'https://mock/layer',z_index:1,output_format:'png',bounding_box:{absolute:[1,2,3,4]},name:'标题',description:'文字'},
      {url:'https://mock/base',z_index:0,output_format:'jpeg'}
    ]}));
    res.emit('end');
  });
  return req;
};
https.get = (url, callback) => {
  const req = new EventEmitter();
  process.nextTick(() => {
    const res = Readable.from([Buffer.from('mock-image-bytes')]);
    res.statusCode = 200; res.headers = {'content-type':'image/png'};
    callback(res);
  });
  return req;
};
