// BLE UUIDs
const serviceUuid = "2A5A20B9-0000-4B9C-9C69-4975713E0FF2";
let sensor1Characteristic;
let sensor2Characteristic;
let sensorLevel1 = 0;
let sensorLevel2 = 0;
let myBLE;
let bg;
let bee;
let bee2;
let music;
let buttonDefault;
let buttonClicked;
let isButtonClicked = false;
let volumeOn;
let volumeOff;
// Variables for volume icon
let volumeIconX;
let volumeIconWidth = 40;  // Set volume icon width
let volumeIconHeight;
let volumeIconScale;
// Variables for volume animation
let lastVolumeIconSwitch = 0;
let iconSwitchInterval = 500; // Switch icon every 500 milliseconds
let showMaxVolume = true;

// Button variables
let buttonX = 10;
let buttonY = 10;
let buttonWidth = 100;  // Base width, height will be calculated based on ratio
let buttonHeight;
let buttonScale;
// Connection status variable
let isConnected = false;

// Animation variables
let beeX;
let beeY;
let targetX;
let targetY;
let speed = 2;
let beeWidth = 150;
let beeHeight;
let isMovingRight = false;
let isTransformed = false;

// Music control variables
let isPlaying = false;
let lastSensor1Value = 0;

let bgScale;
let bgX;
let bgY;
let bgWidth;
let bgHeight;

// font
let customFont;

// debug mode
let debugMode = false;


function preload() {
  bg = loadImage("images/image2.png");
  bee = loadImage("images/bee.png");
  bee2 = loadImage("images/bee2.png");
  music = loadSound('sound/natural_sound.mp3');
  buttonDefault = loadImage("images/button_default.png");
  buttonClicked = loadImage("images/button_clicked.png");
  volumeMax = loadImage("images/Volume_Max.png");
  volumeMin = loadImage("images/Volume_Min.png");
  volumeOff = loadImage("images/Volume_Off.png");
  customFont = loadFont('font/InriaSans-Regular.ttf');
}
    
function setup() {
  myBLE = new p5ble();
  createCanvas(windowWidth, windowHeight);
  
  // Set music to loop
  music.setLoop(true);
  
  // Calculate bee height while maintaining original aspect ratio
  beeHeight = beeWidth * (bee.height / bee.width);
  
  // Calculate button height while maintaining original aspect ratio
  buttonScale = buttonWidth / buttonDefault.width;
  buttonHeight = buttonDefault.height * buttonScale;
  
  // Calculate volume icon height while maintaining original aspect ratio
  volumeIconScale = volumeIconWidth / volumeMax.width;
  volumeIconHeight = volumeMax.height * volumeIconScale;
  
  // Set volume icon X coordinate (to the right of connect button)
  volumeIconX = buttonX + buttonWidth + 10;
  
  // Adjust background size to cover screen
  calculateBackgroundDimensions();
  
  // Initialize bee position in the center
  beeX = width/2;
  beeY = height/2;
  
  // Set initial random target
  setNewTarget();
  
  textFont(customFont);
  textSize(14);
}

function mousePressed() {
  // Check if mouse is within button area
  if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    isButtonClicked = true;
    connectAndStartNotify();
  }
}

function mouseReleased() {
  isButtonClicked = false;
}

