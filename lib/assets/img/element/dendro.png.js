const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../dendro-B4yiSoGA.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
