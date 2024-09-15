import React, { useEffect, useRef, useState, memo} from 'react'
import './Scrape.scss'

import { isDesktop } from '../../utils/funcs'

const Scrape = memo((props) => {
    let {src} = props
    if(!src) src = '/static/kulumi.jpg'
    const can = useRef()
    const [wid, setWid] = useState(Math.min(window.screen.width * 0.65, 500))

    var ableToScrape = false
    var pencil;

    function resizeHandle(){
        let width = Math.min(window.screen.width * 0.65, 500)
        if(width <= 500){
            setWid(Math.min(window.screen.width * 0.65, 500))
        }
    }

    useEffect(()=>{
        window.addEventListener('resize', ()=> resizeHandle() )
        return ()=> window.removeEventListener('resize', resizeHandle)
    },[wid])

    function notDesktopScroll(canvas){
        if(canvas.getBoundingClientRect().y < window.innerHeight * 0.6){
            drawCanvas(canvas)
            window.removeEventListener('resize', notDesktopScroll)
        }
    }
    const canvasPonits = [
        [0.0, 0.09],
        [0.42, 0.0],[0.0, 0.25],
        [0.64, 0.0],[0.0, 0.43],
        [0.78, 0.0],[0.0, 0.61],
        [0.89, 0.0],[0.0, 0.85],
        [1, 0.0],[0.0, 0.97],
        [1, 0.19],[0.1, 1],
        [1, 0.38],[0.34, 1],
        [1, 0.69],[0.67, 1],
        [1, 0.93],[0.86, 1],
        [1, 1]
    ];
    function fullDefaultColor(canvas){
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        let brush = canvas.getContext('2d');
        brush.clearRect(0, 0, canvasWidth, canvasHeight)
        brush.fillStyle = '#eee'
        brush.fillRect(0, 0, canvasWidth, canvasHeight)
    }
    function drawCanvas(canvas){
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        let brush = canvas.getContext('2d');
        brush.globalCompositeOperation = 'destination-out';      // 设置图形重叠的方式
        brush.lineWidth = 60;
        brush.lineCap = 'round';
        brush.lineJoin = 'round';

        let i = 0;

        // 绘图
        let interval_A = setInterval(()=>{
            if(i < canvasPonits.length){
                let x = canvasWidth * canvasPonits[i][0];
                let y = canvasHeight * canvasPonits[i][1];
                brush.lineTo(x, y);
                brush.stroke();
                i ++;
            }else{
                // 清除当前的定时器
                brush.clearRect(0, 0, canvasWidth, canvasHeight)
                clearInterval(interval_A);
            }
        },50);
    }

    useEffect(()=>{
        let canvas = can.current
        canvas.width = wid
        canvas.height = wid

        if(isDesktop()){
            pencil = canvas.getContext('2d')
            pencil.fillStyle = '#eee'
            pencil.fillRect(0, 0, wid, wid)
    
            canvas.addEventListener('mousedown',() => setAbleToScrape())
            canvas.addEventListener('touchstart',(e) => {e.preventDefault();setAbleToScrape()})
    
            canvas.addEventListener('mousemove',e => scarping(e))
            canvas.addEventListener('touchmove',e => {e.preventDefault();scarping(e)})
    
            canvas.addEventListener('mouseup',() => setUnableToScrape())
            canvas.addEventListener('touchup',e => {e.preventDefault();setUnableToScrape()})
    
            canvas.addEventListener('mouseout',() => setUnableToScrape())
            canvas.addEventListener('touchout',e => {e.preventDefault();setUnableToScrape()})
        }else{
            fullDefaultColor(canvas);                // 先填充
            window.addEventListener('scroll', ()=> notDesktopScroll(canvas))
        }
    },[])

    function scarping(e){
        if(ableToScrape){
            pencil.globalCompositeOperation = 'destination-out';      // 设置图形重叠的方式
            pencil.beginPath();
            pencil.moveTo(e.offsetX, e.offsetY);
            pencil.arc(e.offsetX, e.offsetY, 35, 0, Math.PI * 2, true)
            pencil.fill();
            pencil.closePath();
        }
    }
    function setUnableToScrape(){if(ableToScrape){ableToScrape = false}}
    function setAbleToScrape(){if(!ableToScrape){ableToScrape = true}}

    return props.src ? (
        <div className='scrape-container'>
            <canvas ref={can} className='scrape-canvas'></canvas>
            <img className='code-img' src={src}/>
        </div>
    ):(
        <div className='scrape-container'>
            <canvas ref={can} className='scrape-canvas'></canvas>
            <div className='no-img'>
                <img src={src}/>
                <p> 抱歉！出错了 </p>
            </div>
        </div>
    )
})

export default Scrape