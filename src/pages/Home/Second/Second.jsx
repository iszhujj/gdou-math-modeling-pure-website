import './Second.scss';
import Constitue from './Constitue/Constitue'
import Joinus from './Joinus/Joinus'
import Concentrate from './Concentrate/Concentrate'
import Honors from './Honors/Honors'

import React, { memo, useEffect, useState } from 'react'

export default memo(function Second() {
    const [render_honors, set_render_honors] = useState(<></>)

    // 数组求和
    function sum(arr){
        return arr.reduce((pre,cur,index)=>{
            return pre + cur;
        })
    }

    // 初始化背景图案
    function installPattern(){
        // 生成背景图案若干div
        let indexArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]
        let patternItems = []
        let hei = [0];
        let rand = Math.random;
        let colorArr = ['#ffd1dc','#ffffcc','#c5e1a5','#e0d1e8','#cfe7f8','#f2f2f2'];

        for(let i = 0 ; i < indexArr.length ; i ++){
            let widt = 140 + rand() * 80;
            let marginTop = sum(hei);
            let maxHeight = window.screen.height * 6

            if(marginTop > maxHeight) break; 

            // 随机设置圆的样式
            let style = {}
            style.width = `${widt}px`
            style.height = `${widt}px`
            style.position = 'absolute'
            style.top = ` ${marginTop + 0.45 * widt}px`
            style.opacity = '0.3'
            style.borderRadius = '50%'
            style[`${i % 2 === 0 ? 'left' : 'right'}`] = '-7%'

            if(i % 2 === 0){
                style.backgroundImage = `linear-gradient(to right top, ${colorArr[i % colorArr.length]},${colorArr[i % colorArr.length]}33)`
            }else{
                style.backgroundImage = `linear-gradient(to left bottom, ${colorArr[i % colorArr.length]},${colorArr[i % colorArr.length]}33)`
            }
            patternItems.push(style)
            hei.push(widt + 0.3 * widt);
        }
        return patternItems
    }

    useEffect(()=>{
        setTimeout(()=>{
            set_render_honors(<Honors />)
        }, 2000)
    },[])

    return (
        <div className='second-box'>
            <div className='bg-pattern-box'>
                {
                    installPattern().map((e,i)=>{
                        return <div className='bg-pattern' key={i} style={e}></div>
                    })
                }
            </div>
            {/* 团队组成 */}
            <Constitue />

            {/* 发展方向 */}
            <Concentrate />

            {/* 团队成就 */}
            {render_honors}

            {/* 加入我们 */}
            <Joinus />
        </div>
    )
})

