import React,{useState,useRef, useEffect, memo} from 'react'
import './More.scss'

import { Modal,Input,Select,notification, message, Upload, Radio, Popover } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { isDesktop } from '../../../../../utils/funcs';

import {_verify_} from '../../../../../utils/verifyData'
import PubSub from 'pubsub-js';

const { Dragger } = Upload;

export default memo(function More() {
    const [moreOpen, setMoreOpen] = useState(false);            // 是否打开文件上传
    const [file, setFile] = useState();                         // 上传的文件
    const [selectValue, setSelectValue] = useState('');         // 选择的方向
    const [round, setRound] = useState('');                     // 几轮考核
    const [ableToUpload, setAbleToLoad] = useState(false);           // 是否启用上传功能
    const [showUnableUploadTip,setShowUnableUploadTip] = useState(false);       // 是否显示无权上传的提示
    const [tipInfo, setTipInfo] = useState('')                  // 不可上传时的提示
    const [uploading, setUploading] = useState(false);              // 是否正在上传
    const [stuName, setStuName] = useState('');
    const [stuClass, setStuClass] = useState('');
    const [emailLegal, setEmailLegal] = useState(true);           // 邮箱格式错误（如果有填
    const [verify, setVerify] = useState({
        verifyData:'',
        verifyTime:3,
        verifyPass:false,
        radioValue:''
    })

    const inpName = useRef()
    const inpClass = useRef()
    const inpEmail = useRef()

    function init(verifyTime){                    // 恢复初始化
        setFile(null)
        setSelectValue('')
        setRound('')
        setAbleToLoad(false)
        setShowUnableUploadTip(false)
        setUploading(false)
        setStuName('')
        setStuClass('')
        setTipInfo('')
        setVerify({
            verifyData:null,
            verifyPass:false,
            verifyTime:verifyTime >= 0 ? verifyTime : verify.verifyTime,
            radioValue:''
        })
    }

    function changeVerify(verifyPass, verifyTime){
        setVerify({
            verifyData:!verifyPass ? _verify_() : null,
            verifyPass:verifyPass,
            verifyTime:verifyTime,
            radioValue:''
        })
    }

    function checkOpenPanel(){              // 打开上传面板 验证是否能打开上传面板
        let UF = localStorage.getItem('UF')
        if(UF){
            let [date, vt] = UF.split('#')
            let currentDate= new Date().getTime()
            let waitTime = 300000;
            if(vt > 0){             // 有次数或者五分钟以上
                changeVerify(false, vt)
                setMoreOpen(true)
            }else if(!vt <= 0 && currentDate - date > waitTime){
                localStorage.setItem('UF',`0#3`)            // 恢复三次机会
                changeVerify(false, 3)
                setMoreOpen(true)
            }else{
                notification.info({
                    message:'Tip',
                    description:'验证失败次数过多，等待五分钟后方能重试'
                })
            }
        }else{
            localStorage.setItem('UF','0#3')
            changeVerify(false, 3)
            setMoreOpen(true)
        }
    }

    useEffect(()=>{
        isAbleToUpload()
    },[selectValue])

    useEffect(()=>{                     // 挂载获取用于验证的数据
        if(!verify.verifyData || !verify.verifyData.question){
            setVerify({
                verifyData:_verify_()
            })
        }
    },[])

    // 上传考核作品文件时使用
    const props = {
        name: 'file',
        multiple: false,
        accept:'.zip',
        maxCount:1,
        disabled:!ableToUpload || !verify.verifyPass,
        beforeUpload:(file, fileList)=>{        // 点击上传文件时
            setFile(file);
            return false        // 不自动上传到服务器
        },
        onDrop(e){             // 拖动文件上传时
            setFile(e.dataTransfer.files[0]);
        },
        onRemove(e){            // 移除文件时
            setFile(null)
            return true
        }
    };

    function selectChange(val){ setSelectValue(val) }

    function emailChange(e){                // email 输入框变化时
        let val = e.target.value;
        if(!val.trim()){
            setEmailLegal(true)
            return
        }
        let reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        let legal = reg.test(val)
        if(!legal && emailLegal){ setEmailLegal(false) }
        else if(legal && !emailLegal){ setEmailLegal(true) }
    }

    // 验证 用户选择
    function verifySelect(e){
        let inpval = e.target.value
        if(inpval !== verify.verifyData.answer){
            if(verify.verifyTime - 1 <= 0){                    // 当可用验证次数用完时
                let date = new Date().getTime()
                let ufdata = `${date}#0`
                localStorage.setItem('UF', ufdata)         // 设置本次的时间戳，等待五分钟之后才能操作
                init(verify.verifyTime - 1 > 0 ? verify.verifyTime - 1 : 0)
                setMoreOpen(false)
                notification.info({
                    message:'Tip',
                    description:'验证失败，请五分钟后重试'
                })
            }else{
                let ufdata = `0#${verify.verifyTime - 1}`
                localStorage.setItem('UF', ufdata)
                changeVerify(false,verify.verifyTime - 1)
                notification.info({
                    message:'Tip',
                    description:'验证失败，剩余' + (verify.verifyTime - 1) +'次验证'
                })
            }
        }else{                              // 验证成功
            message.success({
                content:'验证成功',
                style:{transform:'translate(0, 60px)'}
            })
            changeVerify(true, 3)
            let ufdata = `0#3`
            localStorage.setItem('UF', ufdata)
        }
    }

    function isAbleToUpload(){                      // 预校验 检查是否能够上传
        let name = inpName.current ? inpName.current.input.value : '';
        let class_ = inpClass.current ? inpClass.current.input.value : '';
        setStuName(name);
        setStuClass(class_);
        if(!name || !class_ || !selectValue) return;
        // requestAbleToUpload({fullName:name, stuClass:class_,selDire:selectValue}).then(res => {
        //     if(res.data.result){                // 可以提交
        //         setAbleToLoad(true);
        //         setShowUnableUploadTip(false);
        //         setRound(res.data.data)
        //     }else{
        //         setAbleToLoad(false);
        //         setRound('')
        //         setShowUnableUploadTip(true);
        //         if(parseInt(res.data.resCode) === 0){
        //             setTipInfo('未查找到报名信息（或提交方向与报名时不符）')
        //         }else if(parseInt(res.data.resCode) === 1){
        //             setTipInfo('距离上次上次成功不足五分钟，请五分钟后再上传')
        //         }else if(parseInt(res.data.resCode) === 2){
        //             setTipInfo(res.data.msg)
        //         }else{
        //             // 重复请求次数过多，短时间内不能再打开提交
        //         }
        //     }
        // }).catch(e => {
        //     setAbleToLoad(false);
        //     setTipInfo('预校验失败')
        //     setRound('')
        //     setShowUnableUploadTip(false);
        //     notification.error({
        //         message:'Tip',
        //         description:'预校验失败，请稍后再试'
        //     })
        // })

        setAbleToLoad(false)
        setTipInfo('')
        setRound('')
        setShowUnableUploadTip(false);
        notification.success({
            message:'Tip',
            description:'没有接入服务端哟'
        })
    }

    function uploadFileAndInfo(){                   // 上传
        if(!ableToUpload || showUnableUploadTip || uploading || 
            (inpEmail.current.input.value && !emailLegal)) return;

        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);                         // 上锁
        PubSub.publish('doing','正在上传')

        let fullName = inpName.current.input.value;
        let stuClass = inpClass.current.input.value;
        let email = inpEmail.current.input.value;
        let selDire = selectValue;
        
        let date = new Date();
        let uploadTime = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}#${date.getHours()}:${date.getMinutes()}`
        let fileName = `${(fullName)}-${(stuClass)}-${(selDire)}-${(round)}#${uploadTime}`
        let data = {
            fullName:fullName || '',
            stuClass:stuClass || '',
            email:email || '',
            selDire:selDire || '',
            round:round.split('-')[0] || '',
            fileName:fileName
        }

        // uploadtestZipFile(formData,{
        //     "upload-info":encodeURIComponent(JSON.stringify(data))
        // }).then((res) => {
        //     if(res.data.result){
        //         notification.success({
        //             message:'Tip',
        //             description:'文件上传成功'
        //         });
        //     }else{
        //         notification.error({
        //             message:'Tip',
        //             description:'文件上传失败，请稍后再试'
        //         })
        //     }
        // }).catch((err) => {
        //     notification.error({
        //         message:'Tip',
        //         description:'文件上传失败，请稍后再试'
        //     })
        // }).finally(() => {

            notification.success({
                message:'Tip',
                description:'没有接入服务端哟'
            });

            setUploading(false);                    // 解锁
            PubSub.publish('done')
            init()
            setMoreOpen(false);
        // });
    }

    return (
        <>
            <div onClick={checkOpenPanel} 
                style={isDesktop ? {display:'inline-block'} : {display:'none'}} 
                className='more'>
                <p> Work submission </p>
            </div>

            {/* 点击 more 之后的弹窗,考核作品提交 */}
            <Modal
                destroyOnClose={true}
                title="考核作品提交"
                centered
                cancelText='取消'
                okText='确认上传'
                open={moreOpen}
                onOk={() => uploadFileAndInfo()}
                onCancel={() => {
                    setMoreOpen(false);
                    init()
                }}
                okButtonProps={{
                    disabled: !file || !verify.verifyPass,
                }}
            >
                <div className='model-content'>
                    {/* 姓名 */}
                    <div className='item-div'>
                        <label htmlFor="">
                            <span style={{color:'brown'}}>*</span>
                            姓名：
                        </label>
                        <Input ref={inpName} placeholder='请输入姓名' onBlur={()=>isAbleToUpload()}/>
                    </div>
                    {/* 班级 */}
                    <div className='item-div'>
                        <label htmlFor="">
                            <span style={{color:'brown'}}>*</span>
                            班级：
                        </label>
                        <Input ref={inpClass} placeholder='如：大气1213' onBlur={()=>isAbleToUpload()}/>
                    </div>
                    {/* 选择提交方向 */}
                    <div className='item-div'>
                        <label htmlFor="">
                            <span style={{color:'brown'}}>*</span>
                            提交方向：
                        </label>
                        <Select
                            onChange={(value, option)=>{
                                console.log(123,value)
                                selectChange(value)
                            }}
                            showSearch
                            style={{width: 200}}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={[
                                { value: '0', label: '前端开发' },
                                { value: '1', label: '后端开发'},
                                { value: '2', label: '计算机视觉'},
                                { value: '3', label: '运筹优化' },
                                { value: '4', label: 'UI设计' },
                                { value: '5', label: '数据挖掘'},
                            ]}
                        />
                    </div>
                    {/* 预校验后显示的提交方向和轮次 */}
                    {
                        round ? (
                            <div className='item-div'>
                                <label htmlFor="">当前考核轮次：</label>
                                <p style={{fontSize:'1rem',fontWeight:'600',color:'#1f77e7',margin:'5px 0'}}>
                                    { round.split('-')[1] }
                                </p>
                            </div>
                        ) : ('')
                    }
                    {/* 邮箱 */}
                    <div className='item-div'>
                        <label htmlFor="">Email：</label>
                        <Input ref={inpEmail} placeholder='请输入邮箱' 
                            status={emailLegal ? '' : 'error'}
                            onChange={emailChange}
                        />
                    </div>
                    {
                        (verify.verifyData && !verify.verifyPass) ? (
                            <div className='verify'>
                                <Popover placement="right" 
                                title={!verify.verifyData.targetImg.includes('place') ? '地图来源于：广海星链团队' : ''}
                                 content={
                                    <img className='large-verify-img'
                                        style={
                                            {width:'40vw',height:'40vw',maxWidth:'450px',maxHeight:'450px',minWidth:'270px',minHeight:'270px'}
                                        }
                                        src={`/static/verify${verify.verifyData.targetImg}`} alt=""/>
                                }>
                                    <img className='verify-img' src={`/static/verify${verify.verifyData.targetImg}`} alt=""/>
                                </Popover>
                                <div className='verify-question-select'>
                                    <label className='ver-label'>{ verify.verifyData.question }</label>
                                    <Radio.Group options={
                                        verify.verifyData.selectArr.map((e)=>({value:e,label:e}))
                                    } onChange={verifySelect} value={verify.radioValue} optionType="button" />
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        showUnableUploadTip ? 
                        (
                            <div className='unable-to-upload'>
                                <p>
                                <span style={{color:'black',fontSize:'0.90rem'}}>
                                    {inpClass.current ? (inpClass.current.input.value ? inpClass.current.input.value : '') : ''}-
                                    {inpName.current ? (inpName.current.input.value ? inpName.current.input.value : '') : ''} 
                                </span>&emsp;
                                你好：</p>
                                <p>{ tipInfo }</p>
                            </div>
                        ) : ''
                    }
                </div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或将文件拖动到此处预上传</p>
                    <p className="ant-upload-hint">
                        每次仅允许上传单个文件，仅接收zip类型压缩文件
                    </p>
                </Dragger>
            </Modal>
        </>
    )
})
