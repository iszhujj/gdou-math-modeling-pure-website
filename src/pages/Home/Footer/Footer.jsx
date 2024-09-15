import React, { useEffect, useState, useRef, memo } from 'react'
import './Footer.scss'
import { Modal } from 'antd'

import Suggestion from './Suggestion/Suggestion'

import { isDesktop } from '../../../utils/funcs'
import { attentionUsInfo, contactUsInfo } from '../../../utils/staticData'

import LazyLoadImage from '../../../components/LazyLoadImg/LazyLoadImg'

import pubsub from 'pubsub-js'

export default memo(function Footer(){
    let [contactUs, setContactUs] = useState([]);
    let [attention, setAttention] = useState([]);
    let [showModel, setShowModel] = useState(false);        // 是否打开当年招新负责人的详情面板
    let [target, setTarget] = useState([]);                 // 所选择的招新负责人的详情信息

    const footerBox = useRef();

    useEffect(()=>{
        // const getContactUsInfo_ = getContactUsInfo();
        // const getAttention_ = getAttention();

        // Promise.all([getAttention_, getContactUsInfo_]).then(resArr => {
        //     setContactUs(resArr[1].data);
        //     setAttention(resArr[0].data);
        // }).catch(err=>{
            setContactUs(contactUsInfo);
            setAttention(attentionUsInfo);
        // })

        pubsub.subscribe('show-footer',()=>{
            footerBox.current.style = 'opacity:1;'
        })
        return () => {
            pubsub.unsubscribe('show-footer');
        }
    },[]);

    let is_desktop = isDesktop()            // 判断是否为pc

    function changeModelStatus(index){           // 设置联系我们的弹窗信息
        let temp_target = {
            defaultImg:contactUs[index].defaultImg,
            codeImg:contactUs[index].personalCode,
            name:contactUs[index].desc,
            major:contactUs[index].major
        }
        setTarget(temp_target)
        setShowModel(true)
    }

    function hideModal(){ setShowModel(false) && setTarget({}) }

    return (
        <>
        <div className='footer-mouse'>
            <div className='mouses-container'>
                {/* <img className='footer-mouse-1' src="/static/footer/footer-mouse.png" />
                <img className='footer-mouse-2' src="/static/footer/mouse-good.png" /> */}
                <LazyLoadImage class_name={'dogs-gif'} src="/static/footer/dogs.gif" alt="" />
            </div>
        </div>
        <div className='footer-box' ref={footerBox}>
            <div className='main-content-box'>
                <div className='attention-relative-box'>
                    <div className='attention'>
                        <h3>关注我们</h3>
                        {
                            attention.map((e,i)=>{
                                return (
                                    <div className='pre-img' key={i}>
                                        {
                                            is_desktop ? (<img className='default-img' src={e.defaultPic} alt="" />) : ''
                                        }
                                        <LazyLoadImage class_name={'code-img'} src={e.codeUrl} alt={''} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='relative'>
                        <h3>联系我们</h3>
                        <div className={isDesktop ? 'rel-img-group' : 'rel-img-group no-desktop-rel-img-group'}>
                            {
                                contactUs.map((e,i)=>{
                                    return  (
                                        <div className='pre-img' key={i} onClick={() => changeModelStatus(i)}>
                                            <img className='default-img' src={e.defaultImg} alt="" />
                                            <LazyLoadImage class_name={'code-img'} src={e.personalCode} alt={''} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='suggestion'>
                    <Suggestion />
                </div>
                <div className='address-and-postcode'>
                    <div className='address'>
                        <h3>地址</h3>
                        <p>中华人民共和国<br/> 广东省 湛江市 麻章区 海大路1号<br/> 钟海楼 04001</p>
                    </div>
                    <div className='postcode'>
                        <h3>邮政编码</h3>
                        <p>524088</p>
                    </div>
                </div>
                <div className='copyright'>
                    <p>广海大 数学建模团队 版权所有</p>
                    <p>Copyright © 2023 <br /> GDOU-Math-Modeling <br /> All Rights Reserved.</p>
                </div>
            </div>
            <div className='footer-img-box'>
                <img className='end-text-img' src="/static/footer/math_modeling_text.png"/>
            </div>
            <div className='record'>
                <p>粤ICP备 0000000000 号</p>
                <p className='link-to-beian' onClick={() => {
                    window.open('https://beian.mps.gov.cn/#/query/webSearch?code=44200002445088', '__blank')
                }}>
                    <img src="/static/icons/beiantubiao.png"/>
                    粤公网安备 00000000000 号
                </p>
            </div>
        </div>

        <Modal
            className='ant-model-custom'
            title="欢迎 '打扰' 😛"
            open={showModel}
            onOk={hideModal}
            onCancel={hideModal}
            okText="OK"
            centered={true}
            width={is_desktop ? '350px' : null}
        >
            {
                target.defaultImg ? 
                (
                    <div className='senior'>
                        <div className='top'>
                            <div className='img-box'>
                                <img src={ target.defaultImg } alt={''} />
                            </div>
                            <div className='info-box'>
                                <h2>{ target.name || '保密' }</h2>
                                <p>major in: <strong>{ target.major || '保密' }</strong></p>
                            </div>
                        </div>
                        <div className='bottom'>
                            <LazyLoadImage class_name={'code-img'} src={ target.codeImg } alt={''} />
                        </div>
                        <img className='come' src="/static/come.png" alt="" />
                    </div>
                ):(
                    <></>
                )
            }
        </Modal>
        </>
    )

})
