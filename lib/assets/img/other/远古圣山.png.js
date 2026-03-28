const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../远古圣山-QNXqH7Fn.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
