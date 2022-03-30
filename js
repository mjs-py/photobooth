var cnv;
var video_master;
var cam;
var single_cap;
var quad_mode;
var images = [];
var c_w;
var c_h;
var f_click;

//attempted ml5 implementation
let faceapi;
let detections = [];


function setup() {
  cnv = createCanvas(600, 450);

  video_master = createCapture(VIDEO);
  video_master.hide();
  
  cam = createButton('live camera');
  cam.position(600, 469);
  cam.mousePressed(camFeed)
  
  single_cap = createButton('snap!');
  single_cap.position(600, 449);
  single_cap.mousePressed(takeSnap);
  
  quad_mode = createButton('quad mode!');
  quad_mode.position(0, 449);
  c_w = 300;
  c_h = 225;
  quad_mode.mousePressed(quadSnap);
  
  cnv.mousePressed(playClicks);
  
  //attempted ml5 implementation
  
    const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.5
  };
  
  faceapi = ml5.faceApi(video_master, faceOptions, faceReady);
 
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if(error){
    console.log(error);
    return;
  }
  
  detections = result;
  console.log(detections);
  faceapi.detect(gotFaces);
}

//regular code

function WarholSnap() {
  
  push();
  tint(255, 0, 0);
  image(video_master, 0, 0, c_w, c_h);
  tint(0, 255, 0);
  image(video_master, width/2, 0, c_w, c_h);
  tint(0, 0, 255)
  image(video_master, 0, height/2, c_w, c_h)
  tint(255, 0, 255)
  image(video_master, width/2, height/2, c_w, c_h);
  pop();

}

function playClicks() {
  
  f_click++;
  
  if(f_click == 1) {
    scale(1, -1)
    translate(0, -height)
    image(video_master, 0, 0)
  }
  
  else if(f_click == 2) {
    WarholSnap();
  }
  
  else if(f_click == 3) {
    image(video_master, 0, 0)
    filter(THRESHOLD)
  }
  
  else if(f_click == 4) {
    image(video_master, 0, 0)
    filter(INVERT)
  }
  
  else {
    f_click = 0;
  }
}

function takeSnap() {
  
  images.push(video_master.get())
  var a = 0;
  var z = 0;
  for (var i = 0; i < images.length; i++) {
    image(images[i], a, z)
  }
}

function quadSnap() {
  
  images.push(video_master.get())
  var x = 0;
  var y = 0;
  for (var i = 0; i < images.length; i++) {
    image(images[i], x, y, c_w, c_h);
    x = x + c_w;
    if (x >= width) {
      x = 0;
      y = y + c_h;
    }
    if (y >= height) {
      y = 0
    }
  }
}


function camFeed() {
  video_master.show();
  video_master.position(600, 0)
}

function draw() {
  textAlign(CENTER);
  textFont('Georgia');
  textSize(16);
  stroke(255);
  fill(0);
  if (millis() < 2000) {
    textStyle(ITALIC);
    text('Digital Photobooth', 300, 225)
    textStyle(NORMAL);
    text('Click the canvas to use filters', 300, 255)
  } else if (millis() > 2000) {
    fill(255);
  }
  
}

