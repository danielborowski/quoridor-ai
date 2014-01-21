
var boardWidth = 9; 
var lastSpace = (boardWidth-1)*(boardWidth+1);

/****************************************************
    RETURN POSSIBLE MOVEMENTS FROM CURRENT SPACE
****************************************************/
function possibleMoves(loc,compTesting,opponentLoc,possibleWalls) { 
    // determine all directional moves
    loc = parseInt(loc);
    oppLoc = parseInt(opponentLoc);
    var moves = new Array(loc-1,loc+1,loc+boardWidth,loc-boardWidth); 
    var possibleJumps = new Array();  
    var removeSpaces = new Array(); 
    var removeOverlaps_col_first = new Array(8,17,26,35,44,53,62,71,80);
    var removeOverlaps_col_last  = new Array(0,9,18,27,36,45,54,63,72);
    // remove overlapping and OOB moves
    for (var x=0;x<moves.length;x++) {
        if (moves[x]<0 || moves[x]>lastSpace) { removeSpaces.push(moves[x]); }   
        for (var c1=0;c1<removeOverlaps_col_last.length;c1++) {
            if (loc==removeOverlaps_col_last[c1]) {
                if (removeOverlaps_col_first.indexOf(moves[x]) != -1) {
                     if (removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }
                }    
            }    
        }
        for (var c2=0;c2<removeOverlaps_col_first.length;c2++) {
            if (loc==removeOverlaps_col_first[c2]) {
                if (removeOverlaps_col_last.indexOf(moves[x]) != -1) {
                     if (removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }
                }    
            }    
        }
    }        
    // prevent jumping over walls
    var walls = $("#walls").val() + ','; 
    if (possibleWalls!=null) { walls = walls + possibleWalls + ","; } 
    var walS = walls.split(",");  
    for (var c=0;c<moves.length;c++) {  
        if (loc<moves[c]) { var check = loc+"-"+moves[c]; }    
        else { var check = moves[c]+"-"+loc; }   
        if ((walS.indexOf(check) != -1) && (removeSpaces.indexOf(moves[c]) == -1)) { 
            removeSpaces.push(moves[c]); 
        }
    }   
    // 1) if no wall in front of player allow jumping over opponent piece 2) cannot move to same space as opponent  
    for (var x=0;x<moves.length;x++) {
        if ((moves[x]==oppLoc) && (possibleJumps.indexOf(moves[x]) == -1) && (removeSpaces.indexOf(moves[x]) == -1)) { possibleJumps.push(moves[x]); } 
        if (possibleWalls==null) { if ((moves[x]==oppLoc) && (removeSpaces.indexOf(moves[x]) == -1)) { removeSpaces.push(moves[x]); } } 
    } 
    // add actual space where player will jump over opponent
    for (var j=0;j<possibleJumps.length;j++) {
        if (loc<possibleJumps[j]) { var jump = ((possibleJumps[j]-loc)*2); }    
        else { var jump = ((loc-possibleJumps[j])*2)*-1; } 
        if (moves.indexOf(loc+jump) == -1) { moves.push(loc+jump); }        
    }  
    // prevent jumping over opponent with wall behind them   
    var jcheck = false
    for (var a=0;a<moves.length;a++) {
        if (moves.indexOf(oppLoc) != -1) {
            if (oppLoc<moves[a]) { var check = oppLoc+"-"+moves[a]; }    
            else { var check = moves[a]+"-"+oppLoc; }      
            if (walls.indexOf(check) != -1) { 
                removeSpaces.push(moves[a]); 
                jcheck = true;
            }   
        }         
    }   
    // add actual spaces where player will jump to the side of opponent
    if (jcheck) {
        for (var j=0;j<4;j++) {
            if (j==0 && oppLoc-1!=loc && moves.indexOf(oppLoc-1)==-1) { moves.push(oppLoc-1); }    
            else if (j==1 && oppLoc+1!=loc && moves.indexOf(oppLoc+1)==-1) { moves.push(oppLoc+1); }  
            else if (j==2 && oppLoc+9!=loc && moves.indexOf(oppLoc+9)==-1) { moves.push(oppLoc+9); }  
            else if (j==3 && oppLoc-9!=loc && moves.indexOf(oppLoc-9)==-1) { moves.push(oppLoc-9); }      
        }
    }
    for (var x=0;x<moves.length;x++) {
        if ((moves[x]<0 || moves[x]>lastSpace) && removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }   
        for (var c1=0;c1<removeOverlaps_col_last.length;c1++) {
            if (loc==removeOverlaps_col_last[c1]) {
                if (removeOverlaps_col_first.indexOf(moves[x]) != -1) {
                     if (removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }
                }    
            }    
        }
        for (var c2=0;c2<removeOverlaps_col_first.length;c2++) {
            if (loc==removeOverlaps_col_first[c2]) {
                if (removeOverlaps_col_last.indexOf(moves[x]) != -1) {
                     if (removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }
                }    
            }    
        }
    }    
    for (var a=0;a<moves.length;a++) {
        if (moves.indexOf(oppLoc) != -1) {
            if (oppLoc<moves[a]) { var check = oppLoc+"-"+moves[a]; }    
            else { var check = moves[a]+"-"+oppLoc; }      
            if (walls.indexOf(check) != -1 && removeSpaces.indexOf(moves[a]) == -1) { removeSpaces.push(moves[a]); }   
        }         
    }         
    // check if the placement of a possible (not placed yet) wall is legal by checking path to end
    if (possibleWalls==null) { var possibleWalls = $("#possibleWalls").val(); } 
    else { var possibleWalls = possibleWalls; }
    for (var c=0;c<moves.length;c++) {
        if (loc<moves[c]) { var check = loc+"-"+moves[c]; }    
        else { var check = moves[c]+"-"+loc; }    
        if (possibleWalls.indexOf(check) != -1 && (removeSpaces.indexOf(moves[c]) == -1)) { removeSpaces.push(moves[c]); }
    }      
    // check if jumping over piece overlaps to other side 
    var removeOverlaps_col_secLast = new Array(7,16,25,34,43,52,61,70,79);   
    var removeOverlaps_col_secFirst = new Array(1,10,19,28,37,46,55,64,73);
    for (var x=0;x<moves.length;x++) { 
        for (var c1=0;c1<removeOverlaps_col_secLast.length;c1++) {
            if (loc==removeOverlaps_col_secLast[c1]) {
                if (removeOverlaps_col_last.indexOf(moves[x]) != -1) {
                     if (removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }
                }    
            }    
        }
        for (var c2=0;c2<removeOverlaps_col_secFirst.length;c2++) {
            if (loc==removeOverlaps_col_secFirst[c2]) {
                if (removeOverlaps_col_first.indexOf(moves[x]) != -1) {
                     if (removeSpaces.indexOf(moves[x]) == -1) { removeSpaces.push(moves[x]); }
                }    
            }    
        }
    }
    // remove negative and OOB moves from jump calculations
    for (var x=0;x<moves.length;x++) { 
        if ((moves[x]<0 || moves[x]>lastSpace) && (removeSpaces.indexOf(moves[x]) == -1)) { removeSpaces.push(moves[x]); }      
    }     
    // remove all illegal spaces
    for (var i=0;i<removeSpaces.length;i++) {
        moves.splice(moves.indexOf(removeSpaces[i]),1); 
    }       
    // display where moves are possible to player
    if (!compTesting) {
        for (var i=0;i<moves.length;i++) { $("#board td[data-pos="+(moves[i])+"]").addClass('movableGreenSpaces'); } 
        console.log("-------------------------"); 
        console.log(loc + " can go to " + moves);
    }              
    return new Array(loc,moves);
}

