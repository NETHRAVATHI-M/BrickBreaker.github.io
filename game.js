const cvs = document.getElementById('breakout');
const ctx = cvs.getContext("2d");
cvs.style.border = "2px solid red";
let GAME_OVER = false;
const BALL_RADIUS = 20;
const PADDLE_WIDTH = 300;
const PADDLE_MARGIN_BOTTOM = 100;
const PADDLE_HEIGHT = 50;
let SCORE =0; 
const SCORE_UNIT=10;
let LEVEL=1;
const MAX_LEVEL =3;
ctx.drawImage(BG_IMG, 0, 0);

//make line thick when you are drawing a canvas
ctx.lineWidth = 3;
let leftArrow = false;
let righttArrow = false;
let LIFE = 3;


const paddle ={
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y: cvs.height-PADDLE_MARGIN_BOTTOM-PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx :8
}
drawPaddle()

function drawPaddle(){              
     
    ctx.fillStyle="#2e3548";
    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    ctx.strokeStyle="#ffcd05";
    ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
    
}

//control the paddle
document.addEventListener("keydown", function(event){
    if(event.keyCode==37){
        leftArrow = true;
    }else if(event.keyCode==39){
        righttArrow = true;
    }
    
});

document.addEventListener("keyup", function(event){
    if(event.keyCode==37){
        leftArrow = false;
    }else if(event.keyCode==39){
        righttArrow = false;
    }
    
});

//CREATE A BALL
const ball = {
    x:cvs.width/2,
    y:paddle.y-BALL_RADIUS,
    radius: BALL_RADIUS,
    speed:10,
    dx : 5 + (Math.random()*2 -1),
    dy:-5
}

//draw theb ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0,Math.PI * 2);
    ctx.fillStyle="#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
    
    
    
}

//Move the ball
function moveBall(){
    ball.x +=ball.dx;
    ball.y += ball.dy;
}

//BALL AND WALL COLLISION
function ballWallCollision(){
    if(ball.x +ball.radius>cvs.width || ball.x-ball.radius<0){
        ball.dx =- ball.dx;
        WALL_HIT.play();
    }
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }

    if(ball.y+ball.radius>cvs.height){
        LIFE--;
        LIFE_LOST.play();
        resetBall();
    }
}


//RESETTING THE BALL
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y-BALL_RADIUS;
    
    ball.dx = 5 + (Math.random()*2 -1);
    ball.dy = -5;


}

//BALL AND PADDLE COLLISION
function ballPeddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        PADDLE_HIT.play();
        //CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x -(paddle.x + paddle.width/2);
        //NORMALIZE THE VALUES
        collidePoint = collidePoint/(paddle.width/2);
        //calculate The angle of the ball
        let angle =  collidePoint*Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);

    }
}


//CREATE THE BRICKS
const brick ={
    row: 1,
    column : 6,
    width: 150,
    height: 50,
    offsetLeft:90,
    offsetTop:100,
    marginTop:60,
    fillcolor:"#2e3548",
    strokeColor:"#FFF"
}


//CREATING THE BRICKS
let bricks = [];

