//something.js


 var starfield = document.getElementById("starfield");
 var shield = document.getElementById("shield");
 var shieldText = document.getElementById("shield-label");
 var starctx = starfield.getContext('2d');
 var shieldctx = shield.getContext('2d');
 var scoreBox = document.getElementById("scorebox");
 var splodeSound = new Switcher();
 var speedMultiplier = 2;
 var mouseX = starfield.width/2;
 var mouseY = starfield.height - 100;
 var keyW = false;
 var keyA = false;
 var keyS = false;
 var keyD = false;
 var keySpace = false;
 var score = 0;
 var scurgeSprite = new Image();
 scurgeSprite.src = "img/Scurge2.png";


function Channel(audio_uri) {
    this.audio_uri = audio_uri;
    var clip = new Audio(audio_uri);
    clip.volume = 0.25;
    this.resource = clip;
    
}


function Switcher(audio_uri, num) {
	this.channels = [];
	this.num = num;
	this.index = 0;

	for (var i = 0; i < num; i++) {
        this.channels.push(new Channel(audio_uri));
	}
}

Switcher.prototype.play = function() {
	this.channels[this.index++].play();
	this.index = this.index < this.num ? this.index : 0;
}

Channel.prototype.play = function() {
	// Try refreshing the resource altogether
	this.resource.play();
}

