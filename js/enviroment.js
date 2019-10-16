

class Game{
    constructor(gameView, background_width, background_height){
        this.context = gameView.getContext('2d')
        this.background_width = background_width;
        this.background_height = background_height;
        this.gameView = gameView;   
        this.pipGap = 50
        this.hasStarted = false;
        this.gameOver = false;

        this.envState = {
            velocity : 0.4,
            xPos : 0,
            yPos : 0,
            pipeList : [],
            score :0
        }     
        this.bottomState = {
            velocity : 2,
            xPos : 0,
            yPos : 0,
        }
        this.setEnviroment()
    }

    resetGame = () =>{
        Object.keys(this.envState).map(key =>{
            this.envState[key] = 0
        })
        this.envState.pipeList = [];
        this.envState.velocity = 0.4;
    }

    setEnviroment = ()=>{
        this.gameWrapper = document.getElementsByClassName('game-background')[0]
        this.bottomWrapper = document.getElementsByClassName('bottom-background')[0]
        this.startGameWrapper = document.getElementsByClassName('gameStart')[0]
        this.gameOverWrapper = document.getElementsByClassName('gameOver')[0]
        this.startGameWrapper.style.display = 'block'
        
        this.playerScoreWrapper = document.getElementById('player-score')
        this.bestScoreWrapper = document.getElementById('best-score')

        this.startBtn = document.getElementsByClassName('gameStartBtn')[0]
        this.podiumBtn = document.getElementsByClassName('gamePodium')[0]

        this.gameWrapper.style.width = DISPLAY_WIDTH * 3 + 'px';
        this.bottomWrapper.style.width = DISPLAY_WIDTH * 3 + 'px';

        this.envState.xPos = 0
        this.gameView.setAttribute('width', DISPLAY_WIDTH + 'px')
        this.gameView.setAttribute('height', DISPLAY_HEIGHT + 'px')
        this.gameView.style.overFlow = 'hidden'
        this.gameView.style.backgroundSize = `${BACKGROUND_WIDTH}px ${BACKGROUND_HEIGHT}px`

        this.image = new Image()
        this.image.src = "./images/flappy_sprite.png"     
        this.startBtn.addEventListener('click', () =>{
            this.gameOverWrapper.style.display = 'none'
            this.startBtn.style.display = 'none'
            this.podiumBtn.style.display = 'none'
            this.gameOver = false;
            this.hasStarted = false;
            this.startGameWrapper.style.display = 'block'
            this.startGame()
        })
    }

    removePipe = (removePipe) =>{
        this.envState.pipeList = this.envState.pipeList.filter(pipe => pipe !== removePipe)
    }

    generatePipe = () =>{
        var pipeHeight = (Math.random() * 100) + 100
        var pipe = new Pipe(this.context, pipeHeight, this.image)
        this.envState.pipeList.push(pipe)
    }

    generateBird = () =>{
        this.bird = new Bird(this.context, this.image)
        
    }

    startGame = () =>{
        this.generateBird()
        this.generatePipe()
        
        this.run()
    }

    drawBackground = () =>{
        this.gameWrapper.style.left = this.envState.xPos + 'px';    
        this.bottomWrapper.style.left = this.bottomState.xPos + 'px';
    }

    moveBackground = () =>{ 
        if(-(this.envState.xPos) > DISPLAY_WIDTH * 2){
            this.envState.xPos = 0
        }else{
            this.envState.xPos -= this.envState.velocity     
        }

        if(-(this.bottomState.xPos) > DISPLAY_WIDTH * 2){
            this.bottomState.xPos = 0
        }else{
            this.bottomState.xPos -=this.bottomState.velocity       
        }
    }

    checkCollision = () => {
        this.envState.pipeList.map(pipe => {
          var rightCollision = this.bird.dX + this.bird.dWidth >= pipe.dX
          var leftCollision = this.bird.dX <= pipe.dX + pipe.dWidth          
          
          var topCollision = this.bird.dY <= pipe.dY + pipe.dHeight
          var bottomCollision = this.bird.dY + this.bird.dHeight >= pipe.dY
          
          var topSecondCollision = this.bird.dY <= pipe.bottomPipe.dY + pipe.bottomPipe.dHeight
          var bottomSecondCollision = this.bird.dY >= pipe.bottomPipe.dY           
          var rightSecondCollision = this.bird.dX >= pipe.dX

          if(!this.gameOver){
            if(leftCollision && rightCollision && topCollision && bottomCollision){    
                this.endGame()
            }

            else if(leftCollision && rightSecondCollision && bottomSecondCollision && topSecondCollision){
                this.endGame()
            }else{
                if(!pipe.hasPassed){
                    pipe.hasPassed = true;
                    this.envState.score += 1
                }
                
            }
          }
        })
    }

    endGame = () =>{
        this.gameOver = true
        this.gameOverWrapper.style.display = 'block'
        this.startBtn.style.display = 'block'
        this.podiumBtn.style.display = 'block'
        this.playerScoreWrapper.innerHTML = this.envState.score
        var bestScore = window.localStorage.getItem('bestScore')
        
        if(bestScore){
            if(bestScore < this.envState.score){
                bestScore = this.envState.score
                window.localStorage.setItem('bestScore', this.envState.score)
            }
        }else{
            bestScore = this.envState.score
            window.localStorage.setItem('bestScore', bestScore)
            
        }
        this.bestScoreWrapper.innerHTML = bestScore

        this.resetGame()
        this.context.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
        this.hasStarted = false;
    }

    run = () =>{
        this.moveBackground()
        this.drawBackground()     
        this.checkCollision()        
        if(this.hasStarted){
            this.startGameWrapper.style.display = 'none'
            this.envState.pipeList.map(pipe => {
                pipe.draw(this.removePipe, this.envState.pipeList)
                pipe.move(this.generatePipe)            
            })
            this.bird.gravity(this.endGame)
        }
        
        if(!this.gameOver){
            this.bird.draw()
            window.requestAnimationFrame(this.run)
        }
        
    }
}

var gameView = document.getElementById('game-canvas')
var game = new Game(gameView, BACKGROUND_WIDTH, BACKGROUND_HEIGHT)
game.startGame()
window.addEventListener('keydown', (e) =>{
        if(e.keyCode === 32){
            if(!game.hasStarted){
                game.hasStarted = true;
            }else{
                game.bird.jump()
            }   
        }
})

window.addEventListener('mousedown', () =>{
    if(!game.hasStarted){
        game.hasStarted = true;
    }else{
        game.bird.jump()
    }   
})
