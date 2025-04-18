// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 获取所有网格项
  const gridItems = document.querySelectorAll('.grid-item1 .grid-item2');
  // 获取底部图片元素
  const bottomPic = document.querySelector('.ic1-dropdown .bottom-pic');
  // 默认背景图路径
  const icdrown=document.querySelector('.ic1-dropdown');
  const defaultBg = 'url(./asserts/image/rheader/upload/1.png)';
  const defaultbg1='url(./asserts/image/rheader/upload/3.png)';

 
  // 鼠标进入事件处理
  const handleMouseEnter = (index) => {
    return function() {
      // 根据不同的索引设置不同背景
      switch(index) {
        case 0: // 第一个元素
          bottomPic.style.background = defaultBg;
          position();
          console.log('第一个元素');
          break;
        case 1:
          bottomPic.style.background=defaultBg;
          position();
          break;
        case 2: // 第三个元素（索引从0开始）
          bottomPic.style.background = defaultbg1;
          position();
          break;
        case 3:
          bottomPic.style.background = defaultbg1;
          position();
          break;
        default:
          bottomPic.style.background =defaultBg;
          position();
        }
    };
  };
  const position = () => {
    bottomPic.style.backgroundSize = 'cover';          
    bottomPic.style.backgroundPosition = 'center';  
  };
  // 为每个网格项绑定事件
  gridItems.forEach((item, index) => {
      item.addEventListener('mouseenter', handleMouseEnter(index));
      // console.log('鼠标进入第' + index + '个元素');
     
  });
  icdrown.addEventListener('mouseleave', handleMouseEnter(4));
});