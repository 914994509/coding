(async function () {
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      return data.data; // 确保返回的是 `data` 字段中的数组
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  function createAudioItem(data) {
    const item = document.createElement('li');
    item.className = 'audio-item';
    // Format play count
    const playCount = data.times && data.times >= 100000000 
    ? `${(data.times/100000000).toFixed(1)}亿` 
    : data.times && data.times >= 10000 
    ? `${(data.times/10000).toFixed(1)}万`
    : data.times || '0';
    // console.log(data.id)

    // 修改后缀名称
    const correctedAudioUrl = data.audio.replace('.mpg', '.mp3');
    // console.log(correctedAudioUrl); 
// onclick="playAudio('http://localhost:3000//${correctedAudioUrl} alert(this.href); "
    item.innerHTML = `
      <div class="album-wrapper">
        <div class="album-card">
          <a class="album-cover" href="http://localhost:3000${correctedAudioUrl} "onclick="return false; " >
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
          ${data.free ? '<img class="corner-tag" src="./asserts/image/body/free.png" alt="free tag">' : ''}
        </div>
        
        <a class="album-title" href="/album/${data.id}" title="${data.title}">
          ${data.title}
        </a>
        
        <a class="album-author" href="/zhubo/${data.authorId || ''}">${data.author}</a>
      </div>
    `;

    return item;
  }

  function displayRandomItems(dataList, audioList) {
    // 清空当前列表
    audioList.innerHTML = '';

    // 随机选择五个数据
    const randomItems = dataList.sort(() => 0.5 - Math.random()).slice(0, 5);

    // 渲染五个数据
    randomItems.forEach(data => {
      const audioItem = createAudioItem(data);
      audioList.appendChild(audioItem);
    });

// 添加边距
    const items = audioList.querySelectorAll('.audio-item');
    items.forEach((item, index) => {
      if (index > 0) {
        item.style.marginLeft = '20px';
      }
    });
  }

  const apiUrl = 'http://localhost:3000/api?tag=guesslike';
  const audioList = document.querySelector('.audio-list');
  const changeButton = document.querySelector('.changebutton');
  if (!audioList || !changeButton) {
    console.error('Required DOM elements not found: .audio-list or .changebutton');
    return;
  }
  const dataList = await fetchData(apiUrl);
  if (Array.isArray(dataList) && dataList.length > 0) {
    // 初次加载显示五个数据
    displayRandomItems(dataList, audioList);
    // 点击换一换按钮时随机显示五个数据
    changeButton.addEventListener('click', () => {
      displayRandomItems(dataList, audioList);
    });
  } else {
    console.error('No valid data received to populate the audio list.');
  }
})();

