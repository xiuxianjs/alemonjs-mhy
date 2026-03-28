const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../bg3-DUI0YdtP.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
