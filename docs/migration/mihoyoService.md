# Miao-Yunzai -> alemonjs 米游社迁移蓝图

## 1. 迁移目标

将旧项目中的米游社相关能力迁移到 alemonjs 架构下，统一为：

1. 路由层：识别指令与入口控制。
2. 应用层：编排业务流程、并发控制、异常标准化。
3. 模型层：米游社账号、区域、接口与缓存模型。
4. 数据层：DB + Redis 持久化与索引关系。

## 2. 旧项目能力映射

1. 账号与 Cookie：MysUser / NoteUser / MysInfo。
2. 基础查询：dailyNote、index、character、spiralAbyss。
3. 抽卡链路：authkey -> 分池拉取 -> 本地存储 -> 图像分析。
4. 充值链路：authkey -> crystal/primogem 记录 -> 统计图。
5. 公告推送：getNewsList + 定时任务 + 群投递。

## 3. 新项目目录建议

1. src/response/mihoyo：路由处理器。
2. src/model/mihoyo：类型、区域判断、接口映射、签名工具、客户端。
3. src/model/keys.ts：新增 mihoyo 相关 redis key。
4. src/db/models：按需新增账号映射和任务状态模型。

## 4. 分阶段迁移

1. phase-1：骨架
   - 新增路由入口。
   - 新增 types / region / apiMap。
   - 新增迁移帮助和状态命令。
2. phase-2：账号体系
   - 迁移 Cookie 解析、脱敏、有效性校验。
   - 迁移 uid <-> ltuid 关系与主 UID 选择。
3. phase-3：基础查询
   - 先实现体力、主页、角色、深渊。
   - 统一错误码处理与验证码兜底。
4. phase-4：数据链路
   - 抽卡记录、充值统计。
   - 数据导入/导出兼容层。
5. phase-5：推送任务
   - 公告资讯任务化。
   - 群订阅开关与频控。

## 5. 本周可执行计划

1. 完成 phase-2：账号与 Cookie 服务。
2. 完成 phase-3 的 dailyNote + index。
3. 提供命令：#绑定cookie、#体力、#米游社状态。
4. 增加第一版集成测试与日志埋点。
