
            var Board={
                Foods:[], //Array to store pixels
                PowerUps:[],
                Size:{
                    width:500,
                    height:500
                },
                 // substitute the old food with a new food at a random pixel
                generateFood:function(x,y,circle){
                    for(var i=0; i<this.Foods.length;i++){
                        if(this.Foods[i].x == x && this.Foods[i].y == y) {
                          this.Foods[i] = this.generateEmptyPixel(circle);
                          break;
                        }
                    }
                }, 
                 generatePowerUp:function(x,y,circle){
                    for(var i=0; i<this.PowerUps.length;i++){
                        if(this.PowerUps[i].x == x && this.PowerUps[i].y == y) {
                          this.PowerUps[i] = this.generateEmptyPixel(circle);
                          break;
                        }
                    }
                },
                initGenerate:function(circle){
                    var pixelCount=Board.Size.width*Board.Size.height;
                    var foodCount=pixelCount/10000; // 1 out of 1000 pixels are foods.
                    for(var i=0; i<foodCount; i++) {
                        this.Foods[i]=this.generateEmptyPixel(circle);
                    }
                    var powerUpCount=pixelCount/100000; // 1 out of 10000 pixels are powerUps.
                    for(var i=0; i<powerUpCount; i++) {
                        this.PowerUps[i]=this.generateEmptyPixel(circle);
                    }
                },
                generateEmptyPixel:function(circle){
                    var lowX = circle.x-Math.ceil(circle.radius);
                    var HighX = circle.x+Math.ceil(circle.radius);
                    var lowY = circle.y-Math.ceil(circle.radius);
                    var HighY = circle.y+Math.ceil(circle.radius);
                    var map=[]; // Map for al the empty pixels available
                    for(var x=0; x<this.Size.width; x++) {
                      for(var y=0; y<this.Size.height; y++) {
                        if(x<=HighX && x>=lowX && y<=HighY && y>=lowY) {
                          continue;
                        }
                        var isEmpty=true;
                        for(var i=0; i<this.Foods.length; i++) {
                          if(x==this.Foods[i].x && y==this.Foods[i].y){
                            isEmpty=false;
                            break;
                          }
                        }
                        if(!isEmpty) {
                          continue;
                        }
                        for(var i=0; i<this.PowerUps.length; i++) {
                          if(x==this.PowerUps[i].x && y==this.PowerUps[i].y){
                            isEmpty=false;
                            break;
                          }
                        }
                        if(isEmpty) {
                          map.push([x,y]);
                        }
                      }
                    }
                    var i=Math.floor(Math.random()*map.length);
                    return {x:map[i][0], y:map[i][1]};
                }
            };

            var Direction={
                up:1,
                right:2,
                down:-1,
                left:-2
            };

            function init(){
                var circle=new Circle();
                Board.initGenerate(circle);
                var ctx=document.querySelector('canvas').getContext('2d');

                function draw(circle){
                    ctx.clearRect(0,0,500,500);

                    ctx.beginPath();
                    ctx.fillStyle='black';
                    ctx.arc(circle.x,circle.y,circle.radius*10,0,2*Math.PI);        
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle='red';
                    for(var i=0; i<Board.Foods.length; i++) {
                      ctx.beginPath();
                      ctx.arc(Board.Foods[i].x,Board.Foods[i].y,5,0,2*Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }

                    ctx.fillStyle='blue';
                    for(var i=0; i<Board.PowerUps.length; i++) {
                      ctx.beginPath();
                      ctx.arc(Board.PowerUps[i].x,Board.PowerUps[i].y,5,0,2*Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                }

                var direction,dict_direction=[];
                dict_direction[37]=Direction.left;
                dict_direction[38]=Direction.up;
                dict_direction[39]=Direction.right;
                dict_direction[40]=Direction.down;

                document.addEventListener('keydown',function(e){
                    direction=dict_direction[e.keyCode]||direction;
                });

                (function(){
                    if(circle.move(direction)){
                        draw(circle);
                        console.log(circle.time);
                        setTimeout(arguments.callee,200-circle.speed)
                    }

                })();
            }
			$(function(){
            init();
        });