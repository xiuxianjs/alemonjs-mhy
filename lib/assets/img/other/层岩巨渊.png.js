const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../层岩巨渊-BsTa7mvV.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
