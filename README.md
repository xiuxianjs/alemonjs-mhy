# 阿柠檬-米哈游

必要环境 `nodejs` 、`sql(mysql/sqlite)`、`redis` 、`chrome`

该扩展推荐使用`alemongo`或`alemondesk`作为生产环境

`alemongo` https://github.com/lemonade-lab/alemongo

`alemondesk` https://github.com/lemonade-lab/alemondesk

## 指令一览

[README_COMMAND.md](./README_COMMAND.md)

## 安装方式1: Git

### alemongo/alemondesk

- 地址

```sh
https://github.com/xiuxianjs/alemonjs-mhy.git
```

若访问受限，可使用如下加速地址

```sh
https://ghfast.top/https://github.com/xiuxianjs/alemonjs-mhy.git
```

- branch

```sh
release
```

### 本地

```sh
git clone -b release --depth=1 https://github.com/xiuxianjs/alemonjs-mhy.git ./packages/alemonjs-mhy
```

```sh
yarn install #开始模块化
```

- alemon.config.yaml

```yaml
apps:
  alemonjs-mhy: true # 启动扩展
```

## 安装方式2: npm

> 暂未支持

## 开发指南

### 导出 API

```typescript
import {
  // 类型
  type MihoyoGame,
  type StoredCookieData,
  type StokenData,
  type QueryResult,

  // 游戏检测
  resolveGame,

  // 账号操作
  getUserCookie,
  getUserMainUid,
  bindUserCookie,

  // Stoken
  getUserStoken,
  bindStoken,

  // 签到
  performGameSign,
  performBbsSign,

  // 统一查询（推荐）
  queryMihoyoApi,

  // 底层 API
  mysApiFetch,
  fetchGameRoles
} from 'alemonjs-mhy';
```

#### `queryMihoyoApi` — 统一查询

大多数查询场景推荐使用此方法，自动处理 Cookie 读取、UID 获取、区服识别：

```typescript
const result = await queryMihoyoApi({
  userId: '用户ID',
  game: 'gs',
  api: 'dailyNote'
});

if (result.success) {
  console.log(result.data); // API 返回数据
  console.log(result.uid); // 使用的 UID
}
```

#### `mysApiFetch` — 底层调用

需要自行传入 Cookie 和 UID，适合定制化场景：

```typescript
const res = await mysApiFetch({
  uid: '100000001',
  cookie: 'ltoken=xxx;ltuid=xxx;',
  api: 'dailyNote',
  game: 'gs'
});
```
