
var twice=0;


var prevData=JSON.parse('{"selections":[],"currLevel":0,"level":0,"levelAnswered":0,"moreCount":0}');

			
			
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



function popWords(words){
			//alert('popWords');	
			$(".wordset").remove();
			$.each(words, function(i, word) {
				
				//alert(word);
				var tr = $('<tr class="wordset">');
				
				$.each(word.split(''), function(j,character){
				/* 	var temp = emojiUnicode(character);
					console.log(temp);
					//var df = String.fromCodePoint(parseInt(temp).toString(16));
					//df.length;
					var first = String.fromCodePoint(eval('0x'+temp)).charCodeAt(0).toString(16); // d83d
					var second = String.fromCodePoint(eval('0x'+temp)).charCodeAt(1).toString(16);
					console.log(first+second);
					var temp =first+second; */
					//alert(emojiChar[character]);
					$('<td class="cwd-tile-word" ><div class="cwd-tile-letter d3char '+character+'" word='+word+' style="margin-top: 0px;">'+(emojiChar[character])+'</div></td>').appendTo(tr);
					//tr.find('.cwd-tile-letter').text(emojiChar[character]);
		
			});
						
						
						
							tr.appendTo(tbody);
			});
						
						
		$("#words").find(".cwd-tile-letter").click(function() {
				
				activeSet = $("#crossword").find(".cwd-tile-highlight, .cwd-tile-highlight-help").find('.cwd-tile-letter');
				
				if(!activeSet) return;
				if(!activeSet.parent().hasClass('cwd-tile-highlight,cwd-tile-highlight-help') ) return;
				
								
				
				var word = $(this).attr('word');
				var invalid = false;
				
				
				
				
				
				
				//alert(""+selectionTillLast);
				
				
				if(activeSet && activeSet.length==word.length ){
				
				
					$.each(word.split(''), function(j,character){
						character = emojiChar[character];
						
					//alert("["+$(activeSet[j]).text()+"] : " + character);
					
						if ( $(activeSet[j]).html()!= ' ' && !invalid ) {
							invalid = $(activeSet[j]).text()!=character;
							
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
					
					 clueid=activeSet.parent('[acrossclueid]').length==activeSet.parent().length?'acrossclueid':'downclueid';
					 
					 id = activeSet.parent().attr(clueid);
				
					
					
					 //id = id?id:activeSet.parent().attr('downclueid');
					
					
					 activeId=id;
					selectionTillLast.push([clueid,id,word]);
				
					var arr=[];
					for (i = 0; i < selectionTillLast.length; i++) {
						arr.push(selectionTillLast[i][2]);
					}
				
				
					//storeLevel();
					
					//var stringSelected = ""+arr+","+word;
					//arr.push(word);
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
					
					// SET VALID WORD
					$.each(word.split(''), function(j,character){
					
						
						$(activeSet[j]).addClass(character);
						$(activeSet[j]).addClass('d3char ');
						$(activeSet[j]).html(emojiChar[character]);
						//$(activeSet[j]).attr('word',character);
						
						
					});
					activeSet.parent().removeClass("cwd-tile-highlight");
					activeSet.parent().removeClass("cwd-tile-incorrect");
						
					// MAIN LEVEL COMPLETED
					if(levelAnswered==correctAns.length-1 && answered ){
						//storeLevel();
						totalLevels--;
						
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
						moreCount=0;
						levelAnswered=0;
						currLevel=0;
						selectionTillLast=[];
						
						
						  
							setTimeout(function(){ 
								level++;
								clearLevelGrid();
								play();
								//alert('Good!');
								
								//storeLevel();
							}, 1000);
						
						
							
							  // this will load a full screen ad on startup
						 /*  AdMob.prepareInterstitial({
							adId: admobid.interstitial,
							isTesting: true, // TODO: remove this line when release
							autoShow: true
						  }); */
						 
					}else{
					
						// CHILD LEVEL COMPLETED
						if(answered){
							totalLevels--;
							levelAnswered++;
							selectionTillLast=[];
							moreCount=0;
							
							
							setTimeout(function(){ 
								clearLevelGrid();
								setStartEnd(++currLevel); 
							
							
							}, 1000);
							
								
							
							
							
							
						}
					}
					storeLevel();
					
				};
				
			});	
			}
			
			// CLEAR SELECTED WORD
			function clear(add){
				//twice=0;
					var clearGrid =$("#crossword").find(".cwd-tile-active");
					//clearGrid = clearGrid.not("[row="+startCell[currLevel][0]+"][col="+startCell[currLevel][1]+"]");
					//clearGrid = clearGrid.not("[row="+endCell[currLevel][0]+"][col="+endCell[currLevel][1]+"]");
					
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
					activeSet.parent().addClass("cwd-tile-highlight");
					
					start.addClass("d3 green");
					start.find('.cwd-tile-letter').html(emojiChar[greenChar]);
					end.addClass("d3 red");
					end.find('.cwd-tile-letter').html(emojiChar[redChar]);
					start.find('.cwd-tile-letter').addClass('bounce');
					end.find('.cwd-tile-letter').addClass('bounce');
					
					if(add){
					var removeElement;
						$.each(selectionTillLast, function(i, activeList) {
				
							$.each(activeList[2].split(''), function(j,character){
						
									//alert('['+activeList[0]+'='+activeList[1]+']');
									
									if(activeList[1]!=activeId){
										var tile = $($('['+activeList[0]+'='+activeList[1]+'] div')[j]);
										tile.html(emojiChar[character]);
										tile.addClass('d3char ' + character);
										
										
										
									}else{
										removeElement=i;
										
									}
									
							});
							
						});
						selectionTillLast.splice(removeElement,1);
						//selectionTillLast.pop();
						
					}else{
						selectionTillLast=[];
						
					}
					storeLevel();
				
			}
			
			
			function generateNumber(correctWord){
				
					var randomChild = getRandomArbitrary(0,3);
					var random = getRandomArbitrary(0,moreWords.length);
					//alert("["+randomChild+random+"] in " + randomString + correctWord);
					
					
					if(randomString.indexOf("["+randomChild+random+"]")==-1 ){
						moreWords[random][randomChild]=correctWord;
						randomString+='['+randomChild+random+']';
					}else{
						
						generateNumber(correctWord);
					}
			}
			
			function setStartEnd(lvl){
					
					showLevel();
					storeLevel();
					setTimeout(function(){
						
						if(currLevel==1) admob.interstitial.show();
						
					},3000);
					//selectionTillLast=[];
					//randomString='';
				
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
					
					/* var clearGrid =$("#crossword").find(".cwd-tile-active");
					clearGrid.removeAttr('class');
					clearGrid.addClass('cwd-tile cwd-tile-active');
					var gridChild=clearGrid.find('.cwd-tile-letter');
					gridChild.html(' ');
					gridChild.removeAttr('class');
					gridChild.addClass('cwd-tile-letter'); */
					
				
				//alert(lvl);
				
				var correctAnsItem=correctAns[lvl];
				currlvl=lvl;
				//alert(endCell[lvl][0]<startCell[lvl][0]);
				
				if (endCell[lvl][0]<startCell[lvl][0]){
					greenChar=correctAnsItem[0][correctAnsItem[0].length-1];
					redChar = correctAnsItem[correctAnsItem.length-1][0];
					
				}else{
					greenChar=correctAnsItem[0][0];
					redChar = correctAnsItem[correctAnsItem.length-1][correctAnsItem[correctAnsItem.length-1].length-1];
					
					
				}
				
				//alert(greenChar);
				//alert(redChar);
				
				
				var gridParent = $("#cwd-grid").parent();
				//gridParent.addClass('hide');
				//gridParent.css('visibility','hidden');
				var gridClone = $("#cwd-grid").clone(true);
				$("#cwd-grid").remove();
				gridClone.css('opacity','0');
				gridClone.css('transition','opacity 2s ease-in-out');
				
  
						//gridClone.appendTo(gridParent);
						start = gridClone.find("[row="+startCell[lvl][0]+"][col="+startCell[lvl][1]+"]");
						end = gridClone.find("[row="+endCell[lvl][0]+"][col="+endCell[lvl][1]+"]");
						start.find('.cwd-tile-letter').addClass('bounce');
						end.find('.cwd-tile-letter').addClass('bounce');
						
						//gridClone.appendTo(gridParent);
						//gridParent.css('opacity', '1');
						//gridClone.css('transition','opacity 2s ease-in-out');
						gridClone.appendTo(gridParent).fadeIn('slow',function(){
								gridClone.css('opacity','1');
								
								
						});
			
						start = $("[row="+startCell[lvl][0]+"][col="+startCell[lvl][1]+"]");
						end = $("[row="+endCell[lvl][0]+"][col="+endCell[lvl][1]+"]");
						start.addClass("d3 green");
						start.find('.cwd-tile-letter').html(emojiChar[greenChar]);
						end.addClass("d3 red");
						end.find('.cwd-tile-letter').html(emojiChar[redChar]);
						
				
				
				
			
			
			}
			
			function loadCW() {
				
			
			tbody = $('#words');
			
			setStartEnd(currLevel);
			
			popWords(moreWords[moreCount]);
			moreCount++;
			
						
			
				
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
				
				

			
		
			$("#crossword").find(".cwd-tile-active").click(function() {
				
				
				//var prevActiveSetId = id
				
				//var prevActiveSet= activeSet;
				
				
				
				
				//$(this).addClass("cwd-tile-highlight");
				
				
				
				 id = $(this).attr('acrossclueid');
				
				 clueid=id?'acrossclueid':'downclueid';
				
				 id = id?id:$(this).attr('downclueid');
				
				
				
				
				
				activeSet= $('*['+clueid+'="'+id+'"]');
				
				//activeSet=activeSet.length>0?activeSet:$('*[downclueid="'+id+'"]');
				
				//activeSetWord=activeSet.find('[word]');
				
				activeSet=activeSet.find('.cwd-tile-letter');
				
				
				
				activeId=id;
				//alert(activeSetWord.length);
				var activeSetWord = activeSet.text().trim().replace(' ' ,'');
				
				var factor;
				var activeSetWordlength;
				
				if(activeSetWord.length>0){
					factor = gametype.length>0?2:1;
					activeSetWordlength = activeSetWord.length/factor;
				}
				
				//if( prevActiveSetId == id ) twice++;
				if(activeSet && activeSet.filter('.strikeout').length==activeSet.parent().length && activeSetWordlength==activeSet.parent().length){
					clear(true);
					//activeSetWord.removeAttr('word');
										
					storeLevel();
					return;
				}
				
				/* prevActiveSet = prevActiveSet?prevActiveSet:activeSet;
				
				prevActiveSet.removeClass('strikeout');
				prevActiveSet.removeClass('strikeacrossclueid');
				prevActiveSet.removeClass('strikedownclueid'); */
				
				$('.cwd-tile-letter')
				.removeClass("strikeout strikeacrossclueid strikedownclueid");
				
				
				/* prevActiveSet.parent().removeClass("cwd-tile-highlight");	
				prevActiveSet.parent().removeClass("cwd-tile-incorrect");	 */
				$('.cwd-tile-letter').parent()
				.removeClass("cwd-tile-highlight cwd-tile-incorrect");
			
				activeSet.removeClass("strikedownclueid strikeacrossclueid");
				
					
				//if(twice==2) clear();
				if(activeSet && activeSetWordlength==activeSet.parent().length){
				
				
					activeSet.addClass('strikeout ' + "strike"+clueid);
					
					
					
				}else{
					
					activeSet.parent().addClass("cwd-tile-highlight");
					
				}
				
				storeLevel();
				
			});	
			
			
			
			
			
			
			
			
		}

			

function showLevel(){
	
	
	$(".wrapperContainer > .wrapper").remove();
	$(".wrapperContainer")
	.append('<div class="wrapper" ><table width=100% ><tr><td></td><td class="score" align="left" >'+(totalLevels)+'</td><td width="85%"></td></tr></table></div>');
	
	
	
}
		   
function storeLevel(){
	
	
	
	var storage = window.localStorage?window.localStorage:localStorage;
	prevData=JSON.parse('{"selections":[],"currLevel":0,"level":0,"levelAnswered":0,"moreCount":0,"html":0}');

	prevData.currLevel=currLevel;
	prevData.level=level;
	prevData.moreCount=moreCount;
	prevData.levelAnswered=levelAnswered;
	prevData.html=$('#cwd-grid').html();
	prevData.selections=selectionTillLast;
	prevData.totalLevels=totalLevels;
	
	storage.setItem(gametype+'prevData',JSON.stringify(prevData));
	//alert("Storing : " +currLevel +" : "+ (level-1) );
	
}

function clearLevelGrid(){
	
	var clearGrid =$("#crossword").find(".cwd-tile-active");
	clearGrid.removeAttr('class');
	clearGrid.addClass('cwd-tile cwd-tile-active');
	var gridChild=clearGrid.find('.cwd-tile-letter');
	gridChild.html(' ');
	gridChild.removeAttr('class');
	gridChild.addClass('cwd-tile-letter');
}

function getLevel(){
	var storage = window.localStorage?window.localStorage:localStorage;
	
	prevData=JSON.parse(storage.getItem(gametype+'prevData'));
	if(prevData){
		currLevel=prevData.currLevel;
		level=prevData.level;
		moreCount=prevData.moreCount;
		levelAnswered=prevData.levelAnswered;
		selectionTillLast=prevData.selections;
		totalLevels=prevData.totalLevels?prevData.totalLevels:mainTotalLevel;
	}else{
		currLevel=0;
		level=0;
		moreCount=0;
		levelAnswered=0;
		selectionTillLast=[];
		totalLevels=mainTotalLevel;
	}
	console.log(prevData);
	//storage.removeItem('prevData');
}

function home(){
	firstLoad=true;
	//$(indexMain).find('.switch-field').attr('style',"visibility:hidden; -webkit-animation-delay:0s ;background-color:transparent; border:0px");
	$('.centerbody').html(indexMain);
	//$('.centerbody').find('.switch-field').attr('style',"visibility:hidden; -webkit-animation-delay:0s ;background-color:transparent; border:0px");
}

function clearAll(){
	if(helpFlag){
		clear(false);
	}
}

var helpFlag=true;



function help(){
	
	if(helpFlag){
		
		var helpMoreWords=[['MAID','MONEY','FOGY']];
	
		popWords(helpMoreWords[0]);
		
		helpFlag=false;
		$('#crossword .cwd-tile-active').attr('style','background-color:lightgray');
		//$('#words').attr('style','-webkit-filter:sepia(50%)');
		
		// Start
		var offset=$('.green').offset();
		var startHelp = $('<div class="bounceside" ><font style="background-color:transparent;font-size:30px" >👈</font><font style="border-radius:6px;border:1px solid dimgray;padding:2px;background: linear-gradient(#EEEEEE, #DDFF96,#DDFF96);" >Start</font></div>');
				//alert(offset);
		startHelp.attr('style','position:absolute; left:'+(offset.left+20)+
		'px; top:'+(offset.top-10)+
		'px; background-color:transparent; -webkit-animation-delay:0s;text-shadow:none;width:100px;');
		$('.centerbody').append(startHelp);
		
		// End
		
		var offset=$('.red').offset();
		var startHelp = $('<div class="bounceside" ><font style="background: linear-gradient(#EEEEEE, #DDFF96,#DDFF96);border-radius:6px;border:1px solid dimgray;padding:2px;" >End</font> <font style="background-color:transparent;font-size:30px" >👉 </font></div>');
		//alert(offset);
		startHelp.attr('style','position:absolute;text-shadow:none; left:'+
				   (offset.left-50)+'px; top:'+(offset.top-10)+
		'px; background-color:transparent; -webkit-animation-delay:3s;width:100px ');
		$('.centerbody').append(startHelp);
		
		
		
		var offset=$('[downclueid="13"]:eq(1)').offset();
		
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left)+'px; top:'+(offset.top+10)+
		'px; background-color:transparent;  -webkit-animation-delay:6s;font-size:30px');
		$('.centerbody').append(startHelp);
		setTimeout(function(){$('[downclueid="13"]').addClass('cwd-tile-highlight-help');},8000);
		
		
		
		var offset=$('.wordset:eq(0)').offset();
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left+50)+'px; top:'+(offset.top+5)+
		'px; background-color:transparent;  -webkit-animation-delay:9s;font-size:30px');
		$('.centerbody').append(startHelp);
		$('.wordset:eq(0)').addClass('clickWord').attr('style','-webkit-animation-delay:11s;');
		
		setTimeout(function(){$('.wordset:eq(0)').find('.cwd-tile-letter').click();},12000);
		
		
		
		
		
		var offset=$('[acrossclueid="12"]:eq(2)').offset();
		
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left)+'px; top:'+(offset.top+10)+
		'px; background-color:transparent;  -webkit-animation-delay:13s;font-size:30px');
		$('.centerbody').append(startHelp);
				
		setTimeout(function(){$('[downclueid="13"]').removeClass('cwd-tile-highlight-help');
			$('[acrossclueid="12"]').addClass('cwd-tile-highlight-help');
		},15000);
		
			
		var offset=$('.wordset:eq(1)').offset();
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left+50)+'px; top:'+(offset.top+5)+
		'px; background-color:transparent;  -webkit-animation-delay:16s;font-size:30px');
		$('.centerbody').append(startHelp);
		$('.wordset:eq(1)').addClass('clickWord').attr('style','-webkit-animation-delay:18s;');
		
		setTimeout(function(){$('.wordset:eq(1)').find('.cwd-tile-letter').click();},19000);
		
		
		
		
		
		var offset=$('[downclueid="3"]:eq(2)').offset();
		
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left)+'px; top:'+(offset.top+10)+
		'px; background-color:transparent;  -webkit-animation-delay:20s;font-size:30px');
		$('.centerbody').append(startHelp);
	
		setTimeout(function(){$('[acrossclueid="12"]').removeClass('cwd-tile-highlight-help');
				      $('[downclueid="3"]').addClass('cwd-tile-highlight-help');
		
		},22000);
		
		var offset=$('.wordset:eq(2)').offset();
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left+50)+'px; top:'+(offset.top+5)+
		'px; background-color:transparent;  -webkit-animation-delay:23s;font-size:30px');
		$('.centerbody').append(startHelp);
		$('.wordset:eq(2)').addClass('clickWord').attr('style','-webkit-animation-delay:25s;');
		
		setTimeout(function(){$('.wordset:eq(2)').find('.cwd-tile-letter').click();},26000);
		
		
		
		
		
		setTimeout(function(){showLevel();
		$('[downclueid="3"]').removeClass('cwd-tile-highlight-help');
		},27000);
		
		
		
		
		var offset=$('.arrow:eq(1)').offset();
		var startHelp = $('<div class="bounceside"><font style="background: linear-gradient(#EEEEEE, #DDFF96,#DDFF96);border-radius:6px;border:1px solid dimgray;padding:2px;" >More words</font> <font style="background-color:transparent;font-size:30px" >👉</font></div>');
		startHelp.attr('style','position:absolute;text-shadow:none;left:'+
				   (offset.left-130)+'px; top:'+(offset.top-15)+
				   'px; background-color:transparent; -webkit-animation-delay:29s;width:200px;');
		$('.centerbody').append(startHelp);
		
			
		setTimeout(function(){
			
			$('.wrapperHelpLClick').remove();
			$('.bounceside').remove();	
			helpFlag=true;			
			clearAll();
			//$('#crossword').attr('style','-webkit-filter:none;');
			//$('#words').attr('style','-webkit-filter:none;');
			$('#crossword .cwd-tile-active').attr('style','background-color:lightyellow;');
			moreCount=0;
			popWords(moreWords[moreCount]);
			moreCount++;
		},31000);
		
	}
	
}

