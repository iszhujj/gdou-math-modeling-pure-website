// 需要在使用文件中将路径定位到 public/static/verify + 返回的图片路径

const select = ['上方', '下方', '左侧', '右侧']
const selectTwo = ['左上方','左下方','右上方','右下方']

// 西北区
const northwest = {
    src:'/northwest.jpg',
    questionAndAnswer:[
        {
            question:['海情','海意'],               // 【A,B】
            answer:['下方','上方']                  // A位于B的[0];B位于A的[1]
        },{
            question:['海蓝','海湛'],
            answer:['上方','下方']
        },{
            question:['海怀','西区快递站'],
            answer:['上方','下方']
        },{
            question:['海思','西区快递站'],
            answer:['上方','下方']
        },
    ]
}
// 海洋广场
const haiyangguangchang = {
    src:'/haiyangguangchang.jpg',
    questionAndAnswer:[
        {
            question:['广学楼','钟海楼'],
            answer:['下方','上方']
        },{
            question:['图书馆','兴海楼'],
            answer:['上方','下方']
        },{
            question:['兴海楼','兴农楼'],
            answer:['右侧','右侧']
        },{
            question:['海洋广场','广学楼'],
            answer:['下方','上方']
        },
    ]
}
// 海园
const haiyuan = {
    src: '/haiyuan.jpg',
    questionAndAnswer:[
        {
            question:['西区运动场','海园'],
            answer:['左侧','右侧']
        },{
            question:['门诊部','海园'],
            answer:['右侧','左侧']
        },{
            question:['海云','西区运动场'],
            answer:['下方','上方']
        },{
            question:['海沁','海念'],
            answer:['右侧','左侧']
        },{
            question:['门诊部','海风'],
            answer:['上方','下方']
        },
    ]
}
// 蝴蝶湖
const hudiehu = {
    src: '/hudiehu.jpg',
    questionAndAnswer:[
        {
            question:['蝴蝶湖','海研'],
            answer:['右侧','左侧']
        },{
            question:['海研','海洋广场'],
            answer:['左下方','右上方'],
            select:selectTwo
        },{
            question:['水生博物馆','行政楼'],
            answer:['左侧','右侧']
        },{
            question:['兴农楼','兴教楼'],
            answer:['左上方','右下方'],
            select:selectTwo
        },{
            question:['蝴蝶湖','广学楼'],
            answer:['下方','上方']
        }
    ]
}
// 学生活动中心
const studentactivities = {
    src: '/studentactivities.jpg',
    questionAndAnswer:[
        {
            question:['海创楼','海怡'],
            answer:['左侧','右侧']
        },{
            question:['明德楼','博文楼'],
            answer:['右侧','左侧']
        },{
            question:['西区快递站','艺海楼'],
            answer:['上方','下方']
        },{
            question:['学生活动中心','艺海楼'],
            answer:['上方','下方']
        },
    ]
}
// 体育馆
const tiyuguan = {
    src: '/tiyuguan.jpg',
    questionAndAnswer:[
        {
            question:['图书馆','海韵'],
            answer:['左侧','右侧']
        },{
            question:['游泳池','水产楼'],
            answer:['下方','上方']
        },{
            question:['网球场','商业中心'],
            answer:['左下方','右上方'],
            select:selectTwo
        },{
            question:['商业中心','体育馆'],
            answer:['下方','上方']
        },{
            question:['游泳池','水产楼'],
            answer:['下方','上方']
        },{
            question:['南苑食苑','学工楼'],
            answer:['左下方','右上方'],
            select:selectTwo
        },{
            question:['图书馆','网球场'],
            answer:['左上方','右下方'],
            select:selectTwo
        },
    ]
}
// 望海楼
const wanghailou = {
    src: '/wanghailou.jpg',
    questionAndAnswer:[
        {
            question:['望海楼','图海楼'],
            answer:['右上方','左下方'],
            select:selectTwo
        },{
            question:['工程训练中心','林果楼'],
            answer:['右下方','左上方'],
            select:selectTwo
        },{
            question:['望海楼','工程训练中心'],
            answer:['左侧','右侧'],
        },{
            question:['海宁','海安'],
            answer:['左侧','右侧'],
        },
    ]
}

const sliceImg = [
    northwest,haiyangguangchang,haiyuan,hudiehu,studentactivities,tiyuguan,wanghailou
]

