let input;
let sizeSlider;
let button;
let isMoving = false;
let select;
let iframeDiv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  input = createInput('✨淡江大學😍');
  input.position(20, 20);
  input.style('font-size', '20px');
  input.size(200, 25); // width, height
  input.style('background-color', '#f7e1d7');
  input.style('color', '#415a77');

  sizeSlider = createSlider(15, 80, 30); // min, max, default value
  sizeSlider.position(input.x + input.width + 50, input.y + input.height / 2);

  button = createButton('跳動');
  button.position(sizeSlider.x + sizeSlider.width + 50, 20);
  button.size(150, 50);
  button.style('font-size', '20px');
  button.mousePressed(() => isMoving = !isMoving);

  select = createSelect();
  select.position(button.x + button.width + 50, 20);
  select.size(150, 40);
  select.style('font-size', '20px');
  select.option('淡江大學');
  select.option('教科系');
  select.changed(changeContent);

  iframeDiv = createDiv();
  iframeDiv.position(200, 200);
  iframeDiv.size(windowWidth - 400, windowHeight - 400);
  iframeDiv.html('<iframe src="https://www.tku.edu.tw" style="width:100%; height:100%; border:none;"></iframe>');
}

function changeContent() {
  let val = select.value();
  input.value(val);
  
  let url = 'https://www.tku.edu.tw';
  if (val === '教科系') {
    url = 'https://www.et.tku.edu.tw';
  }
  iframeDiv.html('<iframe src="' + url + '" style="width:100%; height:100%; border:none;"></iframe>');
}

function draw() {
  background(220);
  let txt = input.value();
  let colors = ['#cdb4db', '#f06c9b', '#ffafcc', '#b23a48', '#a2d2ff', '#b08968', '#c78395', '#5a3b66', '#99ae9d', '#ffbd00'];
  let size = sizeSlider.value();
  textSize(size);
  textAlign(LEFT, CENTER); // 讓文字垂直置中
  
  let w = textWidth(txt);
  
  if (w > 0) {
    // 讓行距根據文字大小動態調整，避免文字重疊
    for (let y = 100; y < height; y += size * 1.5) {
      let count = 0;
      for (let x = 0; x < width; x += w + 30) {
        fill(colors[count % colors.length]);
        
        let xOff = 0;
        let yOff = 0;
        if (isMoving) {
          xOff = random(-5, 5);
          yOff = random(-5, 5);
        }
        text(txt, x + xOff, y + yOff);
        count++;
      }
    }
  }
}