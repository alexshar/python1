import os
import shutil
import time

emailMap = {
"victor.you@nokia-sbell.com": "尤海",
"chao.wang@nokia-sbell.com": "王超",
"fang.2.tang@nokia.com": "唐芳",
"hunter.sun@nokia.com": "孙泽勇",
"george.lu@nokia.com": "卢国柱",
"samuel.shi@nokia.com": "石洪山",
"chao.6.liu@nokia-sbell.com": "刘超",
"jenna.ran@nokia-sbell.com": "冉静",
"matthew.cheng@nokia.com": "程茂川",
"walter.xu@nokia-sbell.com": "徐京涛",
"vera.yu@nokia-sbell.com": "余音知",
"hongping-tracy.lai@nokia-sbell.com": "赖宏萍",
"jian.hai@nokia-sbell.com": "海舰",
"jack.1.yang@nokia.com": "杨伟",
"yongheng.wang@nokia-sbell.com": "王永恒",
"wenjuan-wendy.wang@nokia-sbell.com": "王文娟",
"chris.li@nokia-sbell.com": "李君跃",
"qi.si@nokia-sbell.com": "司奇",
"peilun.li@nokia.com": "李沛伦",
"yuan.yuan@nokia-sbell.com": "袁源",
"zheng.xun.ext@nokia.com": "郑迅",
"xue.1.feng@nokia.com": "冯雪",
"rex.tang@nokia-sbell.com": "唐卿",
"vincent.d.wang@nokia-sbell.com": "王晓冬",
"nancy.1.yu@nokia-sbell.com": "余建秋",
"lin.c.zhang@nokia-sbell.com": "张林聪",
"hao.pu@nokia-sbell.com": "蒲昊",
"evan.he@nokia-sbell.com": "何旭",
"qingquan.luo.ext@nokia.com": "罗清泉",
"hong.1.yang@nokia.com": "杨宏",
"yan.15.zhang@nokia-sbell.com": "张艳",
"william.wang@nokia-sbell.com": "王鉴",
"eva.huang@nokia.com": "黄爱华",
"zhong_yin.yin@nokia-sbell.com": "殷忠银",
"jeffrey.liu@nokia-sbell.com": "刘建",
"xiaoyan.tang@nokia-sbell.com": "唐小艳",
"gary.1.zhang@nokia-sbell.com": "张序",
"ming.5.zhang.ext@nokia-sbell.com": "张铭",
"gary.ma@nokia-sbell.com": "马项楠",
"ying.zhong@nokia-sbell.com": "钟颖",
"jk.dong@nokia-sbell.com": "董健康",
"cheng.1.yu@nokia-sbell.com": "余成",
"milo.leng@nokia.com": "冷关怀",
"yolanda.gu@nokia-sbell.com": "古新",
"mai.wang@nokia.com": "王劢",
"caimao.feng@nokia-sbell.com": "冯才茂",
"hongtao.ren@nokia.com": "任红涛",
"pengfei.1.li.ext@nokia.com": "李鹏霏",
"guangxin.x.zeng@nokia-sbell.com": "曾广鑫",
"yi.fan@nokia-sbell.com": "范奕",
"power.li@nokia-sbell.com": "李权",
"catherine.chen@nokia-sbell.com": " 陈虹",
"irene.zeng@nokia-sbell.com": "曾贞",
"tracy.1.wang@nokia-sbell.com": "王芳",
"iris.kang@nokia-sbell.com": "康姝",
"pei.fan@nokia-sbell.com": "范蓓",
"wen.yu@nokia-sbell.com": "喻闻",
"yonggang.long@nokia-sbell.com": "龙勇钢",
"elton.gao@nokia.com": "高鸿",
"jacky.chen@nokia-sbell.com": "陈松",
"paul.xu@nokia.com": "徐青",
"jarvan.gao@nokia-sbell.com": "高小峰",
"han.1.xiao@nokia-sbell.com": "肖翰",
"yao.xie@nokia.com": "谢尧",
"tiezhu.wang@nokia.com": "王铁柱",
"joan.zhang@nokia-sbell.com": "张琼",
"ji.1.zhang@nokia.com": "张季",
"boyi.y.pan@nokia.com": "潘柏屹",
"jason.2.chen@nokia.com": "陈骏",
"michael.1.zhang@nokia.com": "张毅",
"east.zhao@nokia-sbell.com": "赵泽东",
"yuan.p.li@nokia-sbell.com": "李远平",
"peng.gao@nokia-sbell.com": "高鹏",
"jiong.gao@nokia.com": "高炯",
"li.xiang@nokia-sbell.com": "向黎",
"shouhe.chen.ext@nokia-sbell.com": "陈寿和",
"ying.1.zou@nokia-sbell.com": "邹颖",
"bo.1.he@nokia-sbell.com": "何波",
"yonggang.liao@nokia.com": "廖永刚",
"xia.yang.ext@nokia.com": "杨霞",
"wendy.w.wang@nokia-sbell.com": "王昱文",
"jianqiang.huang@nokia-sbell.com": "黄建强",
"zhihua.xie@nokia-sbell.com": "谢志华",
"stella.xu@nokia-sbell.com": "许锡梅",
"kelly.wang@nokia-sbell.com": "王珂薇",
"frank.5.wang@nokia-sbell.com": "王登",
"chao.yang@nokia.com": "杨超",
"jason.1.yuan@nokia-sbell.com": "袁韬",
"yongnan.jiang@nokia-sbell.com": "蒋勇男",
"carlos.he@nokia-sbell.com": "何正周",
"gem.guo@nokia-sbell.com": "郭义锋",
"xiaofeng.wang@nokia-sbell.com": "王晓枫",
"roc.zou@nokia.com": "邹鹏",
"youdan.d.huang@nokia-sbell.com": "黄友丹",
"jane.liu@nokia-sbell.com": "刘涛",
"gang.1.ma@nokia.com": "马刚",
"samuel.1.zhang@nokia-sbell.com": "张波",
"zhigang.yan@nokia.com": "严志刚",
"chris.luo@nokia-sbell.com": "罗涛",
"neo.niu@nokia.com": "牛磊",
"vanessa.fan@nokia-sbell.com": "范登华",
"rex.zhong@nokia-sbell.com": "钟建",
"sueman.fu@nokia-sbell.com": "付满秀",
"lewis.liu.ext@nokia-sbell.com": "刘显福",
"betsy.hui@nokia-sbell.com": "李慧",
"alice.1.li@nokia-sbell.com": "李肖",
"jessica.zeng@nokia-sbell.com": "曾玉珊",
"kui.xiong@nokia.com": "熊馗",
"qingyuan.zhang@nokia-sbell.com": "张庆远",
"hui.yuan.ext@nokia.com": "袁辉",
"jack.liao@nokia.com": "廖永建",
"jason.yu@nokia-sbell.com": "余健洲",
"jessica.1.zhou@nokia-sbell.com": "周节",
"kelly.deng@nokia-sbell.com": "邓一可",
"lucy.zhao@nokia-sbell.com": "赵白梅",
"qian.l.zhou@nokia-sbell.com": "周茜",
"sandy.hu@nokia-sbell.com": "胡霞",
"lin.ye@nokia.com": "叶林",
"yanbing.zhang@nokia-sbell.com": "张阎兵",
"jim.shi@nokia-sbell.com": "石建民",
"yh.wang@nokia.com": "王益辉",
"muhammad.zafar@nokia.com": "zafar muhammad asif",
"alex.1.zhao@nokia-sbell.com": "赵旋",
"frank.2.liu@nokia-sbell.com": "刘坚",
"lin.4.liu@nokia-sbell.com": "刘琳",
"dandan.1.wu@nokia-sbell.com": "武丹丹",
"eric.gou@nokia-sbell.com": "苟勇刚",
"min.1.zhao@nokia-sbell.com": "赵敏",
"rena.zhao@nokia-sbell.com": "赵晓娜",
"ty.tang@nokia.com": "唐彤英",
"frank.luo@nokia-sbell.com": "罗峰",
"wei.1.deng@nokia-sbell.com": "邓伟",
"steven.ou@nokia.com": "欧昌华",
"xiaoyang.tang@nokia.com": "汤小阳",
"dm.fan@nokia-sbell.com": "樊冬梅",
"mandy.xie@nokia-sbell.com": " 谢敏",
"gin.sun@nokia-sbell.com": "孙静",
"karen.du@nokia-sbell.com": "杜婧",
"keane.shao@nokia-sbell.com": "邵唯",
"simon.cai@nokia.com": "蔡茂",
"jonathan.wu@nokia-sbell.com": "吴聪",
"jenny.jing@nokia-sbell.com": "靖黎",
"ashley.dai@nokia-sbell.com": "戴丽",
"minghui.1.li@nokia-sbell.com": "李明辉",
"frank.yang@nokia-sbell.com": "杨绍君",
"peter.hu@nokia-sbell.com": "胡耀波",
"victor.y.chen@nokia-sbell.com": "陈科羽",
"lei.4.shi@nokia-sbell.com": "石磊",
"judith.duan@nokia-sbell.com": "段利君",
"jalen.yang@nokia-sbell.com": "杨魏",
"heng.yang@nokia-sbell.com": "杨恒",
"qb.wu@nokia-sbell.com": "吴泉彪",
"ren.xie@nokia-sbell.com": "谢仁贵",
"hui.2.zhu@nokia-sbell.com": "朱辉",
"chaoxing.lin@nokia-sbell.com": "林朝星",
"sabrina.sun@nokia-sbell.com": "孙南",
"robin.tang@nokia.com": "唐斌",
"peng.1.liu.ext@nokia.com": "刘鹏",
"sherry.xu@nokia-sbell.com": "徐小彦",
"jian.1.fu@nokia-sbell.com": "傅剑",
"betty.zheng@nokia-sbell.com": "郑清文",
"hong.2.yu.ext@nokia.com": "于红",
"barbara.gong@nokia-sbell.com": "龚敬",
"li.10.yang@nokia.com": "杨利",
"amy.li@nokia-sbell.com": "李卉",
"liqiang.lei@nokia-sbell.com": "雷利强",
"andy.j.wu@nokia-sbell.com": "伍健晖",
"kaizhou.zhang@nokia-sbell.com": "张凯舟",
"hong.shi@nokia.com": "石洪",
"yaping.peng@nokia-sbell.com": "彭雅屏",
"frank.fan@nokia-sbell.com": "范勇",
"lei.7.chen.ext@nokia-sbell.com": "陈蕾",
"xiao.lian@nokia-sbell.com": "练小波",
"xia.1.huang@nokia-sbell.com": "黄霞",
"daisy.zhang@nokia-sbell.com": "张登先",
"richard.zhao@nokia-sbell.com": "赵耀",
"caiyun.zhang@nokia-sbell.com": "张彩云",
"tie.tang@nokia-sbell.com": "唐铁",
"wenxiong.ruan@nokia-sbell.com": "阮文雄",
"chang.1.tan@nokia-sbell.com": "谭畅",
"tracy.m.li@nokia-sbell.com": "李元梅",
"yue.a.teng@nokia-sbell.com": "滕越",
"wenpeng.zhu.ext@nokia-sbell.com": "朱文鹏",
"joey.an@nokia-sbell.com": "安秋雨",
"jeff.1.huang@nokia-sbell.com": "黄艳军",
"hongliang.liu@nokia-sbell.com": "刘宏亮",
"matt.ye@nokia-sbell.com": "叶正明",
"gang.qiao@nokia-sbell.com": "乔刚",
"fei.8.wang@nokia-sbell.com": "王飞",
"jiao.yang@nokia-sbell.com": "杨浇",
"qiang.tang.ext@nokia-sbell.com": "唐强",
"jun.2.zhu@nokia-sbell.com": " 朱军 ",
"lingling.gu@nokia-sbell.com": "顾玲玲",
"liu.liu@nokia-sbell.com": "刘流",
"dan.gou.ext@nokia-sbell.com": "苟丹",
"yanghong.li@nokia-sbell.com": "李扬洪",
"hang.li@nokia-sbell.com": "李航",
"xiaodong.1.yang@nokia-sbell.com": "杨晓东",
"xiaoling.l.yang@nokia-sbell.com": "杨小玲",
"ran.jing@nokia-sbell.com": "井然",
"joyce.1.liu@nokia.com": "刘静",
"shuo.wang@nokia-sbell.com": "王硕",
"amy.h.zhang@nokia-sbell.com": "张兴华",
"chao.zhong.ext@nokia.com": "钟超",
"haitao.chen@nokia-sbell.com": "谌海涛",
"ronny.1.ren@nokia-sbell.com": "任林",
"gong.yuan@nokia-sbell.com": "袁功",
"xu.1.lu@nokia-sbell.com": "卢旭",
"bo.yan.ext@nokia-sbell.com": "燕波",
"jessie.yan@nokia-sbell.com": "颜吉平",
"norman.zhu@nokia-sbell.com": "朱钦隽",
"haitao.xiao@nokia-sbell.com": "肖海涛",
"tao.1.su@nokia-sbell.com": "苏涛",
"biao.shen.ext@nokia-sbell.com": "沈彪",
"deming.yuan@nokia-sbell.com": "袁德明",
"zhangchuan.wang@nokia-sbell.com": "王章川",
"grace.cai@nokia-sbell.com": "蔡倩",
"sweety.zou@nokia-sbell.com": "邹姣",
"junlin.li@nokia-sbell.com": "李俊霖",
"zhenping.gong@nokia-sbell.com": "龚真平",
"jianguo.xie@nokia-sbell.com": "谢键国",
"qiao.chen@nokia-sbell.com": "陈樵",
"jie.xiao@nokia-sbell.com": "肖杰",
"hui.2.zhong.ext@nokia-sbell.com": "钟辉",
"eagle.1.wang@nokia-sbell.com": "王刘莹",
"xiaobing.deng@nokia-sbell.com": "邓小兵",
"xuantao.luo@nokia-sbell.com": "罗宣桃",
"james.zhou@nokia-sbell.com": "周坚",
"xin.5.li@nokia-sbell.com": "李欣",
"poppy.shang@nokia-sbell.com": "尚霈霈",
"zoe.3.chen@nokia-sbell.com": "陈竹",
"cejian.zeng.ext@nokia-sbell.com": "曾测荐",
"mike.lv@nokia-sbell.com": "吕剑",
"sean.sun@nokia-sbell.com": "孙书强",
"fan.5.yang@nokia-sbell.com": "杨帆",
"xiyin.liang.ext@nokia-sbell.com": "梁曦尹",
"joseph.wu@nokia.com": "伍俊洪",
"zeyun.yan@nokia-sbell.com": "严泽云",
"dan.2.wang@nokia-sbell.com": "王丹",
"jenna.zhang@nokia.com": "章曦",
"qinghao.quan@nokia-sbell.com": "全清豪",
"juan.feng@nokia-sbell.com": "冯娟",
"ryan.wu@nokia.com": "吴祺斌",
"shawn.feng@nokia-sbell.com": "冯进文",
"cherry.huang@nokia-sbell.com": " 黄时琛",
"myer.li@nokia-sbell.com": "黎明",
"bruce.1.huang@nokia-sbell.com": "黄文强",
"jie.wei@nokia-sbell.com": "魏杰",
"ben.1.zhang@nokia-sbell.com": "张犇",
"shuang.yue@nokia-sbell.com": "岳双",
"hao.5.chen.ext@nokia-sbell.com": "陈豪",
"xingkuan.li.ext@nokia-sbell.com": "李兴宽",
"yang.15.liu@nokia-sbell.com": "刘洋",
"ke.h.li.ext@nokia-sbell.com": "李可",
"ray.zhao@nokia-sbell.com": "赵锐",
"jinxin.liu@nokia-sbell.com": "刘今心",
"weiguang.qu@nokia-sbell.com": "屈玮光",
"hongji.li@nokia-sbell.com": "李泓汲",
"woody.liu@nokia-sbell.com": "刘桂青",
"jinming.ding@nokia-sbell.com": "丁进明",
"louis.liu@nokia-sbell.com": "刘毅",
"taifu.luo.ext@nokia-sbell.com": "罗太富",
"sylvia.chen@nokia-sbell.com": "陈丽",
"rell.li@nokia-sbell.com": "李剑",
"mo.qu.ext@nokia-sbell.com": "屈沫",
"bill.k.huang@nokia-sbell.com": "黄庆奎",
"xiaohong.zhang@nokia-sbell.com": "张晓宏",
"dingding.liu@nokia-sbell.com": "刘鼎鼎",
"guoyi.wang.ext@nokia-sbell.com": "王国义",
"kevin.4.wang@nokia-sbell.com": "王操",
"wei.tan.ext@nokia-sbell.com": "谈伟",
"kai.cui@nokia-sbell.com": "崔凯",
"joe.li@nokia.com": "李佳",
"mia.h.zhang@nokia-sbell.com": "张久红",
"nancy.yu@nokia-sbell.com": "于小红",
"liao.lin.ext@nokia-sbell.com": "廖林",
"ada.ding@nokia-sbell.com": "丁莹",
"ying.xie.ext@nokia-sbell.com": "谢颖",
"nian.zhang@nokia-sbell.com": "张念",
"zongliang.li@nokia-sbell.com": "李宗良",
"jason.long@nokia-sbell.com": "龙毅",
"fei.cheng@nokia-sbell.com": "程飞",
"mingkui.wang@nokia-sbell.com": "汪明奎",
"hong.1.yu@nokia-sbell.com": "于洪",
"xueming.wang@nokia-sbell.com": "王学明",
"yong.6.liu@nokia-sbell.com": "刘勇",
"lawrence.luo@nokia-sbell.com": "罗云",
"stone.1.shi@nokia-sbell.com": "石磊",
"kevin.fu@nokia-sbell.com": "傅稚钦",
"min.e.chen@nokia-sbell.com": "陈敏",
"yang.liu.ext@nokia-sbell.com": "刘阳",
"jun.6.wang@nokia-sbell.com": "王军",
"owen.ou_yang@nokia-sbell.com": "欧阳怡彪",
"hong.1.zhu@nokia-sbell.com": "朱红",
"victor.p.wang@nokia-sbell.com": "王丹平",
"wencan.cui@nokia-sbell.com": "崔文灿",
"jing.2.hu.ext@nokia-sbell.com": "胡婧",
"jin.1.zhang@nokia-sbell.com": "张劲",
"chunli.wang.ext@nokia-sbell.com": "王春丽",
"qin.1.qin@nokia-sbell.com": "秦矜",
"owen.wu@nokia-sbell.com": "吴耀文",
"lily.guo@nokia-sbell.com": "郭莉莉",
"kedi.peng@nokia-sbell.com": "彭柯迪",
"cookie.zhang@nokia-sbell.com": "张璟",
"jihua.zhao@nokia-sbell.com": "赵继华",
"zhijian.huang.ext@nokia.com": "黄智坚",
"li.chen@nokia-sbell.com": "陈丽",
"ligang.xue@nokia-sbell.com": "薛立岗",
"xiaodong.d1.wu@nokia-sbell.com": "吴晓东",
"qimin.xie@nokia-sbell.com": "谢其敏",
"li.k.li@nokia-sbell.com": "  李黎",
"shuwen.yi.ext@nokia-sbell.com": "易书文",
"betty.h.wang.ext@nokia-sbell.com": "王亚会",
"eleven.wu@nokia-sbell.com": "吴明旺",
"david.zhou@nokia.com": "周懿",
"liquan.guan@nokia-sbell.com": "官理权",
"chen.deng@nokia-sbell.com": "邓琛",
"yuchao.a.zhang@nokia-sbell.com": "张于超",
"elisa.li@nokia-sbell.com": "李欣",
"fei.tang@nokia-sbell.com": "唐菲",
"lauran.lin@nokia-sbell.com": "蔺秀芝",
"kery.wu@nokia-sbell.com": "吴益兵",
"fei.a.wang@nokia-sbell.com": "王飞",
"jiong.zhang@nokia-sbell.com": "张炯",
"qiyin.chen@nokia-sbell.com": "陈麒尹",
"sally.wu@nokia.com": "吴艳芬",
"jeff.zhang@nokia.com": "张志锋",
"yu.lan@nokia-sbell.com": "兰宇",
"jie.1.tan@nokia-sbell.com": "谭杰",
"volan.shu@nokia.com": "舒华",
"zhiyong.wu@nokia-sbell.com": "伍智勇",
"kaize.luo@nokia-sbell.com": "罗开泽",
"yizuo.jiang@nokia-sbell.com": "蒋宜佐",
"huafeng.qian.ext@nokia-sbell.com": "钱华锋",
"chaowen.xiang.ext@nokia-sbell.com": "项朝文",
"zhao.feng.ext@nokia-sbell.com": "冯诏",
"yan.yin@nokia-sbell.com": "殷彦",
"lan.1.yang.ext@nokia-sbell.com": "杨岚",
"meng.luo@nokia-sbell.com": "罗梦",
"xinde.zhang@nokia-sbell.com": "张心德",
"lee.s.li@nokia-sbell.com": "李良爽",
"liqiang.song@nokia-sbell.com": "宋立强",
"guohong.ye@nokia-sbell.com": "叶国宏",
"chengdu.re@nokia-sbell.com": "汪霞",
"chengdu.re@nokia-sbell.com": "蒋素兰",
"zichuan.yang@nokia-sbell.com": "杨子川",
"chengdu.re@nokia-sbell.com": "汪平江",
"chengdu.re@nokia-sbell.com": "张玉华",
"shaoqiang.liu@nokia.com": "刘少强",
"ray.li@nokia-sbell.com": "李锐",
"shuangfei.a.liu@nokia-sbell.com": "刘爽飞",
"wei.c.fang@nokia-sbell.com": "方伟",
"chunle.liu@nokia.com": "刘春乐",
"shanshan.1.huang.ext@nokia-sbell.com": "黄姗姗",
"jian.min@nokia-sbell.com": "闵健",
"xiaoxun.wen@nokia-sbell.com": "温小迅",
"yumei.fang.ext@nokia-sbell.com": "方玉梅",
"gordon.xiong@nokia-sbell.com": "熊昭",
"xin.3.yuan@nokia-sbell.com": "袁欣",
"jingjie.leng.ext@nokia-sbell.com": "冷晶洁",
"linna.zhou@nokia-sbell.com": "周李玲",
"yan.9.li@nokia.com": "李彦",
"granite.long@nokia-sbell.com": "龙益",
"dongmei.cai@nokia-sbell.com": "蔡东梅",
"fancy.li@nokia-sbell.com": "李珍",
"starry.lin@nokia-sbell.com": "林璟",
"vincent.5.wang@nokia-sbell.com": "王伟",
"shirley.yang@nokia.com": "杨坤",
"chris.1.wang@nokia.com": "王预雯",
"catherine.long@nokia.com": "龙江蕾",
"lingbo.zeng@nokia.com": "曾令波",
"hengguo.gao.ext@nokia-sbell.com": "高恒国",
"prince.rong@nokia-sbell.com": "荣凡",
"ray.cheng@nokia.com": "程光",
"yuansheng.liu@nokia-sbell.com": "柳元盛",
"xiaojun.a.hou@nokia-sbell.com": "侯文杰",
"xuebing.deng@nokia-sbell.com": "邓学兵",
"amy.zhang@nokia.com": "张璐",
"nicco.xue@nokia.com": "薛鹏",
"yongan.huang.ext@nokia.com": "黄永安",
"guang.zou@nokia.com": "邹广泰",
"xin.jia.ext@nokia-sbell.com": "贾鑫",
"dailiang.zhong@nokia-sbell.com": "钟代亮",
"jianguo.deng@nokia-sbell.com": "邓建国",
"chengdu.re@nokia-sbell.com": "罗仕斌",
"lan.kou@nokia-sbell.com": "寇兰",
"chengdu.re@nokia-sbell.com": "符群英",
"jack.deng@nokia-sbell.com": "邓光华",
"alina.fu@nokia-sbell.com": "付琪",
"chengdu.re@nokia-sbell.com": "张玉华",
"yun.hua@nokia-sbell.com": "华云",
"jun.a.luo@nokia-sbell.com": "罗钧",
"susan.sun@nokia-sbell.com": "孙志娟",
"jane.y.zhang@nokia-sbell.com": "张佳奕",
"longdong.li@nokia-sbell.com": "李隆东",
"leon.7.li@nokia-sbell.com": "李锡江",
"zhongka.yang@nokia.com": "杨中卡",
"michelle.pan@nokia-sbell.com": "潘佳异",
"lyne.he@nokia.com": "何莉",
"candy.tang@nokia.com": "唐颖",
"chengdu.re@nokia-sbell.com": "陈琴",
"chengdu.re@nokia-sbell.com": "李淑英",
"chengdu.re@nokia-sbell.com": "陈素琼",
"chengdu.re@nokia-sbell.com": "黄崇芳",
"ling.1.wan@nokia-sbell.com": "万灵",
"chengdu.re@nokia-sbell.com": "刘翠英",
"chengdu.re@nokia-sbell.com": "祝彬",
"chengdu.re@nokia-sbell.com": "刘翠珍",
"chengdu.re@nokia-sbell.com": "刘翠兰",
"jack.huang@nokia-sbell.com": "黄亭宇",
"chengdu.re@nokia-sbell.com": "江翠香",
"crystal.liu.ext@nokia-sbell.com": "刘意",
"chengdu.re@nokia-sbell.com": "邓明远",
"tai.wang@nokia.com": "王泰",
"liangwen.tang.ext@nokia-sbell.com": "唐靓雯",
"chengwei.chu@nokia-sbell.com": "楚成伟",
"xiaomei.ren@nokia-sbell.com": "任小梅",
"jian.11.li@nokia-sbell.com": "李建",
"chengdu.security.ext@nokia-sbell.com": "张俊凯",
"hongwei.kuang@nokia.com": "匡宏微",
"wenbiao.hao@nokia-sbell.com": "郝文飚",
"chengdu.security.ext@nokia-sbell.com": "卢德季",
"chengdu.security.ext@nokia-sbell.com": "张建",
"jiangtao.hou@nokia-sbell.com": "侯江涛",
"chengdu.security.ext@nokia-sbell.com": "杨安奇",
"chengdu.security.ext@nokia-sbell.com": "刘天宇",
"evan.jiang@nokia-sbell.com": "蒋波",
"chengdu.security.ext@nokia-sbell.com": "林琪景",
"chengdu.security.ext@nokia-sbell.com": "程锋",
"chengdu.security.ext@nokia-sbell.com": "陈敬诚",
"chuan.li@nokia-sbell.com": "李川",
"lynn.min@nokia-sbell.com": "闵琳",
"nianjie.yu.ext@nokia-sbell.com": "余年洁",
"lijuan.cheng@nokia-sbell.com": "程丽娟",
"david.guo@nokia-sbell.com": "郭从松",
"jian.9.zhang@nokia-sbell.com": "张建",
"xiang.zou@nokia-sbell.com": "邹翔",
"xia.zhang@nokia-sbell.com": "张霞",
"kun.zhang@nokia-sbell.com": "张琨",
"tong.1.wu.ext@nokia.com": "吴桐",
"belle.gu@nokia.com": "谷蓓",
"chunbo.liao@nokia-sbell.com": "廖春波",
"michael.xu@nokia.com": "许志凡",
"sasha.zhang@nokia-sbell.com": "张沙",
"jiahui.sun@nokia-sbell.com": "孙嘉辉",
"tingyong.li@nokia-sbell.com": "李廷勇",
"xiaofang.1.wang.ext@nokia.com": "王晓芳",
"jeffrey.li@nokia-sbell.com": "李华明",
"huijun.yang.ext@nokia-sbell.com": "杨惠钧",
"larry.liu@nokia-sbell.com": "刘远清",
"jilong.li.ext@nokia-sbell.com": "李继龙",
"quanfen.ding.ext@nokia-sbell.com": "丁全芬",
"yifan.1.yang@nokia-sbell.com": "杨一帆",
"yunqiang.feng@nokia-sbell.com": "俸云强",
"youyu.zhang@nokia-sbell.com": "张有余",
"haijun.1.chen@nokia-sbell.com": "陈海军",
"zhiwei.na@nokia-sbell.com": "那志伟",
"daisy.chen@nokia-sbell.com": "陈思",
"sophie.tang@nokia.com": "唐晓芬",
"shengshuai.zhou@nokia-sbell.com": "周生帅",
"jack.you@nokia.com": "游中军",
"zaiping.wang@nokia-sbell.com": "汪在平",
"claud.zhang@nokia.com": "张权昉",
"ross.li@nokia-sbell.com": "李成科",
"liang.a.wu@nokia-sbell.com": "吴量",
"maggie.fan@nokia.com": "樊艳",
"zhiwen.1.huang.ext@nokia-sbell.com": "黄志文",
"luffy.yang@nokia-sbell.com": "杨先彦",
"qi.9.wang@nokia-sbell.com": "王玘",
"zhongming.tang.ext@nokia-sbell.com": "唐忠铭",
"tony.gong@nokia-sbell.com": "龚文杰",
"larry.wu@nokia-sbell.com": "吴海霄",
"mi.zhou@nokia.com": " 周密",
"teresa.peng@nokia-sbell.com": "彭婷婷",
"sam.y.tan@nokia.com": "谭超源",
"yongxia.cai@nokia-sbell.com": "蔡永霞",
"mandy.zhu@nokia-sbell.com": "朱曼",
"cesc.yi@nokia-sbell.com": "易宗伟",
"roy.zhang@nokia-sbell.com": "章小龙",
"junrong.chen@nokia-sbell.com": "陈君荣",
"lusy.li@nokia-sbell.com": "李仕英",
"hua.sun@nokia-sbell.com": "孙华",
"jason.wu@nokia-sbell.com": "吴航海",
"xiaobo.chen@nokia-sbell.com": "陈孝波",
"qian.1.gao@nokia-sbell.com": "高谦",
"kevin.mi@nokia-sbell.com": "米运洪",
"chris.liu@nokia-sbell.com": "刘浏",
"ruojun.luo@nokia-sbell.com": "罗若筠",
"jing.ping@nokia-sbell.com": "平静",
"nancy.liu@nokia-sbell.com": "刘婷婷",
"shenghao.feng@nokia-sbell.com": "冯生浩",
"jing.3.chen.ext@nokia-sbell.com": "陈静",
"limin.1.yang.ext@nokia-sbell.com": "杨立民",
"yingxi.yao@nokia-sbell.com": "姚颖熹",
"ping.5.zhang@nokia-sbell.com": "张萍",
"chenchen.xie.ext@nokia-sbell.com": "谢辰晨",
"shengjun.hao@nokia-sbell.com": "郝胜钧",
"wei.2.wang.ext@nokia-sbell.com": "王伟",
"robby.zhang@nokia-sbell.com": "张勇",
"xinyu.1.zhao.ext@nokia-sbell.com": "赵鑫雨",
"zhenyou.guo.ext@nokia-sbell.com": "郭桢有",
"yanjie.zhao@nokia-sbell.com": " 赵燕杰",
"peter.huang@nokia-sbell.com": "黄培镇",
"young.1.yang@nokia.com": "杨洋",
"yi.lai@nokia-sbell.com": "赖毅",
"wei.3.huang.ext@nokia-sbell.com": "黄伟",
"bin.17.li@nokia-sbell.com": " 李斌",
"xiaoshu.zhang@nokia.com": "张晓书",
"yun.5.chen@nokia.com": "陈云",
"ran.tang.ext@nokia-sbell.com": "唐燃",
"xuming.cheng@nokia-sbell.com": "程绪明",
"xin.xiong.ext@nokia-sbell.com": "熊昕",
"wei.xia.ext@nokia-sbell.com": "夏伟",
"liang.tao.ext@nokia-sbell.com": "陶亮",
"yong.2.liu.ext@nokia-sbell.com": "刘勇",
"xiaojun.2.zhong.ext@nokia-sbell.com": "钟潇俊",
"qing.hu.ext@nokia-sbell.com": "胡情",
"hua.wang.ext@nokia-sbell.com": "王华",
"alex.xia@nokia-sbell.com": "夏良茂",
"xu.pan@nokia-sbell.com": "潘旭",
"liang.1.li.ext@nokia-sbell.com": "李亮",
"tian.yin@nokia-sbell.com": "尹甜",
"bing.3.zhang.ext@nokia-sbell.com": "张兵",
"peng.liu.ext@nokia-sbell.com": "刘鹏",
"xiaobo.feng.ext@nokia-sbell.com": "丰晓波",
"ke.zhong.ext@nokia-sbell.com": "钟科",
"chuan.1.li.ext@nokia-sbell.com": "李川",
"ziqiang.zhao.ext@nokia-sbell.com": "赵子强",
"tim.yu@nokia-sbell.com": "喻希",
"dan.cao.ext@nokia-sbell.com": "曹丹",
"di.zhou.ext@nokia-sbell.com": "周迪",
"he.peng@nokia-sbell.com": "彭贺",
"heather.hu@nokia-sbell.com": "胡琴",
"qiang.a.wang@nokia-sbell.com": "王强",
"yamei.wang@nokia-sbell.com": "王亚梅"
}

source_dir = "C:\\Users\\lixia\\Nokia\\Chengdu-nCov-2019 - Application Collection\\"
dest_dir = "C:\\temp\\cards\\"

def getParts(name):
    x = name.rfind(".")
    if x < 0:
        return ""
    ext = name[x:].lower()
    pre = name[:x].lower()
    return pre

counter = 0
for item in os.listdir(source_dir):
    email = getParts(item)
    if email.lower() in emailMap:
        counter = counter + 1
        newName = emailMap[email].strip() + "_" + item
        print(email, "=>", emailMap[email].strip(), newName)
        shutil.copyfile(source_dir + item, dest_dir + newName)

print ("the total number is " + str(counter))


fileName = "chEnchen.xie.ext@nokia-sbell.com.jpg"
pass