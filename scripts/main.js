const mySound = document.getElementById("turnSound");

var canvas = new fabric.Canvas('c');

var imgElement = document.getElementById('bord');
var imgInstance = new fabric.Image(imgElement,{selectable:false});    
canvas.add(imgInstance);

var fieldAdjacentMatrix = [
[0,1,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
[1,0,1,0,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,2],
[0,0,0,0,1,2,0,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0],
[0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,2,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,0],
[0,0,0,0,0,0,0,1,2,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0],
[0,2,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,2,1,0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0],
[1,0,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,1,0,0],
[0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0],
[0,0,0,0,0,0,1,0,0,2,1,0,0,0,0,1,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,1,2,0,0,1,0,0,0,0,0,0],
[0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
[0,0,1,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,1],
[0,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,1,2,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,2,0],
[0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,2,1,0,0,0,0,0,0,0],
[0,0,0,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,2,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0],
[0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,0,0,2,1,0,0,0,0],
[2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,0,1,0,1],
[0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,1,0]
];

// Ändert die phase von legen zum verschieben
var turnCounter = 0;

// legen, entfernen, verschiebenWegnehmen, verschiebenLegen, endgameLegen
var phase = 'legen';

//Wichtig für die Phase verschiebenLegen. Bestimmt die möglichen nächsten Positionen
var fieldWeggenommen;

var fieldArray = new Array();
fieldArray.push(createField(29,24,0),createField(180,24,1),createField(329,24,2),createField(81,74,3),createField(180,74,4),createField(279,74,5),createField(130,124,6),createField(179,124,7),createField(228,124,8),createField(29,174,9),createField(81,174,10),createField(130,174,11),createField(228,174,12),createField(279,174,13),createField(329,174,14),createField(130,223,15),createField(179,223,16),createField(228,223,17),createField(81,272,18),createField(179,272,19),createField(279,272,20),createField(29,323,21),createField(180,323,22),createField(329,323,23));
fieldArray.forEach(function(item,index,array){
    canvas.add(item);
 });
 
 //wichtig um zu entscheiden ob wir im Endgame sind
 redTaken = 0;
 blueTaken = 0;
 
 //Welcher Spieler is an der Reihe
 turnColor = 'blue'
 
 //--------------------------------------------------------------------
function createField(myLeft,myTop,fieldNumber){
    var circle = new fabric.Circle({
        radius:10,
        top: myTop,
        left: myLeft,
        fill:'black',
        selectable:false
    });
    
    circle.on('mousedown',function(){
    
        
            
        // Only when there is no Spielstein on the selected field we put a new Spielstein on it
        if(phase == 'legen' && this.fill == 'black'){
            
            if (isTriple(turnColor,fieldNumber) && !allOppositeColorTriple(turnColor)){
                phase = 'entfernen';
                circle.set('fill',turnColor);
            }else{
                circle.set('fill',turnColor);
                increaseTurnCounter();
            }
            
        }else if(phase == 'entfernen' && ((turnColor == 'blue' && this.fill == 'red' && !isTriple('red',fieldNumber)) || (turnColor == 'red' && this.fill == 'blue' && !isTriple('blue',fieldNumber))) ){
            if(turnColor == 'blue'){
            redTaken++;
            }else{
            blueTaken++;
            }
            fieldArray[fieldNumber].set('fill','black');
            if(redTaken == 7){
                gameOver('Christian');
              //  gameOver('blue');
            }else if(blueTaken == 7){
                gameOver('Christian');
            //    gameOver('red');
            }else{    
                increaseTurnCounter();
            }
            
        }else if(phase == 'verschiebenWegnehmen' && this.fill == turnColor){
            if((turnColor == 'blue' && blueTaken <6) || (turnColor == 'red' && redTaken <6)){
                fieldAdjacentMatrix[fieldNumber].forEach(function(item,index,array){
                    if(item == 1 && fieldArray[index].fill == 'black'){
                        fieldArray[fieldNumber].set('fill','black');
                        phase = 'verschiebenLegen';
                    }                    
                });
            }else{
                fieldArray[fieldNumber].set('fill','black');
                phase = 'endgameLegen';
            }
            fieldWeggenommen = fieldNumber;
        }
    });
    
    circle.on('mouseup',function(){
        mySound.play();
    
        if(((phase == 'verschiebenLegen' && fieldAdjacentMatrix[fieldNumber][fieldWeggenommen] == 1) || phase == 'endgameLegen') && this.fill == 'black' && fieldWeggenommen != fieldNumber){
            if (isTriple(turnColor,fieldNumber) && !allOppositeColorTriple(turnColor)){      
                circle.set('fill',turnColor);
                phase = 'entfernen';
            }else{
                circle.set('fill',turnColor);
                increaseTurnCounter();
            }
        }
    });
    
    return circle; 
};

function increaseTurnCounter(){
    console.log(phase);
    turnCounter++;
    if(turnCounter %2 == 1){
        turnColor = 'red';
    }else{
        turnColor = 'blue';
    }
    if(turnCounter >17){
        phase = 'verschiebenWegnehmen';
        if(turnCounter %2 == 1){
            if (getStucked()){
                gameOver('blue');
            }
        }else{
            if (getStucked()){
                gameOver('red');
            }
        }

    }else{
        phase = 'legen';
    }
}

function isTriple(turnColor,fieldNumber){
    triple= false;
    fieldAdjacentMatrix[fieldNumber].forEach(function(item,index,array){
        if (item == 1){
            if (fieldArray[index].fill == turnColor){
                fieldAdjacentMatrix[index].forEach(function(item2,index2,array2){
                    if(item2 == 1 && fieldAdjacentMatrix[fieldNumber][index2] == 2 && fieldArray[index2].fill == turnColor){
                        triple = true;
                    }else if(item2 == 2 && fieldAdjacentMatrix[fieldNumber][index2] == 1 && fieldArray[index2].fill == turnColor){
                        triple = true;
                    }
                });
            }
        }
    });
    return triple;
}

function allOppositeColorTriple(turnColor){
    var allTriple = true;
    fieldArray.forEach(function(item,index,array){
        if(turnColor == 'blue' && item.fill == 'red' && !isTriple('red',index)){
            allTriple = false;
        }else if(turnColor == 'red' && item.fill == 'blue' && !isTriple('blue',index)){
            allTriple = false;
         }
     });
     return allTriple;
}

function gameOver(winner){
    canvas.clear();
    var gameOverScreen = new fabric.Text("Game is over and \n" + winner + " is the winner",{selectable:false});
    canvas.add(gameOverScreen);
}

function getStucked(){
    var stucked = true;
    fieldArray.forEach(function(item,index,array){
        fieldAdjacentMatrix[index].forEach(function(item2,index2,array2){
            if(item.fill == turnColor && item2 == 1 && fieldArray[index2].fill == 'black'){
                stucked = false;
                console.log(item.fill,item2,fieldArray[index2].fill);
            }
        });
        
    });
    return stucked;
}