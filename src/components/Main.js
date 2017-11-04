require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';



//todo 获取图片相关数据；
let imageDatas = require('../data/imageDatas.json');

//todo 获取图片相关数据，利用自执行函数，将图片名信息转换成图片url路径信息；
imageDatas = ((imageDatasArr) => {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


//todo 获取区间内的一个随机值
var getRangeRandom = (low, high) => Math.ceil(Math.random() * (high - low) + low);

//todo 获取0-30之间的一个任意正负值；
var get30DegRandom = () => {
  return (Math.random()>0.5 ? '' : '-' )+ Math.ceil(Math.random()*30);
};

class ImgFigure extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

//todo imgFigure的点击处理函数
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }



  render(){
    //todo 如果props属性中指定了这张图片的位置，则使用
    var styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //todo 如果图片的旋转角度有值并且不为0，添加旋转角度；
    if(this.props.arrange.rotate){
      ['MozTransform','msTransform','WebkitTransform','transform'].forEach((value) => {
        styleObj[value]='rotate('+this.props.arrange.rotate + 'deg)';
      });
    }


    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;
    }
    var imgFigureClassName='img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';//空格很重要
    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}


//todo 控制组件
class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }
  handleClick(e){
  //todo 如果当前点击的是当前正在选中态按钮，则反转图片，否则将对应图片居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    var controllerUnitClassName='controller-unit';
    //TODO 如果对应的是居中图片，显示控制按钮的居中态

    if(this.props.arrange.isCenter){
      controllerUnitClassName+=' is-center';

      //todo 如果对应的是图片翻转态
      if(this.props.arrange.isInverse){
        controllerUnitClassName+=' is-inverse';
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}>

      </span>
    )
  }

}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false, //正反面
        //isCenter:false 图片是否居中
        //}
      ]
    };

  }

  //todo 翻转图片；@parm index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  //todo 闭包函数 return 一个真正被执行的函数；
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }




  //todo 重新布局所有图片
  // todo @param centerIndex 指定居中排布哪个图片

  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
      topImgSpiceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);



    //todo 首先居中 centerIndex图片， 首先居中的centerIndex 图片不需要旋转；

    imgsArrangeCenterArr[0]={
      pos:centerPos,
      rotate:0,
      isCenter:true
  };




    //todo 取出要布局上侧的图片的状态信息；
    topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);

    //todo 布局位于上侧的图片

    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      };
    });

    //todo 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //todo 前半部分布局左边,右边部分布局右边

      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i]={
        pos:{
        top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
        left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
      },
        rotate:get30DegRandom(),
        isCenter:false
      }
    }

    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  //todo 利用rearrange函数，居中对应index的图片；
  center(index){
    return () => {
      this.rearrange(index);
    }
  }


  //todo 组件加载后，为每张图片计算其位置范围
  componentDidMount(){
    //todo 拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //todo 拿到一个imageFigure大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //todo 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //todo 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //todo 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);



}

  render() {
    var controllerUnits=[],imgFigures=[];
    imageDatas.forEach((value, index) => {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      }
      imgFigures.push(<ImgFigure data={value}  ref={'imgFigure'+index}
                                 arrange={this.state.imgsArrangeArr[index]}
                                  inverse={this.inverse(index)} center={this.center(index)}
      />);

      controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
