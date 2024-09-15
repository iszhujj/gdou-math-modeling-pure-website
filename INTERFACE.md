# teamWeb-Primary-Station

## 数据参考：

2022年招新推文：[https://mp.weixin.qq.com/s/b7ZP37DvUWwPLUvHBjCpBg](https://mp.weixin.qq.com/s/b7ZP37DvUWwPLUvHBjCpBg)

2023年招新推文：[https://mp.weixin.qq.com/s/96Zxm7lwOovNPw93jjtzHg](https://mp.weixin.qq.com/s/96Zxm7lwOovNPw93jjtzHg)

## 1、指导老师

当前三个

| 请求路径 | /leaderTeacher |
| ---- | -------------- |
| 请求方式 | GET            |
| 参数   | 无              |

```json
// 返回的data 每一项至少包含所列举的内容（下同）
[
    {
         teacherName:'李志',
         desc:'...',
         pictureURL:'http://xxxxx',
         introduce:'高亮显示的内容'
    },{}
]
```

## 2、底部内容——联系我们

一个头像 + 一个微信名片 为一组内容

这个是头像：

![1716557328772](image/interface/1716557328772.png)

这个是微信名片：

![1716557337373](image/interface/1716557337373.png)

| 请求路径 | /Bottom/contectUS |
| ---- | ----------------- |
| 请求方式 | GET               |
| 参数   | 无                 |

```json
// 三个或四个
data:[
    {
        defaultImg:'....',            // 默认的头像
        personalCode:'...',            // 微信名片二维码
   desc:'',// 名字
major:'计算机视觉'// 负责的方向
    }
]
```

## 3、底部内容——关注我们（GET）

微信公众号图标+团队公众号二维码（现在只有这一组）

返回二维码的地址，包括一个对象

| 请求地址 | /Bottom/attention |
| ---- | ----------------- |
| 请求方式 | GET               |
| 参数   | 无                 |

```json
data:[
{
defaultPic:'...',        // 微信公众号官方图片
     codeURL:'...'                // 微信公众号的地址
},{
// 以后或许有其他平台 微博、抖音等
}
]
```

## 4、轮播图

| 请求地址 | /slidePictures |
| ---- | -------------- |
| 请求方式 | GET            |
| 参数   | 无              |

```json
// 规定四张
data:[
    {
    url:'',
    desc:'团建干饭',//描述图片
    putTime:'2023-xx-xx'
    },{}
]
```

## 5、旋转3D honor wall

图片的大小规格会做规范。

### 5-1）横向图片

宽度大于高度的图片；横向图片要有7张（must）

| 请求地址 | /honorWall/horizontal |
| ---- | --------------------- |
| 请求方式 | GET                   |
| 参数   | 无                     |

```
data:[
'http://xxxx',
''
]
```

### 5-2）竖向图片

高度大于宽度的图片；竖向图片要有14张（also must）

| 请求地址 | /honorWall/vertiacl/:type |
| ---- | ------------------------- |
| 请求方式 | GET                       |
| 参数   | params参数：type ，取值：‘all’   |

```
data:[
'http://xxxx',
''
]
```

## 6、toYouFileContent

获取四种语言的表述：SQL、JavaScript、java、python

| 请求地址 | /toYouContent |
| ---- | ------------- |
| 请求方式 | GET           |
| 参数   | 无             |

```
data:{
"sql":"xxxx",
"py":"xxxxx",
"java":"xxx",
"js":"xxx"
}
```

### 数据：

#### SQL：

```sql
INSERT INTO gdou_Math_Modeling
SELECT * 
FROMfreshmenOfGDOU
WHERE ability >= @preeminent;
```

#### JavaScript：

```javascript
us.addEventListener('you coming', you => {
    us.pauseAllThingAndPrepare().then( us =>{
        us.toPickUp(you);
    });
});
```

#### Java：

```java
public interface ProsperousAndStrong {
    public void prosperousAndStrong();
}

class GDOU_Math_Modeling implements ProsperousAndStrong{
    ......
    public void prosperousAndStrong(){
        // wait you to finish with us.
    }
}
```

#### Python：

```python
try:
    if you.selectTeam != "GDOU-Math-Modeling":
        raise RegretForSelectedException
except RegretForSelectedException as opportunity:
    opportunity.selectAgain()
```

## 7、~~招新表单提交~~ 招新二维码

    ~~后端建表的时候加一项时间 datetime。前端表单传输不带时间，后端insert 的时候加上当前时间。~~

| 请求地址      | /recruitment-form                                                                                                                                                                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 请求方式      | post                                                                                                                                                                                                                                                                                                                            |
| 参数（红色为非空） | 1、  fullName—— 全名 <br />2、  gender —— 性别 <br />3、  stuClass—— 班级信息，如：土木1213 <br />4、  phoneNumber <br />5、  email <br />6、  weChatNumber <br />7、  seleDirection—— 选择的方向（建模与算法、人工智能、前端开发、后端开发、UI设计、尚未确定） <br />8、  selfEvaluation—— 自我评价 <br />9、  studySituation—— 目前的学习情况 <br />10、  holp —— 未来自我期望 <br />11、  elseSay—— 其他的话 |

招新二维码：

| 请求地址 | /gotoRegistImg |
| ---- | -------------- |
| 请求方式 | GET            |
| 参数   | 无              |

```
result:true,
data:{
    codeURL:'',        // 扫二维码码报名的图片地址
    startTime:'',       // 开始时间
    endTime:'',        // 结束时间
    uploadTime:''，     // 二维码上传时间
}
```

## 8、团队在校成员数量

返回当前在校的成员数量

若当前年份为Y，当前月份为M：

if M > 6 : { result = N+  ⋀ result ∈ [ y - 3, y - 1 ] }；

else : { result = N+  ⋀  result  ∈  [ y - 4, y - 1 ]}

| 请求地址 | /getCurrentNumber |
| ---- | ----------------- |
| 请求方式 | GET               |
| 参数   | 无                 |

```
data:{
currentNumber:100
}
```

## 9、各方向招新规则

方向：[ 建模与算法、人工智能、后端开发、前端开发、UI设计 ]

| 请求地址 | /join-rules |
| ---- | ----------- |
| 请求方式 | GET         |
| 参数   |             |

```
data:[            // 分五个方向，必须满足五个对象
    {
    direName:'建模与算法',
        receive:{// 表示今年在21级和22级中招新
"21":"1",// 表示预计招多少人
"22":"3个或以上"
},
        expect:"基本的期望，如：热爱数学，热衷于使用编程来解决实际问题",
        request:{// 最终考核时希望达到的条件
    "21":"熟练使用Python，对TensorFlow,keras,pytorch等框架有所了解",
            "22":"对Python能比较好地掌握，对数据处理和数据挖掘有一定的了解，熟悉掌握至少3个相关的算法，能使用简单的爬虫",
        }
},{

}
]
```

## 10、考核作品提交预验证

用于检验是否有报名，如果没有报名，则不允许提交

| 请求地址 | /ableToUpload                             |
| ---- | ----------------------------------------- |
| 请求方式 | post                                      |
| 请求体  | fullName—— 姓名stuClass—— 班级selDire —— 选择方向 |
| 请求头  |                                           |

比如提交的内容为：fullName:’张三‘，stuClass:'大气1234'，selDire:'UI设计'

```
result:true,
data:'UI设计二轮考核',
msg:'重复提交将覆盖上次提交文件'

result:false,
resCode:0// 0表示没有报名，不能提交；1表示距离上次提交时间不足五分钟；2表示需要根据msg提示用户；3表示重复该请求过多，阻止请求
msg:"UI设计二轮考核于2022年2月2日结束，三轮考核暂未开始，当前无提交选项"
```

测试专用数据

| 姓名  | 班级     | 邮箱         | 提交方向 | 考核轮次 |
| --- | ------ | ---------- | ---- | ---- |
| 张三  | 大气1234 | 123@qq.com | UI设计 | 二轮考核 |
| 李四  | 土木1222 | 321@qq.com | 前端开发 | 二轮考核 |
|     |        |            |      |      |

## 11、考核作品提交

| 请求地址 | /uploadTestZip                                                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 请求方式 | post                                                                                                                                         |
| 参数   | 请求体中包含一个file对象（zip文件）                                                                                                                        |
| 请求头  | upload-info：<br />fullName—— 姓名<br />stuClass—— 班级<br />email—— 邮箱<br />selDire—— 选择方向（数字）<br />round ——轮次（几轮考核，1、2、3、4）<br />fileName—— 文件名 |

```
result:true

```

## 12、建议与反馈

| 请求地址   | /feedback/feedback/rel-type/rel-value                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 请求方式   | post                                                                                                                                                      |
| 参数     | 请求体中包含图片文件files                                                                                                                                           |
| params | feedback建议或反馈的内容<br />rel-type联系对方的方式（Email、self-phone、wechat）<br />rel-value联系对方的值（对应的值）<br />其中feedback为必须，后两者可选，但有rel-type时就一定有rel-value，当为空时，用下划线占位表示 |

```
result:true

```

接收到建议与反馈后，将其存入数据库，同时直接使用SMTP发送给相关负责人的邮箱中。

## 13、获奖记录

| 请求地址 | /historyHonor |
| ---- | ------------- |
| 请求方式 | get           |
| 参数   |               |
| 请求头  |               |

```
result:true
data:[// 返回18条，按时间降序来排
{
        title:'什么什么比赛 什么什么奖（名次）',
        time:'年-月-日',
        url:''
},{}
]
```

## 14、返回全部图片

| 请求地址 | /returnAllHonor |
| ---- | --------------- |
| 请求方式 | get             |
| 参数   |                 |
| 请求头  |                 |

```
result:true
data:[{
'http://xxxx',
},{}
]
```

## 15、获取用户信息专用

| 请求地址 | /sendInfo                                       |
| ---- | ----------------------------------------------- |
| 请求方式 | post                                            |
| 参数   |                                                 |
| 请求头  |                                                 |
| 请求体  | screenWidth:设备宽度screenHeight:设备高度userAgent:设备信息 |

```
result:''// 不在乎返回值
```
