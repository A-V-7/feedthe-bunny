const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var w,h;

function preload(){
  bg_img = loadImage("background.png");
  cut_button = loadImage("cut_button.png");
  melon = loadImage("melon.png");
  rabbit1 = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eating = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  greyStar = loadAnimation("g_star1.png");
  yellowStar = loadAnimation("star.png");

  blink.playing = true;
  eating.playing = true;
  sad.playing = true;
  eating.looping = false;
  sad.looping = false;

  air = loadSound("air.wav");
  eatSound = loadSound("eating_sound.mp3");
  ropeCut = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  bgMusic = loadSound("sound1.mp3");
}




function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    w = displayWidth;
    h = displayHeight;
    createCanvas(displayWidth,displayHeight);
  }
  else{
    w = windowWidth;
    h = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }
  engine = Engine.create();
  world = engine.world;
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  
  textSize(50);

  ground = new Ground(200,h,w,20);

  rope = new Rope(12,{x:245,y:100});
  rope2 = new Rope(5,{x:w/2,y:40});
  rope3 = new Rope(10,{x:w-350,y:150});
  
  fruit = Bodies.circle(w/2,300,20);
  Composite.add(rope.body,fruit);

  fruitLink = new Link(rope,fruit);
  fruitLink2 = new Link(rope2,fruit);
  fruitLink3 = new Link(rope3,fruit);
  
  blink.frameDelay = 10;
  eating.frameDelay = 10;
  sad.frameDelay = 10;

  bunny = createSprite(500,h-80);
  bunny.addAnimation("blinking",blink);
  bunny.addAnimation("eat",eating);
  bunny.addAnimation("sad",sad);
  
  bunny.scale = 0.2;
  
  cut = createImg("cut_button.png");
  cut.position(225,100);
  cut.size(30,30);
  cut.mouseClicked(drop);

  cut2 = createImg("cut_button.png");
  cut2.position(w/2,40);
  cut2.size(30,30);
  cut2.mouseClicked(drop2);

  cut3 = createImg("cut_button.png");
  cut3.position(w-350,150);
  cut3.size(30,30);
  cut3.mouseClicked(drop3);

  blower = createImg("balloon.png");
  blower.position(10,350);
  blower.size(150,100);
  blower.mouseClicked(airBlower);

  blower2 = createImg("balloon2.png");
  blower2.position(width/2,400);
  blower2.size(100,150);
  blower2.mouseClicked(airBlower2);

  /*blower3 = createImg("balloon3.png");
  blower3.position(width-200,300);
  blower3.size(150,100);
  blower3.mouseClicked(airBlower3);*/


  star1 = createSprite(width/2+150,100);
  star1.addAnimation("star1",yellowStar);
  star1.scale = 0.02;

  star2 = createSprite(250,height/2+100);
  star2.addAnimation("star1",yellowStar);
  star2.scale = 0.02;

  
  greyStar1 = createSprite(50,30);
  greyStar1.addAnimation("greyStar1",greyStar);
  greyStar1.addAnimation("yellowStar1",yellowStar);
  greyStar1.scale = 0.07;

  greyStar2 = createSprite(100,30);
  greyStar2.addAnimation("greyStar2",greyStar);
  greyStar2.addAnimation("yellowStar2",yellowStar);
  greyStar2.scale = 0.07;


  mute = createImg("mute.png");
  mute.position(w-100,20);
  mute.size(50,50);
  mute.mouseClicked(stopSound);

  bgMusic.play();
  bgMusic.setVolume(0.3);

  /*click = createButton("");
  click.class("button");
  click.position(300,200);*/
  
}

function draw() 
{
  background(0);
  image(bg_img,0,0,displayWidth+80,displayHeight);
  Engine.update(engine);
  drawSprites();
  ground.display();
  rope.display();
  rope2.display();
  rope3.display();
  
  //bunny.debug = true;
  
  imageMode(CENTER);
  if(fruit!=null){
  image(melon,fruit.position.x,fruit.position.y,60,60);
  }
  

  if(collide(fruit,bunny,80)==true){
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation("eat");
    eatSound.play();
  }
  if(fruit!=null&&fruit.position.y>=h-50)
  {
     bunny.changeAnimation('sad');
     bgMusic.stop();
     sadSound.play();
     fruit = null;
   }

   if(collide(fruit,star1,20)==true){
    star1.visible = false;
    greyStar1.changeAnimation("yellowStar1");
    greyStar1.scale = 0.02;

   }

   if(collide(fruit,star2,20)==true){
    star2.visible = false;
    greyStar2.changeAnimation("yellowStar2");
    greyStar2.scale = 0.02;
   }
}

function drop(){
  rope.break();

  fruitLink.break();
  fruitLink = null;
  ropeCut.play();
}

function drop2(){
  rope2.break();

  fruitLink2.break();
  fruitLink2 = null;
  ropeCut.play();
}

function drop3(){
  rope3.break();

  fruitLink3.break();
  fruitLink3 = null;
  ropeCut.play();
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
              
               return true; 
            }
            else{
              return false;
            }
         }
}

function airBlower(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.03,y:0});
  air.play();
}

function airBlower2(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0,y:-0.03});
  air.play();
}

function airBlower3(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:-0.03,y:0});
  air.play();
}

function stopSound(){
  if(bgMusic.isPlaying()){
    bgMusic.stop();
  }
  else{
    bgMusic.play();
  }
}