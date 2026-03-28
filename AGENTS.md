# Alemonjs Mihoyo Plugin — 项目指南

## 概述

基于 [alemonjs](https://github.com/lemonade-lab/alemonjs) 框架的米游社 API 插件，支持原神 (GS)、星穹铁道 (SR)、绝区零 (ZZZ) 三款游戏的数据查询、签到、Cookie 管理等功能。通过 JSX 渲染引擎 (jsxp) 将查询结果生成图片卡片回复。

## 技术栈

- **框架**: alemonjs v2 — 事件驱动多平台 Bot 框架 (QQ / Discord / OneBot)
- **构建**: lvyjs — TypeScript 编译 + 开发热重载
- **渲染**: jsxp — JSX → HTML → PNG Buffer 图片渲染
- **样式**: Tailwind CSS + SCSS，自定义字体 tttgbnumber
- **数据**: Redis (via `@alemonjs/db` 的 `getIoRedis()`)，无 SQL 数据库
- **语言**: TypeScript + TSX (React JSX)
- **包管理**: yarn

## 常用命令

```bash
yarn dev          # 开发模式 (npx lvy app.ts)
yarn view         # JSX 预览模式 (npx lvy app.ts --jsxp)
yarn build        # 编译到 lib/
yarn lint         # ESLint 检查
yarn lint:fix     # ESLint 自动修复
```

## 架构核心

### 入口流程

```
app.ts → src/index.ts → src/router.ts → src/response/mihoyo/*.ts
```

### 路由定义

路由在 `src/router.ts` 中通过 `defineRouter()` + `lazy()` 懒加载注册，正则模式定义在 `src/constants/mihoyo.ts` 的 `mihoyoRouteRules`。

### 中间件

`src/response/mw.ts` 全局中间件在所有路由前执行：

- 从消息文本中检测游戏类型 (`resolveGame()` → `'gs' | 'sr' | 'zzz'`)
- 挂载 `e.mihoyo` 上下文 (`{ game, isGs, isSr, isZzz }`)

### Response Handler 标准模式

```typescript
export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });
  const [message] = useMessage(event);
  const userId = event.UserId;

  // 业务逻辑...
  const result = await queryMihoyoApi({ userId, game, api: 'dailyNote' });

  // 渲染图片
  const format = Format.create();
  const img = await renderComponentIsHtmlToBuffer(CardComponent, { data });
  format.addImage(img);
  void message.send({ format });
};
```

## 目录结构

| 目录                          | 用途                                                  |
| ----------------------------- | ----------------------------------------------------- |
| `src/router.ts`               | 路由注册 (25+ 条)                                     |
| `src/constants/mihoyo.ts`     | 命令正则、游戏常量                                    |
| `src/response/mihoyo/`        | 响应处理器 (每个命令一个文件)                         |
| `src/response/mw.ts`          | 游戏类型检测中间件                                    |
| `src/model/mihoyo/`           | 核心业务逻辑                                          |
| `src/model/mihoyo/mysApi.ts`  | HTTP 客户端：DS 签名、device_fp、请求头、缓存         |
| `src/model/mihoyo/apiMap.ts`  | API 端点映射 (CN/OS × GS/SR/ZZZ)                      |
| `src/model/mihoyo/region.ts`  | UID → 区服解析                                        |
| `src/model/mihoyo/query.ts`   | 统一查询封装 (Cookie + UID + API 调用 + retcode 处理) |
| `src/model/mihoyo/account.ts` | Cookie / UID 绑定与存储                               |
| `src/model/mihoyo/stoken.ts`  | Stoken 管理 + 扫码登录                                |
| `src/model/mihoyo/sign.ts`    | 游戏/米游社签到                                       |
| `src/model/keys.ts`           | Redis Key 模板 (前缀 `data:alemonjs-mhy:`)            |
| `src/img/views/`              | JSX 卡片组件 (12 个)                                  |
| `src/img/views/HTML.tsx`      | 通用 HTML 包装器 (字体、样式)                         |
| `src/assets/`                 | 字体、SCSS、图片资源                                  |

## 米游社 API 关键参数

| 参数        | CN 值                                                          | OS 值                              |
| ----------- | -------------------------------------------------------------- | ---------------------------------- |
| Salt        | `xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs`                             | `okr4obncj8bw5a65hbnn5oo6ixjc3l9w` |
| App Version | `2.40.1`                                                       | `2.55.0`                           |
| Client Type | `5`                                                            | `2`                                |
| DS 签名     | `md5(salt=...&t=...&r=...&b=...&q=...)` → `{t},{r},{hash}`     |
| device_fp   | POST `public-data-api.mihoyo.com/device-fp/api/getFp`，缓存 1h |
| 查询缓存    | 300 秒 (5 分钟)                                                |

## Redis Key 约定

```
data:alemonjs-mhy:cookie:user:{userId}          # Cookie (30d)
data:alemonjs-mhy:uid:user:{userId}:{game}       # UID 列表 (90d)
data:alemonjs-mhy:stoken:user:{userId}           # Stoken (90d)
data:alemonjs-mhy:device_fp:{uid}                # 设备指纹 (1h)
data:alemonjs-mhy:cache:{game}:{uid}:{api}       # 查询缓存 (5m)
data:alemonjs-mhy:qrlogin:lock:{userId}          # 扫码会话
```

## JSX 卡片组件规范

- 使用 `renderComponentIsHtmlToBuffer(Component, { data })` 渲染
- 组件接收 `{ data: XxxData }` props，包含 `game` 字段
- 通用样式：`padding: '24px'`，金色渐变头部 (`#e8d5b0→#d3bc8e`)，白色内容区
- 不设固定 `width`，由内容撑开
- 字体：tttgbnumber (数字专用)
- 包裹层：`HTML.tsx` 提供 Tailwind + 自定义字体

## 编码规范

- 函数式风格，不使用 class
- 类型定义与实现分离 (`types.ts` 中定义接口)
- 导出白名单在 `src/index.ts` 统一管理
- ESLint + Prettier 强制格式化 (husky pre-commit)
- 路径别名 `@src/` → `src/`
