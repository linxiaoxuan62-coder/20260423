let shapes = [];
let bubbles = [];
let particles = [];
let mic;
// 定義多邊形頂點的基礎座標
let points = [[-3, 5], [3, 7], [1, 5], [2, 4], [4, 3], [5, 2], [6, 2], [8, 4], [8, -1], [6, 0], [0, -3], [2, -6], [-2, -3], [-4, -2], [-5, -1], [-6, 1], [-6, 2]];

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();

  // 產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    let scalar = random(10, 30);
    // 透過 map() 讀取全域陣列 points，產生變形
    let shapePoints = points.map(p => {
      return { x: p[0] * scalar, y: p[1] * scalar };
    });

    shapes.push({
      x: random(windowWidth),
      y: random(windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scale: random(1, 10),
      color: color(random(255), random(255), random(255)),
      points: shapePoints
    });
  }
}

function draw() {
  background('#ffcdb2');

  // 產生水泡 (隨機機率)
  if (random(1) < 0.03) {
    bubbles.push({
      x: random(width),
      y: height + 20,
      size: random(10, 30),
      speed: random(1, 3),
      popY: random(height * 0.2, height * 0.8), // 設定隨機破掉的高度
      color: color(255, 255, 255, 100) // 白色偏透明
    });
  }

  // 更新與繪製水泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.y -= b.speed;
    
    push();
    noStroke();
    fill(b.color);
    circle(b.x, b.y, b.size);
    // 水泡光澤
    fill(255, 255, 255, 150);
    circle(b.x + b.size * 0.2, b.y - b.size * 0.2, b.size * 0.25);
    pop();

    // 檢查是否到達破掉位置
    if (b.y < b.popY) {
      createPopEffect(b.x, b.y);
      bubbles.splice(i, 1);
    }
  }

  // 更新與繪製破掉效果粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 10; // 生命週期遞減
    if (p.life <= 0) {
      particles.splice(i, 1);
    } else {
      push();
      noStroke();
      fill(255, 255, 255, p.life);
      circle(p.x, p.y, p.size);
      pop();
    }
  }

  strokeWeight(2);

  // 取得當前音量大小
  let level = mic.getLevel();
  // 映射音量到縮放倍率
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 更新與繪製每個形狀
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y);
    if (shape.dx > 0) {
      scale(-sizeFactor, sizeFactor);
    } else {
      scale(sizeFactor, sizeFactor);
    }

    // 繪製多邊形
    beginShape();
    for (let p of shape.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }
}

function createPopEffect(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-2, 2),
      vy: random(-2, 2),
      size: random(2, 5),
      life: 255
    });
  }
}

// 額外加入：點擊滑鼠切換播放狀態，以應對瀏覽器自動播放策略
function mousePressed() {
  userStartAudio();
}
