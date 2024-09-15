/**
 * 
 *          这个是使用 three.js 制作出来的旋转荣誉墙
 *          效果一直不满意，弃用了
 *          2023-9-18
 * 
 */

import React, { useEffect, useRef, useState } from 'react'
import './HonorBall.scss'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { getHonorWallVerType, getHonorWallHor } from '../../../../../utils/request';
import { vertialHonorInfo, horvicalHonorInfo } from '../../../../../utils/staticData';

export default memo(function HonorBall() {
    const teamHonor = useRef();

    function mounted(horPictureArr, verPictureArr){
        // 创建场景
        const scene = new THREE.Scene();

        // 创建相机
        const camera = new THREE.PerspectiveCamera(45, 
            window.innerWidth / window.innerHeight, 0.1, 500);
        let angle = 0;
        let radius = 16;
        // camera.position.set(radius * Math.cos(angle / 180 * Math.PI), 0 * Math.sin(angle / 180 * Math.PI), 0);
        camera.position.set(16, 0, 0);
        camera.lookAt(scene.position);

        // 创建渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(
            window.innerWidth * 0.8 > 1150 ? 1150 : window.innerWidth * 0.8, 
            window.innerWidth * 0.8 > 1150 ? 650 : window.innerHeight * 0.8 * 5 / 9
        );
        renderer.setClearColor(new THREE.Color(0xffffff), 1);

        // 添加坐标轴到场景中
        // const axes = new THREE.AxesHelper(20);
        // scene.add(axes);

        // 创建太阳光
        const ambientLight = new THREE.AmbientLight(new THREE.Color(0x101010), 0.6);
        ambientLight.position.set(100, 0, 100);
        scene.add(ambientLight);

        // 创建聚光灯
        // const spotLight = new THREE.SpotLight( 0xf0f0f0 );
        // spotLight.position.set(16, 0, 10);
        // spotLight.angle = 2
        // let target = new THREE.Object3D();
        // target.position.set(0, 0, 0);
        // spotLight.target = target;
        // spotLight.distance = 14
        // spotLight.intensity = 10            // 光强
        // scene.add(spotLight)

        // 共 17 张图片（中间大，上下小） 平面+贴图
        let topImgArr = [];
        let bottomImgArr = [];
        let horiNum = 7;    // 水平方向的图片数量
        let verNum = 10;    // 垂直方向的图片数量

        for(let i = 0 ; i < horiNum ; i ++){
            topImgArr[i] = new THREE.TextureLoader().loadAsync(horPictureArr[i].url);
        }
        for(let i = 0 ; i < verNum ; i ++){
            bottomImgArr[i] = new THREE.TextureLoader().loadAsync(verPictureArr[i].url);
        }

        const geometryH = new THREE.PlaneGeometry(2 * 1.7 * 1.2, 2 * 1.2);
        const geometryV = new THREE.PlaneGeometry(2 * 1.1, 2 * 1.7 * 1.1);
        var distance = 6;
    
        Promise.all([...topImgArr,...bottomImgArr]).then(([...arr]) =>{
            for(let i = 0 ; i < horiNum ; i ++){
                // 正面
                let material = new THREE.MeshBasicMaterial({ map: arr[i], side: THREE.FrontSide});
                const plane = new THREE.Mesh(geometryH, material);
                plane.position.set(distance * Math.sin(i * Math.PI * 2 / horiNum), 2, distance * Math.cos(i * Math.PI * 2 / horiNum));
                plane.rotation.y = Math.PI * 2 / horiNum * i;
                scene.add(plane);
                // 背面
                let backMaterial = new THREE.MeshBasicMaterial({ color: 0x880000, side: THREE.BackSide});
                const backPlane = new THREE.Mesh(geometryH, backMaterial);
                backPlane.position.set(distance * Math.sin(i * Math.PI * 2 / horiNum), 2, distance * Math.cos(i * Math.PI * 2 / horiNum));
                backPlane.rotation.y = Math.PI * 2 / horiNum * i;
                scene.add(backPlane);
            }
            for(let i = 0 ; i < verNum ; i ++){
                // 正面
                let material = new THREE.MeshBasicMaterial({ map: arr[i + 7], side: THREE.FrontSide });
                const plane = new THREE.Mesh(geometryV, material);
                plane.position.set(distance * Math.sin(i * Math.PI * 2 / verNum), -1.5, distance * Math.cos(i * Math.PI * 2 / verNum));
                plane.rotation.y = Math.PI * 2 / verNum * i;
                scene.add(plane);
                // 背面
                let backMaterial = new THREE.MeshBasicMaterial({ color: 0x880000, side: THREE.BackSide});
                const backPlane = new THREE.Mesh(geometryV, backMaterial);
                backPlane.position.set(distance * Math.sin(i * Math.PI * 2 / verNum), -1.5, distance * Math.cos(i * Math.PI * 2 / verNum));
                backPlane.rotation.y = Math.PI * 2 / verNum * i;
                scene.add(backPlane);
            }

            // 添加控制器
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            // 使用渲染器渲染场景
            document.getElementsByClassName('team-honor')[0].append(renderer.domElement);
            renderer.render(scene, camera);

            function setRenderSize(renderer){                    // 当重新渲染时调用，设置渲染的大小
                if(window.innerWidth * 0.8 < 1150){
                    renderer.setSize(window.innerWidth * 0.8, window.innerWidth * 0.8 * 5 / 9);
                }else{
                    renderer.setSize(1150, 650);
                }
            }

            function render(){
                controls.update();
                requestAnimationFrame(render);
                setRenderSize(renderer);
                renderer.render(scene, camera);
            }

            render();

            // 窗口大小改变时 动态改变元素
            window.addEventListener('resize', ()=>{
                controls.update();
                setRenderSize(renderer);
                renderer.render(scene, camera);
            })

            // 3d元素绕中轴旋转
            function action(){
                angle += 0.15;
                camera.position.set(radius * Math.cos(angle / 180 * Math.PI), 0, radius * Math.sin(angle / 180 * Math.PI));
                // spotLight.position.set(radius * Math.cos(angle / 180 * Math.PI), 0, radius * Math.sin(angle / 180 * Math.PI));
                rotateAnimation = requestAnimationFrame(action);
                setRenderSize(renderer);
                renderer.render(scene, camera);
            }

            var rotateAnimation = requestAnimationFrame(action);

            /**
             * 当用户控制鼠标在该区域中点击或滚动滚轮时，关闭自动旋转
             * 关闭自动旋转，用户控制鼠标移出当前区域后，再自动旋转
             */
            renderer.domElement.addEventListener('mousedown', (event)=>{
                event.preventDefault();
                cancelAnimationFrame(rotateAnimation);
            });
            renderer.domElement.addEventListener('mousewheel', ()=>{
                cancelAnimationFrame(rotateAnimation);
            })
            renderer.domElement.addEventListener('wheel', ()=>{
                cancelAnimationFrame(rotateAnimation);
            })
            renderer.domElement.addEventListener('mouseleave', ()=>{
                cancelAnimationFrame(rotateAnimation);
                rotateAnimation = requestAnimationFrame(action);
            })
        })
    }

    useEffect(()=>{
        const getVer = getHonorWallVerType('all');
        const getHor = getHonorWallHor();

        Promise.all([getHor, getVer]).then(resArr => {
            // console.log(resArr)
            mounted(resArr[0].data, resArr[1].data);
        }).catch(err =>{
            // console.log('honor ball',err);
            mounted(horvicalHonorInfo, vertialHonorInfo);
        })
        return ()=>{}
    },[]);

    return (
        <div className="team-honor" ref={teamHonor}></div>
    )
})
