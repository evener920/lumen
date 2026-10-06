---
author: "数字生命Q"
sync_status: "已推送"
source_url: "https://mp.weixin.qq.com/s?__biz=MzY5MTMxNzQ3NQ==&mid=2247484147&idx=1&sn=884726d0c6dcef7c44298f376a1b4319&chksm=f53919e64b703ccc89212ba4b01f0288040ecda44a07b425daeded6320ecde17c587d39f314d#rd"
source: "微信"
published: "2026-09-10T17:25:00.000+08:00"
goodlinks: false
github_url: "https://github.com/evener920/lumen/blob/main/md/glm5-3flash还要钱呢-结果glm5-3就免费了-这你忍得住不蹬两下--3f1feb00ed72811899a4ca4bfb7f1013.md"
bear_url: "https://inbox.201573.xyz/glm53flashglm53/"
created: "2026-10-06T23:53:00.000Z"
title: "GLM5.3flash还要钱呢，结果GLM5.3就免费了，这你忍得住不蹬两下？"
updated: "2026-10-06T23:54:00.000Z"
---

> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzY5MTMxNzQ3NQ==&mid=2247484147&idx=1&sn=884726d0c6dcef7c44298f376a1b4319&chksm=f53919e64b703ccc89212ba4b01f0288040ecda44a07b425daeded6320ecde17c587d39f314d#rd](https://mp.weixin.qq.com/s?__biz=MzY5MTMxNzQ3NQ%3D%3D&mid=2247484147&idx=1&sn=884726d0c6dcef7c44298f376a1b4319&chksm=f53919e64b703ccc89212ba4b01f0288040ecda44a07b425daeded6320ecde17c587d39f314d#rd)
你敢信，便宜的那个还要收钱，反倒是它的上位替代，直接免费了。
这真是离了大谱。
说的就是 GLM-5.3，智谱那条线里最大的那个，现在挂在 TokenRouter 上白给，模型名 z-ai/glm-5.3-free，**$0.0000**。反倒是它自家的 Flash 版，**$0.15 进、$0.50 出**，一分钱不少。
对，不是 Flash 本 Flash，是它妈。听着有点像骂人，但它真的免费了。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791330805/mpclipper/2026/10/07/13298795bb51b2dfd2c3c1ce44b4f8a0_640.png)
**白给的，居然是个大号**
GLM-5.3 是什么我就不介绍了，各位搞开发的比我熟。之前教各位薅免费国模还是上一回，主角是 Kimi K3，这回直接换了旗舰上来。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791330805/mpclipper/2026/10/07/f2ce832ea342d45f68adbe68fb0b2170_640.png)
价签就不逐个数了，图里四行，自己看。
同样是白嫖，这次档位直接升了一级。
那它图什么？我认为哈，图的就是注册、是调用量、是你顺手去试试它家别的付费模型。
**入口和链接，都在这儿**
**官网注册**
**https://www.tokenrouter.com**
右上角 Sign Up，邮箱就行，不用绑卡。
**建 Key 的地方**
**https://www.tokenrouter.com/console**
进去点 API Keys，Create New Key，名字随便写；Allowed Models 手动输入并锁死 z-ai/glm-5.3-free，这步最关键；Unlimited Quota 记得打开；创建完立刻复制 sk- 开头那串，弹窗一关就再也看不到了。
对了，Key 得你自己去创一个，我可不能一起发给你，不然内裤都给我蹬没了。
**想先看价签**
**https://www.tokenrouter.com/models**
不登录也能翻，确认它还免不免费，刷这一页最快。
**客户端里就填这两个**
Base URL：**https://api.tokenrouter.com/v1**
模型名：**z-ai/glm-5.3-free**
剩下的跟官方 OpenAI 一模一样，只改这两处。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791330805/mpclipper/2026/10/07/7f0e15791530e19d5c96dd9f8c120a29_640.png)
三个坑顺手记一下：模型名少写 z-ai/ 前缀，直接报模型不存在；写成 **glm-5.3-flash**，那是付费档，你以为在蹭免费其实在扣余额；Key 没锁 Allowed Models，客户端下拉框里手滑选到付费模型，静默烧钱，不看账单发现不了。
还有一件事，文档里没强调但挺实际：这档只开了 OpenAI 格式端点，glm 全系都是这么标的。所以只认 Anthropic 协议的 Claude Code 这类客户端直连不了，中间得加一层转换；能直接用起来的是支持自定义 base_url 的客户端，Cherry Studio、Cline，或者你自己写的那几行脚本。
对了，别忘了智谱自家的 agent，ZCode，毕竟自家的东西更适配自家的模型。
依我看来，这东西拿来写草稿、搓小工具、试新 prompt 都挺合适，旗舰零成本用，这个便宜不占白不占。
各位准备拿它干点啥？
**如果本篇文章帮助到了你不妨点个赞，想要即时获取更新的资讯可以点个关注，感谢观看。**
