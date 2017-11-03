require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//todo 获取图片相关数据；
let imageDatas = require('../data/imageDatas.json');

//todo 获取图片相关数据，利用自执行函数，将图片名信息转换成图片url路径信息；
imageDatas=(function genImageURL(imageDatasArr){
  for(let i=0,j=imageDatasArr.length;i<j;i++){
    var singleImageData=imageDatasArr[i];
    singleImageData.imageURL=require('../images'+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
