import React, { Component } from 'react'
import './Loading.scss'
import pubsub from 'pubsub-js'

export default class Loading extends Component {
    progress = React.createRef();
    outline = React.createRef();
    loadingContainer =React.createRef();

    state = {
        text:'is loading',
    }
    // 创建省略号
    createDots(){
        let res = [];
        for(let i = 0 ; i < 6 ; i ++){
            res.push(<span className={`dot`} key={i}>.</span>)
        }
        return res;
    }
    render() {
        return (
            <div id="loading" ref={this.loadingContainer}>
                <section className='title'>
                    <h4>{this.state.text}</h4>
                    {this.createDots()}
                </section>
                 <div className='outline' ref={this.outline}>
                    <div className='inner-area' ref={this.progress}>
                        <img className='run-dog' src="/static/icons/run-dog.webp"/>
                    </div>
                 </div>
            </div>
        )
    }
    componentDidMount(){
        // 使省略号依次有序跳动
        let dots = document.querySelectorAll('.dot');
        let i = 0;
        dots[i].classList.add(`dot-dancing`);
        i ++;
        let change = setInterval(()=>{
            dots[i].classList.add('dot-dancing');
            i ++;
            if(i >= dots.length){
                clearInterval(change);
            }
        }, 800);

        // 调整进度 等待图片或其他要等待的元素加载完成后，调整进度
        let curWid = 0;
        let endWidt = this.outline.current.offsetWidth;
        let perWid = endWidt / 6;         // 6是当前有多少个资源需要等待，根据页面的情况进行改变(最接近顶部的九张图片)
        curWid = perWid;
        pubsub.subscribe('putForwardProcess',(msg, index)=>{
            this.progress.current.style.width = curWid + 'px';
            
            if(endWidt <= curWid + 6){
                this.progress.current.style.width = endWidt - 8 + 'px';
                this.setState({text:'Be entering'});
                // 取消消息订阅
                // pubsub.unsubscribe('putForwardProcess');
                // 隐藏进度条组件
                this.loadingContainer.current.style.opacity = '0';
                setTimeout(()=>{
                    // 隐藏之后还要设置display为none，不然会阻挡点击团徽之后的效果（点击团徽无效
                    this.loadingContainer.current.style.display = 'none';
                },800);
                pubsub.publish('first-show')
                // 对应在 Home，加载完成后页面可以滚动
                pubsub.publish('loadFinish')
            }
            curWid += perWid
        });
    }
}
