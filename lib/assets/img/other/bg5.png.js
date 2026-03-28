const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../bg5-b84FPLXQ.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
