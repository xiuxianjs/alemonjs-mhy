const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../沉玉谷-CZhHKyJ2.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
