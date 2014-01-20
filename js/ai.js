
var boardWidth = 9;  

/***********************************************
      COMPUTER AI WILL BEGIN CALCULATIONS
***********************************************/
function computerMove() {
    
    // get possible computer moves
    var compMoves = possibleMoves($('.pieceComputer').parent().attr('data-pos'),true,$('.piecePlayer').parent().attr('data-pos'),null);  
    
    // get possible wall placements
    var noWalls = $("#nowalls").val();
    noWalls = noWalls.split(',');   
    
    // begin simulation              
    simulation(noWalls,compMoves[1]);
    
    function simulation(wallSimulations,moveSimulations) {
        var playerWallsLeft = $('#showPlayerPieces').children().next().text();
        var compWallsLeft = $('#showCompPieces').children().next().text();
        var playerLoc = parseInt($('.piecePlayer').parent().attr('data-pos'));     
        var oppLoc = parseInt($('.pieceComputer').parent().attr('data-pos'));  
        var walls = $("#walls").val();       
        var noWalls = $("#nowalls").val().split(',');  
        var arrWins_moves = new Array(0,0,0,0,0,0);  
        var arrShortestMoves_b = shortestPath(null,null,null);
        var arrShortestMoves_a = new Array();       
        for (var p=0;p<wallSimulations.length;p++) {  
            if (wallSimulations[p]=='') { break; }
            var limit = 0;       
            // place current wall down and update board
            var whatWallPlace = $('#board td[data-pos='+wallSimulations[p]+']').attr('class');
            if (whatWallPlace=="wallPlacementHoriz") {     
                var wallDown = placeHorizWall_COMPUTE(wallSimulations[p],noWalls,walls,playerWallsLeft,compWallsLeft,playerLoc,oppLoc,'c'); 
                if (wallDown!='illegal') { var passW  = wallDown[1].split(",").join(","); }   
            } 
            else if (whatWallPlace=="wallPlacementVert") {   
                var wallDown = placeVertWall_COMPUTE(wallSimulations[p],noWalls,walls,playerWallsLeft,compWallsLeft,playerLoc,oppLoc,'c');
                if (wallDown!='illegal') { var passW  = wallDown[1].split(",").join(","); } 
            }                                
            // update shortest path for player and computer with each wall  
            if (wallDown=='illegal') { var sp_a = new Array(0,0); }   
            else { var sp_a = shortestPath(passW,null,null); } 
            arrShortestMoves_a.push(sp_a);
        }  
        var bestWall_sp = null; 
        var worstLen = 0;
        var worstWallForComp = null;
        var wallPreventTrap = null;
        var doublePlaceWall = null;
        var doubleWallPathLen = 0;
        var futureWall = false;  
        var high_change_player = arrShortestMoves_b[0]; 
        var low_change_computer = arrShortestMoves_b[1]; 
        var ranChancePlace = Math.random();   
        // determine if computer might fall into trap
        for (var q=0;q<arrShortestMoves_a.length;q++) { 
            if (arrShortestMoves_a[q][1]>=low_change_computer+2 && wallSimulations[q]!='' && arrShortestMoves_a[q][1]>=worstLen) {
                worstWallForComp=q;
                worstLen = arrShortestMoves_a[q][1]; 
            }    
        }                           
        // find SINGLE wall that can trap computer and prevent it
        var walls_t = $("#walls").val();       
        var noWalls_t = $("#nowalls").val().split(',');
        if (worstWallForComp!=null && parseInt($('#showPlayerPieces').children().next().text())>1 && parseInt($('#showCompPieces').children().next().text())>0) {
            var whatWallBlocker = $('#board td[data-pos='+wallSimulations[worstWallForComp]+']').attr('class');          
            if (whatWallBlocker=="wallPlacementHoriz") { 
                var nextPart = $('#board td[data-pos='+(wallSimulations[worstWallForComp])+']').next().next().attr('data-pos');  
                var walls_with_blocker = wallSimulations[worstWallForComp] + "," + nextPart;
                var inNo = placeHorizWall_COMPUTE(wallSimulations[worstWallForComp],noWalls_t,walls_t,10,10,playerLoc,oppLoc,'c'); 
            }
            else if (whatWallBlocker=="wallPlacementVert") {
                var nvf = parseInt(wallSimulations[worstWallForComp].substr(0,wallSimulations[worstWallForComp].indexOf("-"))) + boardWidth;
                var nvs = parseInt(wallSimulations[worstWallForComp].substr(wallSimulations[worstWallForComp].indexOf("-")+1)) + boardWidth;
                var nextPart = nvf+"-"+nvs;  
                var walls_with_blocker = wallSimulations[worstWallForComp] + "," + nextPart;  
                var inNo = placeVertWall_COMPUTE(wallSimulations[worstWallForComp],noWalls_t,walls_t,10,10,playerLoc,oppLoc,'c');
            }          
            for (var t=0;t<wallSimulations.length;t++) {  
                if (inNo[0].indexOf(wallSimulations[t])!=-1) {
                    var whatWallPlace = $('#board td[data-pos='+wallSimulations[t]+']').attr('class');
                    if (whatWallPlace=="wallPlacementHoriz") {  
                        var test_wall_1 = wallSimulations[t];
                        var test_wall_2 = $('#board td[data-pos='+(test_wall_1)+']').next().next().attr('data-pos');   
                        var checkLegal = shortestPath(inNo[1]+","+test_wall_1+","+test_wall_2,null,null);
                        if (checkLegal[1]==0) { 
                            wallPreventTrap = wallSimulations[t]; 
                            var actuallyLegal = pathToEndExists(wallPreventTrap+","+test_wall_2,null,null);  
                            if (!actuallyLegal) { wallPreventTrap = null; }
                            else { console.log("SINGLE TRAP: "+wallSimulations[worstWallForComp]+","+wallSimulations[t]); break; }    
                        }  
                    } 
                    else if (whatWallPlace=="wallPlacementVert") {     
                        var test_wall_1 = wallSimulations[t];
                        var nvf = parseInt(test_wall_1.substr(0,test_wall_1.indexOf("-"))) + boardWidth;
                        var nvs = parseInt(test_wall_1.substr(test_wall_1.indexOf("-")+1)) + boardWidth;
                        var test_wall_2 = nvf+"-"+nvs;       
                        var checkLegal = shortestPath(inNo[1]+","+test_wall_1+","+test_wall_2,null,null);
                        if (checkLegal[1]==0) { 
                            wallPreventTrap = wallSimulations[t]; 
                            var actuallyLegal = pathToEndExists(wallPreventTrap+","+test_wall_2,null,null);
                            if (!actuallyLegal) { wallPreventTrap = null; }
                            else { console.log("SINGLE TRAP: "+wallSimulations[worstWallForComp]+","+wallSimulations[t]); break; }      
                        }     
                    }       
                }    
            }    
        }   
        // find DOUBLE wall that can trap computer and (try to) prevent it (takes ~ 4 seconds)                                                                               
        var walls_td = $("#walls").val();       
        var noWalls_td = $("#nowalls").val().split(',');      
        var countD = 0;                  
        if (wallPreventTrap==null && parseInt($('#showPlayerPieces').children().next().text())>1 && parseInt($('#showCompPieces').children().next().text())>0 && 
        arrShortestMoves_b[1]-arrShortestMoves_b[0]<=-2) {   
            var compLoc = parseInt($('.pieceComputer').parent().attr('data-pos'));
            var finalLocToCheck = null;
            var fromLoc = wallSimulations.indexOf(compLoc-1+"-"+compLoc); 
            if (fromLoc==-1) {
                var nextLoc = wallSimulations.indexOf(compLoc+"-"+compLoc+1);
                if (nextLoc==-1) {
                    nextLoc = wallSimulations.indexOf(compLoc-9+"-"+compLoc); 
                    if (nextLoc==-1) { finalLocToCheck = null; } 
                    else { finalLocToCheck = nextLoc;  }           
                } else { finalLocToCheck = nextLoc; }
            } else { finalLocToCheck = fromLoc; } 
            // find player double blocking walls
            for (var t=finalLocToCheck+35;t>finalLocToCheck-35;t--) {  
                if (wallPreventTrap==null && typeof wallSimulations[t]!='undefined') {  
                    var whatWallPlace_0 = $('#board td[data-pos='+wallSimulations[t]+']').attr('class');    
                    if (whatWallPlace_0=="wallPlacementHoriz") {  
                        var test_wall_1 = wallSimulations[t];
                        var test_wall_2 = $('#board td[data-pos='+(test_wall_1)+']').next().next().attr('data-pos');  
                        var checkLegal = placeHorizWall_COMPUTE(test_wall_1,noWalls_td,walls_td,10,10,playerLoc,oppLoc,'c'); 
                    } else if (whatWallPlace_0=="wallPlacementVert") {  
                        var test_wall_1 = wallSimulations[t];
                        var nvf = parseInt(test_wall_1.substr(0,test_wall_1.indexOf("-"))) + boardWidth;
                        var nvs = parseInt(test_wall_1.substr(test_wall_1.indexOf("-")+1)) + boardWidth;
                        var test_wall_2 = nvf+"-"+nvs;      
                        var checkLegal = placeVertWall_COMPUTE(test_wall_1,noWalls_td,walls_td,10,10,playerLoc,oppLoc,'c');     
                    }           
                    if (checkLegal!='illegal' && typeof checkLegal!='undefined' && typeof checkLegal[0]!='undefined' && checkLegal[0]!='' && checkLegal[0]!=' ') {  
                        for (var a=finalLocToCheck+35;a>finalLocToCheck-35;a--) {   
                            if (test_wall_1!=wallSimulations[a] && test_wall_2!=wallSimulations[a] && wallPreventTrap==null &&
                                checkLegal[0].toString().indexOf(wallSimulations[a])!=-1 && typeof wallSimulations[a]!='undefined') {
                                var whatWallPlace_2 = $('#board td[data-pos='+wallSimulations[a]+']').attr('class');    
                                if (whatWallPlace_2=="wallPlacementHoriz") {
                                    var test_wall_1_1 = wallSimulations[a];
                                    var test_wall_2_2 = $('#board td[data-pos='+(test_wall_1_1)+']').next().next().attr('data-pos');  
                                    var checkLegal_2 = placeHorizWall_COMPUTE(test_wall_1_1,checkLegal[0].join(",").split(","),checkLegal[1],10,10,playerLoc,oppLoc,'c'); 
                                }
                                else if (whatWallPlace_2=="wallPlacementVert") { 
                                    var test_wall_1_1 = wallSimulations[a];
                                    var nvf = parseInt(test_wall_1_1.substr(0,test_wall_1_1.indexOf("-"))) + boardWidth;
                                    var nvs = parseInt(test_wall_1_1.substr(test_wall_1_1.indexOf("-")+1)) + boardWidth;
                                    var test_wall_2_2 = nvf+"-"+nvs;     
                                    var checkLegal_2 = placeVertWall_COMPUTE(test_wall_1_1,checkLegal[0].join(",").split(","),checkLegal[1],10,10,playerLoc,oppLoc,'c');    
                                }                   
                                if (checkLegal_2!='illegal' && typeof checkLegal_2!='undefined') {        
                                    var sp_t = shortestPath($("#walls").val()+","+test_wall_1+","+test_wall_2+","+test_wall_1_1+","+test_wall_2_2,null,null);
                                    if (sp_t[1]>=low_change_computer+5) {
                                        // find one wall computer can place to make it all illegal   
                                        for (var z=finalLocToCheck-35;z<finalLocToCheck+35;z++) { 
                                            if (wallPreventTrap==null && test_wall_1!=wallSimulations[z] && test_wall_2!=wallSimulations[z] && 
                                                test_wall_1_1!=wallSimulations[z] && test_wall_2_2!=wallSimulations[z] && typeof wallSimulations[z]!='undefined' &&
                                                checkLegal_2[0].toString().indexOf(wallSimulations[z])!=-1) {
                                                var whatWallPlace_5 = $('#board td[data-pos='+wallSimulations[z]+']').attr('class');    
                                                if (whatWallPlace_5=="wallPlacementHoriz") {
                                                    var test_wall_1_z = wallSimulations[z];
                                                    var test_wall_2_z = $('#board td[data-pos='+(test_wall_1_z)+']').next().next().attr('data-pos');   
                                                }
                                                else if (whatWallPlace_5=="wallPlacementVert") { 
                                                    var test_wall_1_z = wallSimulations[z];
                                                    var nvf = parseInt(test_wall_1_z.substr(0,test_wall_1_z.indexOf("-"))) + boardWidth;
                                                    var nvs = parseInt(test_wall_1_z.substr(test_wall_1_z.indexOf("-")+1)) + boardWidth;
                                                    var test_wall_2_z = nvf+"-"+nvs;     
                                                }
                                                var checkLegal_5 = pathToEndExists(test_wall_1+","+test_wall_2+","+test_wall_1_1+","+test_wall_2_2+","+test_wall_1_z+","+test_wall_2_z,null,null);  
                                                if (!checkLegal_5) {  
                                                    wallPreventTrap = wallSimulations[z]; 
                                                    var actuallyLegal = pathToEndExists(wallPreventTrap+","+test_wall_2_z,null,null);
                                                    if (!actuallyLegal) { wallPreventTrap = null; }
                                                    else { wallPreventTrap = "tempfake"; }      
                                                } 
                                            }
                                        }
                                        // find two walls computer can place to make it all illegal
                                        for (var b=finalLocToCheck-90;b<finalLocToCheck+10;b++) {  
                                            if (wallPreventTrap==null && test_wall_1!=wallSimulations[b] && test_wall_2!=wallSimulations[b] && 
                                            test_wall_1_1!=wallSimulations[b] && test_wall_2_2!=wallSimulations[b] && typeof wallSimulations[b]!='undefined') {  
                                                var whatWallPlace_3 = $('#board td[data-pos='+wallSimulations[b]+']').attr('class');    
                                                if (whatWallPlace_3=="wallPlacementHoriz") {  
                                                    var test_wall_1_b = wallSimulations[b];
                                                    var test_wall_2_b = $('#board td[data-pos='+(test_wall_1_b)+']').next().next().attr('data-pos');   
                                                    var checkLegal_3 = placeHorizWall_COMPUTE(test_wall_1_b,checkLegal_2[0].join(",").split(","),checkLegal_2[1]+","+test_wall_1_1+","+test_wall_2_2,10,10,playerLoc,oppLoc,'c');
                                                } else if (whatWallPlace_3=="wallPlacementVert") {  
                                                    var test_wall_1_b = wallSimulations[b];
                                                    var nvf = parseInt(test_wall_1_b.substr(0,test_wall_1_b.indexOf("-"))) + boardWidth;
                                                    var nvs = parseInt(test_wall_1_b.substr(test_wall_1_b.indexOf("-")+1)) + boardWidth;
                                                    var test_wall_2_b = nvf+"-"+nvs;      
                                                    var checkLegal_3 = placeVertWall_COMPUTE(test_wall_1_b,checkLegal_2[0].join(",").split(","),checkLegal_2[1]+","+test_wall_1_1+","+test_wall_2_2,10,10,playerLoc,oppLoc,'c');   
                                                }
                                                if (checkLegal_3!='illegal' && typeof checkLegal_3!='undefined') { 
                                                    for (var c=finalLocToCheck-90;c<finalLocToCheck+10;c++) { 
                                                        if (wallPreventTrap==null && test_wall_1!=wallSimulations[c] && test_wall_2!=wallSimulations[c] && 
                                                            test_wall_1_1!=wallSimulations[c] && test_wall_2_2!=wallSimulations[c] && test_wall_1_b!=wallSimulations[c] &&
                                                            test_wall_2_b!=wallSimulations[c] && typeof wallSimulations[c]!='undefined' 
                                                            && checkLegal_3[0].toString().indexOf(wallSimulations[c])!=-1) {
                                                            var whatWallPlace_4 = $('#board td[data-pos='+wallSimulations[c]+']').attr('class');    
                                                            if (whatWallPlace_4=="wallPlacementHoriz") {
                                                                var test_wall_1_c = wallSimulations[c];
                                                                var test_wall_2_c = $('#board td[data-pos='+(test_wall_1_c)+']').next().next().attr('data-pos');   
                                                            }
                                                            else if (whatWallPlace_4=="wallPlacementVert") { 
                                                                var test_wall_1_c = wallSimulations[c];
                                                                var nvf = parseInt(test_wall_1_c.substr(0,test_wall_1_c.indexOf("-"))) + boardWidth;
                                                                var nvs = parseInt(test_wall_1_c.substr(test_wall_1_c.indexOf("-")+1)) + boardWidth;
                                                                var test_wall_2_c = nvf+"-"+nvs;     
                                                            }
                                                            var checkLegal_4 = pathToEndExists(test_wall_1+","+test_wall_2+","+test_wall_1_1+","+test_wall_2_2+","+test_wall_1_b+","+test_wall_2_b+","+test_wall_1_c+","+test_wall_2_c,null,null);  
                                                            if (!checkLegal_4) {      
                                                                wallPreventTrap = wallSimulations[b];   
                                                                var actuallyLegal = pathToEndExists(test_wall_1_b+","+test_wall_2_b+","+test_wall_1_c+","+test_wall_2_c,null,null);  
                                                                if (!actuallyLegal) { wallPreventTrap = null; }   
                                                                console.log(test_wall_1+","+test_wall_2+","+test_wall_1_1+","+test_wall_2_2+","+test_wall_1_b+","+test_wall_2_b+","+test_wall_1_c+","+test_wall_2_c);  
                                                                //countD++; if (countD>5000) { wallPreventTrap='tempfake'; } 
                                                                console.log("DOUBLE TRAP");
                                                            } 
                                                        }
                                                    }
                                                } 
                                            }
                                        }    
                                    }        
                                } 
                            }
                        }    
                    } 
                }
            }
        }    
        if (wallPreventTrap=='tempfake') { wallPreventTrap=null; }    
        // determine SINGLE wall that slows player            
        for (var k=0;k<arrShortestMoves_a.length;k++) {    
            if (arrShortestMoves_a[k][0]>=high_change_player) {            
                bestWall_sp=k; 
                high_change_player = arrShortestMoves_a[k][0];  
            }    
        }    
        // play N=2 moves into future and see if SINGLE wall should wait (only if player has no walls)  
        var pMoves = possibleMoves($('.piecePlayer').parent().attr('data-pos'),true,$('.pieceComputer').parent().attr('data-pos'),null);
        if (parseInt($('#showPlayerPieces').children().next().text())==0 && parseInt($('#showCompPieces').children().next().text())>0 && 
        pMoves[1].indexOf(0)==-1 && pMoves[1].indexOf(1)==-1 && pMoves[1].indexOf(2)==-1 && pMoves[1].indexOf(3)==-1 &&
        pMoves[1].indexOf(4)==-1 && pMoves[1].indexOf(5)==-1 && pMoves[1].indexOf(6)==-1 && pMoves[1].indexOf(7)==-1 && pMoves[1].indexOf(8)==-1) {
            var playerMoves_1 = possibleMoves($('.piecePlayer').parent().attr('data-pos'),true,$('.pieceComputer').parent().attr('data-pos'),null); 
            var move_sp = 100;
            var tempLoc_1 = null;
            for (var p=0;p<playerMoves_1[1].length;p++) { 
                var temp_sp = shortestPath(null,null,playerMoves_1[1][p]);
                if (temp_sp[0]<move_sp) {
                    move_sp = temp_sp[0]; 
                    tempLoc_1 = p;       
                }
            }
            var playerMoves_2 = possibleMoves(playerMoves_1[1][tempLoc_1],true,$('.pieceComputer').parent().attr('data-pos'),null); 
            var move_sp = 100;
            var tempLoc_2 = null;
            for (var p=0;p<playerMoves_2[1].length;p++) { 
                var temp_sp = shortestPath(null,null,playerMoves_2[1][p]);
                if (temp_sp[0]<move_sp) {
                    move_sp = temp_sp[0]; 
                    tempLoc_2 = p;       
                }
            }
            var walls_f = $("#walls").val();       
            var noWalls_f = $("#nowalls").val().split(',');
            for (var p=0;p<wallSimulations.length;p++) {  
                if (wallSimulations[p]!='') {     
                    var whatWallPlace = $('#board td[data-pos='+wallSimulations[p]+']').attr('class');
                    if (whatWallPlace=="wallPlacementHoriz") {     
                        var wallDown_1 = placeHorizWall_COMPUTE(wallSimulations[p],noWalls_f,walls_f,playerWallsLeft,compWallsLeft,playerMoves_1[1][tempLoc_1],oppLoc,'c'); 
                        if (wallDown_1!='illegal') { 
                            var passW_1  = wallDown_1[1].split(",").join(","); 
                            var sp_a_1 = shortestPath(passW_1,null,playerMoves_1[1][tempLoc_1]);
                        }   
                        var wallDown_2 = placeHorizWall_COMPUTE(wallSimulations[p],noWalls_f,walls_f,playerWallsLeft,compWallsLeft,playerMoves_2[1][tempLoc_2],oppLoc,'c'); 
                        if (wallDown_2!='illegal') { 
                            var passW_2  = wallDown_2[1].split(",").join(","); 
                            var sp_a_2 = shortestPath(passW_2,null,playerMoves_2[1][tempLoc_2]);
                        }    
                    } 
                    else if (whatWallPlace=="wallPlacementVert") {   
                        var wallDown_1 = placeVertWall_COMPUTE(wallSimulations[p],noWalls_f,walls_f,playerWallsLeft,compWallsLeft,playerMoves_1[1][tempLoc_1],oppLoc,'c'); 
                        if (wallDown_1!='illegal') { 
                            var passW_1  = wallDown_1[1].split(",").join(","); 
                            var sp_a_1 = shortestPath(passW_1,null,playerMoves_1[1][tempLoc_1]);
                        }   
                        var wallDown_2 = placeVertWall_COMPUTE(wallSimulations[p],noWalls_f,walls_f,playerWallsLeft,compWallsLeft,playerMoves_2[1][tempLoc_2],oppLoc,'c'); 
                        if (wallDown_2!='illegal') { 
                            var passW_2  = wallDown_2[1].split(",").join(","); 
                            var sp_a_2 = shortestPath(passW_2,null,playerMoves_2[1][tempLoc_2]);
                        }   
                    }          
                    if (wallDown_1!='illegal') {                      
                        if (sp_a_1[0]>high_change_player) {
                            futureWall = true;
                            console.log("WALL WILL BE BETTER IN THE FUTURE");  
                        }
                    }
                    if (wallDown_2!='illegal') {
                        if (sp_a_2[0]>high_change_player) {
                            futureWall = true;
                            console.log("WALL WILL BE BETTER IN THE FUTURE");     
                        }
                    }
                }  
            }                         
        }
        var playerLoc = parseInt($('.piecePlayer').parent().attr('data-pos'));
        var compWallsLeft = $('#showCompPieces').children().next().text();
        var finalLocToCheck = null;
        var fromLoc = wallSimulations.indexOf(playerLoc-1+"-"+playerLoc); 
        if (fromLoc==-1) {
            var nextLoc = wallSimulations.indexOf(playerLoc+"-"+playerLoc+1);
            if (nextLoc==-1) {
                nextLoc = wallSimulations.indexOf(playerLoc-9+"-"+playerLoc); 
                if (nextLoc==-1) {  
                    nextLoc = wallSimulations.indexOf(playerLoc+"-"+playerLoc+9);
                    if (nextLoc==-1) {
                        finalLocToCheck = null; 
                        console.log("CANT ATTEMPT DOUBLE WALL");        
                    } 
                } else { finalLocToCheck = nextLoc; }     
            } else { finalLocToCheck = nextLoc; }
        } else { finalLocToCheck = fromLoc; } 
        var walls_d = $("#walls").val();       
        var noWalls_d = $("#nowalls").val().split(',');
        // determine DOUBLE wall that slows player if computer is behind at least 2 spaces (takes ~ 4 seconds)
        if (finalLocToCheck!=null) {
            for (var t=finalLocToCheck-25;t<finalLocToCheck+25;t++) {  
                if (doublePlaceWall==null && compWallsLeft>1 && typeof wallSimulations[t] != 'undefined' && playerWallsLeft-compWallsLeft<4 && 
                arrShortestMoves_b[1]-arrShortestMoves_b[0]>=2) {     
                    var whatWallPlace = $('#board td[data-pos='+wallSimulations[t]+']').attr('class');    
                    if (whatWallPlace=="wallPlacementHoriz") {  
                        var test_wall_1 = wallSimulations[t];
                        var test_wall_2 = $('#board td[data-pos='+(test_wall_1)+']').next().next().attr('data-pos');
                        var checkLegal = placeHorizWall_COMPUTE(test_wall_1,noWalls_d,walls_d,10,10,playerLoc,oppLoc,'c');     
                    } else if (whatWallPlace=="wallPlacementVert") {  
                        var test_wall_1 = wallSimulations[t];
                        var nvf = parseInt(test_wall_1.substr(0,test_wall_1.indexOf("-"))) + boardWidth;
                        var nvs = parseInt(test_wall_1.substr(test_wall_1.indexOf("-")+1)) + boardWidth;
                        var test_wall_2 = nvf+"-"+nvs;        
                        var checkLegal = placeVertWall_COMPUTE(test_wall_1,noWalls_d,walls_d,10,10,playerLoc,oppLoc,'c');   
                    }
                    if (checkLegal!='illegal') { 
                        for (var a=finalLocToCheck-25;a<finalLocToCheck+25;a++) {  
                            if (checkLegal[0].indexOf(wallSimulations[a])!=-1) {
                                var whatWallPlace_2 = $('#board td[data-pos='+wallSimulations[a]+']').attr('class');    
                                if (whatWallPlace_2=="wallPlacementHoriz") {
                                    var test_wall_1_1 = wallSimulations[a];
                                    var test_wall_2_2 = $('#board td[data-pos='+(test_wall_1_1)+']').next().next().attr('data-pos');   
                                }
                                else if (whatWallPlace_2=="wallPlacementVert") { 
                                    var test_wall_1_1 = wallSimulations[a];
                                    var nvf = parseInt(test_wall_1_1.substr(0,test_wall_1_1.indexOf("-"))) + boardWidth;
                                    var nvs = parseInt(test_wall_1_1.substr(test_wall_1_1.indexOf("-")+1)) + boardWidth;
                                    var test_wall_2_2 = nvf+"-"+nvs;     
                                }
                                var checkLegal_2 = pathToEndExists(test_wall_1+","+test_wall_2+","+test_wall_1_1+","+test_wall_2_2,null,null);
                                if (checkLegal_2) {          
                                    // if placing both walls are legal and both walls together slow player down
                                    var checkSP2walls = shortestPath($("#walls").val()+","+test_wall_1+","+test_wall_2+","+test_wall_1_1+","+test_wall_2_2,null,null);
                                    if (checkSP2walls[0]>high_change_player/*+1*/ && checkSP2walls[1]<=low_change_computer+1) { 
                                        doublePlaceWall = a; 
                                        doubleWallPathLen = checkSP2walls[0];
                                        break; 
                                    }            
                                } 
                            }
                        }
                    }  
                }     
            }
        }
        // find best move with shortest path
        var fm_pos = 0;
        var fastestMove = 100; 
        for (var p=0;p<moveSimulations.length;p++) { 
            var fm = shortestPath(null,moveSimulations[p]);
            if (fm[1]<fastestMove) { 
                fastestMove = fm[1]; 
                fm_pos = p; 
            }
        }      
        
        console.log("---------------------------");
        var ranWallMove = Math.random(); 
        var bestWall = wallSimulations[bestWall_sp]; 
        var bestMove = moveSimulations[fm_pos]; 
        if (typeof arrShortestMoves_a[bestWall_sp]!='undefined' && arrShortestMoves_a[bestWall_sp]!='' && arrShortestMoves_a[bestWall_sp]!=' ' &&
            typeof bestWall!='undefined' && bestWall!='' && bestWall!=' ') { 
            console.log("WALL "+wallSimulations[bestWall_sp] + " slows player from " +arrShortestMoves_b[0]+ " to " +high_change_player); 
            console.log("WALL "+wallSimulations[bestWall_sp]+ " slows computer from " +arrShortestMoves_b[1]+ " to " + arrShortestMoves_a[bestWall_sp][1]); 
        }
        console.log("BEST WALL: "+bestWall); 
        console.log("BEST MOVE: "+bestMove);
        console.log("SHORTEST PATHS: "+arrShortestMoves_b);  
        
        // split board up - heuristic-ish for stopping long paths
        if (ranWallMove<0.3 && (wallSimulations.indexOf("21-22")!=-1 && wallSimulations.indexOf("22-23")!=-1 && 
                                wallSimulations.indexOf("39-40")!=-1 && wallSimulations.indexOf("40-41")!=-1)) {      
            var r = Math.random();
            if (r<0.25) { var p = "21-22"; } 
            else if (r<0.5) { var p ="22-23"; } 
            else if (r<0.75) { var p = "39-40"; } 
            else { var p = "40-41"; }   
            placeVertWall(p);         
        }
        // decide what move to make out of best options      
        else if (doublePlaceWall!=null && typeof wallSimulations[doublePlaceWall]!='undefined' && wallPreventTrap==null && 
        high_change_player-arrShortestMoves_b[0]<7 && !futureWall) {
            console.log("DOUBLE PLACE WALL: "+wallSimulations[doublePlaceWall]);      
            var whatWallPlace = $('#board td[data-pos='+(wallSimulations[doublePlaceWall])+']').attr('class'); 
            if (whatWallPlace=="wallPlacementHoriz") { var wall = placeHorizWall(wallSimulations[doublePlaceWall]); }
            else if (whatWallPlace=="wallPlacementVert") { var wall = placeVertWall(wallSimulations[doublePlaceWall]); } 
        }
        // only check for traps if computer is losing by at most 4 spaces and if winning at all
        else if (wallPreventTrap!=null && arrShortestMoves_b[1]-arrShortestMoves_b[0]<=2 && high_change_player-arrShortestMoves_b[0]<6 && playerWallsLeft-compWallsLeft<3) {
            console.log("COMPUTER TRAP WALL: "+wallPreventTrap); 
            var whatWallPlace = $('#board td[data-pos='+(wallPreventTrap)+']').attr('class'); 
            if (whatWallPlace=="wallPlacementHoriz") { var wall = placeHorizWall(wallPreventTrap); }
            else if (whatWallPlace=="wallPlacementVert") { var wall = placeVertWall(wallPreventTrap); }     
        }                    
        else if ((typeof bestWall!='undefined' && bestWall!='' && bestWall!=' ' && !futureWall) && 
                 (high_change_player-arrShortestMoves_b[0]>=3 || 
                 (arrShortestMoves_b[0]<8 && ranWallMove<0.3) ||
                 (arrShortestMoves_b[0]<7 && compMoves[0]>8 && ranWallMove<0.6) ||
                 (arrShortestMoves_b[0]<6 && compMoves[0]>8)) && 
                  high_change_player-arrShortestMoves_b[0]>0 && 
                 (playerWallsLeft-compWallsLeft<3 || arrShortestMoves_b[0]<4 || high_change_player-arrShortestMoves_b[0]>=4)) {  
                 
            // if losing dont slow down computer only player
            var getDiff = high_change_player-arrShortestMoves_b[0];  
            if (arrShortestMoves_b[1]-arrShortestMoves_b[0]>=3 && arrShortestMoves_a[bestWall_sp][1]-arrShortestMoves_b[1]<=getDiff) {
                console.log("WALL IS OK FOR COMPUTER (LOSING)");
                var whatWallPlace = $('#board td[data-pos='+(bestWall)+']').attr('class'); 
                if (whatWallPlace=="wallPlacementHoriz") { var wall = placeHorizWall(bestWall); }
                else if (whatWallPlace=="wallPlacementVert") { var wall = placeVertWall(bestWall); } 
            } else if (arrShortestMoves_b[1]-arrShortestMoves_b[0]<3) {
                console.log("WALL IS OK FOR COMPUTER (NOT LOSING)")
                var whatWallPlace = $('#board td[data-pos='+(bestWall)+']').attr('class'); 
                if (whatWallPlace=="wallPlacementHoriz") { var wall = placeHorizWall(bestWall); }
                else if (whatWallPlace=="wallPlacementVert") { var wall = placeVertWall(bestWall); }     
            } else {
                console.log("WALL NOT HELPFUL FOR COMPUTER");
                movePiece(compMoves[0],bestMove);     
            }
            
        } 
        else {  
            movePiece(compMoves[0],bestMove);
        }       
    }            
}

