import React, { Component } from 'react'
import './Concentrate.scss'
import VerImgList from './VerImgList/VerImgList';

export default class Concentrate extends Component {
    startX = -1;                        // 第一次触摸的x
    endX = -1;                          // 最后一次触摸时的x
    state = {
        rotateStart:false,
        receiveEvent:false,
        imgArr:[],
        showVerTicalList:(window.innerWidth < 850 ? false : true)       // 是否展示树形排列的五个方向的图片
    }
    imgBox = React.createRef()
    createImg(){                        // 创建5张方向（算法、前端、后端等）的图片
        let res = [];
        let imgarr = ['computer-vision','DM','OR','ui','back','forward'];
        for(let index in imgarr){
            res.push(
                <div key={index} className={`pre-item-box pre-item-box-${index}`}
                    style={{
                        transform: `translate(-50%, -50%) rotate(${this.state.rotateStart ? (-25 + index * 10) : 0}deg)`
                    }} onTouchStart={(e) => this.touchStart(e, index)}
                    onTouchMove={(e) => this.touchMove(e, index)}
                    onTouchEnd={(e) => this.touchEnd(e, index)}
                >
                    <img className='item' onTouchStart={e => {e.preventDefault()}} onClick={e => e.preventDefault()}
                        onTouchMove={e => e.preventDefault()} onDrag={e => e.preventDefault()}
                        src={`/static/concentrate/${imgarr[index]}.png`} />
                </div>
            )
        }
        return res;
    }
    touchStart(e, index){               // 开始触摸
        // 保留原始的合成事件以获取e.touches的值
        e.persist();
        this.startX = e.touches[0].clientX;
    }
    touchMove(e, index){                // 正在移动
        e.persist();
        this.endX = e.touches[0].clientX;
        let sx = this.startX;
        let ex = this.endX;
        if(sx > ex){                    // 左滑生效
            let skew = (sx - ex) > 10 ? 10 : (sx - ex);
            for(let i = 0 ; i <= index ; i ++){
                this.state.imgArr[i].style = `transform: translate(-50%, -50%) rotate(${this.state.rotateStart ? (-25 + i * 10 - skew) : 0}deg)`
            }
        }else if(sx < ex){
            let skew = (ex - sx) > 10 ? 10 : (ex - sx);
            for(let i = index ; i < this.state.imgArr.length ; i ++){
                this.state.imgArr[i].style = `transform: translate(-50%, -50%) rotate(${this.state.rotateStart ? (-25 + i * 10 + skew) : 0}deg)`
            }
        }
    }
    touchEnd(e, index){
        e.persist();
        this.startX = -1;
        this.endX = -1;
        for(let i = 0 ; i < this.state.imgArr.length ; i ++){
            this.state.imgArr[i].style = `transform: translate(-50%, -50%) rotate(${this.state.rotateStart ? (-25 + i * 10) : 0}deg)`
        }
    }
    spread = () => {                           // 将各个方向展开
        if(!this.state.showVerTicalList && 
            this.imgBox.current && 
            this.imgBox.current.getBoundingClientRect().y < window.innerHeight * 0.6){
            this.setState({rotateStart: true, receiveEvent: true});
            window.removeEventListener('scroll', this.spread);
        }
    }
    render() {
        let {showVerTicalList} = this.state;
        return (
            <div className='concentrate-box'>
                <div className='text'>
                    <p>我们虽叫广海数模</p>
                    <p>但我们做的</p>
                    <p>
                        <strong>不只有数模</strong>
                    </p>
                </div>
                <div className='img-box' ref={this.imgBox}>
                    {showVerTicalList ? <VerImgList/> : this.createImg()}
                </div>
            </div>
        )
    }
    componentDidMount(){
        let {showVerTicalList} = this.state;
        if(!showVerTicalList){
            window.addEventListener('scroll', this.spread);
        }
        window.addEventListener('resize',()=>{              // 变更展现方式
            let {showVerTicalList} = this.state;
            if(!showVerTicalList && window.innerWidth >= 850){
                this.setState({showVerTicalList: true});
            }else if(showVerTicalList && window.innerWidth < 850){
                this.setState({showVerTicalList: false});
                window.addEventListener('scroll', this.spread);
            }
        })

        this.setState({
            imgArr: document.querySelectorAll('.pre-item-box')
        })
        
    }
}