function createBricks(){
    for(let r=0;r<brick.row;r++){
        bricks[r] = [];
        for(let c=0;c < brick.column;c++){
            bricks[r][c] = {
                x: c*(brick.offsetLeft+brick.width)+brick.offsetLeft,
                y: r*(brick.offsetTop+brick.height)+brick.offsetTop+brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

//DRAW THE BRICKS 
function drawBricks(){
    for(let r=0;r<brick.row;r++){
        for(let c=0;c<brick.column;c++){
           let b= bricks[r][c];
            if(b.status){
                ctx.fillStyle=brick.fillcolor;
                ctx.fillRect(b.x,b.y,brick.width,brick.height);
                ctx.strokeStyle =brick.strokeColor;
                ctx.strokeRect(b.x,b.y,brick.width,brick.height);
            }
        }
    }
}

//BALL BRICK COLLISION
function ballBrickCollision(){
    for(let r=0;r<brick.row;r++){
        for(let c=0;c<brick.column;c++){
           let b= bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius>b.x && ball.x-ball.radius<b.x+brick.width && ball.y +ball.radius >b.y && ball.y-ball.radius<b.y+brick.height){
                   BRICK_HIT.play();
                    ball.dy= -ball.dy;
                    b.status=false;
                    SCORE += SCORE_UNIT;
                }          }
        }
    }
}

//SHOW GAME STATUS
function showGameStatus(text,textX,textY,img,imgX,imgY){

    ctx.fillStyle="#FFF";
    ctx.font='60px Germania One';
    
    ctx.fillText(text, textX, textY,width=5000,height=4000);
    ctx.drawImage(img,imgX,imgY,width=50,height=50);
    
    
}


//Game Over 
function gameOver(){
    if(LIFE<=0){
        showYouLOOSE();
        GAME_OVER = true;
    }
}

function levelUp(){
    let isLevelDone = true;
    for(let r=0;r<brick.row;r++){
        for(let c=0;c<brick.column;c++){
            isLevelDone = isLevelDone && ! 
            bricks[r][c].status;
        }
    }
    if(isLevelDone){
        WIN.play();
        if(LEVEL >= MAX_LEVEL){
            showYouWin();//here i amcalling that function
            GAME_OVER =true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed+=0.5;
        resetBall();
        LEVEL++;
    }

}

//draw function
function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
    ballBrickCollision();
    //SHOW SCORES
    showGameStatus(SCORE,180,60,SCORE_IMG,100,30);

    //SHOW LIVES
    showGameStatus(LIFE,cvs.width-60,60,LIFE_IMG,cvs.width-150,30);

    //SHOW LEVEL
    showGameStatus(LEVEL,cvs.width/2+10,60,LEVEL_IMG,cvs.width/2 - 70,30);
    
}


//move paddle
function movePaddle(){
    if(righttArrow && paddle.x +paddle.width<cvs.width){
        paddle.x+=paddle.dx;
    }else if(leftArrow && paddle.x>0){
        paddle.x-=paddle.dx
    }
} 

const soundElement = document.getElementById("sound");
soundElement.addEventListener("click",audioManager);
function audioManager(){
    let imgscrc=soundElement.getAttribute("src");
    let SOUND_IMG = imgscrc == "images/SOUND_ON.png" ? "images/SOUND_OFF.png":"images/SOUND_ON.png";
    soundElement.setAttribute("src",SOUND_IMG);
    WALL_HIT.muted = WALL_HIT.muted? false:true;
    PADDLE_HIT.muted = PADDLE_HIT.muted? false:true;
    BRICK_HIT.muted = BRICK_HIT.muted? false:true;
    WIN.muted = WIN.muted? false:true;
    LIFE_LOST.muted = LIFE_LOST.muted? false:true;
}





function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
   ballPeddleCollision();
   gameOver();
   levelUp();
}

function loop(){
    ctx.drawImage(BG_IMG, 0, 0);
    if(LEVEL==0){
        start();

    }
    
    draw();
    update();
    if(!GAME_OVER){
    requestAnimationFrame(loop);
    }      
}



//SHOW GAME OVER MESSAGE
const gameover = document.getElementById("gameover");
const youwon = document.getElementById("youwon");
const youlose = document.getElementById("youlose");

const gamewon = document.getElementById("gamewon");
const restart = document.getElementById("restart");





//CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click",function(){
    location.reload();//used to reload the page
})




//SHOW YOU WON
function showYouWin(){
    gamewon.style.display="block";
    restart.style.display="block";
    restart.style.visibility="visible";

    
}

//SHOW YOU LOOSE THE GAME
function showYouLOOSE(){
    gameover.style.display="block";
    youlose.style.display="block";
    restart.style.visibility="visible";
}
