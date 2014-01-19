
var boardWidth = 9;  

/*********************************************
        COMPUTER PLACING ACTUAL WALLS 
*********************************************/   
function placeHorizWall(thisWall) {
    var noWalls = ($("#nowalls").val()+",").split(',');
    var walls = $("#walls").val();  
    var thisWall = thisWall;
    var nextPart = $('#board td[data-pos='+(thisWall)+']').next().next().attr('data-pos');
    walls = walls+","+thisWall; 
    walls = walls+","+nextPart;  
    if (walls[0]==',') { walls = walls.substr(1); }
    // delete cross-intersection and directly prior walls that overlap
    var intersec = thisWall.substr(0,thisWall.indexOf('-'))+"-"+nextPart.substr(0,nextPart.indexOf('-'));
    var prior = parseInt(thisWall.substr(0,thisWall.indexOf('-')))-1;
    var prior_2 = parseInt(thisWall.substr(thisWall.indexOf('-')+1))-1;
    var priorWall = prior+"-"+prior_2;
    // take these wall possibilities away
    noWalls.splice(noWalls.indexOf(thisWall),1); 
    noWalls.splice(noWalls.indexOf(nextPart),1); 
    if (noWalls.indexOf(intersec) != -1) { noWalls.splice(noWalls.indexOf(intersec),1); $("td[data-pos='"+intersec+"']").removeClass("wallPlacementVert").addClass('wallPlacementVert_NOHOVER'); }
    if (noWalls.indexOf(priorWall) != -1) { noWalls.splice(noWalls.indexOf(priorWall),1); $("td[data-pos='"+priorWall+"']").removeClass("wallPlacementHoriz").addClass('wallPlacementHoriz_NOHOVER'); }
    // update textareas and display
    $("#nowalls").val(noWalls);
    $("#walls").val(walls);
    $("td[data-pos='"+thisWall+"']").removeClass('wallPlacementHoriz').addClass("wallPlacementHoriz_NOHOVER").addClass("keepWall");
    $("td[data-pos='"+thisWall+"']").next().addClass("keepWall"); 
    $("td[data-pos='"+nextPart+"']").removeClass('wallPlacementHoriz').addClass("wallPlacementHoriz_NOHOVER").addClass("keepWall"); 
    // update computer walls
    var compWallsLeft = $('#showCompPieces').children().next().text(); 
    compWallsLeft--;   
    $('#showCompPieces').children().next().text(compWallsLeft);  
}

function placeVertWall(thisWall) {
    var noWalls = ($("#nowalls").val()+",").split(',');
    var walls = $("#walls").val();
    var thisWall = thisWall;
    // get second part of wall for horiz
    var nvf = parseInt(thisWall.substr(0,thisWall.indexOf("-"))) + boardWidth;
    var nvs = parseInt(thisWall.substr(thisWall.indexOf("-")+1)) + boardWidth;
    var nextPart = nvf+"-"+nvs;  
    walls = walls+","+thisWall; 
    walls = walls+","+nextPart;  
    if (walls[0]==',') { walls = walls.substr(1); }
    // delete cross-intersection and directly prior walls that overlap
    var intersec = thisWall.substr(0,thisWall.indexOf('-'))+"-"+nextPart.substr(0,nextPart.indexOf('-'));
    var prior = parseInt(thisWall.substr(0,thisWall.indexOf('-')))-boardWidth;
    var prior_2 = parseInt(thisWall.substr(thisWall.indexOf('-')+1))-boardWidth;
    var priorWall = prior+"-"+prior_2;
    // take these wall possibilities away
    noWalls.splice(noWalls.indexOf(thisWall),1); 
    noWalls.splice(noWalls.indexOf(nextPart),1);   
    if (noWalls.indexOf(intersec) != -1) { noWalls.splice(noWalls.indexOf(intersec),1); $("td[data-pos='"+intersec+"']").removeClass("wallPlacementHoriz").addClass('wallPlacementHoriz_NOHOVER'); }
    if (noWalls.indexOf(priorWall) != -1) { noWalls.splice(noWalls.indexOf(priorWall),1); $("td[data-pos='"+priorWall+"']").removeClass("wallPlacementVert").addClass('wallPlacementVert_NOHOVER'); }
    // update textareas and display
    $("#nowalls").val(noWalls);
    $("#walls").val(walls);
    var cross = nvf-boardWidth+"-"+nvf; 
    $("td[data-pos='"+thisWall+"']").removeClass('wallPlacementVert').addClass("wallPlacementVert_NOHOVER").addClass("keepWall");
    $("td[data-pos='"+cross+"']").next().addClass("keepWall"); 
    $("td[data-pos='"+nextPart+"']").removeClass('wallPlacementVert').addClass("wallPlacementVert_NOHOVER").addClass("keepWall"); 
    // update computer walls
    var compWallsLeft = $('#showCompPieces').children().next().text(); 
    compWallsLeft--;   
    $('#showCompPieces').children().next().text(compWallsLeft);   
}

