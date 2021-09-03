var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var coin, coinsGroup;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bgImg; 
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("mario1.png","mario2.png","mario3.png","mario4.png");
  trex_collided = loadAnimation("mario5.png");
  obstacleImg = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  groundImage = loadImage("ground2.png");
  coinImg = loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png","coin5.png");
  cloudImage = loadImage("cloud.png");
  
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1000, 600);

  //var message = "This is a message";
 //console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 2;
  trex.setCollider("rectangle",0,0,28,33);
  trex.debug = true;
  
  ground = createSprite(500,583,1000,20);
  ground.addImage("ground",groundImage);
  ground.scale = 1.7;
  ground.x = ground.width /2;

  
  gameOver = createSprite(500,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(520,280);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 1;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(500,525,1000,20);
  invisibleGround.visible = false;
  
  //create Obstacle,Cloud and Coin Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  coinsGroup = createGroup();

  
  //trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background('#6485F7');

  //displaying score
  fill('brown');
  textSize(30);
  text("Score: "+ score, 800,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -5;
    
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 475) {
        trex.velocityY = -13;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.4
  
    //spawn the clouds, coins and obstacles
    spawnClouds();
    spawnCoins();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }

    if(coinsGroup.isTouching(trex)){
      //trex.velocityY = -12;
      score = score + 10;
      coinsGroup.destroyEach();
    
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     coinsGroup.setVelocityXEach(0);

     if(mousePressedOver(restart)) {
       reset();
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
  
    
}


function spawnObstacles(){
 var randObstacles = [15,50,97,123,25,72,81,221];
 randObstacles = int(random(randObstacles));
 if (frameCount % randObstacles === 0){
   var obstacle = createSprite(1000,490,10,10);
   obstacle.velocityX = -5;
   obstacle.addAnimation("obstacle",obstacleImg);
   obstacle.scale = 1.2;
   obstacle.lifetime = 250;
   obstaclesGroup.add(obstacle);
 }
}

function spawnCoins() {
 var randCoins = [67,25,85,250,135,173,191,123];
 randCoins = int(random(randCoins)); 
  if(frameCount % randCoins === 0) {
    var coin = createSprite(1100,490,10,10);
    coin.velocityX = -5;
    coin.addAnimation("coin",coinImg);
    coin.scale = 0.28;
    coin.lifetime = 250;
    coinsGroup.add(coin);
    
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloud = createSprite(1100,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 390;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

