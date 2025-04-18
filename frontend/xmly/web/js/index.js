
// header 鼠标下划线及下拉菜单
(function(){
   // const audio = new Audio('/music/10700166.mp3');
   // audio.play().catch(e => console.error("播放失败:", e));
   const navItems = document.querySelectorAll('.nav-item');
   const underline = document.querySelector('.headerscroll');
  // 下划线动画逻辑
   function updateUnderline(target) {
      const { left, width } = target.getBoundingClientRect();
      const containerLeft = document.querySelector('.lheader').getBoundingClientRect().left;
      underline.style.opacity = '1';
      underline.style.width = `${width-38}px`;
      underline.style.left = `${19+left - containerLeft}px`;
   }

   // 默认下划线在第一个标签下面  高亮第一个元素
   const firstNavItem = document.querySelector('.nav-item');
   let activeNavItem = firstNavItem; 

   if (firstNavItem) {
      updateUnderline(firstNavItem);
      navItems[0].style.color = 'black';
      navItems[0].style.fontSize = '16px';
      activeNavItem = navItems[0];
   }

   // 鼠标移动处理
   navItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        if (!item.classList.contains('fenlei')) {
           updateUnderline(e.currentTarget);
        }
      });
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('fenlei')) {
           if (activeNavItem) {
              updateUnderline(activeNavItem); // Keep underline on the active item
           } else if (firstNavItem) {
              updateUnderline(firstNavItem); // Default to the first item
           } else {
              underline.style.opacity = '0';
           }
        }
      });
      item.addEventListener('click', () => {
        navItems.forEach(nav => {
           nav.style.color = ''; 
           nav.style.fontSize = ''; // Reset font size for all items
        });
        item.style.color = 'black'; // Set clicked item's font color to black
        item.style.fontSize = '16px'; // Slightly increase clicked item's font size
        activeNavItem = item; // Update the active item
      });
   });

  // 分类菜单特殊处理
  const fenlei = document.querySelector('.fenlei');
  let menuVisible = false;

  fenlei.addEventListener('mouseenter', () => {
      menuVisible = true;
      updateUnderline(fenlei);
  });

  fenlei.addEventListener('mouseleave', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('.fenlei')) {
          menuVisible = false;
          if (activeNavItem) {
            updateUnderline(activeNavItem); // Keep underline on the active item
         } else if (firstNavItem) {
            updateUnderline(firstNavItem); // Default to the first item
         } else {
            underline.style.opacity = '0';
         }
      }
  });

  // 下拉菜单交互
  document.querySelector('.dropdown').addEventListener('mouseenter', () => {
      underline.style.opacity = '1';
  });

  document.querySelector('.dropdown').addEventListener('mouseleave', () => {
    updateUnderline(firstNavItem);
  });})();


// 搜索框下拉菜单

(function(){
   document.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.querySelector('.sinput');
      // 测试是否拿到搜索框
      console.log(searchInput);
      const searchDropdown = document.getElementById('searchDropdown');
      // 测试是否拿到下拉菜单
      console.log(searchDropdown);
      // 点击搜索框时显示下拉菜单
      searchInput.addEventListener('click', function() {
        searchDropdown.style.opacity = '1';
        searchDropdown.style.pointerEvents = 'auto';
         // 测试下拉菜单是否显示
         console.log(searchDropdown.classList);
      });
    
      // 点击其他地方时隐藏下拉菜单
      document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
         searchDropdown.style.opacity = '0';
         searchDropdown.style.pointerEvents = 'none';
        }
      });
    });
})()