const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../bg-CVUMqi0A.webp', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
