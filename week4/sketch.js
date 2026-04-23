function setup() {
  // createCanvas(400, 400);產生一個400x400的畫布
  createCanvas(windowWidth, windowHeight);// 產生一個畫布，寬度和高度與瀏覽器視窗相同
  // background(220);設定背景顏色為220（灰色），數值範圍從0（黑色）到255（白色）
  // background(225, 0, 0);設定背景顏色為紅色，使用RGB顏色模式，分別代表紅色、綠色和藍色的強度
  // background(255，255，0， 127);設定背景顏色為綠色，使用RGBA顏色模式，分別代表紅色、綠色、藍色的強度和透明度

  var clr1 = color("#ffe5d9"); //創建一個顏色變數clr1，設定為紅色
  var clr2 = color("#ffcad4"); //創建一個顏色變數clr2，設定為綠色
  var clr3 = color("#d8e2dc"); //創建一個顏色變數clr3，設定為藍色
  background(clr1); //使用clr1變數設定背景顏色為紅色
  // background(clr2); //使用clr2變數設定背景顏色為綠色

  colorMode(HSB); //設定顏色模式為HSB，分別代表色相、飽和度和亮度的範圍
  var clr1 = color(0, 30, 100); //創建一個顏色變數clr1，設定為色相0（藍色），飽和度30，亮度100
  clr1.setAlpha(50); //設定clr1變數的透明度為0.5，數值範圍從0（完全透明）到255（完全不透明）
  background(clr1); 
}

function draw() {
  // background(220);
  var clr2 = color(mouseX%360, 50, mouseY%100); //創建一個顏色變數clr2，設定為色相120（綠色），飽和度50，亮度50
  var clr3 = color(240, 50, 50); //創建一個顏色變數clr3，設定為色相240（紅色），飽和度50，亮度50
  clr2.setAlpha(100); //設定clr2變數的透明度為100
  fill(clr2); //設定填充顏色為clr2（綠色）
  // stroke(clr3); //設定筆觸顏色為clr3（藍色）
  // strokeWeight(4); //設定筆觸寬度為4像素
noStroke(); //取消筆觸，使圖形沒有邊框
  ellipse(mouseX, mouseY, 100, 100); //在滑鼠位置繪製一个寬度和高度為200像素的橢圓形
}
