const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../electro-qH5fAN3g.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
