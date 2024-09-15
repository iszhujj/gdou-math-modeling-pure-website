import axios from "axios";
import PubSub from "pubsub-js";

const baseURL = 'http://xxx.xxx:8080';

const uploadZIPFileURL = '/uploadTestZip';

// 默认的 get 请求
async function get_request(url, headers){
    try{
        let res = await axios.get(`${baseURL}${url}`, {
            headers,
            timeout:3000
        });
        return res;
    }catch(error){
        PubSub.publish('serverError')
        // console.warn(url, error);
    }
}

// 请求教师信息
export function getTeacherInfo(){
    return get_request('/leaderTeacher');
}

// 底部联系我们
export function getContactUsInfo(){
    return get_request('/Bottom/contectUS');
}

// 关注我们
export function getAttention(){
    return get_request('/Bottom/attention');
}

// 获取轮播图图片
export function getSlidePictures(){
    let headers = {
        "Access-Control-Allow-Origin":'*'
    }
    return get_request('/slidePictures', headers);
}

// 获取荣誉墙水平图片
export function getHonorWallHor(){
    // let headers = {
    //     "Access-Control-Allow-Origin":'*'
    // }
    // return get_request('/honorWall/horizontal', headers);
    return new Promise((res,rej)=>{
        return rej()
    })
}

export function getHonorWallVerType(type){
    // if(type !== 'all' && type !== 'four'){
    //     return Promise.reject('type 类型错误，只能为 all 或 four.');
    // }
    // return get_request(`/honorWall/vertical/${type}`);
    return new Promise((res,rej)=>{
        return rej()
    })
}

// 请求竖直和水平交错的大量图片
export function getAllHonor(){
    return get_request('/returnAllHonor');
}

// 获取 toYou 内容
export function getToYouContent(){
    return get_request('/toYouContent');
}

// 获取当前的成员数量
export function getCurrentNumber(){
    return get_request('/getCurrentNumber');
}

// 获取入队规则
export function getJoinRules(){
    return get_request('/join-rules');
}

// 上传验证 预校验
export async function requestAbleToUpload(name_class_obj){
    try{
        let res = await axios.post(`${baseURL}/ableToUpload`,name_class_obj,{timeout:3000})
        return res;
    }catch(e){
        PubSub.publish('serverError')
        console.warn('check able to upload fail.',e)
    }
}

// 上传考核作品
export async function uploadtestZipFile(formData, headers){
    try{
        let res = await axios.post(`${baseURL}${uploadZIPFileURL}`,
            formData,
            {headers}
        );
        return res;
    }catch(error){
        console.warn('upload word request fail',error);
    }
}

// 招新表单图片
export async function gotoRegistImg(){
    return axios.get(`${baseURL}/gotoRegistImg`);
}

// 反馈
export async function uploadFeedback(formData, params){
    axios.post(`${baseURL}/feedback/
        ${encodeURIComponent(params.feedback)}/
        ${encodeURIComponent(params['rel-type'])}/${encodeURIComponent(params['rel-value'])}`,
        formData,
        {
            headers:{
                'Content-Type':'multipart/form-data'
            },
            timeout:3000
        }).then(res=>{}).catch(e=>{})
    return axios.post(
        `${baseURL}/feedback/${encodeURIComponent(params.feedback)}/${encodeURIComponent(params['rel-type'])}/${encodeURIComponent(params['rel-value'])}`, 
        formData, 
        {
            headers:{
                'Content-Type':'multipart/form-data'
            },
            timeout:3000
        }
    )
}

// 获取荣誉历史
export async function getHistoryHonor(){
    return axios.get(`${baseURL}/historyHonor`)
}

// 提交用户设备信息
export async function sendInfo(screenWidth, screenHeight, userAgent){
    axios.post(`${baseURL}/sendInfo`,{
        screenWidth, screenHeight, userAgent
    }).then(()=>{}).catch(()=>{})
}