/**************************************************
        COMPUTER COMPUTING BOARD CHANGES
**************************************************/   
function placeHorizWall_COMPUTE(thisWall,noWalls,walls,playerWallsLeft,compWallsLeft,playerLoc,oppLoc,turn) {  
    var nextPart = $('#board td[data-pos='+(thisWall)+']').next().next().attr('data-pos');
    var possibleWalls = thisWall+","+nextPart;
    var checkLegal = pathToEndExists(possibleWalls,null,null);  
    if (turn=='c') { var cwa = compWallsLeft; }
    else { var cwa = playerWallsLeft; }
    if ((checkLegal) && (cwa>0)) {    
        walls = walls+","+thisWall; 
        walls = walls+","+nextPart;  
        if (walls[0]==',') { walls = walls.substr(1); }
        // delete cross-intersection and directly prior walls that overlap
        var intersec = thisWall.substr(0,thisWall.indexOf('-'))+"-"+nextPart.substr(0,nextPart.indexOf('-'));
        var prior = parseInt(thisWall.substr(0,thisWall.indexOf('-')))-1;
        var prior_2 = parseInt(thisWall.substr(thisWall.indexOf('-')+1))-1;
        var priorWall = prior+"-"+prior_2;
        // take these wall possibilities away
        noWalls.splice(noWalls.indexOf(thisWall),1); 
        noWalls.splice(noWalls.indexOf(nextPart),1); 
        if (noWalls.indexOf(intersec) != -1) { noWalls.splice(noWalls.indexOf(intersec),1); }
        if (noWalls.indexOf(priorWall) != -1) { noWalls.splice(noWalls.indexOf(priorWall),1); }
        // update number of walls
        playerWallsLeft = parseInt(playerWallsLeft); 
        compWallsLeft = parseInt(compWallsLeft);
        if (turn=='c') { compWallsLeft--; var turn = 'p'; }
        else { playerWallsLeft--; var turn = 'c'; }
        return new Array(noWalls,walls,playerWallsLeft,compWallsLeft,playerLoc,oppLoc,turn); 
    } else {   
        return 'illegal'; 
    } 
}                             

function placeVertWall_COMPUTE(thisWall,noWalls,walls,playerWallsLeft,compWallsLeft,playerLoc,oppLoc,turn) {   
    var nvf = parseInt(thisWall.substr(0,thisWall.indexOf("-"))) + boardWidth;
    var nvs = parseInt(thisWall.substr(thisWall.indexOf("-")+1)) + boardWidth;
    var nextPart = nvf+"-"+nvs;    
    var possibleWalls = thisWall+","+nextPart;  
    var checkLegal = pathToEndExists(possibleWalls,null,null);      
    if (turn=='c') { var cwa = compWallsLeft; }
    else { var cwa = playerWallsLeft; }
    if ((checkLegal) && (cwa>0)) { 
        walls = walls+","+thisWall; 
        walls = walls+","+nextPart;  
        if (walls[0]==',') { walls = walls.substr(1); }
        // delete cross-intersection and directly prior walls that overlap
        var intersec = thisWall.substr(0,thisWall.indexOf('-'))+"-"+nextPart.substr(0,nextPart.indexOf('-'));
        var prior = parseInt(thisWall.substr(0,thisWall.indexOf('-')))-boardWidth;
        var prior_2 = parseInt(thisWall.substr(thisWall.indexOf('-')+1))-boardWidth;
        var priorWall = prior+"-"+prior_2;
        // take these wall possibilities away        
        noWalls.splice(noWalls.indexOf(thisWall),1);                                                                                                                        
        noWalls.splice(noWalls.indexOf(nextPart),1);   
        if (noWalls.indexOf(intersec) != -1) { noWalls.splice(noWalls.indexOf(intersec),1); }
        if (noWalls.indexOf(priorWall) != -1) { noWalls.splice(noWalls.indexOf(priorWall),1); } 
        // update number of walls
        playerWallsLeft = parseInt(playerWallsLeft); 
        compWallsLeft = parseInt(compWallsLeft);
        if (turn=='c') { compWallsLeft--; var turn = 'p'; }
        else { playerWallsLeft--; var turn = 'c'; }
        return new Array(noWalls,walls,playerWallsLeft,compWallsLeft,playerLoc,oppLoc,turn); 
    } else {            
        return 'illegal'; 
    }
}