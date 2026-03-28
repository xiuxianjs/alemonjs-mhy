import { defineRouter, lazy } from 'alemonjs';

/**
 * 全局中间件路由
 * 用于给alemonjs后续模块提供一个全局e.mhy来实现一系列衍生扩展
 */
export default defineRouter([
  {
    handler: lazy(() => import('@src/middleware/mw'))
  }
]);