function calculateBackgroundDimensions() {
  // Calculate aspect ratio
  let screenRatio = width / height;
  let imageRatio = bg.width / bg.height;
  
  if (screenRatio > imageRatio) {
    // If screen is wider, use width as base
    bgWidth = width;
    bgScale = width / bg.width;
    bgHeight = bg.height * bgScale;
    bgX = 0;
    bgY = (height - bgHeight) / 2;
  } else {
    // If screen is taller, use height as base
    bgHeight = height;
    bgScale = height / bg.height;
    bgWidth = bg.width * bgScale;
    bgX = (width - bgWidth) / 2;
    bgY = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateBackgroundDimensions();
}

function setNewTarget() {
  // Set new random target position within canvas bounds
  targetX = random(50, width-50);
  targetY = random(50, height-50);
}

function connectAndStartNotify() {
  console.log('Attempting to connect...');
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  if (error) {
    console.log('Error getting characteristics:', error);
    isConnected = false;
    return;
  }
  
  isConnected = true;  // Set connection success status
  
  for (let i = 0; i < characteristics.length; i++) {
    if (i == 0) {
      sensor1Characteristic = characteristics[i];
      myBLE.startNotifications(sensor1Characteristic, handleSensor1, 'custom');
    }
    else if (i == 1) {
      sensor2Characteristic = characteristics[i];
      myBLE.startNotifications(sensor2Characteristic, handleSensor2, 'custom');
    }
  }
}

function handleSensor1(data) {
  try {
    sensorLevel1 = data.getInt16(0, true);
    console.log('Sensor 1 value:', sensorLevel1);
    
    // Check whether to move and transform image
    isTransformed = sensorLevel1 > 1;
    
  } catch (error) {
    console.error('Error reading sensor data:', error);
  }
//   try {
//     let newValue = data.getInt16(0, true);
    
//     // Detect change from low to high (moment when button is pressed)
//     if (newValue > 80 && lastSensor1Value <= 80) {
//       if (!isPlaying) {
//         music.play();
//         isPlaying = true;
//       } else {
//         music.pause();  // Use pause() instead of stop()
//         isPlaying = false;
//       }
//     }
    
//     lastSensor1Value = newValue;
//     sensorLevel1 = newValue;
//     console.log('Sensor 1 value:', sensorLevel1);
    
//   } catch (error) {
//     console.error('Error reading sensor data:', error);
//   }
}

function handleSensor2(data) {
    try {
    let newValue = data.getInt16(0, true);
    
    // Detect change from low to high (moment when button is pressed)
    if (newValue > 80 && lastSensor2Value <= 80) {
      if (!isPlaying) {
        music.play();
        isPlaying = true;
      } else {
        music.pause();  // Use pause() instead of stop()
        isPlaying = false;
      }
    }
    
    lastSensor2Value = newValue;
    sensorLevel2 = newValue;
    console.log('Sensor 2 value:', sensorLevel2);
    
  } catch (error) {
    console.error('Error reading sensor data:', error);
  }
  
//   try {
//     sensorLevel2 = data.getInt16(0, true);
//     console.log('Sensor 2 value:', sensorLevel2);
    
//     // Check whether to move and transform image
//     isTransformed = sensorLevel2 > 1;
    
//   } catch (error) {
//     console.error('Error reading sensor data:', error);
//   }
}

function moveBee() {
  // Only move in transformed state (sensor > 80)
  if (isTransformed) {
    // Calculate direction to target
    let dx = targetX - beeX;
    let dy = targetY - beeY;
    let distance = sqrt(dx*dx + dy*dy);
    
    // Update movement direction
    isMovingRight = dx > 0;
    
    // If bee is close to target, set new target
    if (distance < 10) {
      setNewTarget();
    }
    
    // Move bee towards target
    if (distance > 0) {
      beeX += (dx/distance) * speed;
      beeY += (dy/distance) * speed;
    }
  }
}

function draw() {
  background(255);
  
  // Draw background
  image(bg, bgX, bgY, bgWidth, bgHeight);
  
  // Draw button
  if (isButtonClicked) {
    image(buttonClicked, buttonX, buttonY, buttonWidth, buttonHeight);
  } else {
    image(buttonDefault, buttonX, buttonY, buttonWidth, buttonHeight);
  }
  
  // Draw volume icon and handle animation
  let currentVolumeIcon;
  if (!isPlaying) {
    currentVolumeIcon = volumeOff;
  } else {
    // Check if icon needs to be switched
    if (millis() - lastVolumeIconSwitch >= iconSwitchInterval) {
      showMaxVolume = !showMaxVolume;
      lastVolumeIconSwitch = millis();
    }
    currentVolumeIcon = showMaxVolume ? volumeMax : volumeMin;
  }
  
  image(currentVolumeIcon, volumeIconX, buttonY + (buttonHeight - volumeIconHeight)/2, volumeIconWidth, volumeIconHeight);
  
  // Display connection status text
  fill(255);  // White text
  noStroke();
  textAlign(LEFT, TOP);
  let statusText = isConnected ? "Connected" : "Not Connected";
  text(statusText, 20, buttonY + buttonHeight + 5);  // Display 5 pixels below button
  
  // Move bee
  moveBee();
  
  // Draw bee with direction-based flipping
  push();
  imageMode(CENTER);
  translate(beeX, beeY);
  // Flip image based on movement direction
  if (isMovingRight) {
    scale(-1, 1);
  }
  // Choose bee image based on sensor value
  let currentBee = isTransformed ? bee : bee2;
  image(currentBee, 0, 0, beeWidth, beeHeight);
  pop();
  
  if (debugMode) {
    // Draw sensor values
    fill(255);
    textSize(16);
    text(`Sensor Value 1: ${sensorLevel1}${isPlaying ? ' (Playing)' : ' (Stopped)'}`, 20, 90);
    text(`Sensor Value 2: ${sensorLevel2}${isTransformed ? ' (Moving)' : ' (Stopped)'}`, 20, 110);
  }
}