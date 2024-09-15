import React,{useState, useEffect, memo} from 'react'
import './Suggestion.scss'

import {MailOutlined, PlusOutlined,SwapRightOutlined} from '@ant-design/icons';
import { Modal,Button,Upload,Input,Select,notification,Popover,Radio,message } from 'antd'
import PubSub from 'pubsub-js';

import { isDesktop } from '../../../../utils/funcs'
import { onlyMapVerify } from '../../../../utils/verifyData';

const { TextArea } = Input;

export default memo(function Suggestion() {
    const [showFeedback, setShowFeedback] = useState(false)           // 是否开启反馈和建议面板
    const [fileList, setFileList] = useState([])                // 图片列表
    const [value,setValue] = useState('')                       // 反馈的内容
    const [select,setSelect] = useState('Email')                // 选择联系方式
    const [relation,setRelation] = useState('')                 // 联系方式
    const [errTip,setErrTip] = useState('')                     // 不能上传时的提示
    const [ableToSubmit, setAbleToSubmit] = useState(false)     // 是否能够上传
    const [verify, setVerify] = useState({                      // 验证
        verifyData:'',
        verifyTime:5,
        verifyPass:false,
        radioValue:''
    })

    function changeVerify(verifyPass, verifyTime){              // 每一次验证完成后的更新
        setVerify({
            verifyData:!verifyPass ? onlyMapVerify() : null,
            verifyPass:verifyPass,
            verifyTime:verifyTime,
            radioValue:''
        })
    }

    function checkOpenSuggestion(){              // 打开提交建议的面板之前
        let SG = localStorage.getItem('SG')      // SG 就是suggestion
        if(!SG || SG.split("#")[0] < 0 || SG.split("#")[1] < 0){
            notification.error({
                message:'Error',
                description:'似乎有过非法操作而导致该功能无法正常开启，请刷新重试'
            })
        }else{
            let [lastTime, vt] = SG.split('#')
            let curTime = new Date().getTime()
            let waitTime = 300000
            if(vt <= 0 || curTime - lastTime < waitTime){       // 没有剩余验证次数或距离上次提交时间不合要求
                notification.info({
                    message:'Error',
                    description:'请等待五分钟后再进行操作'
                })
            }else if(vt <= 0 && curTime - lastTime >= waitTime){    // 没有剩余验证时间但是距离上次提交达到要求
                localStorage.setItem('SG','0#5')
                setVerify({
                    verifyData:onlyMapVerify(),
                    verifyPass:false,
                    verifyTime:5,
                    radioValue:''
                })
                setShowFeedback(true)
            }else if(vt > 0){
                setVerify({
                    verifyData:onlyMapVerify(),
                    verifyPass:false,
                    verifyTime:vt,
                    radioValue:''
                })
                setShowFeedback(true)
            }
        }
    }

    function hideFeedback(){                                    // 关闭窗口
        setAbleToSubmit(false)
        setErrTip('')
        setFileList([])
        setRelation('')
        setSelect('Email')
        setValue('')
        setShowFeedback(false)
    }
    const handleChange = ({ fileList: newFileList }) => { setFileList(newFileList) }
    const handleRemove = (file)=>{                  // 移除图片
        let newFileList = fileList.filter((e)=>{
            return file.uid !== e.uid
        })
        setFileList(newFileList)
    }

    const relationChange = (val)=>{                 // 判断输入的联系方式是否符合规范
        setRelation(val)
        if(val.trim() === ''){
            setErrTip('')
            if(val){
                setAbleToSubmit(true)
            }else if(ableToSubmit){
                setAbleToSubmit(false)
            }
            return
        }
        let tip = ''
        if(select === 'Email'){
            let reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            let res = reg.test(val)
            if(!res){
                tip = '邮箱地址不符合规范！'
            }else{
                tip = ''
            }
        }else if(select === 'self-phone' && (val.charAt(0) !== '1' || val.length !== 11)){
            tip = '请输入正确的十一位数的手机号'
        }else if(select === 'wechat' && val.length < 3){
            tip = '请输入正确的微信号'
        }else{
            tip = ''
        }
        setErrTip(tip)
        if(!tip && value){
            setAbleToSubmit(true)
        }else{
            setAbleToSubmit(false)
        }
    }

    const feedbackChange = (val)=>{                 // 反馈内容更改
        setValue(val)
        if(val.trim() && !errTip){
            setAbleToSubmit(true)
        }else{
            setAbleToSubmit(false)
        }
    }

    // 验证 用户选择
    function verifySelect(e){
        let inpval = e.target.value
        if(inpval !== verify.verifyData.answer){
            if(verify.verifyTime - 1 <= 0){                    // 当可用验证次数用完时
                let date = new Date().getTime()
                let ufdata = `${date}#0`
                localStorage.setItem('SG', ufdata)         // 设置本次的时间戳，等待五分钟之后才能操作
                setShowFeedback(false)
                notification.info({
                    message:'Tip',
                    description:'验证失败，请五分钟后重试'
                })
            }else{
                let ufdata = `0#${verify.verifyTime - 1}`
                localStorage.setItem('SG', ufdata)
                changeVerify(false,verify.verifyTime - 1)
                notification.info({
                    message:'Tip',
                    description:'验证失败，剩余' + (verify.verifyTime - 1) +'次验证'
                })
            }
        }else{                              // 验证成功
            message.success({
                content:'验证成功',
            })
            changeVerify(true, 5)
            let ufdata = `0#5`
            localStorage.setItem('SG', ufdata)
        }
    }

    const submit = () => {
        if(!value || errTip){return}
        let sel = '_'
        let rel = '_';
        switch(select){
            case 'Email': sel = '1'; break;
            case 'self-phone': sel = '1'; break;
            case 'wechat' : sel = '2'; break;
        }
        if(relation){                       // 加密，大小写转化，小于5的数字加5，大于5的数字减5
            let temp = btoa(relation)                // base64编码
            let charArr = [...temp]        // 字符串转成字符数组
            let newArr = []
            for(let i = 0 ; i < charArr.length; i ++){
                let temp = charArr[i]
                if(charArr[i] >= 'a' && charArr[i] <= 'z'){
                    temp = String.fromCharCode(charArr[i].charCodeAt(0) - 32)
                }
                if(charArr[i] >= 'A' && charArr[i] <= 'Z'){
                    temp = String.fromCharCode(charArr[i].charCodeAt(0) + 32)
                }
                if(charArr[i] >= '0' && charArr[i] < '5'){
                    temp = String.fromCharCode(charArr[i].charCodeAt(0) + 5)
                }
                if(charArr[i] > '5' && charArr[i] <= '9'){
                    temp = String.fromCharCode(charArr[i].charCodeAt(0) - 5)
                }
                newArr.push(temp)
            }
            rel = (new String(newArr)).replaceAll(',', '')
            rel = encodeURIComponent(rel)
        }
        let params = {
            'feedback':value,
            'rel-type':relation ? (sel || '_') : '_',
            'rel-value':rel
        }
        let formData = new FormData();
        fileList.forEach((e)=>{
            formData.append('Files', e.originFileObj);
        })
        
        PubSub.publish('doing', '正在提交')
        // uploadFeedback(formData, params).then(res=>{
        //     notification.success({message:'Tip',description:'提交成功!'})
        //     let time = new Date().getTime()
        //     localStorage.setItem('SG', `${time}#5`)
        // }).catch(err=>{
        //     notification.error({message:'Tip',description:'提交失败！'})
        // }).finally(()=>{
            notification.success({message:'Tip',description:'没有对接服务端哟'})
            hideFeedback()
            PubSub.publish('done')
        // })
    }
/*    // 解密测试 控制台debug
    // function decode(){
    //     let res = 'mtiZndK9n5bXCs5ZDhuUy74T'
    //     res = decodeURIComponent(res)


    //     let charArr = [...res]
    //     let newArr = []
    //     for(let i = 0 ; i < charArr.length; i ++){
    //     let temp =charArr[i]
    //     if(charArr[i] >= 'a' && charArr[i] <= 'z'){
    //         temp = String.fromCharCode(charArr[i].charCodeAt(0) - 32)
    //     }
    //     if(charArr[i] >= 'A' && charArr[i] <= 'Z'){
    //         temp = String.fromCharCode(charArr[i].charCodeAt(0) + 32)
    //     }
    //     if(charArr[i] >= '0' && charArr[i] < '5'){
    //         temp = String.fromCharCode(charArr[i].charCodeAt(0) + 5)
    //     }
    //     if(charArr[i] > '5' && charArr[i] <= '9'){
    //         temp = String.fromCharCode(charArr[i].charCodeAt(0) - 5)
    //     }
    //     newArr.push(temp)
    //     }
    //     let str = new String(newArr)
    //     str = str.replaceAll(',','')
    //     console.log(str)
    //     let result = atob(str)
    //     console.log(result)
    // }
*/


    useEffect(()=>{                     // 当选择的联系方式改变时，检查联系方式的值
        relationChange(relation)
    },[select])

    useEffect(()=>{                     // 创建 SG
        let SG = localStorage.getItem('SG')
        if(!SG){
            localStorage.setItem('SG', '0#5')         // 上次提交时间，剩余可用的验证时间
        }
    },[])

    let is_desktop = isDesktop()

    return (
        <>
        {
            is_desktop ? (
                <div className='suggestion-box' onClick={checkOpenSuggestion}>
                    <p>leave word or suggestion</p>
                    <MailOutlined className='mail'/>
                    <hr className='hr'/>
                </div>
            ):(
                <Button className='suggestion-box' onClick={checkOpenSuggestion} 
                    style={{color:'#845ec2',padding:'14px',height:'40px'}}>
                    <p>leave word or suggestion</p>
                    <MailOutlined className='mail' style={{width:'35px',fontSize:'1.2rem'}}/>
                </Button>
            )
        }
        <Modal
            title="感谢您的建议让我们变得更好！🫡"
            open={showFeedback}                 // 对话框是否可见
            onOk={submit}
            onCancel={hideFeedback}
            okText="发送"
            cancelText={'取消'}
            okButtonProps={{disabled:!ableToSubmit || !verify.verifyPass}}
            destroyOnClose={true}
            // style={{right:-180}}
        >
            <TextArea
                style={{margin:'18px 0'}}
                value={value}
                onChange={(e) => feedbackChange(e.target.value)}
                placeholder="(必填项)请输入留言或建议（leave word or suggestion）..."
                maxLength={240}
                showCount={true}
                autoSize={{ minRows: 3, maxRows: 5}}
            />
            <div className='relation'>
                <Select
                    defaultValue="Email"
                    style={{width: 140,}}
                    onChange={(val) => {setSelect(val)}}
                    options={[
                        { value: 'Email', label: 'Email'},
                        { value: 'self-phone', label: 'self-phone'},
                        { value: 'wechat', label: 'wechat'}
                    ]}
                    placement={'bottomLeft'}
                    placeholder='请选择联系方式'
                ></Select>
                <SwapRightOutlined style={{fontSize:'1.4rem',fontWeight:'900',margin:'0 10px'}}/>
                <Input
                    style={{width:'170px'}}
                    placeholder={`请输入${select === 'Email' ? '邮箱' : select === 'self-phone' ? '手机号' : '微信号'}`} 
                    onChange={(e)=>relationChange(e.target.value)}
                    value={relation}
                    status={errTip ? 'error' : ''}
                ></Input>
            </div>
            {
                (verify.verifyData && !verify.verifyPass) ? (
                    <div className='verify'>
                        <Popover placement={window.innerWidth < 500 ? 'center': 'rightBottom'} 
                            title={!verify.verifyData.targetImg.includes('place') ? '地图来源于：广海星链团队' : ''} content={
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
            <div className='err-tip'>{ errTip }</div>
            <Upload
                className='upload'
                listType="picture-card"
                fileList={fileList}
                accept='.png,.jpg,.gif'
                maxCount={3}
                onChange={handleChange}
                onRemove={handleRemove}
                beforeUpload={()=>{return false}}
            >
                {fileList.length >= 3 ? null : (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8, }} >
                            <p>上传图片</p>
                        </div>
                    </div>
                )}
            </Upload>
        </Modal>
        </>
    )
})
