const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../pyro-BfvVO8WM.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
