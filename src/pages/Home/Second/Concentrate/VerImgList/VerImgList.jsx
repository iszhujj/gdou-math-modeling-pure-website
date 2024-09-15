import React, { useEffect, useRef, useState,memo } from 'react'
import './VerImgList.scss'

export default memo(function VerImgList() {
    const imgBox = useRef();
    const [widLarge, setWidLarge] = useState(window.innerWidth >= 1000)         // 控制更新

    // 各方向的描述 这里直接写死了
    const directionDesc = [
        {
            title:'计算机视觉',
            content:`
            计算机视觉是一种模拟人类视觉系统的技术，通过计算机算法和图像处理技术，
            使计算机能够理解和解释图像或视频中的内容。它涉及图像获取、图像处理、
            图像分析和图像识别等方面的技术，可以用于目标检测、人脸识别、图像分类、
            图像分割、运动跟踪等应用领域。计算机视觉的目标是使计算机能够从图像或
            视频中获取有用的信息，并进行自动化的决策和处理。
            `,
        },{
            title:'数据挖掘',
            content:`
            数据挖掘是一种从大量数据中发现模式、关联和隐藏信息的过程。它是通过应
            用统计学、机器学习和数据库技术来分析大规模数据集，以提取有用的信息和
            知识。数据挖掘可以帮助企业和组织发现潜在的商业机会、改善决策过程、优
            化运营和提高效率。它可以应用于各种领域，如市场营销、金融、医疗保健、社
            交媒体分析等。数据挖掘的主要任务包括分类、聚类、关联规则挖掘、异常检测
            和预测建模等。
            `,
        },{
            title:'运筹优化',
            content:`
            运筹优化（Operations Research，简称OR）是一门研究如何通过数学建模和
            优化方法来解决实际问题的学科。它主要关注如何在有限资源下，通过合理的决策
            和规划，最大化或最小化某个目标函数。运筹优化的核心思想是将实际问题抽象为
            数学模型，并利用数学方法进行求解。它涉及到多个学科领域，如数学、计算机科学
            、经济学、管理学等，常用的数学方法包括线性规划、整数规划、动态规划、图论等。
            `
        },{
            title:'UI设计',
            content:`
                UI设计主要责任是实现软件的人机交互、操作逻辑、界面美观的整体设计。
                范围包括高级网页设计、移动应用界面设计，还涉及到手机应用产品设计、
                游戏软件、多媒体制作、广告设计、商业流通等领域。UI设计可以分为实体ui和虚拟ui，
                移动互联网中经常使用的UI设计是虚拟UI。好的UI设计不仅让软件看起来具有个性和有品位，
                还让软件的实际操作变得舒适简单、自由，充分体现软件的定位和特点。
            `,
        },{
            title:'后端开发',
            content:`
                后端开发，也可以称为服务器端开发，是对用户看不到的程序后端部分的开发，
                负责处理前端的请求，进行逻辑处理和数据交互。
                后端开发需要考虑底层业务逻辑的实现、数据的保存与读取、平台的稳定性和性能等
                需要掌握大量的专业知识和技能,除后端开发语言、计算机基础、数据库，网络安全外
                还需要掌握Linux系统、网络编程、分布式、设计模式、高并发等方面的知识。
            `,
        },{
            title:'前端开发',
            content:`
                前端开发是创建WEB页面或APP等前端界面呈现给用户的过程，通过HTML，
                CSS及JavaScript以及由这三者衍生出来的各种技术、框架、解决方案等，
                来实现互联网产品的用户界面交互。前端技术包括若干个部分：前端美工、
                浏览器兼容、CSS、HTML“传统”技术与Adobe AIR、Google Gears,
                以及概念性较强的交互式设计，艺术性较强的视觉设计等。
            `,
        },
    ]
    const imgarr = ['computer-vision','DM','OR','ui','back','forward'];
    const imgElems = imgarr.map((e,index,arr)=>{
        return (
            <div key={index} className="item">
                <img src={`/static/concentrate/${imgarr[index]}.png`} alt={directionDesc[index].title}/>
                <div className="text-content">
                    <h2>{directionDesc[index].title}</h2>
                    <p>{directionDesc[index].content}</p>
                </div>
            </div>
        )
    })

    function showList(){
        if(imgBox && window.scrollY > window.innerHeight * 2.4){
            let itemArr = document.getElementsByClassName('item');
            let i = 0;
            const showItemTimer = setInterval(()=>{
                itemArr[i].classList.add("item-show");
                i++;
                if(i >= itemArr.length){
                    clearInterval(showItemTimer);
                }
            },40);
            window.removeEventListener('scroll', showList);
        }
    }

    function largeShowList(){
        if(imgBox && window.scrollY > window.innerHeight * 2.8){
            let itemArr = document.getElementsByClassName('item');
            let i = 0;
            const showItemTimer = setInterval(()=>{
                itemArr[i].classList.add("item-show");
                i++;
                if(i >= itemArr.length){
                    clearInterval(showItemTimer);
                }
            },40);
            window.removeEventListener('scroll', largeShowList);
        }
    }

    // function largeShowList(){
    //     if(imgBox && window.scrollY > window.innerHeight * 2.8){
    //         let itemArr = document.getElementsByClassName('item');
    //         let i = 0;

                // 太快了，整齐一排
    //         (function showItemTimer(){
    //             itemArr[i].classList.add("item-show");
    //             i++;
    //             if(i < itemArr.length){
    //                 requestAnimationFrame(showItemTimer)
    //             }
    //         })()
    //     }
    // }

    function resizeLinstener(){
        if(widLarge && window.innerWidth < 1000){
            setWidLarge(false)
        }else if(!widLarge && widLarge.innerWidth >= 1000){
            setWidLarge(true)
        }
    }

    useEffect(()=>{
        if(window.innerWidth > 1000){
            window.addEventListener('scroll',largeShowList)
        }else{
            window.addEventListener('scroll',showList)
        }
        window.addEventListener('resize',resizeLinstener)
        return ()=>{
            window.removeEventListener('resize', resizeLinstener)
        }
    },[])

    return (
        <div className="outest-directions" ref={imgBox}>
            <div className="box">
                <div className="items">
                    {imgElems}
                </div>
            </div>
        </div>
    )
})
