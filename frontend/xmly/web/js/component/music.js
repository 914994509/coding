class MusicPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPlaying = false;
    this.currentModeIndex = 0;
    this.currentVolume = 1;
    this.playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0];
    this.currentRateIndex = 2;
    this.currentTime = 0;
    this.volume = 1;


    this.playlist = [];          // 原始播放列表
    this.shuffledPlaylist = [];  // 随机播放列表
    this.currentTrackIndex = -1; // 当前播放索引
    this.playModes = ['sequence', 'loop', 'random'];
    this.currentMode = 0;        // 0-顺序 1-单曲循环 2-随机
    
   
    // 组件模板
    this.shadowRoot.innerHTML = `
    <style>
  @import "./css/template/music.css";
      </style>
       <div class="player-container">
    <div class="player">
      <!-- 专辑照片 -->
      <div class="album-cover"></div>

      <!-- 播放控制区域 -->
      <div class="play-control">
        <button class="play-btn prev-btn">
          <img src="./asserts/musicpic/pre.png" alt="上一首" class="default-icon">
          <img src="./asserts/musicpic/pre1.png" alt="上一首" class="hover-icon">
        </button>
        <button class="play-btn play-pause-btn">
          <!-- 播放状态图标 -->
          <img src="./asserts/musicpic/2.png" alt="播放" class="default-icon play-state">
          <img src="./asserts/musicpic/1.png" alt="播放" class="hover-icon play-state">
          <!-- 暂停状态图标 -->
          <img src="./asserts/musicpic/4.png" alt="暂停" class="default-icon pause-state">
          <img src="./asserts/musicpic/3.png" alt="暂停" class="hover-icon pause-state">
        </button>
        <button class="play-btn next-btn">
          <img src="./asserts/musicpic/next.png" alt="下一首" class="default-icon">
          <img src="./asserts/musicpic/next1.png" alt="下一首" class="hover-icon">
        </button>
      </div>

      <!-- 核心信息区 -->
      <div class="track-info">
        <div class="track-title">《风水奇事》第001集家中来客【求订阅】</div>
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-current"></div>
          </div>
          <div class="time-info">
            <span class="current-time">00:00:00</span> / <span class="duration">08:55:00</span>
          </div>
        </div>
      </div>

      <!-- 右侧控制区 -->
      <div class="right-controls">
        <button class="control-btn" id="speed-btn">
          <span class="speed-text">X1.0</span>
        </button>
        <div class="speed-menu">
          <div class="speed-option">X0.5</div>
          <div class="speed-option">X0.75</div>
          <div class="speed-option selected">X1.0</div>
          <div class="speed-option">X1.25</div>
          <div class="speed-option">X1.5</div>
          <div class="speed-option">X2.0</div>
          <div class="speed-option">X2.5</div>
          <div class="speed-option">X3.0</div>
        </div>
      </div>

      <!-- 喜欢按钮 -->
      <button class="control-btn" id="like-btn">
        <img src="./asserts/musicpic/like.png" alt="喜欢" class="default-icon">
        <img src="./asserts/musicpic/like1.png" alt="喜欢" class="hover-icon">
      </button>

      <!-- 下载按钮 -->
      <button class="control-btn" id="download-btn">
        <img src="./asserts/musicpic/download.png" alt="下载" class="default-icon">
        <img src="./asserts/musicpic/download1.png" alt="下载" class="hover-icon">
      </button>

      <!-- 转发按钮 -->
      <button class="control-btn" id="share-btn">
        <img src="./asserts/musicpic/share.png" alt="转发" class="default-icon">
        <img src="./asserts/musicpic/share1.png" alt="转发" class="hover-icon">
      </button>

      <!-- 音量控制 -->
      <div class="volume-control">
        <button class="control-btn" id="volume-btn">
          <img src="./asserts/musicpic/listen.png" alt="音量" class="default-icon listen-icon">
          <img src="./asserts/musicpic/listen1.png" alt="音量" class="hover-icon listen-icon">
        </button>
        <div class="volume-menu">
          <div class="volume-slider">
            <div class="volume-current"></div>
          </div>
        </div>
      </div>

      <!-- 随机播放按钮 -->

      <button class="control-btn" id="shuffle-btn">
        <!-- 每个模式只保留一组图标 -->
        <img src="./asserts/musicpic/xunhuan.png" alt="循环模式" class="mode-icon active" data-mode="loop">
        <img src="./asserts/musicpic/danquxunhuan.png" alt="单曲循环" class="mode-icon" data-mode="single">
        <img src="./asserts/musicpic/suiji.png" alt="随机播放" class="mode-icon" data-mode="shuffle">
      </button>

      <!-- 播放列表按钮 -->
      
      <button class="control-btn" id="playlist-btn">
        <img src="./asserts/musicpic/playlist.png" alt="播放列表" class="default-icon">
        <img src="./asserts/musicpic/playlist1.png" alt="播放列表" class="hover-icon">
      </button>
      <div class="playlist-container">
      <div class="playlist-header">
      <h3>播放列表</h3>
      <span class="close-btn">×</span>
      </div>
      <div class="playlist-items"></div>
      </div>
    </div>
  </div>
  </div>
    `;

  }


  static get observedAttributes() {
    return ['src', 'volume', 'cover'];
  }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   // 新增封面处理
  //   if (name === 'cover') {
  //     this.albumCover.style.backgroundImage = `url(${newValue})`;
  //   } if (name === 'src') {
  //     this.audioElement.src = newValue;
  //   } else if (name === 'volume') {
  //     this.updateVolume(parseFloat(newValue));
  //   }

  // }
  // loadAndPlay(url) {
  //   this.setAttribute('src', url);
  //   this.play();
  // }
  // play() {
  //   this.audioElement.play();
  //   this.isPlaying = true;
  //   this.updatePlayState();
  // }
  
  connectedCallback() {
    this.audioElement = new Audio();
    this._bindElements();
    this._bindEvents();
    this._initializeStates();
    this._bindAudioEvents();
    // list 
    this._playlistVisible = false;
  }
  _bindElements() {
    this.elements = {
      albumCover : this.shadowRoot.querySelector('.album-cover'),
      playBtn: this.shadowRoot.querySelector('.play-pause-btn'),
      prevBtn: this.shadowRoot.querySelector('.prev-btn'),
      nextBtn: this.shadowRoot.querySelector('.next-btn'),
      playIcon: this.shadowRoot.querySelector('.play-state'),
      pauseIcon: this.shadowRoot.querySelector('.pause-state'),
      trackTitle: this.shadowRoot.querySelector('.track-title'),
      speedBtn: this.shadowRoot.getElementById('speed-btn'),
      speedText: this.shadowRoot.querySelector('.speed-text'),
      speedMenu: this.shadowRoot.querySelector('.speed-menu'),
      speedOptions: this.shadowRoot.querySelectorAll('.speed-option'),
      progressBar: this.shadowRoot.querySelector('.progress-bar'),
      progressCurrent: this.shadowRoot.querySelector('.progress-current'),
      currentTimeEl: this.shadowRoot.querySelector('.current-time'),
      durationEl: this.shadowRoot.querySelector('.duration'),
      likeBtn: this.shadowRoot.getElementById('like-btn'),
      shuffleBtn: this.shadowRoot.getElementById('shuffle-btn'),
      modeIcons: this.shadowRoot.querySelectorAll('.mode-icon'),
      volumeControl: this.shadowRoot.querySelector('.volume-control'),
      volumeBtn: this.shadowRoot.getElementById('volume-btn'),
      volumeMenu: this.shadowRoot.querySelector('.volume-menu'),
      volumeCurrent: this.shadowRoot.querySelector('.volume-current'),
    // list部分
    playlistBtn: this.shadowRoot.getElementById('playlist-btn'),
    playlistContainer: this.shadowRoot.querySelector('.player .playlist-container'),
    playlistItems: this.shadowRoot.querySelector('.playlist-items'),
    closeBtn: this.shadowRoot.querySelector('.close-btn')
    };
   
  }
  _bindEvents() {
    // 播放控制
    this.elements.playBtn.addEventListener('click', () => {this.togglePlay();
      // this.elements.playBtn.classList.toggle('is-playing');
      this._setPlayState(false); // 同步状态
    });
    

    // 上一首下一首
    this.elements.prevBtn.addEventListener('click', () => this.playPrev());
    this.elements.nextBtn.addEventListener('click', () => this.playNext());


    // 倍速控制
    this.elements.speedBtn.addEventListener('click', (e) => this.handleSpeedBtnClick(e));
    this.elements.speedOptions.forEach(option => {
      option.addEventListener('click', (e) => this.handleSpeedOptionClick(e));
    });

    // 进度条控制
    this.elements.progressBar.addEventListener('click', (e) => this.handleProgressBarClick(e));

    // 随机播放模式
    this.elements.shuffleBtn.addEventListener('click', (e) => this.togglePlayMode(e));
    this.elements.shuffleBtn.addEventListener('mouseenter', () => this.handleShuffleHover());
    this.elements.shuffleBtn.addEventListener('mouseleave', () => this.handleShuffleLeave());

    // 音量控制
    this.elements.volumeBtn.addEventListener('click', (e) => this.handleVolumeBtnClick(e));
    this.elements.volumeMenu.querySelector('.volume-slider').addEventListener('mousedown', (e) => this.startVolumeDrag(e));
    document.addEventListener('mouseup', () => this.endVolumeDrag());
    document.addEventListener('mousemove', (e) => this.handleVolumeDrag(e));
    document.addEventListener('click', () => this.closeMenus());
    // 列表控制
    this.elements.playlistBtn.addEventListener('click', (e) =>{
      e.stopPropagation();
      this.elements.playlistContainer.style.opacity = '1';
      // this.togglePlaylist();
      this._renderPlaylistItems();
    });
    console.log(this.elements.closeBtn);
    this.elements.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.elements.playlistContainer.style.opacity = '0'});

    // 优化外部点击判断
    this._clickOutsideHandler = (e) => {
      e.stopPropagation();
        if (!this.elements.playlistContainer.contains(e.target))
              this.elements.playlistContainer.style.opacity = '0';
        };
  }

  _initializeStates() {
    // 初始化音频
    const audioLinks = document.querySelectorAll('.guessLikecontainer .album-wrapper .album-card a');
    const pics = document.querySelectorAll('.guessLikecontainer .album-wrapper .album-card .album-cover .cover-image');
    const titles = document.querySelectorAll('.guessLikecontainer .album-wrapper .album-title');
    console.log('ssssssssssssssssss');
    console.log('专辑标题:', titles[0].title);
    this.playlist = Array.from(audioLinks).map((link, index) => {
      // 确保元素对应性
      if (!titles[index]) {
        console.error(`第 ${index} 项数据不完整，已跳过`);
        return null;
      }
      return {
        id: index + 1,
        title: titles[index].title,   
        url: link.href,                          
      };
    }).filter(Boolean); // 过滤无效项
    
    console.log('生成的播放列表:', this.playlist);
    
    // 验证数据示例（假设第一个元素存在）
    if (this.playlist.length > 0) {
      console.log('首曲信息:', {
        title: this.playlist[0].title,
        url: this.playlist[0].url,
      });
    }


    // 存储第一个音频链接作为默认
    if (audioLinks.length > 0) {
      this.currentTrack = audioLinks[0].href;
      this.audioElement.src = this.currentTrack;
      console.log('当前音频:', this.currentTrack);
      // 设置音频封面
      
      this.elements.albumCover.style.background= `url(${pics[0].src})`;
      this.elements.albumCover.style.backgroundSize = 'cover';
      this.elements.albumCover.style.backgroundPosition = 'center';
      // console.log('专辑封面:', titles[2].title);
      this.elements.trackTitle.textContent = titles[0].title;
      // this.audioElement.volume = this.currentVolume;
      // this.elements.playIcon.style.display = 'block';

    }

    // 绑定点击事件
    audioLinks.forEach((link,index) => {
    // console.log('绑定音频链接:', link.href);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.audioElement.volume = this.currentVolume;
        this._handleTrackSelection(link.href);
        this._updateAlbumCover(pics[index].src);
        this.elements.trackTitle.textContent = titles[index].title;
        // console.log('当前时间:',this.audioElement.duration);
      });
    });

    // 初始化音频设置 
    this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
    this.updateModeDisplay();
  }
  // 修改后的封面更新方法
   _updateAlbumCover(coverUrl) {
    if (!this.elements.albumCover || !coverUrl) return;
    this.elements.albumCover.style.background= `url(${coverUrl})`;
    this.elements.albumCover.style.backgroundSize = 'cover';
    this.elements.albumCover.style.backgroundPosition = 'center';

  }
  
    _handleTrackSelection(url) {
      try {
        // 暂停当前播放
        if (this.isPlaying) {
          this._pauseTrack();
        }
    
        // 更新音源和封面
        this.audioElement.src = url;
        // this.currentTrack = url;
        
        // // 新增：更新封面
        // console.log('更新封面:', coverUrl);
        // this._updateAlbumCover(coverUrl);
    
        // 加载元数据
        this.audioElement.load();
        
        // 开始播放
        this.audioElement.play()
          .then(() => {
            this._setPlayState(true);
          })
          .catch(error => {
            console.error('播放失败:', error);
            this._setPlayState(false);
          });
    
      } catch (error) {
        console.error('音源切换错误:', error);
        this._setPlayState(false);
      }
    }
  

  // 专用播放状态控制方法
  _setPlayState(isPlaying) {
    this.isPlaying = isPlaying;
    this.updatePlayState();
    this._updateButtonStates();
  }

  // 更新所有相关按钮状态
  _updateButtonStates() {
    // 主播放按钮
    this.elements.playBtn.classList.toggle('is-playing', this.isPlaying);
    
    // 其他相关按钮（如迷你播放器）
    document.querySelectorAll('.play-button').forEach(btn => {
      btn.classList.toggle('is-playing', this.isPlaying);
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this._pauseTrack();
    } else {
      this._playTrack();
    }
  }

  async _playTrack() {
    try {
      if (!this.audioElement.src && this.currentTrack) {
        this.audioElement.src = this.currentTrack;
      }
      
      await this.audioElement.play();
      this._setPlayState(true);
    } catch (error) {
      console.error('播放失败:', error);
      this._setPlayState(false);
    }
  }

  _pauseTrack() {
    this.audioElement.pause();
    this._setPlayState(false);
  }

  // 更新播放状态显示
  updatePlayState() {
    // 主按钮图标切换
    this.elements.playIcon.style.display = this.isPlaying ? 'none' : 'block';
    this.elements.pauseIcon.style.display = this.isPlaying ? 'block' : 'none';

    // 进度条动画控制
    this.elements.progressCurrent.style.animationPlayState = 
      this.isPlaying ? 'running' : 'paused';
  }

  // 添加音频事件监听
  _bindAudioEvents() {
    this.audioElement.addEventListener('play', () => {
      this._setPlayState(true);
    });

    this.audioElement.addEventListener('pause', () => {
      this._setPlayState(false);
    });

    this.audioElement.addEventListener('ended', () => {
      this._setPlayState(false);
    });
  }

  // updatePlayState() {
  //   this.elements.playIcon.style.display = this.isPlaying ? 'none' : 'block';
  //   this.elements.pauseIcon.style.display = this.isPlaying ? 'block' : 'none';
  // }

  // 上一首
  playPrev() {
    if (!this._validatePlaylist()) return;

    let newIndex;
    switch (this.playModes[this.currentMode]) {
      case 'random':
        newIndex = this._getRandomTrackIndex('prev');
        break;
      default:
        newIndex = this.currentTrackIndex > 0 
          ? this.currentTrackIndex - 1 
          : this.playlist.length - 1;
    }

    this._playTrackByIndex(newIndex, 'prev');
  }

  playNext() {
    if (!this._validatePlaylist()) return;

    let newIndex;
    switch (this.playModes[this.currentMode]) {
      case 'random':
        newIndex = this._getRandomTrackIndex('next');
        break;
      case 'loop':
        newIndex = this.currentTrackIndex; // 单曲循环不切换
        break;
      default:
        newIndex = this.currentTrackIndex < this.playlist.length - 1 
          ? this.currentTrackIndex + 1 
          : 0;
    }

    this._playTrackByIndex(newIndex, 'next');
  }
// 核心辅助方法
_validatePlaylist() {
  if (!this.playlist || this.playlist.length === 0) {
    console.warn('播放列表为空');
    return false;
  }
  return true;
}

_getRandomTrackIndex(direction) {
  if (this.shuffledPlaylist.length !== this.playlist.length) {
    this.shuffledPlaylist = this._shufflePlaylist([...this.playlist]);
  }
  
  const currentId = this.playlist[this.currentTrackIndex]?.id;
  const currentShuffledIndex = this.shuffledPlaylist.findIndex(t => t.id === currentId);
  
  if (direction === 'next') {
    return currentShuffledIndex < this.shuffledPlaylist.length - 1 
      ? currentShuffledIndex + 1 
      : 0;
  } else {
    return currentShuffledIndex > 0 
      ? currentShuffledIndex - 1 
      : this.shuffledPlaylist.length - 1;
  }
}

_shufflePlaylist(list) {
  // Fisher-Yates 洗牌算法
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  console.log('洗牌后的列表:', list);
  return list;
}

_playTrackByIndex(index, direction) {
  const targetPlaylist = this.playModes[this.currentMode] === 'random' 
    ? this.shuffledPlaylist 
    : this.playlist;

  if (index < 0 || index >= targetPlaylist.length) {
    console.error('无效的索引:', index);
    return;
  }

  const track = targetPlaylist[index];
  console.log('播放音频:',track );
  this.currentTrackIndex = this.playlist.findIndex(t => t.id === track.id);
  
  // 更新音频源和UI
  console.log('播放音频: sd s ada ds d ad ', track.url);
  this._handleTrackSelection(track.url);
  this.elements.trackTitle.textContent =track.title;
  this._highlightCurrentTrack(direction);
}

// UI 更新示例
_highlightCurrentTrack(direction) {
  // 移除所有激活状态
  document.querySelectorAll('.playlist-item').forEach(item => {
    item.classList.remove('active', 'prev-transition', 'next-transition');
  });

  // 添加动画类
  const items = Array.from(document.querySelectorAll('.playlist-item'));
  const currentItem = items[this.currentTrackIndex];
  if (currentItem) {
    currentItem.classList.add('active');
    currentItem.classList.add(
      direction === 'prev' ? 'prev-transition' : 'next-transition'
    );
  }

  // 滚动到可视区域
  currentItem?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

// 在现有方法中补充模式切换
togglePlayMode(e) {
  e.stopPropagation();
  console.log('beidianjiss ') 
  this.currentMode = (this.currentMode + 1) % 3;
  this._updateModeDisplay();
  // this.playModes = ['sequence', 'loop', 'random'];
  // 切换模式时重置随机列表
  if (this.playModes[this.currentMode] === 'random') {
    this._handleRandomModeActivation(this.currentTrack);
  }
  else if (this.playModes[this.currentMode] === 'sequence') {
  //  播放完成后索引不变
  this._handleNormalModeActivation(previousMode, this.currentTrack);
  }else{
    // 顺序播放
    this._handleLoopModeActivation();

  }
  this._updateModeDisplay();
  // this._refreshPlaylistDisplay();
  this._renderPlaylistItems();
}


_handleRandomModeActivation(currentTrack) {
  // 智能生成包含当前曲目的随机列表
  this.shuffledPlaylist = this._generateSmartShuffle(currentTrack);
  
  // 定位当前曲目在新列表中的位置
  const newIndex = this.shuffledPlaylist.findIndex(t => t.id === currentTrack.id);
  this.currentTrackIndex = Math.max(newIndex, 0);
}

_handleLoopModeActivation() {
  // 单曲循环不需要修改播放列表
  this._bindLoopEventHandler();
}
// 绑定单曲循环事件处理
_bindLoopEventHandler() {
  this.audioElement.addEventListener('ended', () => {
    this.audioElement.currentTime = 0;
    this.audioElement.play();
  });
}

_handleNormalModeActivation(previousMode, currentTrack) {
  if (previousMode === MusicPlayer.PLAY_MODES.RANDOM) {
    // 从随机模式恢复时定位原始索引
    const originalIndex = this.playlist.findIndex(t => t.id === currentTrack.id);
    this.currentTrackIndex = Math.max(originalIndex, 0);
  }
}

// 改进的随机列表生成方法
_generateSmartShuffle(currentTrack) {
  const clone = [...this.playlist];
  const currentIndex = clone.findIndex(t => t.id === currentTrack.id);
  
  // 将当前曲目移至列表开头后再洗牌
  if (currentIndex > 0) {
    [clone[0], clone[currentIndex]] = [clone[currentIndex], clone[0]];
  }
  
  // 仅洗牌后续元素
  for (let i = clone.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  
  return clone;
}

// 更新模式显示方法
_updateModeDisplay() {
  // 先移除所有激活状态
  this.elements.modeIcons.forEach(icon => {
    icon.classList.remove('active');
    icon.style.display = 'none';
  });

  // 根据当前模式显示对应图标
  const activeIcon = Array.from(this.elements.modeIcons)
    .find(icon => icon.dataset.mode === this.playModes[this.currentMode]);
  
  if (activeIcon) {
    activeIcon.classList.add('active');
    activeIcon.style.display = 'block';
  }
}

// 修改播放结束处理
_bindAudioEvents() {
  this.audioElement.addEventListener('ended', () => {
    switch (this.currentMode) {
      case MusicPlayer.PLAY_MODES.LOOP:
        this.audioElement.currentTime = 0;
        this.audioElement.play();
        break;
      case MusicPlayer.PLAY_MODES.RANDOM:
        this.playNext();
        break;
      default:
        if (this.currentTrackIndex === this.playlist.length - 1) {
          this._pauseTrack();
        } else {
          this.playNext();
        }
    }
  });
}

// // 更新播放列表渲染方法
// _renderPlaylistItems() {
//   const activeList = this.currentMode === MusicPlayer.PLAY_MODES.RANDOM 
//     ? this.shuffledPlaylist 
//     : this.playlist;

//   // 使用文档片段批量操作DOM
//   const fragment = document.createDocumentFragment();
  
//   activeList.forEach((track, index) => {
//     const item = document.createElement('div');
//     item.className = `playlist-item ${index === this.currentTrackIndex ? 'active' : ''}`;
//     item.innerHTML = `
//       <span class="track-index">${index + 1}</span>
//       <span class="track-title">${track.title}</span>
//     `;
    
//     item.addEventListener('click', () => this._playTrackByIndex(index));
//     fragment.appendChild(item);
//   });

//   this.elements.playlistItems.innerHTML = '';
//   this.elements.playlistItems.appendChild(fragment);
// }

// switch (this.currentMode) {
//   case MusicPlayer.PLAY_MODES.RANDOM:
//     this._handleRandomModeActivation(currentTrack);
//     break;
//   case MusicPlayer.PLAY_MODES.LOOP:
//     this._handleLoopModeActivation();
//     break;
//   default:
//     this._handleNormalModeActivation(previousMode, currentTrack);
// }
_updateModeDisplay() { 
  this.elements.modeIcons.forEach((icon, index) => {
    icon.classList.toggle('active', index === this.currentMode);
    icon.style.opacity = index === this.currentMode ? 1 : 0;
  });
    // console.log('当前播放模式:', this.playModes[this.currentMode]);
}
  // 倍速控制方法
  handleSpeedBtnClick(e) {
    e.stopPropagation();
    console.log('倍速按钮被点击');
    this.elements.speedMenu.style.display = 
      this.elements.speedMenu.style.display === 'block' ? 'none' : 'block';
  }

  handleSpeedOptionClick(e) {
    e.stopPropagation();
    const option = e.target;
    this.elements.speedOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    this.elements.speedText.textContent = option.textContent;
    this.audioElement.playbackRate = parseFloat(option.textContent.slice(1));
    this.elements.speedMenu.style.display = 'none';
  }

  // 进度条控制
  handleProgressBarClick(e) {
    const rect = this.elements.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.audioElement.currentTime = percent * this.audioElement.duration;
    
  }

  updateProgress() {
    const percent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
    this.elements.progressCurrent.style.width = `${percent}%`;
    this.elements.currentTimeEl.textContent = this.formatTime(this.audioElement.currentTime);
    this.elements.durationEl.textContent = this.formatTime(this.audioElement.duration);
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hours, minutes, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  }


  updateModeDisplay() {
    this.elements.modeIcons.forEach((icon, index) => {
      icon.classList.toggle('active', index === this.currentModeIndex);
      icon.style.opacity = index === this.currentModeIndex ? 1 : 0;
    });
  }

  handleShuffleHover() {
    const activeIcon = this.elements.shuffleBtn.querySelector('.active');
    if (activeIcon) activeIcon.style.opacity = 0.8;
  }

  handleShuffleLeave() {
    const activeIcon = this.elements.shuffleBtn.querySelector('.active');
    if (activeIcon) activeIcon.style.opacity = 1;
  }

  // 音量控制
  handleVolumeBtnClick(e) {
    e.stopPropagation();
    this.elements.volumeMenu.style.display = 
      this.elements.volumeMenu.style.display === 'block' ? 'none' : 'block';
      
    // 双击检测
    const now = Date.now();
    if (now - this.lastClick < 300) {
      this.updateVolume(this.currentVolume > 0 ? 0 : 1);
    }
    this.lastClick = now;
  }

  startVolumeDrag(e) {
    this.isDragging = true;
    this.updateVolumeFromEvent(e);
  }

  endVolumeDrag() {
    this.isDragging = false;
  }

  handleVolumeDrag(e) {
    if (!this.isDragging) return;
    this.updateVolumeFromEvent(e);
  }

  updateVolumeFromEvent(e) {
    const slider = this.elements.volumeMenu.querySelector('.volume-slider');
    const rect = slider.getBoundingClientRect();
    const percent = 1 - (e.clientY - rect.top) / rect.height;
    this.updateVolume(percent);
  }

  updateVolume(percent) {
    percent = Math.min(1, Math.max(0, percent));
    this.currentVolume = percent;
    this.elements.volumeCurrent.style.height = `${percent * 100}%`;
    this.audioElement.volume = percent;
    this.elements.volumeBtn.classList.toggle('mute', percent === 0);
  }

  closeMenus() {
    this.elements.speedMenu.style.display = 'none';
    this.elements.volumeMenu.style.display = 'none';
    // this.elements.playlistContainer.style.opacity = '1';
  }

  //list 

    // 显示/隐藏播放列表 (修复第三个参数错误)

  // hidePlaylist() {
  
  // this.elements.playlistContainer.style.pointerEvents = 'none';
  // }
// 优化后的切换逻辑
togglePlaylist() {
    this._playlistVisible = !this._playlistVisible;
    this._updatePlaylistVisibility();
    
    if (this._playlistVisible) {
        // 使用微任务保证渲染后执行
        Promise.resolve().then(() => {
            this._renderPlaylistItems();
            document.addEventListener('click', this._clickOutsideHandler);
        });
    } else {
        document.removeEventListener('click', this._clickOutsideHandler);
    }
}

// 修复可见性更新方法
_updatePlaylistVisibility() {
    // const { playlistContainer, playlistBtn } = this.elements;
    
    // 同步CSS类
    // this.elements.playlistContainer.classList.toggle('visible', this._playlistVisible);
    // console.log('playlistContainer:',  this._playlistVisible);
    
    // 优化过渡效果
    if (this._playlistVisible) {
      
      this.elements.playlistContainer.style.opacity = '1';
      // this.elements.playlistContainer.classList.add('visible');
      console.log(this.elements.playlistContainer.style.opacity );
      this.elements.playlistContainer.style.pointerEvents = 'auto';
    } else {
      // this.elements.playlistContainer.classList.remove('visible');
      this.elements.playlistContainer.style.opacity = '0';
    }
    // 保持按钮状态同步
    this.elements.playlistBtn.setAttribute('aria-expanded', this._playlistVisible);
}

// 修复渲染方法
_renderPlaylistItems() {
    const fragment = document.createDocumentFragment();
    
    this.playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === this.currentTrackIndex ? 'active' : ''}`;
        // 修复innerHTML拼写错误
        item.innerHTML = `
        
            <span class="track-index">${index + 1}</span>
            <span class="track-title">${track.title}</span>
            <span class="track-url" >${track.url}</span>
        `;
        
        // 优化点击处理
        item.addEventListener('click', () => {
            this._playTrackByIndex(index);
            this._highlightCurrentItem();
            // this.hidePlaylist();
            this.elements.playlistContainer.style.opacity = '0';
        });
        
        fragment.appendChild(item);
    });
    
    this.elements.playlistItems.innerHTML = '';
    this.elements.playlistItems.appendChild(fragment);
}

// 优化高亮方法
_highlightCurrentItem() {
    const items = this.elements.playlistItems.children;
    
    // 使用展开运算符转换HTMLCollection
    [...items].forEach(item => item.classList.remove('active'));
    
    if (items[this.currentTrackIndex]) {
        const currentItem = items[this.currentTrackIndex];
        currentItem.classList.add('active');
        // 添加滚动动画
        currentItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    }
}

}

// 注册自定义组件
customElements.define('music-player', MusicPlayer);
