/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisiblejungle;
var invisibleGround

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  //create jungle 
  jungle = createSprite(400,30,width,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.4;
  jungle.x = width /2;

  //create kangaroo and set properties 
  kangaroo = createSprite(100, height-120);
  kangaroo.addAnimation('kangaroo_running', kangaroo_running);
  kangaroo.addAnimation('kangaroo_collided', kangaroo_collided);
  kangaroo.changeAnimation('kangaroo_running');
  kangaroo.scale = 0.18;
  kangaroo.debug = true;
  kangaroo.setCollider("circle", 0, 100, 300);

  // create invisible ground 
  invisibleGround = createSprite(width/2, height-20, width, 20);
  invisibleGround.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(0);
  //position of kangaroo according to camera
  kangaroo.x = camera.position.x-270;

  //Gravity 
  kangaroo.velocityY +=1 ;
  kangaroo.collide(invisibleGround);
  if(keyDown (UP_ARROW) && kangaroo.y >= 170){
    kangaroo.velocityY = -12;
    jumpSound.play();
  }

  //check the state of game 
  if (gameState === PLAY){
        jungle.velocityX = -4;
        if(jungle.x < 0){
          jungle.x = jungle.width/7;
        }

      //spawn Shubs
        spawnObstables();

      //spawn Obstacles
        spawnShrub();

      if (kangaroo.isTouching(shrubsGroup)){
        shrubsGroup.destroyEach();
        score +=1;
      }
      if (kangaroo.isTouching(obstaclesGroup)){
        gameState = 0;
        collidedSound.play();
      }
    
  
  if(gameState===END){
      kangaroo.changeAnimation('kangaroo_collided');
      jungle.velocityX = 0;
      shrubsGroup.destroyEach();
      obstaclesGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
  }

 
    
  }
  
  drawSprites();

  push ();
    stroke (0);
    fill ('#660000');
    textSize (25);
    textStyle(BOLDITALIC);
    text ("Score: " + /* "&emsp;" */ + score , width -120, 30);
  pop ();
}

function spawnShrub(){
  if(frameCount %150 === 0){
    var shrub = createSprite(camera.position.x + 400, 330, 40, 10);
    shrub.velocityX = -4;
    var shrubTypes = [shrub1, shrub2, shrub3];
    var rand = random(shrubTypes);
    shrub.addImage(rand);
    shrub.scale = 0.1;
    shrub.lifetime = width/4 + 200;
    shrubsGroup.add(shrub);
  }
}
function spawnObstables(){
  if(frameCount %100 === 0){
    var obstacle = createSprite(camera.position.x + 500, 330, 40, 10);
    obstacle.velocityX = -4;
    obstacle.scale = 0.25;
    obstacle.addImage(obstacle1);
    obstaclesGroup.add(obstacle);
    obstacle.lifetime = width/4 + 200;
    obstacle.depth = kangaroo.depth;
    kangaroo.depth +=1;
  }
}
