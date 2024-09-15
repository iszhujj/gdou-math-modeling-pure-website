import React from 'react'

import {useRoutes} from 'react-router-dom'
import { useState,useEffect,Suspense } from 'react'
import routes from './routes/index.js'

import Loading from './pages/Loading/Loading'
import DoingTip from './components/DoingTip/DoingTip.jsx'

import './App.scss'
import pubsub from 'pubsub-js'
import { notification } from 'antd'

export default function App(){
    const element = useRoutes(routes);

    let [loadFinish,setLoadFinish] = useState(false);

    // const {userAgent, webdriver} = navigator;

    // const sendLocalInfo = () => {           // 上传用户的设备信息
    //     new Promise((res,rej)=>{
    //         sendInfo(window.screen.width,window.screen.height,navigator.userAgent)
    //     })
    // }

    useEffect(()=>{
        console.log('@beta version 2023-9-25')
        
        if(!navigator.onLine){
            notification.error({
                message:'Local Error',
                description:'网络连接异常，当前可能显示为静态网页',
                duration:null                   // 不自动关闭
            })
        }
        pubsub.subscribe('serverError',()=>{ 
            notification.error({
                message:'Server Error',
                description:'服务器异常,部分内容可能显示静态数据',
                duration:null
            })
            pubsub.unsubscribe('serverError')
        })

        pubsub.subscribe('loadMainContent',()=>{
            setLoadFinish(true);            // 设置溢出可以滚动
        });

        let url = window.location.href
        if(!url.includes('@test_mode')){            // 严格模式
            // 禁止复制
            window.addEventListener('copy',(e)=>{ e.preventDefault() })
            // 禁止右键
            window.addEventListener('contextmenu',(e)=>{e.preventDefault()})
            // 禁止打印
            window.addEventListener('beforeprint',e => {
                e.preventDefault();
                window.location.href = 'about:blank';
                return false;
            })
            // 禁止打开控制台
            window.addEventListener('keydown', e => {
                if(e.key === 'F12' || e.keyCode === 123){ e.preventDefault(); }
                if(e.ctrlKey || e.key === 'Control' || e.keyCode === 17){ e.preventDefault() }
            });
        }
        // sendLocalInfo()
        return ()=>{                        // 相当于componentDidMount
            pubsub.unsubscribe('loadMainContent');
        }
    },[])
    
    return(
        <div id='App' style={loadFinish ? {overflowX:'hidden',height:'auto'} : {}}>
            <Loading/>
            <Suspense fallback={<div></div>}>
                {element}
            </Suspense>
            <DoingTip/>
        </div>
    )    
}

