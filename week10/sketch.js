let capture;
let pg;
let bubbles = [];
let btn;

function setup() {
  // 建立一個跟視窗一樣大的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片節點，只在畫布上繪製
  capture.hide();

  // 產生一個與視訊畫面預設寬高一樣的繪圖層 (預設通常為 640x480)
  pg = createGraphics(640, 480);

  // 初始化泡泡
  for (let i = 0; i < 20; i++) {
    bubbles.push(new Bubble(pg.width, pg.height));
  }

  // 建立擷取按鈕
  btn = createButton('擷取圖片');
  btn.style('font-size', '20px');    // 加大字體
  btn.style('padding', '10px 20px'); // 增加內距讓按鈕變大
  btn.mousePressed(takeSnapshot);
  repositionButton();
}

function draw() {
  // 設定背景顏色
  background('#e7c6ff');
  
  // 計算影像顯示的大小（畫布寬高的 60%）
  let w = width * 0.6;
  let h = height * 0.6;
  
  // 如果攝影機已讀取，且繪圖層大小與攝影機不符，則重新調整繪圖層大小
  if (capture.width > 0 && (pg.width !== capture.width || pg.height !== capture.height)) {
    pg = createGraphics(capture.width, capture.height);
    bubbles = []; // 重置泡泡
    for (let i = 0; i < 20; i++) {
      bubbles.push(new Bubble(pg.width, pg.height));
    }
  }

  // 在繪圖層 (pg) 上進行繪製
  pg.clear(); // 清除上一幀內容，保持透明
  pg.fill(255, 255, 0); // 設定黃色文字
  pg.textSize(pg.width * 0.05);
  pg.textAlign(CENTER, CENTER);
  pg.text("GRAPHICS OVERLAY", pg.width / 2, pg.height / 2);
  pg.stroke(255);
  pg.noFill();
  pg.rect(10, 10, pg.width - 20, pg.height - 20, 10); // 畫一個邊框

  // 更新並繪製泡泡到 pg 圖層上
  for (let b of bubbles) {
    b.update();
    b.display(pg);
  }

  push();
  // 修正左右顛倒問題：將座標原點移至畫布右側，並水平翻轉座標系
  translate(width, 0);
  scale(-1, 1);
  
  let xPos = (width - w) / 2;
  let yPos = (height - h) / 2;

  // 馬賽克與黑白處理邏輯
  if (capture.width > 0) {
    capture.loadPixels();
    let stepSize = 20; // 定義 20x20 為一個單位
    
    // 計算縮放比例，確保馬賽克能正確填滿 60% 的顯示區域
    let scaleW = w / capture.width;
    let scaleH = h / capture.height;

    for (let y = 0; y < capture.height; y += stepSize) {
      for (let x = 0; x < capture.width; x += stepSize) {
        // 取得該單位左上角像素的索引位置
        let i = (x + y * capture.width) * 4;
        let r = capture.pixels[i];
        let g = capture.pixels[i + 1];
        let b = capture.pixels[i + 2];

        // 計算平均值 (R+G+B)/3 轉為灰階
        let avg = (r + g + b) / 3;

        // 使用該灰階值填滿該單位的矩形
        fill(avg);
        noStroke();
        rect(xPos + x * scaleW, yPos + y * scaleH, stepSize * scaleW, stepSize * scaleH);
      }
    }
  }
  
  // 將 pg 繪圖層顯示在視訊畫面的上方，位置與大小皆與視訊同步
  image(pg, xPos, yPos, w, h);
  pop();
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
  repositionButton();
}

function repositionButton() {
  // 將按鈕放置在左上角
  btn.position(20, 20);
}

function takeSnapshot() {
  // 計算視訊在畫面上顯示的實際範圍
  let w = width * 0.6;
  let h = height * 0.6;
  let x = (width - w) / 2;
  let y = (height - h) / 2;
  
  // 使用 get() 取得該區域的影像內容
  let img = get(x, y, w, h);
  // 儲存為 jpg 檔案
  save(img, 'my_snapshot.jpg');
}

// 泡泡類別
class Bubble {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }

  reset() {
    this.x = random(this.w);
    this.y = this.h + random(20, 100); // 從畫面下方外面開始
    this.r = random(2, 6);            // 隨機半徑 (縮小尺寸)
    this.speed = random(1, 3);        // 隨機上升速度
  }

  update() {
    this.y -= this.speed;             // 向上移動
    // 如果泡泡完全離開畫面頂部，重置它
    if (this.y < -this.r) {
      this.reset();
    }
  }

  display(graphics) {
    graphics.fill(255, 255, 255, 150); // 半透明白色
    graphics.noStroke();
    graphics.ellipse(this.x, this.y, this.r * 2);
  }
}