'use strict';
const dns = require('node:dns');
const net = require('node:net');
const http = require('node:http');
const https = require('node:https');

function validateApiBase(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'ark.cn-beijing.volces.com' ||
      url.port || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('AgentPlan API仅允许 https://ark.cn-beijing.volces.com，禁止向其他主机发送密钥');
  }
  return url.origin;
}
function validateTaskId(value) {
  if (typeof value !== 'string' || !/^cgt-[A-Za-z0-9-]{1,150}$/.test(value)) throw new Error('无效任务ID：必须为cgt-开头且不含路径字符');
  return value;
}
function isPublicAddress(address) {
  if (net.isIP(address) === 4) {
    const [a,b,c] = address.split('.').map(Number);
    return !(a===0 || a===10 || a===127 || a>=224 || (a===100 && b>=64 && b<=127) ||
      (a===169 && b===254) || (a===172 && b>=16 && b<=31) || (a===192 && (b===168 || b===0 || (b===2))) ||
      (a===198 && (b===18 || b===19 || (b===51 && c===100))) || (a===203 && b===0 && c===113));
  }
  if (net.isIP(address) === 6) {
    // 仅允许全球单播2000::/3，排除文档、隧道与特殊用途地址；拒绝IPv4映射和本地地址。
    const hex = new URL(`http://[${address}]/`).hostname.slice(1,-1).toLowerCase();
    return /^[23]/.test(hex) && !/^2001:([01]:|2:|db8:|10:|20:)/.test(hex) && !hex.startsWith('2002:');
  }
  return false;
}
function validateMediaUrl(value) {
  const url = new URL(value);
  const host = url.hostname.replace(/^\[|\]$/g,'');
  if (!['https:','http:'].includes(url.protocol) || url.username || url.password ||
      (url.port && !['80','443'].includes(url.port)) || host === 'localhost' || host.endsWith('.localhost') ||
      (net.isIP(host) && !isPublicAddress(host))) throw new Error('下载仅允许公网HTTP(S)媒体地址');
  return url;
}
function publicLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err);
    if (!addresses.length || addresses.some(x => !isPublicAddress(x.address))) return callback(new Error('拒绝下载内网或特殊用途地址'));
    // 连接使用本次已验证的地址，防止DNS校验与实际连接之间重新解析。
    if (options?.all) callback(null, addresses);
    else callback(null, addresses[0].address, addresses[0].family);
  });
}
async function fetchMedia(value, {method='GET', signal}={}, redirects=0) {
  const url = validateMediaUrl(value);
  if (redirects > 5) throw new Error('下载重定向次数超限');
  const response = await new Promise((resolve,reject) => {
    const request = (url.protocol==='https:' ? https : http).request(url, {
      method, signal, lookup: publicLookup, agent: false
    }, resolve);
    request.on('error',reject);
    request.end();
  });
  if ([301,302,303,307,308].includes(response.statusCode)) {
    response.resume();
    if (!response.headers.location) throw new Error('下载重定向缺少Location');
    return fetchMedia(new URL(response.headers.location,url).href,{method,signal},redirects+1);
  }
  return {
    ok: response.statusCode >= 200 && response.statusCode < 300,
    status: response.statusCode,
    headers: {get: key => response.headers[key.toLowerCase()] || null},
    body: response
  };
}
module.exports={validateApiBase,validateTaskId,isPublicAddress,validateMediaUrl,fetchMedia,publicLookup};
