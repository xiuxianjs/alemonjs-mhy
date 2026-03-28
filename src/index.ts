import router from './router';
import routerMw from './router-mw';

// 关于 event 对象的 mihoyo 类型声明
export type Mihoyo = {
  name: string;
};

export default defineChildren({
  // 注册路由
  register() {
    return {
      responseRouter: router,
      middlewareRouter: routerMw
    };
  },
  onCreated() {
    logger.info('mihoyo服务');
  }
});
