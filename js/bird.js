class Bird{
    constructor(context, image){
        this.context = context;
        // this.image = image;

        this.velocity = 4;
        this.accelerationShift = 3
        this.fallVelocity = 0.5;
        this.scale = 2;

        this.scale = 2;
        this.sX = 28
        this.sY = 490;
        this.dX = 40;
        this.dY = 300;
        this.sWidth = 20;
        this.sHeight = 13;        
        this.dWidth = this.sWidth * this.scale;
        this.dHeight = this.sHeight * this.scale;
        this.jumpHeight = 50
        this.nextPoint = this.jumpHeight + this.yPos
        this.loop = [0, 1, 0, 2]
        this.currentInd = 2;
        this.isFalling = false;
        this.jumpTo = this.dY;

        this.image = new Image()
        this.image.src = "./images/flappy_sprite.png"   
        
    }

    move = () =>{
        this.yPos += this.velocity
    }

    jump = () =>{
        this.isFalling = false
        this.dY -= this.jumpHeight
        this.fallVelocity = 0.5;
    }

    gravity = (endGame) =>{
        this.isFalling = true
        this.accelerationShift += 1;
        if(this.accelerationShift % 5 === 0){
            this.fallVelocity += 0.5 ;
        }else{
            var bottomPos = DISPLAY_HEIGHT - BOTTOM_BACKGROUND_HEIGHT
            if(this.dY > bottomPos){
                this.dY = bottomPos
                endGame()
            }
            this.dY += this.fallVelocity;
        }
    }

    rotateBird = (angle) =>{
        this.context.save()
        this.context.translate(this.dX, this.dY)
        this.context.rotate(angle * TO_RADIANT)
        
        this.context.drawImage(this.image, this.sX * Math.floor(this.currentInd), this.sY, this.sWidth, this.sHeight, -this.dWidth/2, -this.dHeight/2, this.dWidth , this.dHeight)

        this.context.restore()
    }

    draw = () =>{
        if(this.currentInd > 3){
            this.currentInd = 0;
        }
        if(this.isFalling && this.fallVelocity > 3){
            var angle = this.fallVelocity * 10
            if(Math.floor(angle) > 90){
                angle = 90
            }
            this.rotateBird(angle)
        }else{
            this.rotateBird(0)
        }
        
        // flapSpeed
        this.currentInd += 0.2
    }

}