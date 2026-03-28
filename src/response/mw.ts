import { EventsEnum } from 'alemonjs';

export default (e: EventsEnum) => {
  console.log('进中间件', e);

  // 放行
  return true;
};
