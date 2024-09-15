import React, { useEffect,memo, useState, useRef } from 'react'
import './HonorWall.scss'

import { allHistoryHonor } from '../../../../../../utils/staticData'

const HonorWall = memo(() => {
    const [imgArr, setImgArr] = useState([])
    const container = useRef()
    const container_below = useRef()

    useEffect(()=>{
        if(imgArr.length <= 0){
            setImgArr(allHistoryHonor)
        }
    },[])

    return imgArr.length > 0 ? (
        (
            <>
                <div className='honorwall-outer'>
                    <div className='for-shadow'>
                        <div ref={container} className='honor-container'>
                            {
                                imgArr.map((e,i)=>{
                                    return (
                                    <img src={e} key={i} 
                                        className={e.includes('hp') ? 'large-img' : ''}
                                    />)
                                })
                            }
                        </div>
                    </div>
                    {/* 用于循环轮播 animation 实现 */}
                    <div className='for-shadow'>
                        <div ref={container_below} className='honor-container'>
                            {
                                imgArr.map((e,i)=>{
                                    return (
                                    <img src={e} key={i + 'xyz'}
                                        className={e.includes('hp') ? 'large-img' : ''}
                                    />)
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    ) : (<></>)
})

export default HonorWall
