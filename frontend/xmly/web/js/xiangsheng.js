// xiangsheng加载
(async function () {
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data); // 打印 API 响应内容
      return data.data.toutuoyuan; // 确保返回的是 `toutuoyuan` 字段中的数组
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  function createAudioItem(data) {
    const item = document.createElement('li');
    item.className = 'ixiangsheng';
    // 格式化播放次数
    const finishedClass = data.finished ? '1' : '';
    const playCount = data.times && data.times >= 100000000 
    ? `${(data.times/100000000).toFixed(1)}亿` 
    : data.times && data.times >= 10000 
    ? `${(data.times/10000).toFixed(1)}万`
    : data.times || '0';

    item.innerHTML = `
      <div class="album-wrapper">
        <div class="album-card">
          <a class="album-cover" href="/album/${data.id}">
            <img src="${data.img}" alt="Album cover" class="cover-image">
            <div class="play-overlay">
              <img src="./asserts/image/body/play.png" alt="Play icon">
            </div>
            <p class="listen-count">
              <i class="icon-earphone"></i>
              <span>${playCount}</span>
            </p>
          </a>
          ${data.vip ? '<img class="corner-tag" src="./asserts/image/body/vip.png" alt="VIP tag">' : ''}
        </div>
        
        <a class="album-title ${finishedClass}" href="/album/${data.id}" title="${data.text}">
          ${data.text}
        </a>
        
        <a class="album-author" href="/zhubo/${data.authorId || ''}">${data.author}</a>
      </div>
    `;

    return item;
  }

  function displayRandomItems(dataList, audioList) {
    // 清空当前列表
    audioList.innerHTML = '';
    // 随机选择十个数据
    const randomItems = dataList.sort(() => 0.5 - Math.random()).slice(0, 10);

    // 渲染十个数据
    randomItems.forEach(data => {
      const audioItem = createAudioItem(data);
      audioList.appendChild(audioItem);
    });

    // 添加边距
    const items = audioList.querySelectorAll('.ixiangsheng');
    items.forEach((item, index) => {
      item.style.marginLeft = (index % 5 === 0) ? '0px' : '20px';
    });
  }

  const apiUrl = 'http://localhost:3000/api?tag=audiobook';
  const audioList = document.querySelector('.lxiangsheng');
  const dataList = await fetchData(apiUrl);
  if (Array.isArray(dataList) && dataList.length > 0) {
    // 初次加载显示十个数据
    displayRandomItems(dataList, audioList);
  } else {
    console.error('No valid data received to populate the audio list.');
  }
})();