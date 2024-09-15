import React, { Component } from "react";
import './Fireworks.scss'

class Fireworks extends Component {
    state = {
        timer:null
    }
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.particles = [];
        this.width = window.innerWidth * 0.55;
        this.height = window.innerWidth * 0.55;
        this.color = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];
        this.mouse = {
            x: null,
            y: null,
            radius: 100,
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        // 添加点击事件，点击时触发效果
        this.canvas.addEventListener("click", (event) => {
            let vw = window.innerWidth / 100;
            let vh = window.innerHeight / 100;
            let centerX = 50 * vw;
            let centerY = 20 * vh + 27.5 * vw;

            // 判断是否在徽章的大致范围内
            let {abs, pow, sqrt} = Math;
            if(abs(sqrt(pow((event.x - centerX), 2) + pow((event.y - centerY), 2))) > 27.5 * vw){
                return;
            }

            clearInterval(this.state.timer);
            this.mouse.x = event.x - this.width * 0.225;         // 设置点击的位置是绝对位置
            this.mouse.y = event.y - window.innerHeight * 0.2;
            let i = 0;
            this.state.timer = setInterval(() => {
                i ++;
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.createParticles();
                this.drawParticles();
                this.updateParticles();
                if(i >= 20){
                    clearInterval(this.state.timer);
                    this.canvas.width = this.canvas.width;
                }
            }, 1000 / 60);
        });

        // 适应窗口变化
        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerWidth;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        });
    }

    // 创建粒子
    createParticles() {
        for (let i = 0; i < 10; i++) {
            const x = this.mouse.x;
            const y = this.mouse.y;
            const radius = Math.random() * 2 + 1.5;         // 单个粒子的大小
            const color = this.color[Math.floor(Math.random() * this.color.length)];
            const velocity = {                  // 速率
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8,
            };
            this.particles.push({ x, y, radius, color, velocity });
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, 
                    particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;

            if (particle.radius > 0.2) {
                particle.radius -= 0.1;
            }else{
                this.particles.splice(index, 1);
            }
        });
    }

    render() {
        return <canvas id="fireworks" ref={this.canvasRef} />;
    }
}

export default Fireworks;