/*
function help1(){
	
	if(helpFlag){
		helpFlag=false;
		var offset=$('.green').offset();
		var startHelp = $('<div class="bouncesideright" >👈 Start from here</div>');
		//alert(offset);
		startHelp.attr('style','position:absolute; left:'+(offset.left+3)+'px; top:'+offset.top+'px; background-color:#DDFF96;  border-radius:3px; -webkit-animation-delay:0s;border: solid 1px dimgray; text-shadow:none;padding:2px;');
		$('.centerbody').append(startHelp);
		
		var word = gametype.length==0?'word':'emoji word';
		
		var offset=$('.red').offset();
		var startHelp = $('<div class="bounceside" >End here 👉 </div>');
		//alert(offset);
		startHelp.attr('style','position:absolute;text-shadow:none; left:'+
				   (offset.left-70)+'px; top:'+offset.top+
		'px; background-color:#DDFF96;  border-radius:3px;border: solid 1px dimgray; -webkit-animation-delay:3s; padding:2px;');
		$('.centerbody').append(startHelp);
		
		
		var offset=$('[downclueid="18"]:eq(1)').offset();
		
		setTimeout(function(){$('[downclueid="18"]').addClass('cwd-tile-highlight');},8000);
		
		
		
		var startHelp = $('<div class="wrapperHelpL" >👈 Tap to select one <br/> across or down grid.</div>');
		//alert(offset);
		startHelp.attr('style','-webkit-animation-iteration-count: 1;position:absolute;text-shadow:none; left:'+
				   (offset.left+20)+'px; top:'+(offset.top+10)+
		'px; background-color:#DDFF96;  border-radius:3px;border: solid 1px dimgray; -webkit-animation-delay:5s; padding:2px;');
		$('.centerbody').append(startHelp);
		
		
			
		var offset=$('.d3word').offset();
		var startHelp = $('<div class="wrapperHelpR">Check length and letter then,<br/>tap '+word+' 👇 to fill the selected grid.</div>');
		//alert(offset);
		startHelp.attr('style','position:absolute;opacity:1;text-shadow:none;left:'+
				   (offset.left+20)+'px; top:'+(offset.top-40)+
				   'px; background-color:#DDFF96;  border-radius:3px;border: solid 1px dimgray; -webkit-animation-delay:10s;');
		$('.centerbody').append(startHelp);
		
		var offset=$('.arrow:eq(1)').offset();
		var startHelp = $('<div class="wrapperHelpL"> Use right/left arrows 👉 <br/> to get next set of '+word+'s.  </div>');
		//alert(offset);
		startHelp.attr('style','position:absolute;width:180px;opacity:1;text-shadow:none;left:'+
				   (offset.left-180)+'px; top:'+(offset.top-5)+
				   'px; background-color:#DDFF96;  border-radius:3px;border: solid 1px dimgray; -webkit-animation-delay:15s;');
		$('.centerbody').append(startHelp);
		

		
		var offset=$('[downclueid="2"]:eq(5)').offset();
		var startHelp = $('<div class="wrapperHelpL">👈 Find path from start to end filling '+word+'s to complete level.</div>');
		//alert(offset);
		startHelp.attr('style','position:absolute;opacity:1;text-shadow:none;left:'+
				   (offset.left+20)+'px; top:'+(offset.top-40)+
				   'px; background-color:#DDFF96;  border-radius:3px;border: solid 1px dimgray; -webkit-animation-delay:19s;');
		$('.centerbody').append(startHelp);
		
				
		setTimeout(function(){$('[acrossclueid="17"]').addClass('cwd-tile-highlight');},25000);
		
		setTimeout(function(){$('[downclueid="2"]').addClass('cwd-tile-highlight');},26000);
		
		setTimeout(function(){$('[acrossclueid="10"]').addClass('cwd-tile-highlight');},27000);
		
		setTimeout(function(){$('[downclueid="3"]').addClass('cwd-tile-highlight');},28000);
		
		
			
		setTimeout(function(){
			
			$('.bouncesideright').attr('style','visibility:hidden;display:none');
			
			$('.wrapperHelpLClick').attr('style','visibility:hidden;display:none');
			$('.bounceside').attr('style','visibility:hidden;display:none');
			//$('.bounceside').removeClass('bounceside');
			//$('.arrow').attr('style','visibility:visible;display:');
			$('[downclueid="18"],[acrossclueid="17"],[downclueid="2"],[acrossclueid="10"],[downclueid="3"]').
		removeClass('cwd-tile-highlight');
			helpFlag=true;
			showLevel();
		},31000);
		
	}
	
}*/