/**********************************
    MOVE PIECE TO A NEW SPACE
**********************************/
function movePiece(curLoc,newLoc) {
    var whatPiece = $('#board td[data-pos='+(curLoc)+']').children('div').attr('class');
    $('#board td[data-pos='+(curLoc)+']').children('div').remove();
    $('#board td[data-pos='+(newLoc)+']').append("<div class='"+whatPiece+"'></div>");
    $("#board td").removeClass('movableGreenSpaces'); 
    var cw = checkWin();   
    if (whatPiece=='piecePlayer' && cw==-1) { computerMove(); }
}

/*********************************
        CHECK FOR WINNERS
*********************************/
function checkWin() {
    var computer = $('.pieceComputer').parent().attr("data-pos");
    var player = $('.piecePlayer').parent().attr("data-pos"); 
    if (player>=0 && player<=8) { alert("YOU WIN!!!!!!!!!!!!"); return 'pwins'; } 
    if (computer>=72 && computer<=80) { alert("COMPUTER WINS!!!!!!!!!!!!"); return 'cwins'; }
    else { return -1; }   
}

/*****************************************************
    CHECK FOR ILLEGAL WALLS THAT TRAP PLAYER/COMP
*****************************************************/
function pathToEndExists(possibleWalls,playerLoc,oppLoc) {
    var possibleWalls = possibleWalls; 
    if (playerLoc==null) { var player = $('.piecePlayer').parent().attr("data-pos"); }  
    else { var player = playerLoc; }
    player = parseInt(player);    
    var p_visited = new Array(); p_visited.push(player); 
    var p_path = false;
    if (oppLoc==null) { var computer = $('.pieceComputer').parent().attr("data-pos"); } 
    else { var computer = oppLoc; }
    computer = parseInt(computer);
    var p_moves = possibleMoves(player,true,computer,possibleWalls);  
    var c_moves = possibleMoves(computer,true,player,possibleWalls);
    var c_visited = new Array(); c_visited.push(computer);
    var c_path = false;
    // recursive path functions  
    function followPathPlayer(loc,loop) {  
        if ((loc>=0)&&(loc<=8)) { p_path = true; }
        if (!p_path || loop<8000) { 
            p_visited.push(parseInt(loc));   
            var nextMoves = possibleMoves(loc,true,computer,possibleWalls);
            loop++;
            for (var c1=0;c1<nextMoves[1].length;c1++) {
                if (p_visited.indexOf(nextMoves[1][c1]) == -1) { followPathPlayer(nextMoves[1][c1],loop); }  
            }
        }
    }
    function followComputerPlayer(loc,loop) {
        if ((loc>=72)&&(loc<=80)) { c_path = true; }
        if (!c_path || loop<8000) { 
            c_visited.push(parseInt(loc));
            var nextMoves = possibleMoves(loc,true,player,possibleWalls);
            loop++;
            for (var c1=0;c1<nextMoves[1].length;c1++) {
                if (c_visited.indexOf(nextMoves[1][c1]) == -1) { followComputerPlayer(nextMoves[1][c1],loop); }  
            }
        }
    }
    // make sure player and computer have path to the end 
    for (var c1=0;c1<p_moves[1].length;c1++) { followPathPlayer(p_moves[1][c1],0); }
    for (var c2=0;c2<c_moves[1].length;c2++) { followComputerPlayer(c_moves[1][c2],0); }                   
    var doubleCheck = shortestPath($("#walls").val() + ','+possibleWalls,null,null);       
    if (!c_path && doubleCheck[1]==0) { return false; } 
    if (!p_path) { return false; }
    return true;   
    
}

