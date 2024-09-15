import React, { useEffect, useRef, useState, memo } from 'react'
import './IfYou.scss'

export default memo(function IfYou() {
    const [showDesc, setShowDesc] = useState(false);
    const ifText = useRef();

    useEffect(()=>{
        if(window.innerWidth >= 1000){
            window.addEventListener('scroll', largeSpread)
        }else{
            window.addEventListener('scroll', spread)
        }
    },[])

    function largeSpread(){
        if(!showDesc && window.scrollY > window.innerHeight * 6.9){        // 展示要求
            setShowDesc(true);
            window.removeEventListener('scroll', largeSpread);
        }
    }

    function spread(){
        if(!showDesc && ifText.current &&
             ifText.current.getBoundingClientRect().y < window.innerHeight * 0.6){        // 展示要求
            setShowDesc(true);
            window.removeEventListener('scroll', spread);
        }
    }
    return (
        <>
            <div className='if-you' ref={ifText}>
                <h2 className={showDesc ? 'if-text' : 'text'}>if you:</h2>
            </div>
            <div className='detail-text'>
                <span className={showDesc ? 'text-0 rand-font' : ''}>爱好于数学？</span>
                <span className={showDesc ? 'text-1 rand-font' : ''}>热衷于算法？</span>
                <span className={showDesc ? 'text-2 rand-font' : ''}>痴迷于人工智能？</span>
                <span className={showDesc ? 'text-3 rand-font' : ''}>对计算机技术着迷？</span>
                <span className={showDesc ? 'text-4 rand-font' : ''}>对数据信息处理感兴趣？</span>
                <span className={showDesc ? 'text-5 rand-font' : ''}>想用键盘绘制客户端上的艺术？</span>
                <span className={showDesc ? 'text-6 rand-font' : ''}>想成为客户端界面设计师？</span>
            </div>
            <div className='then'>
                <h2 className={showDesc ? 'then-text' : 'text'}>then</h2>
            </div>
        </>
    )
})
