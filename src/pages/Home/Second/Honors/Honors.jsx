import React, { Component } from 'react'
import './Honors.scss'

import ScrapeArea from './ScrapeArea/ScrapeArea'
import {HistoryHonor} from './historyHonor/HistoryHonor'

import { honorWallFourImg } from '../../../../utils/staticData'

export default class Honors extends Component {
    verImgAreaParent = React.createRef()

    state = {
        curIndex:0,
        canSpread:false,
        showHonorBall:(window.innerWidth > 850 ? true : false),
        verPicicture:[],
    }

    curIndex = 0;           // 当前位于正前方的图片索引（0-3）
    startX = 0;
    endX = 0;
    distance = 0;           // x 的滑动距离

    preDefault(e){ e.preventDefault() }

    // 创建竖直的获奖证书
    createVerImg(){
        return this.state.verPicicture.map((e, index)=>{
            return <img className={ this.state.canSpread ? `ver-img ver-img-${
                this.state.curIndex > index ? (4 - this.state.curIndex + index) : (index - this.state.curIndex)
            }` : 'ver-img'} src={e.url}
                        onTouchStart={event => this.touchStart(event, index)}
                        onTouchMove={event => this.touchMove(event, index)}
                        onTouchEnd={event => this.touchEnd(event, index)}
                        onDragStart={event => this.preDefault(event)} key={index} />
        })
    }

    touchStart(e, index){
        e.persist();
        e.preventDefault();
        if(!e.target.classList.contains('ver-img-0')){
            return
        }
        this.startX = e.touches[0].clientX;
    }

    touchMove(e, index){
        if(!e.target.classList.contains('ver-img-0')){ return }
        e.persist();
        e.preventDefault();
        this.endX = e.touches[0].clientX;
        this.distance = this.endX - this.startX;
        if(this.distance < -150){
            return
        }
        this.verImgAreaParent.current.childNodes[index].style = `transfrom-orign: right bottom;
            transform: translate(${(this.distance > 60 ? 60 : this.distance) / 2.5}px, -55%) 
            rotate(${(this.distance > 60 ? 60 : this.distance) / 5}deg) 
            scale(${1 - (this.distance > 60 ? 60 : this.distance) * 0.002});
            opacity: ${1 - (this.distance > 60 ? 60 : this.distance) / 200};z-index:${
                this.distance > 89 ? 1 :''
            }`;
    }

    touchEnd(e){
        e.persist();
        e.preventDefault();
        if(!e.target.classList.contains('ver-img-0')){ return }
        this.startX = 0;
        this.endX = 0;
        this.verImgAreaParent.current.childNodes[this.curIndex].style = '';
        if(this.distance < 90){
            this.distance = 0; 
            return 
        }
        this.distance = 0;
        this.setState({
            curIndex: (this.curIndex + 1) % 4
        })
        this.curIndex = (this.curIndex + 1) % 4;
    }

    spread = ()=>{                   // 散开
        if(this.verImgAreaParent.current &&
             this.verImgAreaParent.current.getBoundingClientRect().y < window.innerHeight * 0.6){
            this.setState({canSpread:true});
            window.removeEventListener('scroll', this.spread);
        }
    }

    render() {
        const {showHonorBall} = this.state;
        return showHonorBall ? (
            <>
            <ScrapeArea />
            <HistoryHonor/>
            </>
        ) : (
            <>
            <div className='honors-box'>
                <div className='top-area' style={{marginBottom:'20px'}}>
                    <div className='left-title'>
                        <p>近年的成果</p>
                    </div>
                    <div className='right-imgs' ref={this.verImgAreaParent}>
                        {this.createVerImg()}
                    </div>
                </div>
            </div>
            <HistoryHonor/>
            </>
        )

    }
    componentDidMount(){
        this.setState({verPicicture:honorWallFourImg})

        if(window.innerWidth <= 800){
            window.addEventListener('scroll', this.spread);
        }
            
        window.addEventListener('resize',()=>{              // 变更展现方式
            this.setState({wid:window.innerWidth,hei:window.innerHeight})
            let {showHonorBall} = this.state;
            if(!showHonorBall && window.innerWidth >= 850){
                this.setState({showHonorBall: true});
            }else if(showHonorBall && window.innerWidth < 850){
                this.setState({showHonorBall: false});
                window.addEventListener('scroll', this.spread);
            }
        })
    }
}
