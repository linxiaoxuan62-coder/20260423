let seeds = [];
let weekData = [
  { week: 1, title: "教育科技網頁", url: "week1/index.html" },
  { week: 2, title: "電流急急棒", url: "week2/index.html" },
  { week: 3, title: "小精靈", url: "week3/index.html" },
  { week: 4, title: "畫圓形", url: "week4/index.html" },
  { week: 5, title: "漸層圓形", url: "week5/index.html" },
  { week: 6, title: "跳動多邊形", url: "week6/index.html" },
  { week: 7, title: "圓形", url: "week7/index.html" },
  { week: 8, title: "游動的魚", url: "week8/index.html" },
  { week: 9, title: "字串排列", url: "week9/index.html" },
  { week: 10, title: "攝影機畫面", url: "week10/index.html" }
];
let displayIframe;
let fishes = [];
let bubbles = [];

function setup() {
  // 建立畫布，預留空間給右側的 iframe
  let cvs = createCanvas(windowWidth, windowHeight);
  cvs.position(0, 0);
  
  // 動態建立 iframe
  displayIframe = select('#myIframe');
  if (!displayIframe) {
    displayIframe = createElement('iframe');
    displayIframe.id('myIframe');
    displayIframe.position(width * 0.4, 50);
    displayIframe.size(width * 0.55, height - 100);
    displayIframe.style('border', 'none');
    displayIframe.style('background', '#fff');
    displayIframe.style('border-radius', '10px');
    displayIframe.style('box-shadow', '0 4px 15px rgba(0,0,0,0.3)');
  }

  // 初始化每一週的種子物件
  for (let i = 0; i < weekData.length; i++) {
    // t 代表在藤蔓上的位置 (0.2 ~ 0.8 之間)
    let t = map(i, 0, weekData.length - 1, 0.8, 0.2);
    seeds.push(new Seed(weekData[i], t));
  }

  // 初始化魚群
  for (let i = 0; i < 5; i++) {
    fishes.push(new Fish());
  }
  // 初始化氣泡
  for (let i = 0; i < 20; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(10, 45, 65); // 深藍色水底背景

  // 繪製並更新氣泡
  for (let b of bubbles) { b.update(); b.display(); }
  // 繪製並更新魚
  for (let f of fishes) { f.update(); f.display(); }
  
  drawVine(); // 繪製生長的脈絡

  // 顯示並更新所有節點
  for (let s of seeds) {
    s.update();
    s.display();
  }
}

// 利用 Vertex 繪製動態藤蔓
function drawVine() {
  noFill();
  stroke(100, 200, 150, 150); // 更像水草的青綠色
  strokeWeight(4);
  
  beginShape();
  for (let y = height; y > 0; y -= 10) {
    // 利用 noise 產生有機的晃動感
    let xOffset = noise(y * 0.01, frameCount * 0.01) * 100 - 50;
    let x = width * 0.2 + xOffset;
    vertex(x, y);
  }
  endShape();
}

// 週次種子類別
class Seed {
  constructor(data, t) {
    this.data = data;
    this.t = t; // 在垂直高度上的比例
    this.size = 20;
    this.interSize = 20;
    this.x = 0;
    this.y = 0;
    this.isHovered = false;
  }

  update() {
    // 根據目前的藤蔓形狀更新種子坐標
    this.y = height * this.t;
    let xOffset = noise(this.y * 0.01, frameCount * 0.01) * 100 - 50;
    this.x = width * 0.2 + xOffset;

    // 偵測滑鼠懸停
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.size) {
      this.isHovered = true;
      this.interSize = lerp(this.interSize, 40, 0.2); // 放大特效
    } else {
      this.isHovered = false;
      this.interSize = lerp(this.interSize, 20, 0.1);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // 利用 vertex 繪製花朵瓣片
    fill(this.isHovered ? '#FFD54F' : '#E91E63'); // 懸停時變色
    noStroke();
    let petals = 6;
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      // 花瓣公式：利用極坐標產生波浪狀邊緣
      let r = this.interSize * (0.6 + 0.4 * cos(petals * a));
      let vx = r * cos(a);
      let vy = r * sin(a);
      vertex(vx, vy);
    }
    endShape(CLOSE);
    
    // 繪製花蕊
    fill('#FFEB3B');
    ellipse(0, 0, this.interSize * 0.4);

    // 標註週次文字
    fill(255);
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(`W${this.data.week}: ${this.data.title}`, -20, 0);
    pop();
  }

  clicked() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.size) {
      displayIframe.attribute('src', this.data.url);
    }
  }
}

// 魚類別
class Fish {
  constructor() {
    this.reset();
    this.x = random(width); // 初始隨機分佈
  }
  reset() {
    this.x = -50;
    this.y = random(height);
    this.speed = random(1, 3);
    this.c = color(random(200, 255), random(100, 180), 100);
    this.size = random(15, 30);
    this.offset = random(1000);
  }
  update() {
    this.x += this.speed;
    this.y += sin(frameCount * 0.05 + this.offset) * 1.5; // 上下波浪游動
    if (this.x > width + 50) this.reset();
  }
  display() {
    push();
    translate(this.x, this.y);
    fill(this.c);
    noStroke();
    // 魚身
    ellipse(0, 0, this.size * 1.5, this.size);
    // 魚尾
    let tailW = this.size * 0.6;
    triangle(-this.size * 0.6, 0, -this.size * 1.2, -tailW/2, -this.size * 1.2, tailW/2);
    // 魚眼
    fill(0);
    ellipse(this.size * 0.4, -this.size * 0.1, 3, 3);
    pop();
  }
}

// 氣泡類別
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height, height * 2);
    this.speed = random(1, 2.5);
    this.r = random(2, 8);
  }
  update() {
    this.y -= this.speed;
    this.x += sin(this.y * 0.05) * 0.5; // 輕微晃動上升
    if (this.y < -20) this.y = height + 20;
  }
  display() {
    noFill();
    stroke(255, 120);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function mousePressed() {
  for (let s of seeds) {
    s.clicked();
  }
}
