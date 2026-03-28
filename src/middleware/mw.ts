import { EventsEnum, Next } from 'alemonjs';

// 中间件
export default (event: EventsEnum, next: Next) => {
  // 给事件对象添加一个mihoyo属性，包含事件名称，供后续模块使用
  // event.mihoyo = {
  //   name: event.name
  // };

  // // 设置 mihoyo 属性此时仅访问不可以赋值
  // Object.defineProperty(event, 'mihoyo', {
  //   writable: false,
  //   configurable: false
  // });

  next();
};
