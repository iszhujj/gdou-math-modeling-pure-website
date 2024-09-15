import React, { Component } from 'react'
import './First.scss'
import Fireworks from './Fireworks/Fireworks'
import putForwardProcess from '../../../utils/pushProcess.js'

import pubsub from 'pubsub-js'

export default class First extends Component {
    canvas = React.createRef();
    wordBox = React.createRef();
    badge = React.createRef();

    canvasPonits = [
        [0.39, 0.73],[0.52, 0.66],
        [0.49, 0.78],[0.74, 0.68],
        [0.23, 0.86],[0.70, 0.74],
        [0.34, 0.93],[0.66, 0.80],
        [0.3, 0.95],[0.8, 0.85],
        [0.38, 1],[0.76, 0.89],
        [0.58, 1],[0.62, 1]
    ];
    drawCanvas(canvas, pictureSrc, imgEle, callback){
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;
        // 创建图片
        let img = new Image(canvasWidth, canvasHeight);
        img.src = pictureSrc;

        // 等待图片加载完再操作
        img.onload = () => {
            // 创建一个临时的 canvas 使用 drawImg 方法先将图片绘制在其中
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvasWidth;
            tempCanvas.height = canvasHeight;
            let tempCanvasBrush = tempCanvas.getContext('2d');
            tempCanvasBrush.drawImage(img, 0, 0, canvasWidth, canvasHeight);

            let brush = canvas.getContext('2d');
            // 将 tempCanvas 作为 canvas 画笔 brush 的图案样式(为了保障最终的图片效果是宽高同时缩放到指定大小的)
            let pattern = brush.createPattern(tempCanvas, 'no-repeat');
            brush.strokeStyle = pattern;
            brush.lineWidth = 80;
            brush.lineCap = 'round';
            brush.lineJoin = 'round';

            let i = 0;

            // 绘图
            let interval_A = setInterval(()=>{
                if(i < this.canvasPonits.length){
                    let x = canvasWidth * this.canvasPonits[i][0];
                    let y = canvasHeight * this.canvasPonits[i][1];
                    brush.lineTo(x, y);
                    brush.stroke();
                    i ++;
                }else{
                    // 清除当前的定时器
                    clearInterval(interval_A);
                    // imgEle.style.opacity = '1';
                    // canvas.style.opacity = '0';
                    callback();
                }
            },50);
        }
    }

    // 动画展示团徽和欢迎文字
    imgAndWordShow = ()=>{
        if(this.badge.current) this.badge.current.classList.add('team-badge-show')
        if(this.wordBox.current) this.wordBox.current.style = 'transform:translate(0,0);opacity:1;'
    }

    render() {
        return (
            <div className='first-box'>
                <div className='team-badge-container'>
                    {/* 点击团徽的烟花效果 效果不好 */}
                    {/* <Fireworks></Fireworks> */}
                    <img onLoad={() => putForwardProcess(1)} className='team-badge' ref={this.badge}
                        src="/static/teamBadge.png" alt="团队徽章" />
                    <div className='word-box' ref={this.wordBox}>
                        <div className='word'>欢迎来到广海大数模团队</div>
                        <div className='word'>
                            <p>welcome to</p>
                            <p>GDOU Math Mo‰deling!</p>
                            <p></p>
                        </div>
                    </div>
                </div>
                <div className='bg-img-box'>
                    <canvas ref={this.canvas} id='canvas'>no support canvas</canvas>
                    <img className='bg-img' onLoad={() => putForwardProcess(2)} src='/static/firstPagebgi.png'/>
                </div>
            </div>
        )
    }
    componentDidMount(){
        let canvas = this.canvas.current;
        canvas.width = document.querySelector('.first-box').offsetWidth;
        canvas.height = document.querySelector('.first-box').offsetHeight;

        let imgsrc ='/static/firstPagebgi.png'
        pubsub.subscribe('first-show',()=>{
            this.drawCanvas(canvas, imgsrc, 
                document.querySelector('.bg-img'), ()=>{
                    setTimeout(()=>{
                        this.imgAndWordShow();
                        // 加载主要的内容
                        pubsub.publish('loadMainContent');          // 加载second
                        pubsub.publish('show-footer');              // 加载footer
                    },100);
                });
        })
        
    }
    componentWillUnmount(){
        pubsub.unsubscribe('first-show')
    }
}
