let particles = [];
let gameState = 'START'; // START, PLAYING, GAMEOVER
let gameResult = '';     // WIN, LOSS
let spacing = 40;
let targetX, targetY;
let startTime;
let timeLimit = 30;      // 遊戲時限 30 秒

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame();
}

function resetGame() {
  // 隨機生成目標位置，確保在格線內
  let cols = floor(width / spacing);
  let rows = floor(height / spacing);
  targetX = floor(random(cols)) * spacing + spacing / 2;
  targetY = floor(random(rows)) * spacing + spacing / 2;
  particles = [];
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布尺寸
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (gameState === 'START') {
    drawStart();
  } else if (gameState === 'PLAYING') {
    drawPlaying();
  } else if (gameState === 'GAMEOVER') {
    drawGameOver();
  }
}

function drawStart() {
  background('#1a0033');
  textAlign(CENTER, CENTER);
  
  // 標題設定
  noStroke();
  fill(255, 215, 0); // 金色
  textSize(54);
  text("✨ 尋找隱形小精靈", width / 2, height / 2 - 80);
  
  fill(255, 255, 255, 180);
  textSize(18);
  text("觀察網格閃爍，找出隱藏在其中的小精靈", width / 2, height / 2 - 10);

  // 按鈕設計
  let btnW = 220;
  let btnH = 60;
  let btnX = width / 2 - btnW / 2;
  let btnY = height / 2 + 50;

  // 檢查滑鼠是否懸停在按鈕上
  let isHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

  stroke(255, 215, 0);
  strokeWeight(2);
  if (isHover) {
    fill(255, 215, 0, 40); // 懸停時顯示淡淡的填充色
    cursor(HAND);
  } else {
    noFill();
    cursor(ARROW);
  }
  rect(btnX, btnY, btnW, btnH, 30); // 圓角外框

  // 按鈕文字
  noStroke();
  fill(255, 215, 0);
  textSize(24);
  text("進入森林", width / 2, btnY + btnH / 2);
}

function drawPlaying() {
  cursor(ARROW);
  // 背景設定為深紫色
  background('#1a0033');

  // 計算剩餘時間
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, timeLimit - elapsed);
  
  // 顯示計時器
  textAlign(CENTER, CENTER);
  fill(255, 255, 255, 200);
  textSize(24);
  text("⏳ 剩餘時間: " + timeLeft.toFixed(1) + "s", width / 2, 40);

  if (timeLeft <= 0) {
    gameState = 'GAMEOVER';
    gameResult = 'LOSS';
  }

  // 計算滑鼠與隱藏目標之間的距離
  let d = dist(mouseX, mouseY, targetX, targetY);

  // 根據距離計算閃爍頻率：距離越短，freq 越大 (0.4 ~ 0.02)
  let freq = map(d, 0, 600, 0.4, 0.02, true);
  let flicker = map(sin(frameCount * freq * 10), -1, 1, 50, 255);

  // 繪製垂直網格線
  for (let x = 0; x <= width; x += spacing) {
    // 如果網格線靠近滑鼠位置，則產生霓虹粉紅閃爍
    if (abs(x - mouseX) < spacing) {
      stroke(255, 0, 255, flicker); 
      strokeWeight(2); // 霓虹線條稍微粗一點
    } else {
      stroke(255, 215, 0, 50); // 原始淡淡的金色
      strokeWeight(1);
    }
    line(x, 0, x, height);
  }

  // 繪製水平網格線
  for (let y = 0; y <= height; y += spacing) {
    if (abs(y - mouseY) < spacing) {
      stroke(255, 0, 255, flicker);
      strokeWeight(2);
    } else {
      stroke(255, 215, 0, 50);
      strokeWeight(1);
    }
    line(0, y, width, y);
  }

  // 更新與繪製粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  // 繪製滑鼠追蹤圓點，輔助玩家對準格子
  drawMouseDot();
}

function drawMouseDot() {
  push();
  noStroke();
  fill(255, 215, 0, 150); // 淡淡的金色
  circle(mouseX, mouseY, 8); // 直徑 8 像素的小圓點
  pop();
}

function drawGameOver() {
  background('#1a0033');
  
  // 標示精靈原本的位置 (明顯的光圈)
  push();
  noFill();
  let pulse = sin(frameCount * 0.1) * 10;
  stroke(255, 215, 0, 150 + sin(frameCount * 0.1) * 100);
  strokeWeight(4);
  circle(targetX, targetY, spacing * 1.5 + pulse);
  pop();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  textAlign(CENTER, CENTER);
  if (gameResult === 'WIN') {
    fill(255, 215, 0);
    textSize(64);
    text("🎉 捕捉成功！", width / 2, height / 2 - 80);
  } else {
    fill(255, 50, 50);
    textSize(64);
    text("💀 精靈消失了...", width / 2, height / 2 - 80);
  }

  // 再玩一次按鈕
  let btnW = 200;
  let btnH = 50;
  let btnX = width / 2 - btnW / 2;
  let btnY = height / 2 + 20;
  let isHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

  stroke(255);
  strokeWeight(1);
  if (isHover) {
    fill(255, 255, 255, 50);
    cursor(HAND);
  } else {
    noFill();
  }
  rect(btnX, btnY, btnW, btnH, 10);
  noStroke();
  fill(255);
  textSize(20);
  text("再玩一次", width / 2, btnY + btnH / 2);
}

function mousePressed() {
  if (gameState === 'START') {
    let btnW = 220;
    let btnH = 60;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 + 50;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      gameState = 'PLAYING';
      startTime = millis();
      resetGame();
    }
  } else if (gameState === 'PLAYING') {
    let d = dist(mouseX, mouseY, targetX, targetY);
    if (d < spacing) {
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(targetX, targetY));
      }
      gameState = 'GAMEOVER';
      gameResult = 'WIN';
    }
  } else if (gameState === 'GAMEOVER') {
    let btnW = 200;
    let btnH = 50;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 + 20;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      gameState = 'START';
    }
  }
}

// 粒子類別
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // 隨機放射速度
    this.vel = p5.Vector.random2D().mult(random(2, 8));
    this.acc = createVector(0, 0.05); // 輕微的重力感
    this.lifespan = 255;
    // 隨機彩虹色 (HSB 概念)
    this.hue = random(360);
    this.size = random(5, 15); // 初始大小較大，模擬「放大」放射感
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4; // 逐漸消失
    this.size *= 0.98;   // 逐漸縮小
  }

  display() {
    push();
    colorMode(HSB);
    noStroke();
    fill(this.hue, 80, 100, this.lifespan);
    circle(this.pos.x, this.pos.y, this.size);
    pop();
  }

  isFinished() {
    return this.lifespan < 0;
  }
}
