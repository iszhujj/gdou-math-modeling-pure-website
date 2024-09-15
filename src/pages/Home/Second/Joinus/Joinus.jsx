import React, { useState, useRef, memo } from 'react'
import './Joinus.scss'

import Code from './Code/Code';
import Attract from './Attract/Attract';
import IfYou from './IfYou/IfYou';
import More from './More/More';
import Scrape from '../../../../components/Scrape/Scrape';

// gotoRegistImg 用于请求招新报名二维码
// import { gotoRegistImg } from '../../../../utils/request';
import { isDesktop } from '../../../../utils/funcs';

export default memo(function Joinus() {
    // 招新报名二维码
    const [registData, setRegistData] = useState({})

    const joinUs = useRef(null)

    const colors = [
        'linear-gradient(220.55deg, #FFDC99 0%, #FF62C0 100%)',
        'linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)',
        'linear-gradient(220.55deg, #8A88FB 0%, #D079EE 100%)',
        'linear-gradient(220.55deg, #FFEAF6 0%, #FF9DE4 100%)',
        'linear-gradient(220.55deg, #FFDC99 0%, #FF62C0 100%)',
        'linear-gradient(220.55deg, #DDE4FF 0%, #8DA2EE 100%)',
        'linear-gradient(220.55deg, #B7DCFF 0%, #FFA4F6 100%)'
    ]

    let is_desktop = isDesktop()

    return (
        <div className='joinus-box' ref={joinUs}>
            <Attract />
            <Code />
            <div className='condition'>
                <IfYou />
                <div className='collection'>
                    <p>犹豫什么呢 ？</p>
                    <p>快来加入我们吧 ！</p>
                    <img className='point-to' src="/static/icons/pointTo.png" alt="" />

                    {
                        (registData.codeUrl) ? (
                            // 刮刮卡
                            <Scrape src={registData.codeUrl} class_name='regist-img'/>
                        ) : (   // 如果没有二维码则显示出错的图片
                            <Scrape src={''} class_name='regist-img'/>
                        )
                    }
                    
                    {/* 如果是pc端，则可以提交考核作品 */}
                    {
                        is_desktop ? (
                            <div className='upload-work'>
                                <More></More>
                            </div>
                        ):''
                    }
                </div>
            </div>
            <div className='circle-box'>
                {
                    [1,2,3,4,5].map((e)=>{
                        let heigh = 2000 / 6;
                        let vw = window.screen.width / 100
                        let num = Math.floor(Math.random() * (25 - 15)) + 35
                        return <img style={{
                            height:`${num}vw`,
                            width:`${num}vw`,
                            left: e % 2 === 0 ? '-5%': '',
                            right: e % 2 !== 0 ? '-5%' : '',
                            top:(e - 1) * (heigh + 15) + 'px',
                            opacity:0.1,
                            background:colors[e]
                        }} className='circle' key={e}/>
                    })
                }
            </div>
        </div>
    )
})

