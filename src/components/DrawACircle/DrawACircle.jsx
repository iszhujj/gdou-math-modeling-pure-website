/* 
    画圈，将文本内容圈起来，要圈起来的文本可以用span或strong包裹起来，并设置相对定位
    然后将该组件放到里面
*/

import React, { memo, useEffect } from 'react'
import './DrawACircle.scss'
import pubsub from 'pubsub-js'

const DrawACircle = memo((props)=> {
    const config = {
        text: '广海数模团队',
        style:{fontSize:'1.6rem',fontWeight:'700'},
        color: '#6492e8aa',
        lineWidth: 3
    }

    // 绘制顶部的二次贝塞尔曲线
    function quadratic(x0, x1, x2, y0, y1, y2, t = 0, ctx, canvas, callback){
        let {pow} = Math;
        let x = pow((1-t),2) * x0 + 2 * t * (1-t) * x1 + pow(t,2) * x2;
        let y = pow((1-t),2) * y0 + 2 * t * (1-t) * y1 + pow(t,2) * y2;
        ctx.lineTo(x,y);
        ctx.stroke();
        if(t < 0.4){
            requestAnimationFrame(()=>{
                quadratic(x0, x1, x2, y0, y1, y2, t + 0.08, ctx, canvas, callback);
            })
        }else if(t + 0.06 <= 1){
            requestAnimationFrame(()=>{
                quadratic(x0, x1, x2, y0, y1, y2, t + 0.12, ctx, canvas, callback);
            })
        }else{
            callback();
        }
    }

    // 绘制底部的三次贝塞尔曲线
    function bezier(x0, x1, x2, x3, y0, y1, y2, y3, t = 0, ctx, canvas, callback) {
        let {pow} = Math;
        let x = pow((1-t),3) * x0 + 3 * t * pow((1-t),2) * x1 + 3 * pow(t,2) * (1-t) * x2 + pow(t,3) * x3;
        let y = pow((1-t),3) * y0 + 3 * t * pow((1-t),2) * y1 + 3 * pow(t,2) * (1-t) * y2 + pow(t,3) * y3;
        ctx.lineTo(x,y);
        ctx.stroke();
        if(t < 0.3){
            requestAnimationFrame(()=>{
                bezier(x0, x1, x2, x3, y0, y1, y2, y3, t + 0.05, ctx, canvas, callback);
            })
        }else if(t + 0.03 <= 1){
            requestAnimationFrame(()=>{
                bezier(x0, x1, x2, x3, y0, y1, y2, y3, t + 0.06, ctx, canvas, callback);
            })
        }else{
            callback();
        }
    }

    useEffect(()=>{
        // 画笔的颜色; 线宽
        const {color, lineWidth} = config;
        const canvas = document.querySelector('#circle-canvas');
        const parentNode = document.querySelector('.outer-span');
        const ctx = canvas.getContext('2d');
        
        let Wid = parentNode.offsetWidth * 2;
        let Hei = parentNode.offsetHeight * 2;
        canvas.width = Wid;
        canvas.height = Hei;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        
        // 起点坐标
        let startx = Wid / 8;
        let starty = Hei / 2;
        
        // 二次贝塞尔曲线相关（顶部
        let control2x = Wid / 4 * 3 - 10;
        let control2y = -10;
        let end2x = Wid / 4.6;
        let end2y = Hei / 1.6;
        
        // 三次贝塞尔曲线相关（底部
        let con3x0 = Wid / 5.2;
        let con3x1 = Wid / 4 * 3 + 10;
        let con3y0 = Hei;
        let con3y1 = Hei + 5;
        let end3x = Wid / 4 * 3 + 10;
        let end3y = Hei / 2;

        pubsub.subscribe('startAction', () => {
            // console.log('startAction')
            // 先画底部的三次
            bezier(startx, con3x0, con3x1, end3x, starty, con3y0, con3y1, end3y, 0, ctx, canvas,()=>{
                // 再画顶部的二次
                quadratic(end3x, control2x, end2x, end3y, control2y, end2y, 0, ctx, canvas,()=>{
                    // 重绘
                    canvas.width = canvas.width;
                    canvas.height = canvas.height;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;

                    ctx.moveTo(startx, starty);
                    ctx.bezierCurveTo(con3x0, con3y0, con3x1, con3y1, end3x, end3y);
                    ctx.quadraticCurveTo(control2x, control2y, end2x, end2y);       // 二次
                    ctx.stroke();
                });
            })
            pubsub.publish('unsub')             // 确保只画（执行）一次  
        })
        pubsub.subscribe('unsub',()=>{
            pubsub.unsubscribe('startAction');
        })
    },[])

    let {style, text} = config;
    return (
        <div>
            <span style={style} className='outer-span'>
                <canvas id='circle-canvas'></canvas>
                {text}
            </span>
        </div>
    )
})

export default DrawACircle
