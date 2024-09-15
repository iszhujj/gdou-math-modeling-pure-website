import React, { memo, useEffect, useRef, useState } from 'react'
import './LeaderTeacher.scss'

import { teacherInfo } from '../../../../../utils/staticData';

import DrawACircle from '../../../../../components/DrawACircle/DrawACircle';
import putForwardProcess from '../../../../../utils/pushProcess';
import pubsub from 'pubsub-js';

const LeaderTeacher = memo((props)=> {
    const [hasDraw,setHasDraw] = useState(false)                    // 是否圈了文字
    const [colorIndex,setColorIndex] = useState(parseInt(Math.random() * 100 / 6))
    const [showTeachers,setShowTeachers] = useState(false)          // 是否显示指导老师组件
    const [teacherData, setTeacherData] = useState(null)
    const [largeSize, setLargeSize] = useState(window.innerWidth >= 1000)       // 控制更新
    
    const teachers = useRef()

    const colorArr = ['#ffd1dc','#ffffcc','#c5e1a5','#e0d1e8','#cfe7f8','#f2f2f2'];

    const spread = ()=>{               // 图片散开
        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        if(!hasDraw && currentScrollTop > window.innerHeight * 0.5){
            pubsub.publish('startAction');          // 圈文字
            setHasDraw(true)         // 上锁
        }
        if(!showTeachers && teachers.current &&
             teachers.current.getBoundingClientRect().y < window.innerHeight * 0.6){
            setShowTeachers(true)
            window.removeEventListener('scroll', spread);
        }
    }

    const largeSpard = () => {
        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        if(!hasDraw && currentScrollTop > window.innerHeight * 0.9){
            pubsub.publish('startAction');          // 圈文字
            setHasDraw(true)         // 上锁
        }
        if(!showTeachers && currentScrollTop > window.innerHeight * 0.7){
            setShowTeachers(true)
        }
        if(currentScrollTop > window.innerHeight * 1.3){
            window.removeEventListener('scroll', largeSpard);
        }
    }

    function resizeListener(){
        if(largeSize && window.innerWidth < 1000){
            setLargeSize(false)
        }else if(!largeSize && window.innerWidth >= 1000){
            setLargeSize(true)
        }
    }

    useEffect(()=>{
        let staticData = teacherInfo
        setTeacherData(staticData)

        if(window.innerWidth >= 1000){
            window.addEventListener('scroll', largeSpard);
        }else{
            window.addEventListener('scroll', spread);
        }
        window.addEventListener('resize',resizeListener)
        return ()=>{
            window.removeEventListener('resize',resizeListener)
        }
    },[])

    return teacherData ? (
        <section className='main-area' style={props.style_}>
            <div className='title-text'>
                <DrawACircle />
                <p>成立于2017年11月</p>
                <p> 
                    由信计系
                    <strong>{teacherData[0].pictureName}</strong>、
                    <strong>{teacherData[1].pictureName}</strong>、
                    <strong>{teacherData[2].pictureName}</strong>
                    三位老师共同带领
                </p>
            </div>

            <section className='three-teacher-container' ref={teachers}>
                {
                    teacherData.map((e,i,arr) => {
                        return  (
                            <div className={
                                    showTeachers ? 
                                    `teacher-box tea-box-${i % 2 == 0 ? 'left' : 'right'}-into down-${i + 1}`:
                                    'teacher-box'
                                }
                                key={e.pictureName + i}>
                                <div className='tea-img-box'>
                                    <div className='tea-img-show'  style={{'backgroundColor':`${colorArr[(colorIndex + i) % 6]}`}}>
                                        <img className={e.pictureName === '李志' ? 'lz' : e.pictureName === '李升' ? 'ls' : 'dm'} 
                                            onLoad={() => putForwardProcess(3)} src={e.url} alt="teacher-img"/>
                                    </div>
                                </div>
                                <p className='tea-passage' style={{'backgroundColor':`${colorArr[(colorIndex + i) % 6]}70`}}>
                                    <strong>{e.pictureName}  {e.desc}</strong>{e.introduce}
                                </p>
                            </div>
                        )
                    })
                }
            </section>
        </section>
    ) : <></>
})

export default LeaderTeacher
