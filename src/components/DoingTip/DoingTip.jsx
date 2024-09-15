import React, { memo, useEffect, useState } from 'react'
import './DoingTip.scss'

import PubSub from 'pubsub-js'
import { Spin } from 'antd'

const DoingTip = memo(() => {
    const [uploading, setUploading] = useState({show:false, tip:''})

    useEffect(()=>{
        PubSub.subscribe('doing',(_,tip) => {
            setUploading({show:true,tip:tip})
            // document.addEventListener('scroll',(e)=>{
            //     e.preventDefault()
            // })
        })
        PubSub.subscribe('done',() => setUploading({show:false, tip:''}))
        return ()=>{
            PubSub.unsubscribe('doing')
            PubSub.unsubscribe('done')
        }
    },[])

    return uploading.show ? (
        <div className='global-spin'>
            <Spin 
                spinning={uploading.show} 
                tip='正在上传'
                size='large'
            />
            <h2 className='tip'>{uploading.tip}</h2>
        </div>
    ) : <></>
})

export default DoingTip
