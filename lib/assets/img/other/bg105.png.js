const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../bg105-Bl7yI3p3.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
