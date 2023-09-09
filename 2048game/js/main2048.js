
var board = new Array();
var added = new Array();
var score = 0;
var top = 240;
$(document).ready(function(e){
    newgame();
});
 
function newgame(){
    //Initialize the board
    init();
    //generate number
    generateOneNumber();
    generateOneNumber();
}
 
function init(){
	score=0;
	document.getElementById("score").innerHTML=score;
	$("#gameover").css('display','none');
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }
    
    for(var i = 0; i<4;i++){//Initialize the grid array
        board[i] = new Array();
        for(var j = 0;j<4;j++){
            board[i][j] = 0;
        }
    }
    
    for(var i = 0; i<4;i++){//Initialize the combined array
        added[i] = new Array();
        for(var j = 0;j<4;j++){
            added[i][j] = 0;
        }
    }
    
    updateBoardView();//Notify the front end to set the board two-digit array.
}
 
function updateBoardView(){//Update the front-end style of the array
    $(".number-cell").remove();
    for(var i = 0;i<4;i++){
        for ( var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('hegiht','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
}
 
function generateOneNumber(){//Generate random grid
    if (nospace(board)) 
        return false;
    
    //random position
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if (board[randx][randy] == 0) 
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }
    var randNumber = Math.random()<0.5 ? 2 : 4;
    //Show random numbers in random locations
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}
 
//Incident response loop
$(document).keydown(function(event){
    switch (event.keyCode) {
    case 37://left
        if(moveLeft()){
            //setTimeout("generateOneNumber()",210);
            getScore();
            generateOneNumber();//Every time a number is added, the game may end
            setTimeout("isgameover()",400);//300毫秒
        }
        break;
    case 38://up
        if(moveUp()){
        	getScore();
            generateOneNumber();//Every time a number is added, the game may end
            setTimeout("isgameover()",400);
        }
        break;
    case 39://right
        if(moveRight()){
        	getScore();
            generateOneNumber();//Every time a number is added, the game may end
            setTimeout("isgameover()",400);
        }
        break;
    case 40://down
        if(moveDown()){
        	getScore();
            generateOneNumber();//Every time a number is added, the game may end
            setTimeout("isgameover()",400);
        }
        break;
 
    }
});
 
function isgameover(){
    if(nospace(board)&&nomove(board))
        gameover();
}
 
function gameover(){
    $("#gameover").css('display','block');
}
 
function isaddedArray(){//Set the value of the array to be judged whether it can be merged to 0
	for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
        	added[i][j] = 0;
        }
   }
}
 
function moveLeft(){//More Details
    //Determine whether the grid can move to the left
    if( !canMoveLeft(board))
        return false;
    
    isaddedArray();
    for(var i = 0;i<4;i++)
        for(var j = 1;j<4;j++){//The numbers in the first column cannot be moved to the left
            if(board[i][j] !=0){
                //(i,j)Element on the left
                for(var k = 0;k<j;k++){
                    //Whether the footing position is empty && There is no obstacle in the middle
                    if(board[i][k] == 0 && noBlockHorizontal(i , k, j, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //The number at the footing position is equal to the original number && There is no obstacle in between
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i , k, j, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        //add
                        if(added[i][k]!=0){//Whether the target location has completed the merger
                        		board[i][k+1] = board[i][j];
                        		board[i][j] = 0;
                        }
                        else{
                        	board[i][k] += board[i][j];
                        	board[i][j] = 0;
                        	added[i][k] = 1;
                        	score +=board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
 
function moveRight(){//More details
    //Determine whether the grid can move to the right
    if( !canMoveRight(board))
        return false;
    
    isaddedArray();
    for(var i = 0;i<4;i++)
        for(var j = 2;j>=0;j--){//The numbers in the last column cannot be moved to the right
            if(board[i][j] !=0){
                //(i,j)Element on the right
                for(var k = 3;k>j;k--){
                    //Whether the footing position is empty && There is no obstacle in the middle
                    if(board[i][k] == 0 && noBlockHorizontal(i , j, k, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //The number at the footing position is equal to the original number && There is no obstacle in between
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i , j, k, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        //add
                         if(added[i][k]!=0){
                        		board[i][k-1] = board[i][j];
                        		board[i][j] = 0;
                        }
                        else{
                        	board[i][k] += board[i][j];
                        	board[i][j] = 0;
                        	added[i][k] = 1;
                        	score +=board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
 
function moveUp(){//More details
    //Determine whether the grid can move up
    if( !canMoveUp(board))
        return false;
    
    isaddedArray();
    for(var j = 0;j<4;j++)
        for(var i = 1;i<4;i++){//The numbers in the first row cannot move up
            if(board[i][j] !=0){
                //(i,j)the element at top
                for(var k = 0;k<i;k++){
                    //Whether the footing position is empty && There is no obstacle in the middle
                    if(board[k][j] == 0 && noBlockVertical(j , k, i, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //The number at the footing position is equal to the original number && There is no obstacle in between
                    else if(board[k][j] == board[i][j] && noBlockVertical(j , k, i, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        //add
                        if(added[k][j]!=0){
                        	board[k+1][j] = board[i][j];
                        	board[i][j] = 0;
                        }
                        else{
                        	board[k][j] += board[i][j];
                        	board[i][j] = 0;
                        	added[k][j] = 1;
                        	score +=board[k][j];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
 
function moveDown(){//More details
    //Determine whether the grid can move down
    if( !canMoveDown(board))
        return false;
        
    isaddedArray();
    for(var j = 0;j<4;j++)
        for(var i = 2;i>=0;i--){//The numbers in the last row cannot move down
            if(board[i][j] !=0){
                //(i,j)element at the bottom
                for(var k = 3;k>i;k--){
                    //Whether the footing position is empty && There is no obstacle in the middle
                    if(board[k][j] == 0 && noBlockVertical(j , i, k, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //The number at the footing position is equal to the original number && There is no obstacle in between
                    else if(board[k][j] == board[i][j] && noBlockVertical(j , i, k, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        //add
                        if(added[k][j]!=0){
                        	board[k-1][j] = board[i][j];
                        	board[i][j] = 0;
                        }
                        else{
                        	board[k][j] += board[i][j];
                        	board[i][j] = 0;
                        	added[k][j] = 1;
                        	score +=board[k][j];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
