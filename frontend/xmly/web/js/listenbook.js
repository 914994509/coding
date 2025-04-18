// listenbook的加载
(async function () {
  async function fetchData(url, selectedTagName) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data1 = await response.json();
      // console.log('API Response:', data1); 
      return data1.data[selectedTagName]; 
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  function createAudioItem(data) {
    const item = document.createElement('li');
    item.className = 'listenbook-body-item';
    const finishedClass = data.finished ? 'true' : 'false';
    // console.log('Data:', data.finished); // 打印数据内容
    // 格式化播放次数
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
        <div class=finisher-container>
        ${data.finished ? '<span class="finished "></span>':''}
        <a class="album-title " href="/${data}/${data.id}" title="${data.text}">
        ${data.text}
        </a>
        </div>
        <a class="album-author" href="/zhubo/${data.authorId || ''}">${data.author}</a>
      </div>
    `;
    return item;
  }

  function displayRandomItems(dataList, audioList) {
    // 清空当前列表
    audioList.innerHTML = '';
    // 随机选择十个数据渲染
    const randomItems = dataList.sort(() => 0.5 - Math.random()).slice(0, 10);
    randomItems.forEach(data => {
      const audioItem = createAudioItem(data);
      // console.log(data);
      audioList.appendChild(audioItem);
    });

    // 添加边距
    const items = audioList.querySelectorAll('.listenbook-body-item');
    items.forEach((item, index) => {
      item.style.marginLeft = (index % 5 === 0) ? '0px' : '20px';
    });
  }
  
  const apiUrl = 'http://localhost:3000/api?tag=audiobook';
  const audioList = document.querySelector('.listenbook-body-list');
  const tags = document.querySelectorAll('.smalltips a');
  let selectedTagName = ''; 
  tags.forEach(tag => {
    tag.addEventListener('click', async () => {
      selectedTagName = tag.className;
      // Fetch data and update the list when a tag is clicked
      const dataList = await fetchData(apiUrl,selectedTagName);
      // console.log(dataList)
      if (Array.isArray(dataList) && dataList.length > 0) {
        displayRandomItems(dataList, audioList);
      } else {
        console.error('No valid data received to populate the audio list.');
      }
    });
  });
  // 默认显示第一个页面内容
  const initialDataList = await fetchData(apiUrl,'toutuoyuan');
  if (Array.isArray(initialDataList) && initialDataList.length > 0) {
    displayRandomItems(initialDataList, audioList);
  } else {
    console.error('No valid data received to populate the audio list.');
  }
})();