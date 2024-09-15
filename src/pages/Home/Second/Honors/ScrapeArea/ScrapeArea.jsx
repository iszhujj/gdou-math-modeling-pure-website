import React, { memo, useEffect, useRef, useState } from 'react'
import '../Honors.scss'

// import HonorBall from '../HonorBall/HonorBall'
import HonorWall from './HonorWall/HonorWall'

const ScrapeArea = memo((props)=> {
    const canvas = useRef()
    const [wid,setWid] = useState(window.innerWidth)
    const [hei,setHei] = useState(window.innerHeight)

    function initCanvas(){
        let pencil = canvas.current.getContext('2d')
        let defaultFillStyle = 'rgb(30, 30, 30)'
        let defaultGlobalAlpha = 0.9
        pencil.globalAlpha = defaultGlobalAlpha
        pencil.fillStyle = defaultFillStyle

        pencil.fillRect(0, 0, wid, hei)

        var x,y;
        var radius = 150;

        canvas.current.addEventListener('mousemove',(e)=>{
            x = e.offsetX;
            y = e.offsetY;

            pencil.beginPath();
            pencil.clearRect(0, 0, wid, hei)
            // pencil.globalCompositeOperation = 'source-over'
            pencil.fillStyle = '#ffffff'
            pencil.arc(x, y, radius, 0, Math.PI * 2)
            pencil.fill()
            pencil.closePath() 

            // pencil.beginPath()
            // pencil.globalCompositeOperation = 'source-over'
            // pencil.arc(x, y, radius + 40, 0, Math.PI * 2);
            // let crl = pencil.createRadialGradient(x, y, 0, x, y, radius + 40);     
            // crl.addColorStop(0, 'rgba(255, 255, 255, 0)');
            // crl.addColorStop(1, 'rgb(30, 30, 30, 0.5)');
            // pencil.fillStyle = crl;
            // pencil.fill()
            // pencil.closePath()

            pencil.beginPath();
            pencil.globalCompositeOperation = 'source-out'
            pencil.globalAlpha = defaultGlobalAlpha
            pencil.fillStyle = defaultFillStyle
            pencil.fillRect(0, 0, wid, hei)
            pencil.closePath()
        })
        canvas.current.addEventListener('mouseleave',(e)=>{             // 鼠标移除区域后把光圈弄掉
            pencil.beginPath();
            pencil.clearRect(0, 0, wid, hei)
            pencil.globalCompositeOperation = 'source-over'
            pencil.fillStyle = defaultFillStyle
            pencil.fillRect(0, 0, wid, hei)
            pencil.closePath()
        })
    }

    function resizeHandle(willResize, st){
        if(willResize){
            clearTimeout(st)
            st = setTimeout(()=>{
                setWid(window.innerWidth)
                willResize = false
            },300)
            return
        }else{
            willResize = true;
            st = setTimeout(()=>{
                setWid(window.innerWidth)
                willResize = false
            },300)
        }
    }

    useEffect(()=>{
        // console.log('init')
        initCanvas()

        // 以下代码用来优化窗口大小改变时的重新渲染问题，圆环卡顿
        var willResize = false;
        var st;
        window.addEventListener('resize',() => resizeHandle(willResize, st))

        return () => window.removeEventListener('resize', resizeHandle)
    },[window.innerWidth])

    return (
        <div className='honors-box'>
            <div className='top-area'>
                <div className='left-title'>
                    <p>近年的成果</p>
                </div>
                {/* <div className='right-imgs'>
                    <HonorBall />
                </div> */}
                <HonorWall />
            </div>
            <canvas style={{minWidth:`${hei}px`}}
                id='outer-canvas' ref={canvas} width={wid} height={hei}
            ></canvas>
        </div>
    )
})

export default ScrapeArea