/*****************************************************
     FIND SHORTEST PATH FOR EVALUATION FUNCTION
*****************************************************/
function shortestPath(possibleWalls,compLoc,playerLoc) {       
    if (playerLoc==null) { var player = $('.piecePlayer').parent().attr("data-pos");   }
    else { var player = playerLoc; } 
    player = parseInt(player); 
    if (compLoc==null) { var computer = $('.pieceComputer').parent().attr("data-pos"); }
    else { var computer = compLoc; }   
    computer = parseInt(computer);
    if (possibleWalls==null) { var walls = $("#walls").val() + ','; }
    else { var walls = possibleWalls + ','; }
    walls = walls.split(",");
    // construct matrix
    var mat = new Array(
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0], 
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    );
    // add wall boundaries to matrix
    for (var x=0;x<walls.length;x++) {
        var f = parseInt(walls[x].substr(0,walls[x].indexOf('-')));
        var s = parseInt(walls[x].substr(walls[x].indexOf('-')+1));
        var fVal = 0;
        var sVal = 0;
        // if horiz wall
        if (s==f+9) { 
            if (f>=0 && f<=8) { fVal = 1; } 
            else if (f>=9 && f<=17) { fVal = 3; } 
            else if (f>=18 && f<=26) { fVal = 5; } 
            else if (f>=27 && f<=35) { fVal = 7; }
            else if (f>=36 && f<=44) { fVal = 9; } 
            else if (f>=45 && f<=53) { fVal = 11; } 
            else if (f>=54 && f<=62) { fVal = 13; }  
            else if (f>=63 && f<=71) { fVal = 15; } 
            sVal = (s%9)*2;
            mat[fVal][sVal] = 0;
            mat[fVal][sVal+1] = 0; 
        }
        // if vert wall
        else { 
            if (f>=0 && f<=8) { fVal = 0; } 
            else if (f>=9 && f<=17) { fVal = 2; } 
            else if (f>=18 && f<=26) { fVal = 4; } 
            else if (f>=27 && f<=35) { fVal = 6; }
            else if (f>=36 && f<=44) { fVal = 8; } 
            else if (f>=45 && f<=53) { fVal = 10; } 
            else if (f>=54 && f<=62) { fVal = 12; }  
            else if (f>=63 && f<=71) { fVal = 14; } 
            if (f>=0&&f<=71) {
                sVal = (s%9)*2-1;
                mat[fVal][sVal] = 0;
                mat[fVal+1][sVal] = 0;  
            }        
        } 
    }          
    // get shortest path in graph with walls
    var graph = new Graph(mat); 
    var start_p = graph.nodes[Math.floor(player/9)*2][player%9*2];
    var end_p_c_array = new Array(0,2,4,6,8,10,12,14,16); 
    var s_path_player = 200;
    for (var i=0;i<end_p_c_array.length;i++) { 
        var result = astar.search(graph.nodes, start_p, graph.nodes[0][end_p_c_array[i]]);  
        if (result.length < s_path_player && result.length>0) { s_path_player = result.length; }  
    }
    var start_c = graph.nodes[Math.floor(computer/9)*2][computer%9*2];
    var s_path_computer = 200;
    for (var i=0;i<end_p_c_array.length;i++) {    
        var result = astar.search(graph.nodes, start_c, graph.nodes[16][end_p_c_array[i]]);  
        if (Math.floor(computer/9)==8) { if (result.length < s_path_computer) { s_path_computer = result.length; } } 
        else { if (result.length < s_path_computer && result.length>0) { s_path_computer = result.length; } }   
    }            
    if (s_path_player==200) { s_path_player = 0; }
    if (s_path_computer==200) { s_path_computer = 0; } 
    return new Array(Math.ceil(s_path_player/2),Math.ceil(s_path_computer/2));
}