// 基本方位辨别验证
const orientation = ()=>{
    let index = Math.floor(Math.random() * 7)
    let target = sliceImg[index]
    let targetQuestionIndex = Math.floor(Math.random() * target.questionAndAnswer.length)
    // 问题数组和答案数组的对应选择
    let questionEle = target.questionAndAnswer[targetQuestionIndex].question
    let answerEle = target.questionAndAnswer[targetQuestionIndex].answer
    let reverse = Math.random() < 0.5
    if(reverse){
        questionEle = questionEle.reverse()
        answerEle = answerEle.reverse()
    }
    // 是否翻转选择数组
    let selectArr = target.questionAndAnswer[targetQuestionIndex].select || select
    let reverseSelectArr = Math.random() < 0.5
    if(reverseSelectArr){
        selectArr = selectArr.reverse()
    }
    return {
        targetImg:target.src,
        selectArr:selectArr,
        question:<><strong>{questionEle[0]}</strong>位于<strong>{questionEle[1]}</strong>的:</>,
        answer:answerEle[0]
    }
}

// 识别建筑物或场景
const recognizeImg = {
    question:'图中的建筑或场景为：',
    data:[{
        src:`/places/gate.jpg`,
        answer:'南门',
        select:['南门','西门','北门','东门']
    },{
        src:`/places/guangxuelou.jpg`,
        answer:'广学楼',
        select:['图海楼','广学楼','兴教楼','钟海楼']
    },{
        src:`/places/guangxuelou2.jpg`,
        answer:'广学楼',
        select:['美术楼','图海楼','望海楼','广学楼']
    },{
        src:`/places/guangxuelou3.jpg`,
        answer:'广学楼',
        select:['文科楼','兴农楼','蝴蝶楼','广学楼']
    },{
        src:`/places/hudiehu.jpg`,
        answer:'蝴蝶湖',
        select:['比翼湖','蝴蝶湖','燕雀湖','湖光湖']
    },{
        src:`/places/tiyuguan.jpg`,
        answer:'体育馆',
        select:['图书馆','文体楼','体育馆','艺体楼']
    },{
        src:`/places/tuhailou.jpg`,
        answer:'图海楼',
        select:['广学楼','兴教楼','图海楼','钟海楼']
    },{
        src:`/places/tuhailou2.jpg`,
        answer:'图海楼',
        select:['兴农楼','水产楼','图海楼','广学楼']
    },{
        src:`/places/tushuguan.jpg`,
        answer:'图书馆',
        select:['科技馆','图书馆','水生博物馆','海洋馆']
    },{
        src:`/places/xihu.jpg`,
        answer:'西湖',
        select:['南湖','北湖','东湖','西湖']
    },{
        src:`/places/yishulou.jpg`,
        answer:'艺术楼',
        select:['艺术楼','舞蹈楼','科教楼','综合楼']
    },{
        src:`/places/yishulou2.jpg`,
        answer:'艺术楼',
        select:['西海楼','艺术楼','美术楼','综合楼']
    },{
        src:`/places/zhonghailou.jpg`,
        answer:'钟海楼',
        select:['广学楼','美术楼','钟海楼','兴教楼']
    },{
        src:`/places/zhonghailou2.jpg`,
        answer:'钟海楼',
        select:['综合楼','钟海楼','兴教楼','图海楼']
    },{
        src:`/places/zhonghailou3.jpg`,
        answer:'钟海楼',
        select:['望海楼','钟海楼','明德楼','兴教楼']
    }]
}

// 打乱选项数组
const messSelectArr = (arr) => {
    let i = Math.floor(Math.random() * 4)
    let j = Math.floor(Math.random() * 4)
    if(i !== j){
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    let continue_ = Math.random() > 0.5
    if(continue_){
        return messSelectArr(arr)
    }else{
        return arr
    }
}

const placesVerify = () =>{
    let index = Math.floor(Math.random() * recognizeImg.data.length)
    let _select = messSelectArr(recognizeImg.data[index].select)
    return {
        targetImg:recognizeImg.data[index].src,
        selectArr:_select,
        question:recognizeImg.question,
        answer:recognizeImg.data[index].answer
    }
}

// 两种都要 随机
export const _verify_ = () => {
    return Math.random() < 0.3 ? placesVerify() : orientation()
}

// 只要地图方位识别
export const onlyMapVerify = () => {
    return orientation()
}

