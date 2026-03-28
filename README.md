# 阿柠檬-米哈游

必要环境 `nodejs` 、`sql(mysql/sqlite)`、`redis` 、`chrome`

该扩展推荐使用`alemongo`或`alemondesk`作为生产环境

`alemongo` https://github.com/lemonade-lab/alemongo

`alemondesk` https://github.com/lemonade-lab/alemondesk

## 安装方式1: Git

### alemongo/alemondesk

- 地址

```sh
https://github.com/lemonade-lab/alemonjs-mhy.git
```

若访问受限，可使用如下加速地址

```sh
https://ghfast.top/https://github.com/lemonade-lab/alemonjs-mhy.git
```

- branch

```sh
release
```

### 本地

```sh
git clone -b release --depth=1 https://github.com/lemonade-lab/alemonjs-mhy.git ./packages/alemonjs-mhy
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
