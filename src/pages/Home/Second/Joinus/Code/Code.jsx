import React, { Component } from 'react';
import './Code.scss';

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';

// import 'codemirror/theme/neo.css';
import { githubLight } from '@uiw/codemirror-theme-github';
import { langs } from '@uiw/codemirror-extensions-langs';

export default class Code extends Component {
    codemirrorBox =React.createRef();
    codeArea = React.createRef();

    state = {
        showCode: '',                  // 页面正在显示的内容
        codeMode: '',                  // 类型
        isWritingCode: false,
        canSpread:false,               // 界面滚动到代码区域可视时，打印代码
        showTitle:false,               // 界面滚动到标题区域可视时，标题显示
        showDesc:false,                // 界面滚到到描述性区域（如果你xxx，xxx）、if 、then显现
        codeData:[],
    }
    typePng = [
        ['MySQL.png','sql',0],
        ['Python.png','py',1],
        ['Java.png','java',2],
        ['JavaScript.png','js',3],
    ]
    typeCode = [                    // 静态代码，代码类型与上面的typePng顺序对应
        ` \nINSERT INTO gdou_Math_Modeling\nSELECT * \nFROM freshmenOfGDOU\nWHERE ability >= @preeminent;\n `,
        ` \ntry:\n\tif you.selectTeam != "GDOU-Math-Modeling":\n\t\traise RegretForSelectedException\nexcept RegretForSelectedException as opportunity:\n\topportunity.selectAgain()\n `,
        ` \npublic interface ProsperousAndStrong {\n\tpublic void prosperousAndStrong();\n}\n\nclass GDOU_Math_Modeling implements ProsperousAndStrong{\n\t......\n\tpublic void prosperousAndStrong(){\n\t\t// wait you to finish with us.\n\t}\n}\n `,
        ` \nus.addEventListener('you coming', you => {\n\tus.pauseAllThingAndPrepare().then( us => {\n\t\tus.toPickUp(you);\n\t});\n});\n `,
    ]

    changeCode(index){                  // 选择了查看另一种类型的代码
        if(this.state.isWritingCode){
            return;
        }
        this.setState({isWritingCode:true});
        let childNodes = this.codemirrorBox.current.childNodes;
        childNodes.forEach(element => {                     // 检查并移除所有元素已有的.actived
            if(element.classList.contains('item-actived')){
                element.classList.remove('item-actived');
            }
        });
        childNodes[index].classList.add('item-actived');    // 将选中的类型添加激活规则集
        let showCodeArr = this.typeCode[index].split('');      // 将代码分成字符数组
        this.setState({
            showCode:'',
            codeMode:this.typePng[index][2]
        },()=>{                   // 清空
            this.pushChar(showCodeArr, 0);                     // 依次打代码
        });                       
    }
    pushChar(charArr, newCharIndex){                        // 打代码的动画
        let newChar = this.state.showCode + charArr[newCharIndex];
        this.setState({showCode:newChar},()=>{
            if(newCharIndex + 1 < charArr.length){
                requestAnimationFrame(() => this.pushChar(charArr, newCharIndex + 1));
            }else{
                this.setState({isWritingCode:false});
            }
        });
    }
    createFileTypeList(){                                   // 创建4个文件类型的标题
        return this.typePng.map((e,index)=>{
            return (
                <div className={`item ${index === 0 ? 'item-actived' : ''}`} key={index}
                    onClick={ e => this.changeCode(index) }>
                    <img className='icon' src={`/static/icons/${e[0]}`} alt="" />
                    <span className='title'>{`toYou.${e[1]}`}</span>
                </div>
            )
        })
    }
    codespread =()=>{                                          // 滚动到可见，打字显现
        const { showCode } = this.state;
        if(!showCode && this.codeArea.current
             && this.codeArea.current.getBoundingClientRect().y < window.innerHeight * 0.6){            // 打印代码
            let showCodeArr = this.typeCode[0].split('');      // 将代码分成字符数组
            this.setState({
                showCode:'',
                codeMode:this.typePng[0][2]
            },()=>{                   // 清空
                this.pushChar(showCodeArr, 0);                     // 依次打代码
            });
            window.removeEventListener('scroll', this.codespread);
        }
    }
    largeCodeSpread = () => {                                   // 屏幕可用宽度大于等于1000时
        const { showCode } = this.state;
        if(!showCode && window.scrollY > window.innerHeight * 6.4){
            let showCodeArr = this.typeCode[0].split('');      // 将代码分成字符数组
            this.setState({
                showCode:'',
                codeMode:this.typePng[0][2]
            },()=>{                   // 清空
                this.pushChar(showCodeArr, 0);                     // 依次打代码
            });
            window.removeEventListener('scroll', this.largeCodeSpread);
        }
    }

    render() {
        return (
            <div className='code-container' ref={this.codeArea}>
                <section className='file-type-list' ref={this.codemirrorBox}>
                    {this.createFileTypeList()}
                </section>
                <CodeMirror
                    value={this.state.showCode}
                    className='my-codemirror-wrapper'
                    theme={githubLight}
                    autoFocus={false}
                    editable={false}
                    readOnly={true}
                    extensions={
                        this.codeMode === 0 ? [langs.sql()] :
                        this.codeMode === 1 ? [langs.python()] :
                        this.codeMode === 2 ? [langs.java()] : [langs.javascript()]
                    }
                />
            </div>
        )
    }
    componentDidMount(){
        if(window.innerWidth >= 1000){
            window.addEventListener('scroll', this.largeCodeSpread);
        }else{
            window.addEventListener('scroll', this.codespread);
        }
    }
}
