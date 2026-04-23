function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(85, 20, 90);
  for (let i = 0; i < width; i += 100) {
    var clr = color((frameCount + i / width * 60) % 360, 100, 100);
    // clr.setAlpha(i / width);
    fill(clr);
    ellipse(i, height / 2, 200, 200);
  }
}
