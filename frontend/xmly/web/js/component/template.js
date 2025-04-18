const generatehtml = () => {
  return `
<style>
@import "./css/template/template.css";
 </style>
<ul class="card-container"></ul>
`;
}


const template = document.createElement('template');
template.innerHTML = generatehtml();

class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('.card-container');

  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'ranking';
    this.apiUrl = `http://localhost:3000/api?tag=${type}`;
    this.fetchData(this.apiUrl);
  }

  async fetchData(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.renderCards(data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // You might want to show an error message in the UI here
    }
  }

  renderCards(rankingData) {
    // Clear existing content
    this.container.innerHTML = '';
    
    // Check if we have data
    if (!rankingData || rankingData.length === 0) {
      this.container.innerHTML = '<li>No data available</li>';
      return;
    }
    rankingData.forEach(item => {
      const card = document.createElement('li');
      card.className = 'youshengshu-li';
      
      if(item.img!=null){
      const imgUrl = item.img;
      const id=item.id%10;
      card.innerHTML = `
        <a>
          <div class="img">
            <div class="mainpic">
              <img src="${imgUrl}" alt="${item.desc || 'Audio cover'}" class="pic">
            </div>
            <div class="play-overlay1">
              <img src="./asserts/image/body/play.png" alt="Play icon">
              
            </div>
            <div class="decorte">
              <img src="https://s1.xmcdn.com/yx/ximalaya-web-static/last/dist/images/cover-bottom_29764f1.png" class="dibu">
            </div>
            <div class="decorte1">
              <img src="./asserts/image/123/${id}.png">
              </div>
            <div class="rtitlebody">
              <div class="title">
                ${item.desc || 'No description available'}
              </div>
              ${item.author ? `<div class="title author">${item.author}</div>` : ''}
            </div>
          </div>
        </a>
      `;
      }else{
        card.innerHTML = `
         <a>
            <div class="rtitlebody1">
              <div class="title">
                ${item.id-50} &nbsp&nbsp ${item.desc || 'No description available'}
              </div>
          </div>
        </a>
    
      `;
        card.style.height='20px';
      }     
      this.container.appendChild(card);
    });
  }
}

window.customElements.define('my-card', Card);