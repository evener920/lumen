---
author: "花叔"
sync_status: "已推送"
source_url: "https://mp.weixin.qq.com/s?__biz=Mzg2OTA1OTAxNA==&mid=2247492344&idx=1&sn=f2b9cb9c272bfb9c8ec163ab0b279b49&chksm=cf9a200df61ee6a594d64b778262b458052acf44268f6a0d3cc28c9f5c19e41aa5c2229603c1#rd"
source: "微信"
published: "2026-10-06T13:17:00.000+08:00"
goodlinks: false
github_url: "https://github.com/evener920/lumen/blob/main/md/huashu-art-motion发布-可能是最有审美的动画skill--3f2feb00ed72813a9380ff6fdcce8f5f.md"
bear_url: "https://inbox.201573.xyz/huashu-art-motionskill/"
created: "2026-10-07T00:14:00.000Z"
title: "huashu-art-motion发布！可能是最有审美的动画skill。"
updated: "2026-10-07T00:15:00.000Z"
---

> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=Mzg2OTA1OTAxNA==&mid=2247492344&idx=1&sn=f2b9cb9c272bfb9c8ec163ab0b279b49&chksm=cf9a200df61ee6a594d64b778262b458052acf44268f6a0d3cc28c9f5c19e41aa5c2229603c1#rd](https://mp.weixin.qq.com/s?__biz=Mzg2OTA1OTAxNA%3D%3D&mid=2247492344&idx=1&sn=f2b9cb9c272bfb9c8ec163ab0b279b49&chksm=cf9a200df61ee6a594d64b778262b458052acf44268f6a0d3cc28c9f5c19e41aa5c2229603c1#rd)
先看片子，2分08秒，一镜到底。
再看一支更适合实际工作的视频，同样是用这个skill做的，讲的是SpaceX这24年。
这种whiteboard（白板）动画，我觉得特别适合B站、YouTube上的长解说和教程：跟着口播一点点画出人物、事件和关系，观众能顺着画面理解你在讲什么。做知识科普、产品讲解，或者给课程配动画，都可以往这个方向试。
开头那支是Q版的我从拉斯科洞穴壁画出发，穿过23种画风，最后回到2026年书桌前的一段动画。每进一幅画，我就换成那幅画的画风，再跟画里的东西玩一下：在古埃及壁画里跳过推着太阳球的圣甲虫，在北斋的巨浪底下缩头躲浪爪，在莫奈的日本桥上打水漂，陪蒙克的呐喊者一起大叫，帽子被叫飞了，又在8-bit的夜空里顶出一枚金币。
场景是代码画的，配乐也是代码一个音一个音合成的（没用一个采样），除了我的形象是调用codex的ImageGen生成的（现在codex真的只配给CC打打生图的下手），其余全是Claude Code里的Opus 5.5做的，从拿到参考视频到这一版成片，前后不到一天。
做这些动画的方法，我沉淀成了一个skill，叫huashu-art-motion，装上之后你可以直接跟它说「用梵高《星月夜》的风格给我做一段15秒的动画」，也可以给它参考短片，让它拆解、复刻，或者按你的口播做解说动画。
## 从Fable 5.5说起～
如果你前几天刷过X的AI圈，大概率刷到过一批说是Fable 5.5做的动画：有人只给了一句提示词，拿回来一部3分钟、带原创配乐的动画短片，6000多赞；有人让超人在不同画风里一镜到底地连续穿梭，67万浏览；还有一条15秒的艺术史动画，一只猫和一个人在喝茶，背景从洞穴壁画一路换到扁平插画，原作者是Tak（@cherry_mx_reds）。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332047/mpclipper/2026/10/07/62d1a6997c8c63e4782a01683cf45848_640.jpg)
中文区很多人看到的其实是它的一条转发，这条转发的收藏居然比原帖还多。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332047/mpclipper/2026/10/07/b995dd3ec00d4e94ef78b3a8ab221807_640.jpg)
截至今天，Anthropic官方并没有发布过Fable 5.5，官方最新的还是9月1号发布的Fable 5.1。这一波作品都来自自称被灰度路由到Fable 5.5的用户（判断方法是一个民间的Tibo测试，不联网问模型认不认识OpenAI Codex团队的Tibo，答得出来就认为是知识更新过的新模型），模型版本本身没有官方确认。
我也把那条视频丢给Claude Code复刻了一遍。不过做完一支同款，我更想留下的是方法：怎么拆画风、让画面里的东西动起来，下次换个题材还能继续用。
复刻时有个挺有意思的细节，它自己做了一张运动热力图，找出原片里哪些区域在动。每个时代虽然只有1秒左右，但浪在卷、文字在闪，画面内部一直有动作。后来这些拆解方法，也一起放进了skill。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332048/mpclipper/2026/10/07/f769839ca4fe15adfb8359fd858369f0_640.jpg)
## 复刻里没有的那支片子
所以复刻完的当晚，我给了它一个原片里没有的题目：
用我的卡通形象，穿越至少20种不同风格的场景，形象要随着场景变化，并且要跟场景里具体的东西发生互动，比如穿过莫奈的日本桥，往睡莲池子里打水漂。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332049/mpclipper/2026/10/07/7cd0affc954a508a61b4a25c983be214_640.gif)
这支片子里，场景和风格用代码画，我的形象则每种画风都用gpt-image重画动作帧，再由代码控制位置、大小和换帧时机，给角色叠上对应画风的笔触。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332050/mpclipper/2026/10/07/92ae5cc9900d06d53d5241094fad57ab_640.gif)
配乐也跟着画风走：洞穴段是骨笛和手鼓，敦煌是琵琶，浮世绘是三味线和尺八，8-bit是方波。这些声音全部由代码合成，换场景的时候也会换乐器和调式。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332050/mpclipper/2026/10/07/50b3e3714a325137a9a82054fcd2ce2c_640.gif)
## 放到真实工作里试试
不过，除了展示模型的能力，或者自己驾驭模型的能力，我更关心的还是，这个东西能不能用到真实的工作场景中。
所以我们又增加了8种YouTube上常见的解说风格，包括白板、Vox、Kurzgesagt、3Blue1Brown、发布会UI、财经图表、故事和动态文字。讲数据可以用财经图表，讲数学和AI概念可以试3b1b，软件教程里的界面操作可以用发布会UI，具体用哪种，跟着要讲的内容来选。
除了开头的whiteboard，还有这种Vox风格，同样讲SpaceX这24年：
同一个题材换一种表达，画面的感觉就很不一样。你可以把自己的口播交给它，按时长做出对应的动画段，插进正在剪的视频里；也可以像这两支一样，把一段完整的解说做成动画。
对我自己来说，这部分会更常用。做一条B站或者YouTube的长视频，碰到一个光靠说不容易讲明白的地方，就可以单独配一段，让图形跟着讲解一步步展开。
## 这个skill里有什么
除了上面这8种解说风格，里面还整理了几十张艺术风格卡，从洞穴壁画、古埃及、浮世绘、印象派，到梵高、蒙克、达利、霍珀、波普、吉卜力、新海诚、蒸汽波。每张卡里都有配色、笔触、动作的做法，以及目前的短板，下次做的时候可以接着改。
![image](https://res.cloudinary.com/dqvoyeo3x/image/upload/v1791332047/mpclipper/2026/10/07/673c1a37d6a935b8558186d2eb1ae9da_640.jpg)
拆参考视频的方法、角色怎么生帧和合成、配乐怎么跟画面卡节拍，也都放进去了。做完后会先跑程序检查静止帧、异常跳变等问题，再让一个没参与制作的agent只看成片挑毛病。
我一直要求它把实践里做对的事情记下来，包括做法、证据、为什么、什么时候用。下次换题材、换风格，甚至换模型，这些经验都能带过去。
## 带走这个skill
skill开源在GitHub：
https://github.com/alchaincyf/huashu-art-motion
安装（Claude Code、Codex、Cursor等支持skill的agent都可以用）：
```plain text
npx skills add alchaincyf/huashu-art-motion
```
渲染视频需要本机有uv和ffmpeg，第一次渲染前装一下无头浏览器：`uv run --with playwright playwright install chromium`（这些你直接让agent帮你装就好）。
装完之后，可以直接这么跟它说：
```plain text
用梵高《星月夜》的风格，给我做一段15秒的动画，画面里的东西要一直在动
```
```plain text
帮我拆解这段动画，告诉我它是怎么做出来的，然后复刻一版：[视频路径]
```
```plain text
我这段口播讲的是梯度下降，帮我按3b1b的风格做一段对应时长的动画
```
如果你想让动画里出现你自己或者某个角色，需要你的agent能调用生图模型（我用的是gpt-image）；没有的话，可以让它用代码画几何化的角色，或者直接用你已有的角色图。
做出来的作品也欢迎发给我看看，尤其是skill里还没有的风格，做得好的话，我会把它补进skill的风格卡里。
