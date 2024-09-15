import React, { useEffect, useState } from 'react'
import './Home.scss'

import First from './First/First'
import Second from './Second/Second'
import Footer from './Footer/Footer'

import LeaderTeacher from './Second/Constitue/LeaderTeacher/LeaderTeacher'
import Students from './Second/Constitue/Students/Students'
import Concentrate from './Second/Concentrate/Concentrate'
import ScrapeArea from './Second/Honors/ScrapeArea/ScrapeArea'
import { HistoryHonor } from './Second/Honors/historyHonor/HistoryHonor'
import Joinus from './Second/Joinus/Joinus'
import { subscribe, unsubscribe } from 'pubsub-js'

export default function Home() {
    const [upcard, setUpcard] = useState(window.innerWidth >= 1000)
    const [loaded, setLoaded] =useState(false)
    const [renderHonor,setRenderHonor] = useState(<></>)

    function resizeHandle(){
        if (window.innerWidth < 1000 && upcard) {  
            setUpcard(false);  
        } else if (window.innerWidth >= 1000 && !upcard) {  
            setUpcard(true);  
        }
    }

    // 控制页面滚动的效果；使用粘滞布局时，发现粘滞布局不能很好地兼容某些浏览器
    function upcardScroll(e, pages, hei){
        let scrollY = window.scrollY
        var endHeight = pages[6].offsetHeight;

        // 更改页面的样式
        function setPageTransform(transform, ...args){
            args.forEach(i => {pages[i].style.transform = transform})
        }

        if(scrollY <= hei *1.1){
            setPageTransform(`translate(0, -${scrollY}px)`, 0)
            setPageTransform(`translate(0, 0)`, 1, 2, 3, 4)
            setPageTransform(`translate(0, 100vh)`, 5, 6)
        }
        // LeaderTeacher
        else if(scrollY > hei *1.1 && scrollY <= hei * 2.2){
            setPageTransform(`translate(0, -101vh)`, 0)
            setPageTransform(`translate(0, -${scrollY - hei * 1.1}px)`, 1)
            setPageTransform(`translate(0, 0)`, 2, 3, 4)
            setPageTransform(`translate(0, 100vh)`, 5, 6)
        }
        // Students
        else if(scrollY > hei *2.2 && scrollY <= hei * 3.3){
            setPageTransform(`translate(0, -101vh)`, 0, 1)
            setPageTransform(`translate(-${(scrollY - hei * 2.2)/hei * 100}vw, 0)`, 2)
            setPageTransform(`translate(0, 0)`, 3, 4)
            setPageTransform(`translate(0, 100vh)`, 5, 6)
        }
        // Concentrate
        else if(scrollY > hei *3.3 && scrollY <= hei * 4.4){
            setPageTransform(`translate(0, -101vh)`, 0, 1, 2)
            setPageTransform(`translate(${(scrollY - hei * 3.3)/hei * 100}vw, 0)`, 3)
            setPageTransform(`translate(0, 0)`, 4)
            setPageTransform(`translate(0, 100vh)`, 5, 6)
        }
        // ScrapeArea
        else if(scrollY > hei *4.4 && scrollY <= hei * 5.5){
            setPageTransform(`translate(0, -101vh)`, 0, 1, 2, 3)
            setPageTransform(`translate(0, 0)`, 4)
            setPageTransform(`translate(0, ${(scrollY - hei * 4.4) / hei > 1 ? 0 : hei - (scrollY - hei * 4.4)}px)`, 5)
            setPageTransform(`translate(0, 100vh)`, 6)
        }
        else if(scrollY > hei *5.5 && scrollY <= hei * 6.6){
            setPageTransform(`translate(0, -101vh)`, 0, 1, 2, 3, 4)
            setPageTransform(`translate(0, -${scrollY - hei * 5.5}px)`, 5)
            setPageTransform(`translate(0, 0)`, 6)
        }
        else if(scrollY > hei *6.6 && scrollY - hei * 6.6 < endHeight){
            setPageTransform(`translate(0, -101vh)`, 0, 1, 2, 3, 4)
            setPageTransform(`translate(0, -201vh)`, 5)
            setPageTransform(`translate(0, calc(-${
                scrollY - hei * 6.6 > 3600 ? hei - endHeight : 
                (endHeight - hei) / (3600 - hei) * (scrollY - hei * 6.6)
            }px))`, 6)
        }
    }    

    useEffect(()=>{
        window.scroll({ top: 0, left: 0, behavior: 'smooth' }); // 滚动回顶部  
        window.addEventListener('resize', ()=>resizeHandle());
        return ()=> window.removeEventListener('resize', resizeHandle)
    },[window.innerWidth])

    useEffect(()=>{
        if(upcard || parseInt(window.innerWidth) >= 1000){
            let pages = document.querySelectorAll('.page')
            let hei = window.innerHeight
            window.addEventListener('scroll',e => upcardScroll(e, pages, hei))
        }else{
            window.removeEventListener('scroll', upcardScroll)
        }
    },[upcard])

    useEffect(()=>{
        // loading 完成
        subscribe('loadFinish',()=>{
            setLoaded(true)
        })
        // 等待几秒之后再渲染荣誉墙
        setTimeout(() => {
            if(parseInt(window.innerWidth) >= 1000 || upcard){
                setRenderHonor(<ScrapeArea/>)
            }
        }, 2000);
        return ()=>{
            unsubscribe('loadFinish')
        }
    })

    return (parseInt(window.innerWidth) >= 1000 || upcard) ? (
        <>
            <div className='container' style={loaded ? {} : {'height':'100vh', overflow:'hidder'}}>
                <div className='main'>
                    <div className='page' style={{zIndex:'10'}}><First/></div>
                    <div className='page' style={{zIndex:'9'}}><LeaderTeacher style_={{height:'100vh'}} /></div>
                    <div className='page' style={{zIndex:'8'}}><Students/></div>
                    <div className='page' style={{zIndex:'7'}}><Concentrate /></div>
                    <div className='page' style={{zIndex:'3'}}>
                        {renderHonor}
                    </div>
                    <div className='page' style={{zIndex:'5'}}><HistoryHonor /></div>
                    <div className='page page-end' style={{zIndex:'4'}}>
                        <Joinus />
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    ) : (
        <>
            <First/>
            <Second/>
            <Footer/>
        </>
    )
}