Sound = (function() {
    var self = {};
    
	self.init = function() {
        splodeSound  = new Switcher('sound/splode.wav', 10);
        smackerShoot = new Switcher('sound/smacker_shoot2.wav', 20);
        scurgeShoot = new Switcher('sound/scurge_shoot.wav', 20);
	}

	return self;
}());



 
 class Star {
    
    static count = 400;
    static array = [];

    constructor() {
         this.x = Math.round(Math.random() * starfield.width);
         this.y = Math.round(Math.random() * starfield.height);
         this.size = Math.random() + 0.1;
         this.speed = Math.random() * speedMultiplier;
     }

   static generateStars(){
        for (var i = 0; i < Star.count; i++){
            Star.array.push(new Star());
        }
     }

   static drawStars(){
        for(var i = 0; i < Star.array.length; i++){
            starctx.beginPath();
            starctx.arc(
                Star.array[i].x, 
                Star.array[i].y, 
                Star.array[i].size, 
                0, 
                Math.PI * 2, 
                false
            );
            starctx.fillStyle = "lightblue";
            starctx.fill();
            starctx.closePath();
        }
    }

    static moveStars(){
        for(var i = 0; i < Star.array.length; i++){
            if(Star.array[i].y >= starfield.height){
                Star.array[i].x = Math.round(Math.random() * starfield.width);
                Star.array[i].y = 0;
                Star.array[i].speed = Math.random() + speedMultiplier;
                Star.array[i].size = Math.random() + 0.1;
            } else {
                Star.array[i].y += Star.array[i].speed + speedMultiplier;
            }
            
        }
    }
    
 }



 class Shot{
     
    static array = [];

    constructor(speed, startX, startY, fromScurge) {
         this.x = startX;
         this.dx = 0;
         this.y = startY;
         //this.y = source.y;
          this.speed = speed;

         if (speed < 0){
             this.color = "lightgreen";
         } else {
             this.color = "lightblue";
         }

         this.fromScurge = fromScurge;
     }

    static drawShots(){
        for(var i = 0; i < Shot.array.length; i++){
            starctx.beginPath();
            starctx.rect(Shot.array[i].x, Shot.array[i].y, 2, 12);
            starctx.fillStyle = Shot.array[i].color;
            starctx.fill();
            starctx.closePath();
        }
    }

    static moveShots(){
        for(var i = 0; i < Shot.array.length; i++){
            Shot.array[i].y -= Shot.array[i].speed;
            Shot.array[i].x -= Shot.array[i].dx;
            if (Shot.array[i].x <= 0){
                Shot.array.shift;
            }
        }
    }
 }


 class Smacker {

    static x;
    static y;
    static isHit = false;
    static speed = 0;
    static raiseShield = false;
    static shieldPower = 200;
    static shieldEmpty = false;
    
    constructor(){
        Smacker.x = starfield.width/2;
        Smacker.y = starfield.height*(3/4);
    }

    static generate(){
       var x = new Smacker();
    }

    static move(){

        if(Smacker.shieldPower <= 0){
            Smacker.shieldEmpty = true;
            shieldText.style.color = "red";
        } else if (Smacker.shieldPower >= 200){
            Smacker.shieldEmpty = false;
            shieldText.style.color = "greenyellow";
        }
        
        if(Smacker.shieldEmpty == true && Smacker.shieldPower <= 200){
            Smacker.shieldPower += .3;
        }
        
        if(keyD){
            Smacker.x += 9;
        }

        if (keyW){
            Smacker.y -= 9;
        }

        if(keyS){
            Smacker.y += 9;
        }

        if (keyA){
            Smacker.x -= 9;
        }

        if (keySpace && Smacker.shieldEmpty == false){
                Smacker.raiseShield = true;   
        } else {
            Smacker.raiseShield = false;
            Smacker.shieldPower += .3;
        }
        
        /*if (mouseX <= starfield.width && mouseX >= 0
            && mouseY <= starfield.height && mouseY >= 0){
                if((Smacker.x) <= Math.floor(mouseX)){
                    Smacker.x += 7;
                } else {
                    Smacker.x -= 7;
                }

                if(Smacker.y+20 <= Math.floor(mouseY)){
                    Smacker.y += 7;
                } else {
                    Smacker.y -= 7;
                }

            }*/

        
    }

    static shoot(){
        if (Smacker.isHit == false){
            Shot.array.push(new Shot(12, Smacker.x, Smacker.y, false));
            smackerShoot.play();
        }      
    }
     
    static draw(){

        shieldctx.clearRect(0,0, shield.width, shield.height);
        shieldctx.beginPath();
        shieldctx.rect(0, 0, Smacker.shieldPower, shield.height);
        shieldctx.fillStyle = "rgba(70, 102, 255, 0.5)";
        shieldctx.fill();
        shieldctx.closePath();

        if (Smacker.isHit == false){
            starctx.beginPath();
            starctx.rect(Smacker.x, Smacker.y, 2, 50);
            starctx.rect(Smacker.x-2, Smacker.y+4, 2, 50);
            starctx.rect(Smacker.x+2, Smacker.y+4, 2, 50);
            starctx.rect(Smacker.x-4, Smacker.y+16, 2, 50);
            starctx.rect(Smacker.x+4, Smacker.y+16, 2, 50);
            starctx.rect(Smacker.x-6, Smacker.y+32, 2, 50);
            starctx.rect(Smacker.x+6, Smacker.y+32, 2, 50);
            starctx.rect(Smacker.x-8, Smacker.y+40, 2, 42);
            starctx.rect(Smacker.x+8, Smacker.y+40, 2, 42);
            starctx.rect(Smacker.x-10, Smacker.y+40, 2, 44);
            starctx.rect(Smacker.x+10, Smacker.y+40, 2, 44);
            starctx.rect(Smacker.x-14, Smacker.y+43, 2, 22);
            starctx.rect(Smacker.x+14, Smacker.y+43, 2, 22);
            starctx.rect(Smacker.x-18, Smacker.y+47, 2, 20);
            starctx.rect(Smacker.x+18, Smacker.y+47, 2, 20);
            starctx.rect(Smacker.x-22, Smacker.y+51, 2, 18);
            starctx.rect(Smacker.x+22, Smacker.y+51, 2, 18);
            starctx.rect(Smacker.x-26, Smacker.y+56, 2, 16);
            starctx.rect(Smacker.x+26, Smacker.y+56, 2, 16);
            starctx.rect(Smacker.x-30, Smacker.y+62, 2, 14);
            starctx.rect(Smacker.x+30, Smacker.y+62, 2, 14);
            starctx.rect(Smacker.x-22, Smacker.y+25, 2, 55);
            starctx.rect(Smacker.x+22, Smacker.y+25, 2, 55);
            starctx.fillStyle = "gray";
            starctx.fill();
            starctx.closePath();
            if (Smacker.raiseShield == true && Smacker.shieldPower > 0){
                Smacker.shieldPower = Smacker.shieldPower - .5;
                starctx.beginPath();
                //starctx.rect(Smacker.x - 50, Smacker.y-20, 100, 10);
                starctx.arc(Smacker.x, Smacker.y+30, 50, 0, Math.PI, true); 
                starctx.fillStyle = "rgba(70, 102, 255, 0.2) ";
                starctx.fill();
                starctx.closePath();
            }
        }
     }

     static checkHit(){
         if(Smacker.isHit == false){
			for (var i = 0; i < Shot.array.length; i++){
				if (Math.round(Shot.array[i].x) >= Smacker.x - 22 
					&& Math.round(Shot.array[i].x) <= Smacker.x + 22
					&& Math.round(Shot.array[i].y) >= Smacker.y - 10
                    && Math.round(Shot.array[i].y) <= Smacker.y + 55
                    && Shot.array[i].fromScurge == true
                    && Smacker.raiseShield == false
				)
				{
                    Smacker.isHit = true;
                    splodeSound.play();
                    Splode.generateSplodes(Smacker);
                    Splode.generateSplodes(Smacker);
                    Splode.generateSplodes(Smacker);
					Shot.array.splice(i, 1);
				} else if (
                    Math.round(Shot.array[i].x) >= Smacker.x - 50 
                    && Math.round(Shot.array[i].x) <= Smacker.x + 50
                    && Math.round(Shot.array[i].y) >= Smacker.y - 10
                    && Math.round(Shot.array[i].y) <= Smacker.y + 55
                    && Shot.array[i].fromScurge == true
                    && Smacker.raiseShield == true){
                        Shot.array[i].speed = -(Shot.array[i].speed);
                        if(Shot.array[i].x > Smacker.x){
                            Shot.array[i].dx = -12;
                        }else if (Shot.array[i].x < Smacker.x){
                            Shot.array[i].dx = 12;
                        }
                        
                        Shot.array[i].fromScurge = false;
                    }
			}
        }
    }

 }

 class Scurge {

    static array = [];
    static count = 3;
    static scale = 1.3 ;
    static spriteW = 32;
    static spriteH = 31;
    static frame = [0, 1, 2, 4];
	
	constructor(){
		this.x = Math.round(Math.random() * starfield.width);
		this.y = -10;
		this.radius = 7;
        this.speed = 7;
        if (this.x <= Smacker.x){
            this.dx = 5;
        } else {
            this.dx = -5;
        }
        this.isHit = false;
        this.name = "scurge";
        this.index = 0;
        this.frameCount = 0;
        Scurge.array.push(this);
    }
    
    static generateScurge(){
        for (var i = 0; i < Scurge.count; i++){
           Scurge.array.push(new Scurge());
        }
     }


    static drawScurge(){
        for(var i = 0; i < Scurge.array.length; i++){
            if (Scurge.array[i].isHit == false){
                
                if (Scurge.array[i].index > 3){
                    Scurge.array[i].index = 0;
                }

                starctx.drawImage(
                    scurgeSprite, 
                    Scurge.frame[Scurge.array[i].index] * Scurge.spriteW,
                    0 * Scurge.spriteH, 
                    32, 31, 
                    Scurge.array[i].x, Scurge.array[i].y, 
                    32 * Scurge.scale, 31 * Scurge.scale
                );

                if (Scurge.array[i].frameCount > 10){
                    Scurge.array[i].index++;
                    Scurge.array[i].frameCount = 0;
                } else{
                    Scurge.array[i].frameCount++;
                }

            }
        }
    }

    shoot(){
        Shot.array.push(new Shot(-12, this.x+25, this.y+30, true));
        scurgeShoot.play();
    }
	
	static moveScurge(){
            

        for(var i = 0; i < Scurge.array.length; i++){
            var dx = Smacker.x - Scurge.array[i].x;
            if (Scurge.array[i].y < starfield.height){
                Scurge.array[i].y += Scurge.array[i].speed;
                Scurge.array[i].x += Scurge.array[i].dx;
                if((Math.random() * 500) + 1 > 490 && Scurge.array[i].x >= Smacker.x - 200 && Scurge.array[i].x <= Smacker.x + 200){
                    Scurge.array[i].shoot();
                }
            } else {
                Scurge.array[i].y = -1;
                Scurge.array[i].x =  Math.round(Math.random() * starfield.width);
            }
        }
			
    }
    
	
	static checkHit(){
		for (var j = 0; j < Scurge.array.length; j++){
			for (var i = 0; i < Shot.array.length; i++){
				if (Math.round(Shot.array[i].x) >= Scurge.array[j].x - 10  
					&& Math.round(Shot.array[i].x) <= Scurge.array[j].x + 40
					&& Math.round(Shot.array[i].y) >= Scurge.array[j].y - 25
                    && Math.round(Shot.array[i].y) <= Scurge.array[j].y + 25
                    && Shot.array[i].fromScurge == false
				)
				{
                    Scurge.array[j].isHit = true;
                    splodeSound.play();
                    Splode.generateSplodes(Scurge.array[j]);
                    Scurge.array.splice(j, 1);
                    score+= 100;
                    Shot.array.splice(i, 1);
                    new Scurge();
				}
			}
		}
		
	}
}


 class Splode {
     
    static array = []; 

    constructor(x, y, speed){
        
        this.x = x;
        this.y = y;
        this.x2 = x;
        this.y2 = y;
        this.age = 0;
        this.speed = speed;
        
        if (Math.random() >= 0.5){
        this.xDirection = Math.random() * -5;
        this.x2Direction = Math.random() * -50;
        } else {
        this.xDirection = Math.random() * 5;
        this.x2Direction = Math.random() * 50;
        }

        if (Math.random() >= 0.5){
        this.yDirection = Math.random() * -5;
        this.y2Direction = Math.random() * -50;
        } else {
        this.yDirection = Math.random() * 5;
        this.y2Direction = Math.random() * 50;
        }

    }

    static generateSplodes(s){
        for (var i=0; i < 100; i++){
            Splode.array.push(new Splode(s.x, s.y, s.speed));
        }
    }

    static drawSplodes(){
        for(var i=0; i < Splode.array.length; i++){
            starctx.beginPath();
            starctx.arc(Splode.array[i].x, Splode.array[i].y, 2, 0, Math.PI*2, false);
            starctx.rect(Splode.array[i].x2, Splode.array[i].y2, 1, 4);
            //starctx.rect(Splode.array[i].x2-2, Splode.array[i].y2+2, 4, 1);
            starctx.fillStyle = "rgba(" + (Math.floor(Math.random() * (255)) + 1) + ", " + (Math.floor(Math.random() * (255)) + 1) + "," + (Math.floor(Math.random() * (255)) + 1);
            starctx.fill();
            starctx.closePath();
        }
    }

    static moveSplodes(){
        for(var i=0; i < Splode.array.length; i++){
            if(Splode.array[i].age < 25){
                Splode.array[i].x += Splode.array[i].xDirection;
                Splode.array[i].y += Splode.array[i].yDirection + Splode.array[i].speed;
                Splode.array[i].x2 += Splode.array[i].x2Direction;
                Splode.array[i].y2 += Splode.array[i].y2Direction + Splode.array[i].speed;
                Splode.array[i].age++;
            } else {
                Splode.array.splice(i, 1);
            }
        }
    }
        
     
 }

 starfield.addEventListener('mousemove', handleMouseMove, false);
 starfield.addEventListener('click', Smacker.shoot, false);
 starfield.addEventListener('contextmenu', Smacker.shoot, false);
 window.addEventListener("keydown", onKeyDown, false);
 window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
        
        var keyCode = event.keyCode;
        
        switch (keyCode) {
            case 68: //d
                keyD = true;
                break;
            case 83: //s
                keyS = true;
                break;
            case 65: //a
                keyA = true;
                break;
            case 87: //w
                keyW = true;
                break;
            case 78:
                if(Smacker.isHit){
                    Smacker.isHit = false;
                    score = 0;
                    Smacker.shieldPower = 200;
                }
                break;
            case 32:
                keySpace = true;
                break;
            }
    }

    function onKeyUp(event) {
    
        var keyCode = event.keyCode;

        switch (keyCode) {
            case 68: //d
                keyD = false;
                break;
            case 83: //s
                keyS = false;
                break;
            case 65: //a
                keyA = false;
                break;
            case 87: //w
                keyW = false;
                break;
            case 32:
                keySpace = false;
                break;
        }
    }


 Scurge.generateScurge();
 Star.generateStars();
 Smacker.generate();
 Sound.init();
 Draw();


function handleMouseMove(e){
    mouseX = e.clientX - starfield.offsetLeft;
    mouseY = e.clientY - starfield.offsetTop;
}

function Draw() {
    starctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    starctx.fillRect(0, 0, starfield.width, starfield.height);
    scoreBox.textContent = "SCORE: " + score;
    //starctx.fillText("SCORE: " + score, starctx.height/2, starctx.width/2);
    Shot.moveShots();
    Star.moveStars();
    Smacker.move();
    Splode.moveSplodes();
    Scurge.moveScurge();
    Scurge.checkHit();
    Smacker.checkHit();
    Scurge.drawScurge(); 
    Smacker.draw();
    Shot.drawShots();
    Star.drawStars();
    Splode.drawSplodes();

   requestAnimationFrame(Draw);

   }
