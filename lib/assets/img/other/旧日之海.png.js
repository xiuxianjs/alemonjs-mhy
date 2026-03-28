const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../旧日之海-klAbsKZ-.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
