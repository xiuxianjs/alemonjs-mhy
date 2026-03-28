const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../纳塔-DKZqhIgr.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
