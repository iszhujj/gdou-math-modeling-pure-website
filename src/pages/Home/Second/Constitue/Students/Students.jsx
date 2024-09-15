import React, { Component } from 'react'
import './Students.scss'
import putForwardProcess from '../../../../../utils/pushProcess.js'

import { Steps , Carousel} from 'antd';
import {RocketOutlined} from '@ant-design/icons'

import { sliderInfo } from '../../../../../utils/staticData';

export default class Students extends Component {
    usimg = [React.createRef(),React.createRef(),React.createRef(),React.createRef()]
    picFrame = React.createRef();
    Carousel = React.createRef();

    state = {
        canSpread:false,                    // 是否向下展开图片
        upRocket:false,                     // 发射火箭
        stdentPicSlide:(window.innerWidth >= 1000 ? true : false),     // 照片是否转成轮播图样式
        currentPicture:0,
        pictureData:[{},{},{},{}],
        showComponent:false,
        currentNumber:''                    // 在校成员数量
    }
    // 为图片添加事件
    addEventListenerForPic(){
        this.usimg.forEach(e =>{
            let startY = 0;
            let endY = 0;
            let startX = 0;
            let endX = 0;
            if(!e.current){ return }

            e.current.addEventListener('touchstart',(e)=>{
                e.preventDefault();             // 阻止默认事件
                e.stopPropagation();            // 阻止冒泡
                let elem = e.target;
                if(!elem.classList.contains('usimg-0')){
                    return;
                }
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
            })
            e.current.addEventListener('touchmove',e=>{
                e.preventDefault();             // 阻止默认事件
                e.stopPropagation();            // 阻止冒泡
                let elem = e.target;
                if(!elem.classList.contains('usimg-0')){
                    return;
                }
                endY = e.touches[0].clientY;
                endX = e.touches[0].clientX;
                let distance = startY - endY;
                // 角度超过则不再旋转
                if(endY > 0 && startY > 0 && distance > 80){
                    elem.style.zIndex = 0;
                    return;
                }else if(distance > 25 || distance < -25){
                    return;
                }
                if(startX <= document.body.offsetWidth / 2){
                    elem.style = `transform-origin: 0% 0%;
                        transform : translate(calc(-50% + ${Math.abs(-distance * 2)}px),-50%) rotate(${-distance}deg);`;
                }else{
                    elem.style = `transform : translate(calc(-50% + ${Math.abs(distance * 2)}px),-50%) rotate(${distance}deg);`;
                }
            })
            e.current.addEventListener('touchend',e=>{
                e.preventDefault();             // 阻止默认事件
                e.stopPropagation();            // 阻止冒泡
                let elem = e.target;
                if(!elem.classList.contains('usimg-0')){
                    return;
                }
                // 往上滑才切换
                if(endY > 0 && startY > 0 && endY - startY <= -80){              // 切换下一张 
                    this.seeNextPicture();
                }
                startY = 0;
                endY = 0;
                elem.style.transformOrigin = '';
                elem.style.transform = '';    // 恢复style
                elem.style.zIndex = '';
            })
        })
    }
    // 切换下一张图片
    seeNextPicture(){
        let parent = this.picFrame.current;
        let i = 0;
        // 找到当前classList 含有 usimg-0 的，就是当前的第一个，
        for(let e of parent.childNodes){
            if(e.classList.contains('usimg-0')){
                break;
            }
            i += 1;
        }
        // 关键部分，利用 i 依次往后，移除已有的usimg-x，按新顺序新增usimg-x
        for(let j = 0 ; j < parent.childNodes.length ; j ++, i ++){
            parent.childNodes[(i + 1) % 4].classList.remove(`usimg-${(j + 1) % 4}`);
            parent.childNodes[(i + 1) % 4].classList.add(`usimg-${j}`);
        }
    }
    spread = ()=>{               // 图片散开
        if(this.picFrame.current && 
            this.picFrame.current.getBoundingClientRect().y < window.innerHeight * 0.6
            && !this.state.canSpread){
            this.setState({canSpread:true, upRocket: false});        // 向下展开图片
            // window.removeEventListener('scroll', this.spread);
        }
    }
    rocketUp = ()=> {               // 火箭显现
        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        if(currentScrollTop > window.innerHeight * 1.6 && !this.state.upRocket){
            this.setState({upRocket: true, canSpread:false});
            document.querySelectorAll('.ant-steps-item-container').forEach((e,index)=>{
                e.classList.add(`up-show-${index}`);
            })
        }
    }
    render() {
        const {canSpread, stdentPicSlide, currentPicture, currentNumber} = this.state;
        if(!this.state.showComponent){
            return (<div></div>)
        }
        // 不使用轮播图
        if(!stdentPicSlide){
            return (
                <div className='student-box' style={canSpread ? {'height':'98vw'} : {}}>
                    <p>今在校队员共{ currentNumber }人</p>
                    <div className='pic-frame' ref={this.picFrame}>
                        {
                            this.state.pictureData.map((e,i,arr)=>{
                                return (
                                    <img key={i + e.desc} onLoad={() => putForwardProcess(6)} ref={this.usimg[i]} 
                                        className={canSpread ? `img-item usimg-${i}` : 'img-item'} src={e.url}/>
                                )
                            })
                        }
                    </div>
                    <div style={stdentPicSlide ? {} : {display:'none'}}></div>
                </div>
            )
        }else{
            return (
                <div className='student-box' style={canSpread ? {'height':'98vw'} : {height:'100vh'}}>
                    <h3>今在校队员共{ currentNumber }人</h3>
                    <div className='pic-frame' ref={this.picFrame}>
                        {/* 走马灯-轮播图 */}
                        <Carousel dots={false} ref={this.Carousel} autoplay autoplaySpeed={4000}
                            beforeChange={(current, next) => this.setState({currentPicture: next})}>
                            {
                                this.state.pictureData.map((e,i,arr) => {
                                    return (
                                        <div key={i}>
                                            <img onLoad={() => putForwardProcess(6)} className='per-img'
                                                onClick={(e)=>{e.preventDefault();return false;}}
                                                src={e.url}/>
                                        </div>
                                    )
                                })
                            }
                        </Carousel>
                        <div className='step-line'>
                            <Steps
                                className='step-antd'
                                current={currentPicture}
                                labelPlacement="vertical"
                                onChange={ current => {
                                    this.setState({currentPicture: current});   // 切换火箭
                                    this.Carousel.current.goTo(current);        // 切换轮播图
                                }}
                                items={
                                    this.state.pictureData.map((e, index)=>{
                                        return  {
                                            title: e.desc || '暂无描述',
                                            description: e.putTime.split(' ')[0],
                                            status: currentPicture === index ? 'finish' : 'wait',
                                            icon:<RocketOutlined />
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            )
        }
        
    }
    componentDidMount(){
        let staticData = sliderInfo
        this.setState({
            pictureData:staticData,
            showComponent:true
        },()=>{
            // 这些是一开始的监听
            if(window.innerWidth >= 1000){
                this.setState({stdentPicSlide: true},()=>{
                    window.addEventListener('scroll', this.rocketUp);
                });
            }
            if(window.innerWidth < 1000){
                this.setState({stdentPicSlide: false},()=>{
                    window.addEventListener('scroll', this.spread);
                    // 为图片添加监听事件
                    this.addEventListenerForPic();
                });
            }
        })

        this.setState({currentNumber:36})

        // 只有尺寸有变化才会执行回调函数
        window.addEventListener('resize', ()=>{
            if(window.innerWidth >= 1000){
                this.setState({stdentPicSlide: true},()=>{
                    window.addEventListener('scroll', this.rocketUp);
                    window.removeEventListener('scroll', this.spread);
                });
            }
            if(window.innerWidth < 1000){
                this.setState({stdentPicSlide: false},()=>{
                    window.addEventListener('scroll', this.spread);
                    window.removeEventListener('scroll', this.rocketUp);
                    // 为图片添加监听事件
                    this.addEventListenerForPic();
                });
            }
        })
    }
}
