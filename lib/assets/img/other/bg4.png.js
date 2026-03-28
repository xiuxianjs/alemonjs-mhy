const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../bg4-BX-G8zUc.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
