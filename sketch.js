let mySong;
let fft;
let filter, filterFreq, filterRes;
let analyzer;
let capture;
let playing;

function preload(){
  mySong = loadSound("./assets/paolo-nutini-better-man-official-acoustic.mp3");
  filter = new p5.LowPass();
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  //mySong.play ();

  // The analyzer allows to perform analysis on a sound file
  analyzer = new p5.Amplitude();
  analyzer.setInput(mySong);

  mySong.disconnect();
  mySong.connect(filter);
  fft = new p5.FFT();

  myCapture = createCapture (VIDEO);
  myCapture.hide();
}


function draw() {
  background(196,247,161);

  textFont("Poppins")
  textSize(14);
  
  let msg = "Move the cross to change the sound"
  let msg2 = "Press P to make Nutini sing again"
  text(msg, mouseX + 20, mouseY + 30);
  text(msg2, mouseX + 20, mouseY  + 50);
  cursor(CROSS);

  push();
  image(myCapture, mouseX, mouseY, width, - height);
  scale(-2, 2);
  pop();
  
  line(mouseX, 0, mouseX, height);
  line(0, mouseY, width, mouseY);


  if (mySong.isPlaying() === false) {
  mySong.play();
  } 
  

  // Map mouseX to a the cutoff frequency from the lowest
  push();
  filterFreq = map(mouseX, 0, width, 1, 10000);

  // Map mouseY to resonance (volume boost) at the cutoff frequency
  filterRes = map(mouseY, 0, height, 20, 20);

  // set filter parameters
  filter.set(filterFreq, filterRes);

  // Draw every value in the FFT spectrum analysis where
  // x = lowest (10Hz) to highest (22050Hz) frequencies,
  // h = energy (amplitude / volume) at that frequency
  let spectrum = fft.analyze();
  
  noFill();
 
  for (let i = 0; i < spectrum.length; i++) {
  let x = map(i, 0, spectrum.length, 0, width);
  let h = -height + map(spectrum[i], 0, 255, height, 0);
  rect(x, height, width / spectrum.length, h);
  }

  pop();
  
}

function keyPressed() {
  if (key === 'p') {
      mySong.stop();
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
