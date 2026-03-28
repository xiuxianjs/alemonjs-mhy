import router from './router';

export default defineChildren({
  // 注册路由
  register() {
    return {
      responseRouter: router
    };
  },
  onCreated() {
    logger.info('mihoyo服务');
  }
});
