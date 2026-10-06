---
author: "效率火箭"
sync_status: "已推送"
source_url: "https://mp.weixin.qq.com/s?__biz=MzI2MjEyODE4OA==&mid=2650484535&idx=1&sn=602888c44074ae8da26decc2088ee4ae&chksm=f3d134ea4654d2db5dc767ef12c6f9ff753b13acfdea61a39ffe328aba409b9fdebf77f2ffe9#rd"
source: "微信"
published: "2026-10-06T15:30:00.000+08:00"
goodlinks: false
github_url: "https://github.com/evener920/lumen/blob/main/md/速报-obsidian-1-14-正式发布-库外-markdown-bases-看板与多色高亮--3f1feb00ed728110a6ccd4be7dcd6b47.md"
bear_url: "https://inbox.201573.xyz/obsidian-114-markdownbases/"
created: "2026-10-06T08:31:00.000Z"
title: "【速报】Obsidian 1.14 正式发布：库外 Markdown、Bases 看板与多色高亮"
updated: "2026-10-06T08:32:00.000Z"
---

> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzI2MjEyODE4OA==&mid=2650484535&idx=1&sn=602888c44074ae8da26decc2088ee4ae&chksm=f3d134ea4654d2db5dc767ef12c6f9ff753b13acfdea61a39ffe328aba409b9fdebf77f2ffe9#rd](https://mp.weixin.qq.com/s?__biz=MzI2MjEyODE4OA%3D%3D&mid=2650484535&idx=1&sn=602888c44074ae8da26decc2088ee4ae&chksm=f3d134ea4654d2db5dc767ef12c6f9ff753b13acfdea61a39ffe328aba409b9fdebf77f2ffe9#rd)
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791275481/mpclipper/2026/10/06/e68906997485f989362ca04d9e46b1f2_640.png)
Obsidian 又迎来了一次挺实用的大更新。
2026 年 10 月 5 日，Obsidian 1.14 正式向所有用户开放。桌面端的重点是直接打开库外 Markdown、Bases 看板和多色高亮；移动端则带来了 iOS 快速记录等改进。
其中，我最喜欢的，是那个看起来再普通不过的功能：终于可以直接打开一个 Markdown 文件了。
# 库外 Markdown，终于可以直接打开了
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791275480/mpclipper/2026/10/06/65edcd16048ff79d284e357c03c5e53f_640.jpg)
以前想用 Obsidian 处理一份临时下载的 .md 文件，通常得先把它放进库，或者把所在文件夹打开成一个库。所以一般我都会另外安装一个 Markdown 编辑器，例如 MarkText，Tyopra，只是为了看一下，临时的，或不在Obsidian 库里的 Markdown文件。
现在，Obsidian 桌面端新增了 Open file from outside the vault… 命令，可以在当前窗口直接打开库外 Markdown。
而且，Obsidian 也会出现在系统的 “打开方式” 菜单里，可以设为 .md 文件的默认打开程序。我测试了一下， .txt文件 竟然不可以，只支持 markdown 文件。
macOS 还加入了 Quick Look 支持，不启动 Obsidian 也能快速预览 Markdown。
这对临时阅读、修改下载件，或者查看项目里的 README，都很方便。已经习惯 Obsidian 编辑界面的用户，现在可以少安装一个 Markdown 工具了。
不过有一说一，现在这个模式，也有缺点，它只是解决了可以打开的问题，但远非完美。因为，每次双击打开外部 MD 文件时，Obsidian 还是会 默认打开上一次的库。 只是为了将外部文件展示出来，就需要打开整个库，而且那个库和临时打开的文件未必有关。 我觉得，应该有一个机制，让 Obsidian 打开外部文件时，处于一个没有库的状态，然后让用户可以快速决定将文件扔到某个库里，或者索性临时编辑，用完就走。
# Bases 加入原生看板
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791275481/mpclipper/2026/10/06/62436a4b3b27d9918cb916b54647b4b8_640.jpg)
Bases 是 Obsidian 用来整理笔记和属性的核心插件。这次新增了 Kanban 看板视图，可以把笔记按属性分成不同列。
比方说，博客选题按“待研究”“写作中”“已发布”排列。使用可编辑的笔记属性分组时，把卡片拖到另一列，就会更新对应属性。看板里的卡片仍然对应笔记文件，数据也继续保存在本地 Markdown 及其属性中。
在其它在线表格应用里，表格转换成看板已经是标配应用了，如今Obsidian将这项功能带到了 本地Markdown 笔记数据库里面来。 和之前大家以为的 用户可以构建任意看板不同，这次更新是基于 Bases 的，所以本质上还是一个 表格的视图。 Obsidian 已经将起锚定在 Bases 上了，不像以前的Canvas 那样是天马行空的全新类型。
同时，新的 Group 菜单可以调整分组顺序、隐藏或添加分组。表格、卡片和列表视图也支持折叠分组。
如果平时已经在用 Bases 管理笔记清单，这次就多了一种更直观的浏览方式。
# 高亮文字，现在有六种颜色
我之前专门介绍过 高亮语法，以及 Obsidian 注释插件。 现在 Obsidian 官方也开始重视起来了。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791275480/mpclipper/2026/10/06/ee96c4dbe75a5b3dbd8c850e2363103a_640.jpg)
Obsidian 1.14 加入了红、橙、黄、绿、蓝、紫六种高亮颜色。可以从菜单选择，也可以在高亮内容开头加入对应的彩色 Emoji。输入 == 时，编辑器会提示颜色选项；在实时预览中，还能点击色块调整颜色。
对于习惯边读边标注的人，这个小功能超级实用。比如用黄色标重点、红色标疑问，回头整理时更容易区分。
# iOS 快速记录，不必等整个库加载
移动端最值得关注的是 Quick Capture。
在 iOS 26 上，可以通过锁屏、控制中心、主屏幕小组件或快捷指令直接记录，不必先等待资料库加载完成。记录位置可以设为新笔记、当天的日记、已收藏笔记或指定笔记，也支持可选模板。
随手记一个想法时，现在可以 少等几秒、少点几下了。
# 升级时，记得重新下载安装包
有一点需要特别提醒：**要使用桌面端的库外文件打开功能，需要从官网下载最新安装包并重新安装，不能只做应用内更新。
我觉得这次更新的几个重点都很贴近日常使用：临时文件更容易打开，已有笔记更方便整理，手机上的想法也更容易及时记下来。
对于已经在用 Obsidian 的朋友，非常值得更新看看。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791275480/mpclipper/2026/10/06/04343b88db4bc89208c434889f32cf94_640.png)
