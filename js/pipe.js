const BACKGROUND_WIDTH = 1250;
const BACKGROUND_HEIGHT = 1200;
const DISPLAY_WIDTH = 350;
const DISPLAY_HEIGHT = 600;
const TO_RADIANT = Math.PI/180
const BOTTOM_BACKGROUND_HEIGHT = 120;

class Pipe{
    constructor(context, topPipeHeight, image){
        this.context = context;
        this.pipeWidth = 90;
        this.velocity = 2;
        this.scale = 2;
        this.sX = 0;
        this.sY = 320;
        this.dX = DISPLAY_WIDTH;
        this.dY = -BOTTOM_BACKGROUND_HEIGHT;
        this.sWidth = 26;
        this.hasPassed = false;
        this.sHeight = topPipeHeight;
        
        this.dWidth = this.sWidth * this.scale;
        this.dHeight = this.sHeight * this.scale;
        
        this.hasGenerateNext = false;
        this.image = image       
        
        
        this.pipeGapHeight = 100
        
        
        this.nextPipeGap = 220;
                
        this.bottomPipe = {
            dY: this.dY + this.dHeight + this.pipeGapHeight,
            dHeight : DISPLAY_HEIGHT - (this.dY + this.dHeight + this.pipeGapHeight)            
        }
    }
    
    delete = (removePipe) =>{
        removePipe(this)
    }

    rotatePipe = (angle, obj) =>{
        this.context.save()
        this.context.translate(obj.dX, obj.dY)
        this.context.rotate(angle * TO_RADIANT)
        this.context.drawImage(this.image, obj.sX, obj.sY, obj.sWidth, obj.sHeight,
            -(obj.dWidth), -(obj.dHeight), obj.dWidth, obj.dHeight)
        this.context.restore()
    }
    
    getPipesDetails = () =>{
        return {
            sX : this.sX,
            sY : this.sY,
            dX: this.dX,
            dY: this.dY,
            sWidth : this.sWidth,
            sHeight: this.sHeight,
            dWidth :this.dWidth,
            dHeight:this.dHeight,
            scale: this.scale,
            bottomPipe:{
                dHeight: this.bottomPipe.dHeight,
                dY: this.bottomPipe.dY
            }
            
        }
    }

    drawPipes(obj){
        this.rotatePipe(180, obj)
        this.context.drawImage(this.image, obj.sX, obj.sY, obj.sWidth, obj.bottomPipe.dHeight, obj.dX, obj.bottomPipe.dY, obj.sWidth * obj.scale, obj.bottomPipe.dHeight * obj.scale)
    }

    move = (generatePipe) =>{
        if(this.dX < this.nextPipeGap && !this.hasGenerateNext){
            this.hasGenerateNext = true;
            generatePipe()
        }else{
            this.dX -= this.velocity;
        }
    }

    draw = (removePipe, pipeList) =>{
        if(this.dX < -(this.sWidth * 2)){
            removePipe(this)
        }else{
            this.context.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
            if(pipeList){
                pipeList.map(pipe =>{
                    this.drawPipes(pipe.getPipesDetails())
                })
            }    
        }
    }

    getElement = () =>{
        return this.pipe;
    }
}