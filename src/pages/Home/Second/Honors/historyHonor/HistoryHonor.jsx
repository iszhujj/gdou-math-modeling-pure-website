import React,{memo, useEffect, useRef, useState} from 'react'
import './HistoryHonor.scss'

import { Timeline,Popover } from 'antd'

import { historyHonor } from '../../../../../utils/staticData'
import LazyLoadImage from '../../../../../components/LazyLoadImg/LazyLoadImg'

// 使用 memo 来控制当前组件的更新，只有该组件的属性或子组件的属性有更新才更新该组件
export const HistoryHonor = memo((props) => {
    // const [finishRequest, setFinishRequest] = useState(false)     // 是否请求到数据
    const [moveUp, setMoveUp] = useState(150)
    const [hoverP,setHoverP] = useState(false)                      // 鼠标是否悬浮在《p》上
    const [showTimeLine, setShowTimeLine] = useState(true)          // 是否使用时间线组件
    const [data,setData] = useState([])

    const contentBox = useRef()

    const y = 75                // ul 的高度除以 li 的数量 得到 li 的高度
    var upHonor;                // 定时器

/*********   showTimeLine 的循环  因为有日期，因此不采用循环的方式
    useEffect(()=>{
        setTimeout(()=>{
            if(currentIndex >= renderData.length - 8){ return }
            let index = currentIndex + 1
            if(index === renderData.length - 8){
                setCurrentIndex(index)
                setMoveUp(moveUp - y)
                setTimeout(()=>{
                    setBoxTransition(false)
                }, 1900)
            }else if(index === 1 && !boxTransition){
                setBoxTransition(true)
            }else{
                setCurrentIndex(index)
                setMoveUp(moveUp - y)
            }
        },2000)
    },[currentIndex])
    useEffect(()=>{
        if(!boxTransition){
            setCurrentIndex(0)
            setMoveUp(0)
        }else{
            setCurrentIndex(1)
            setMoveUp(moveUp - y)
        }
    },[boxTransition])
*/

    const resizeListener = ()=>{
        let width = window.innerWidth
        if(width <= 990 && showTimeLine){
            setShowTimeLine(false)
        }else if(width > 990 && !showTimeLine){
            setShowTimeLine(true)
        }
    }

    useEffect(()=>{                     // 挂载时，检查页面的大小来决定是否改变渲染的结果
        setData(historyHonor)

        upHonor = setTimeout(()=>{
            if(!hoverP){
                let res = (moveUp - y) < -875 ? 150 : (moveUp - y)
                setMoveUp(res)
            }
        },2000)

        window.addEventListener('resize', resizeListener)
        return ()=>{
            window.removeEventListener('resize', resizeListener)
        }
    },[])

    useEffect(()=>{
        clearTimeout(upHonor)
        upHonor = setTimeout(()=>{
            if(!hoverP){
                let res = (moveUp - y) < -875 ? 150 : (moveUp - y)
                setMoveUp(res)
            }
        },2000)
    },[moveUp,hoverP])

    return (
        <>
        <div className='history-honor'>
            {
                (window.innerWidth > 1000 && showTimeLine) ? (
                    <div className={`content-box transition-div`} 
                        style={{transform:`translate(0, ${moveUp}px)` }} ref={contentBox} >
                        <Timeline
                            mode="alternate"
                            items={
                                data.map((item,i)=>{
                                    return {
                                        label:item.time,
                                        children:(
                                            <p className='honor-title' key={i}>
                                                <Popover content={
                                                    <LazyLoadImage src={item.url} style_={{width:'350px'}} />
                                                } title={item.title}>
                                                    <span className='text'
                                                        onMouseOver={()=> {
                                                            if(hoverP){
                                                                clearTimeout(upHonor)
                                                            }else{
                                                                clearTimeout(upHonor)
                                                                setHoverP(true)
                                                            }
                                                        }}
                                                        onMouseLeave={() => {
                                                            setHoverP(false)
                                                        }}
                                                    >{ item.title }</span>
                                                </Popover>    
                                            </p>
                                        )
                                    }
                                })
                            }
                        />
                    </div>
                    
                ) : (
                    <>
                    <div className={`content-box transition-div`} 
                        style={{transform:`rotate(90deg) 
                            translate(${
                                window.innerWidth < 530 ? (550 - window.innerWidth) / 2 + 'px' : 
                                window.innerWidth > 850 ? (810 - window.innerWidth)  + 'px' :
                                (530 - window.innerWidth) / 2 + 'px'
                            },
                             ${moveUp}px)` }} 
                        ref={contentBox} >
                        <Timeline
                            mode='left'
                            items={
                                data.map((item,i)=>{
                                    return {
                                        label:<div className='time'>{ item.time }</div>,
                                        children:<p key={i} className='ver-p'>{ item.title }</p>
                                    }
                                })
                            }
                        />
                    </div>
                    <div className='mask'></div>
                    </>
                )
            }
        </div>
        </>
    )
})
