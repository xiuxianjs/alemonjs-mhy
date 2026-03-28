const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../稻妻-mwsQHdpI.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
