const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../渊下宫-CX3Dfi8d.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
