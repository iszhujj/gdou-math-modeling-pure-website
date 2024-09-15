import React, { useEffect, useRef, useState, memo } from 'react'
import './Attract.scss'

export default memo(function Attract() {
    const [showTitle, setShowTitle] = useState(false);
    const topText = useRef();

    function attractSpread(){
        if(!showTitle && topText.current &&
             topText.current.getBoundingClientRect().y < window.innerHeight * 0.6){
            setShowTitle(true);
            window.removeEventListener('scroll', attractSpread);
        }
    }

    function largeAttractSpread(){
        if(!showTitle && window.scrollY >= window.innerHeight * 6.5){
            setShowTitle(true);
            window.removeEventListener('scroll', attractSpread);
        }
    }

    useEffect(()=>{
        if(window.innerWidth >= 1000){
            window.addEventListener('scroll', largeAttractSpread);
        }else{
            window.addEventListener('scroll', attractSpread);
        }
    },[])

    return (
        <div className='top-text' ref={topText}>
            <h2 className={showTitle ? 'top-text-h' : ''}>Yes,</h2>
            <h2 className={showTitle ? 'top-text-h' : ''}>Everything we showing</h2>
            <h2 className={showTitle ? 'top-text-h' : ''}>is designed to</h2>
            <h2 className={showTitle ? 'top-text-h' : ''}>attract you !</h2>
            <h1 className={showTitle ? 'top-text-h' : ''}>
                <span className='hand'>👉</span> 
                Join us 
                <span className='hand'>👈</span>
            </h1>
        </div>
    )
})
