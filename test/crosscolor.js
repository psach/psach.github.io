
var twice=0;



			
			
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}




function popWords(words){

						$(".wordset").remove();
						$.each(words, function(i, word) {
							
							
							var tr = $('<tr class="wordset">');
						
							$.each(word.split(''), function(j,character){
								$('<td class="cwd-tile-word" ><div class="cwd-tile-letter d3 '+character+'" word='+word+' style="margin-top: 0px;"> '+character+'</div></td>').appendTo(tr);
						
						});
						
						
						
							tr.appendTo(tbody);
						});
						
		$("#words").find(".cwd-tile-letter").click(function() {
				
				if(!activeSet) return;
				if(!activeSet.parent().hasClass('cwd-tile-highlight') ) return;
				
	
				var word = $(this).attr('word');
				var invalid = false;
				
				var arr=[];
				for (i = 0; i < selectionTillLast.length; i++) {
					arr.push(selectionTillLast[i][2]);
				}
				
				
				
				//alert(""+selectionTillLast);
				
				
				if(activeSet && activeSet.length==word.length ){
				
				
					$.each(word.split(''), function(j,character){
					//alert("["+$(activeSet[j]).html()+"] : " + character);
					
						if ( $(activeSet[j]).html()!= ' ' && !invalid ) {
							invalid = $(activeSet[j]).html()!=character;
							
						}
						
				
					});
					
					
					
					
				
				}else{
					invalid=true;
				}
				
				
				if( invalid ) { 
				
					//alert('Incorrect selection');
					//activeSet.parent().removeClass('cwd-tile-highlight');
					activeSet.parent().addClass('cwd-tile-incorrect');
				
				}else{
					storeLevel();
					selectionTillLast.push([clueid,id,word]);
					//var stringSelected = ""+arr+","+word;
					arr.push(word);
					//alert(stringSelected + " : " + correctAns);
					stringCorrect = ""+correctAns[currLevel];
					

					$.each(arr, function(j,word){
						stringCorrect = stringCorrect.replace(word,"|");
					});
					
					//alert(stringCorrect);
					//alert((stringCorrect.split('|').length + stringCorrect.split('|').length-3) + " : " + stringCorrect.length );
					var answered = ((stringCorrect.split('|').length + stringCorrect.split('|').length-3)==stringCorrect.length);
					
					//levelAnswered = answered?levelAnswered++:levelAnswered;
					//var levelAnswered = correctAns.match("^"+startWord);
					//var levelAnswered = correctAns.match(endWord+"$");
					
					
					//alert(stringSelected + " : " + stringCorrect );
					
					
					$.each(word.split(''), function(j,character){
					
						
						$(activeSet[j]).addClass(character);
						$(activeSet[j]).addClass('d3');
						$(activeSet[j]).html(character);
						
					});
					activeSet.parent().removeClass("cwd-tile-highlight");
					
					if(levelAnswered==correctAns.length-1 && answered ){
						//storeLevel();
						
						
					/* 	//answered=false;
						moreCount=0;
						insertCorrect=0;
						levelAnswered=0;
						currLevel=0;
						stringCorrect ="";
						selectionTillLast=[];
						greenChar, redChar;
						start,end;
						activeId;
						randomString=''; */
						//window.location.replace(nextLevel);
						//$('head').load('https://drive.google.com/uc?export=download&id=1HTs_G_XQciOrSrUbMJKAtCmhdBTImiy-');
						
					
						
						  
						setTimeout(function(){ 
							//alert('Good!');
							
							play();
							//storeLevel();
						}, 1000);
							  // this will load a full screen ad on startup
					  AdMob.prepareInterstitial({
						adId: admobid.interstitial,
						isTesting: true, // TODO: remove this line when release
						autoShow: true
					  });
						 
					}else{
					
						if(answered){
							
							levelAnswered++;
							
							setTimeout(function(){ 
							setStartEnd(++currLevel); 
							
							//storeLevel();
							}, 1000);
							
								
							
							
							
							
						}
					}
					
				};
				
			});	
			}
			
			function clear(){
				//twice=0;
					var clearGrid =$("#crossword").find(".cwd-tile-active");
					clearGrid = clearGrid.not("[row="+startCell[currLevel][0]+"][col="+startCell[currLevel][1]+"]");
					clearGrid = clearGrid.not("[row="+endCell[currLevel][0]+"][col="+endCell[currLevel][1]+"]");
					
					clearGrid.removeAttr('class');
					clearGrid.addClass('cwd-tile cwd-tile-active');
					var gridChild=clearGrid.find('.cwd-tile-letter');
					gridChild.html(' ');
					gridChild.removeAttr('class');
					gridChild.addClass('cwd-tile-letter');
					
					start = $("[row="+startCell[currLevel][0]+"][col="+startCell[currLevel][1]+"]");
					end = $("[row="+endCell[currLevel][0]+"][col="+endCell[currLevel][1]+"]");
					start.find('.cwd-tile-letter').removeClass('d3 strikeout '+start.find('.cwd-tile-letter').html());
					end.find('.cwd-tile-letter').removeClass('d3 strikeout '+end.find('.cwd-tile-letter').html());
					
					
					/*
					start.addClass("d3 green");
					start.find('.cwd-tile-letter').html(greenChar);
					end.addClass("d3 red");
					end.find('.cwd-tile-letter').html(redChar); */
					var removeElement;
						$.each(selectionTillLast, function(i, activeList) {
				
							$.each(activeList[2].split(''), function(j,character){
						
									//alert('['+activeList[0]+'='+activeList[1]+']');
									
									if(activeList[1]!=activeId){
										var tile = $($('['+activeList[0]+'='+activeList[1]+'] div')[j]);
										tile.html(character);
										tile.addClass('d3 ' + character);
										
									}else{
										removeElement=i;
										
									}
							});
							
						});
						selectionTillLast.splice(removeElement,1);
						//selectionTillLast.pop();
				
			}
			
			
			function generateNumber(correctWord){
				
					var randomChild = getRandomArbitrary(0,3);
					var random = getRandomArbitrary(0,moreWords.length);
					//alert("["+randomChild+random+"] in " + randomString);
					
					
					if(randomString.indexOf("["+randomChild+random+"]")==-1 ){
						moreWords[random][randomChild]=correctWord;
						randomString+='['+randomChild+random+']';
					}else{
						
						generateNumber(correctWord);
					}
			}
			
			function setStartEnd(lvl){
				
					
  
					selectionTillLast=[];
					randomString='';
				
					$.each(correctAns[lvl], function(i, correctWord) {
					
						generateNumber(correctWord);
						
					
					});
					//$($('['+activeList[0]+'='+activeList[1]+'] div')[j]).html(character);
					//$($('['+activeList[0]+'='+activeList[1]+'] div')).removeClass(character);
					/* var clearGrid =$("#crossword").find(".cwd-tile-active");
					var gridChild=clearGrid.children();
					
					gridChild.html(' ');
					gridChild.removeAttr('class');
					clearGrid.removeAttr('class');
					
					clearGrid.addClass('cwd-tile cwd-tile-active');
					gridChild.addClass('cwd-tile-letter'); */
					
					var clearGrid =$("#crossword").find(".cwd-tile-active");
					clearGrid.removeAttr('class');
					clearGrid.addClass('cwd-tile cwd-tile-active');
					var gridChild=clearGrid.find('.cwd-tile-letter');
					gridChild.html(' ');
					gridChild.removeAttr('class');
					gridChild.addClass('cwd-tile-letter');
					
				
				//alert(lvl);
				
				var correctAnsItem=correctAns[lvl];
				currlvl=lvl;
				
				
				if (endCell[lvl][0]<startCell[lvl][0]){
					greenChar=correctAnsItem[0][correctAnsItem[0].length-1];
					redChar = correctAnsItem[correctAnsItem.length-1][0];
					
				}else{
					greenChar=correctAnsItem[0][0];
					redChar = correctAnsItem[correctAnsItem.length-1][correctAnsItem[correctAnsItem.length-1].length-1];
					
					
				}
				
				
				var gridParent = $("#cwd-grid").parent();
				//gridParent.addClass('hide');
				//gridParent.css('visibility','hidden');
				var gridClone = $("#cwd-grid").clone(true);
				$("#cwd-grid").remove();
				gridClone.appendTo(gridParent).fadeIn(1000,function(){
					
					start = $("[row="+startCell[lvl][0]+"][col="+startCell[lvl][1]+"]");
					end = $("[row="+endCell[lvl][0]+"][col="+endCell[lvl][1]+"]");
					start.addClass('cwd-tile-highlight');
					end.addClass('cwd-tile-highlight');
					
					}).fadeOut(1000).fadeIn(1000,function(){
					
					
					start = $("[row="+startCell[lvl][0]+"][col="+startCell[lvl][1]+"]");
					end = $("[row="+endCell[lvl][0]+"][col="+endCell[lvl][1]+"]");
					
					start.addClass("d3 green");
					start.find('.cwd-tile-letter').html(greenChar);
					
					
					end.addClass("d3 red");
					end.find('.cwd-tile-letter').html(redChar);
					
					
					
				});
				
				
				//if(lvl>0){
					//gridClone.fadeOut(2000,function(){
						
						//gridClone.appendTo(gridParent).fadeIn(2000);
					//});
					//gridClone.appendTo(gridParent).fadeIn(2000);
				//}
				//var lvlChange=$("<div class='lvl-change' >GOOD</div>");
				//lvlChange.appendTo(gridParent).fadeOut('slow',function(){$(this).remove();});
				//$(".lvl-change").fadeIn('slow').fadeOut('slow');
				//gridClone.animate({opacity: 0},800);
				//gridClone.animate({opacity: 1},800);
				//gridParent.css('display','inline-block');
	
			
			}
			
			function loadCW() {
				
			/* var storage = window.localStorage;
			var savedLevel = storage.getItem('currHtml');
			if(savedLevel){$('.').html(savedLevel)};
			storage.removeItem('currHtml'); */
			
			//$('#ccwordjs').load('https://drive.google.com/uc?export=download&id=1rezomHcxVkhzqCIbAP7UjH2UgkNAlXK1');
			//$.mobile.loading().hide();
			//$('head').append('<script src="https://drive.google.com/uc?export=download&id=1rezomHcxVkhzqCIbAP7UjH2UgkNAlXK1" />');
			tbody = $('#words');
			
			setStartEnd(currLevel);
			popWords(moreWords[moreCount]);
			moreCount++;
			
			$(".clear").click(function() {
			
					
				//$("#crossword").find(".cwd-tile-active").dblclick(function() {
				//$("#crossword").find(".cwd-tile-letter").html(' ');
				//alert();
				/* if(activeSet){
				
				activeSet.html(' ');
				activeSet.removeClass('d3');
				} */
				//alert($("<div />").append(activeSet.text().clone()).html());
				//alert(activeSet.text());
				var activeSetWord = activeSet.text().trim().replace(' ' ,'');
				
				if(activeSet && activeSetWord.length==activeSet.length)clear();
				
			
				
							
				
			});
			
			
			
				
			$(".next").click(function() {
				moreCount++;
				if(moreCount==moreWords.length)moreCount=0;
				popWords(moreWords[moreCount]);
				
			});
			
			$(".prev").click(function() {
			
				moreCount--;
				if(moreCount==-1)moreCount=moreWords.length-1;
				popWords(moreWords[moreCount]);
				
			});
			
			/* $( ".action-container" ).on( "swiperight", function(){
				
				moreCount++;
				if(moreCount==moreWords.length)moreCount=0;
				popWords(moreWords[moreCount]);
			});
			
			$( ".action-container" ).on( "swipeleft", function(){
				
				moreCount--;
				if(moreCount==-1)moreCount=moreWords.length-1;
				popWords(moreWords[moreCount]);
			});
			 */
			$("#crossword").find(".cwd-tile-active").dblclick(function() {
				//alert(activeSet.text().trim());
				//if(activeSet && activeSet.text().trim().length==activeSet.length)clear();
			});
			
		
			$("#crossword").find(".cwd-tile-active").click(function() {
				
				
				//var prevActiveSetId = id
				
				var prevActiveSet= activeSet;
				
				
				
				
				//$(this).addClass("cwd-tile-highlight");
				
				
				
				 id = $(this).attr('acrossclueid');
				
				 clueid=id?'acrossclueid':'downclueid';
				
				 id = id?id:$(this).attr('downclueid');
				
				
				
				
				
				activeSet= $('*['+clueid+'="'+id+'"]');
				
				//activeSet=activeSet.length>0?activeSet:$('*[downclueid="'+id+'"]');
				
				
				activeSet=activeSet.find('.cwd-tile-letter');
				
				
				
				activeId=id;
				var activeSetWord = activeSet.text().trim().replace(' ' ,'');
				
				//if( prevActiveSetId == id ) twice++;
				if(activeSet && activeSet.filter('.strikeout').length==activeSet.parent().length && activeSetWord.length==activeSet.parent().length){
					clear();
					activeSet.parent().addClass("cwd-tile-highlight");
					return;
				}
				
				prevActiveSet = prevActiveSet?prevActiveSet:activeSet;
				
				prevActiveSet.removeClass('strikeout');
				prevActiveSet.removeClass('strikeacrossclueid');
				prevActiveSet.removeClass('strikedownclueid');
				
				prevActiveSet.parent().removeClass("cwd-tile-highlight");	
				prevActiveSet.parent().removeClass("cwd-tile-incorrect");	
				
				activeSet.removeClass("strikedownclueid strikeacrossclueid");
				activeSet.addClass("strike"+clueid);
					
				//if(twice==2) clear();
				if(activeSet && activeSetWord.length==activeSet.parent().length){
				
					
					activeSet.addClass('strikeout');
					
					
					
				}else{
					
					activeSet.parent().addClass("cwd-tile-highlight");
					
				}
				
				
				
			});	
			
			
			
			
			
			
			
			
		}

			
        
		   
function storeLevel(){
	//alert("Storing : " +currLevel +" : "+ (level-1) );
	var storage = window.localStorage;
	//currLevel = storage.getItem('currLevel'); // Pass a key name to get its value.
	//storage.setItem('currLevel', currLevel);
	//storage.setItem('mainLevel', level-1);
	//storage.removeItem(key) 
	storage.setItem('currHtml',$('.centerbody').html());
	
}


function getLevel(){
	
	var storage = window.localStorage;
	currLevel = storage.getItem('currLevel')?storage.getItem('currLevel'):0; 
	level = storage.getItem('mainLevel')?storage.getItem('mainLevel'):0; 
	alert("Retriving : " +currLevel +" : "+ level );
	// Pass a key name to get its value.
	//storage.setItem(key, value) // Pass a key name and its value to add or update that key.
	//storage.removeItem(key) 
	
}

