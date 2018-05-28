
var twice=0;

var removeOver=false;

var prevData=JSON.parse('{"selections":[],"currLevel":0,"level":0,"levelAnswered":0,"moreCount":0}');


			
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



function popWords(words){
			//alert('popWords');	
			$(".wordset").remove();
			var arr=[];
			for (i = 0; i < selectionTillLast.length; i++) {
				
				arr.push(selectionTillLast[i][2]);
			}
					
			$.each(words, function(i, word) {
				
				var selFlag=arr.indexOf(word)>-1;
					
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
					//character = 
					
					$('<td class="cwd-tile-word" ><div class="cwd-tile-letter d3char '+
					character+
					(selFlag?' strikeout strikeacross':'')+
					'" word='+word+' style="margin-top: 0px;">'+
					(emojiChar[character])+
					'</div></td>').appendTo(tr);
					//tr.find('.cwd-tile-letter').text(emojiChar[character]);
		
			});
						
						
						
							tr.appendTo(tbody);
			});
						
						
		$("#words").find(".cwd-tile-letter").click(function() {
				
				activeSet = $("#crossword").find(".cwd-tile-highlight").find('.cwd-tile-letter');
				
				if(!activeSet) return;
				if(!activeSet.parent().hasClass('cwd-tile-highlight')) return;
				if($(this).hasClass('strikeout')) return;
								
				
				var word = $(this).attr('word');
				var invalid = false;
				$("#words tr").removeClass('clickWord');
				$(this).parent().parent().addClass('clickWord');
				
				
				
				
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
					selectionTillLast.push([clueid,id,word,startId]);
				
					var arr=[];
					for (i = 0; i < selectionTillLast.length; i++) {
						
						arr.push(selectionTillLast[i][2]);
					} 
					setTimeout(function(){
						$('#words [word="'+word+'"]').addClass((arr.indexOf(word)>-1?' strikeout strikeacross':''));
					},1500);
					//storeLevel();
					
					//var stringSelected = ""+arr+","+word;
					//arr.push(word);
					//alert(stringSelected + " : " + correctAns);
					stringCorrect = ""+correctAns[currLevel];
					

					$.each(arr, function(j,selword){
						
						stringCorrect = stringCorrect.replace(selword,"|");
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
					
						
						$(activeSet[j]).addClass(character+' d3char ' );
						$(activeSet[j]).html(emojiChar[character]);
						$(activeSet[j]).addClass('wordSlide');
						//$(activeSet[j]).toggleClass('SR');
						$(activeSet[j]).attr('word',word);
						$(activeSet[j]).attr('style','-webkit-animation-delay:'+(j/2)+'s');
						
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
						
						
						  
							//setTimeout(function(){ 
								level++;
								
								play();
								//alert('Good!');
								
								//storeLevel();
							//}, 1000);
						
						
							
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
							
							
							//setTimeout(function(){ 
								
								++currLevel;
								//setStartEnd(++currLevel); 
								showLevel();
							
							//}, 1000);
							
								
							
							
							
							
						}else{
							if(helpOver)if(selectionTillLast.length==correctAns[currLevel].length){
								console.log('try again');
								$(".wrapperContainer > .wrapperRight").remove();
								$(".wrapperContainer")
								.append($('<div class="wrapperRight" style="-webkit-animation-delay:0s;" >👎</div>'));
								setTimeout(function(){
									$(".wrapperContainer > .wrapperRight").remove();
								
								},4200);
							}
							
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
					
					
					if(activeSet) {
						activeSet.parent().addClass("cwd-tile-highlight");
					}
						
					
					var wordPanel = $('#words').find('[word]');
					wordPanel.removeClass('strikeout strikeacross');
					start.addClass("d3 green");
					start.find('.cwd-tile-letter').html(emojiChar[greenChar]);
					end.addClass("d3 red");
					end.find('.cwd-tile-letter').html(emojiChar[redChar]);
					start.find('.cwd-tile-letter').addClass('bounce');
					end.find('.cwd-tile-letter').addClass('bounce');
					
					if(add){
					var removeElement;
						$.each(selectionTillLast, function(i, activeList) {
							
							var tarr = $('['+activeList[0]+'='+activeList[1]+'] div').slice(activeList[3],activeList[3]+activeList[2].length);
							$.each(activeList[2].split(''), function(j,character){
						
									//alert('['+activeList[0]+'='+activeList[1]+']');
									
									if(activeList[0]!=clueid || activeList[1]!=activeId || activeList[3]!=startId){
										//if(j>=activeList[3]){
											var tile = $(tarr[j]);
																				
											tile.html(emojiChar[character]);
											tile.addClass('d3char ' + character);
											tile.removeClass(' bounce ');
											tile.attr('word',activeList[2]);
											wordPanel.filter('[word="'+activeList[2]+'"]').
											//$(,wordPanel.parent()).
											addClass('strikeout strikeacross');
										//}
										
									}else{
										removeElement=i;
										
									}
									
							});
							
						});
						
						if(activeId!=-1)selectionTillLast.splice(removeElement,1);
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
					
					
					if(randomString.indexOf("["+randomChild+''+random+"]")==-1 )
						{
						moreWords[random][randomChild]=correctWord;
						randomString+='['+randomChild+''+random+']';
						
					}else{
					
							generateNumber(correctWord);
						
					}
			}
			
			function setStartEnd(lvl){
					
					//moreWords=levelMoreWords[level].slice();
					//showLevel();
					
					if(currLevel*(level+1) >=1){
						setTimeout(function(){
							
							//if(currLevel==1) admob.interstitial.show();
							admob.interstitial.show();
							
						},4000);
					}
					
					//selectionTillLast=[];
					//randomString='';
					randomString='';
					var tMoreWords = moreWords+"";
					
					$.each(correctAns[lvl], function(i, correctWord) {
						
						if(tMoreWords.indexOf(','+correctWord+',')==-1){
							generateNumber(correctWord);
						}
						
					
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
				
				//greenChar =startCell[lvl][2];
				//redChar =endCell[lvl][2];
				//alert(endCell[lvl][0]<startCell[lvl][0]);
				greenChar=startCell[lvl][2]==0?correctAnsItem[0][0]:correctAnsItem[0][correctAnsItem[0].length-1];
				
				redChar=endCell[lvl][2]==0?correctAnsItem[correctAnsItem.length-1][0]:correctAnsItem[correctAnsItem.length-1][correctAnsItem[correctAnsItem.length-1].length-1];
				
				/*if (startCell[lvl][0]){
					greenChar=startCell[lvl][1]<=endCell[lvl][1]?correctAnsItem[0][0]:correctAnsItem[0][correctAnsItem[0].length-1];
					redChar = correctAnsItem[correctAnsItem.length-1][0];
					
				}else{
					greenChar=correctAnsItem[0][0];
					redChar = correctAnsItem[correctAnsItem.length-1][correctAnsItem[correctAnsItem.length-1].length-1];
					
					
				}*/
				
				//alert(greenChar);
				//alert(redChar);
				
				
				var gridParent = $("#cwd-grid").parent();
				//gridParent.addClass('hide');
				//gridParent.css('visibility','hidden');
				var gridClone = $("#cwd-grid").clone(true);
				$("#cwd-grid").remove();
				gridClone.css('opacity','0');
				gridClone.css('transition','opacity 1s ease-in-out');
				
  
						//gridClone.appendTo(gridParent);
						start = gridClone.find("[row="+startCell[lvl][0]+"][col="+startCell[lvl][1]+"]");
						end = gridClone.find("[row="+endCell[lvl][0]+"][col="+endCell[lvl][1]+"]");
						start.find('.cwd-tile-letter').addClass('bounce');
						end.find('.cwd-tile-letter').addClass('bounce');
						
						//gridClone.appendTo(gridParent);
						//gridParent.css('opacity', '1');
						//gridClone.css('transition','opacity 2s ease-in-out');
						gridClone.appendTo(gridParent).fadeIn(3000,function(){
								gridClone.css('opacity','1');
								
								
						});
			
						start = $("[row="+startCell[lvl][0]+"][col="+startCell[lvl][1]+"]");
						end = $("[row="+endCell[lvl][0]+"][col="+endCell[lvl][1]+"]");
						start.addClass("d3 green");
						start.find('.cwd-tile-letter').html(emojiChar[greenChar]);
						end.addClass("d3 red");
						end.find('.cwd-tile-letter').html(emojiChar[redChar]);
						
				
				
				storeLevel();
			
			
			}
			var attrType, startId, endId, clickIndex;
			function loadCW() {
				
			showLevel();
			tbody = $('#words');
			
			
			
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
				
				if(removeOver || !helpOver ) return;
				//var prevActiveSetId = id
				
				//var prevActiveSet= activeSet;
				
				//var tempWord = $(this).find('.cwd-tile-letter').attr('word');
				
				
				//if(!tempWord){
				 id = $(this).attr('acrossclueid');
				
				 clueid=id?'acrossclueid':'downclueid';
				
				 id = id?id:$(this).attr('downclueid');
				//}else{
					//$('[word="'+tempWord+'"]').
					
					
				//}
				 
				 
				 tActiveSet = $('*['+clueid+'="'+id+'"]');
				 attrType = clueid.indexOf('down')>-1?'row':'col';
				
				 start, end=0;
				 clickIndex = $(this).attr(attrType);
				//console.log(" clickIndex :" + clickIndex);
				
				
				 //sliceArray(tActiveSet);
				 var seq=true;
				 startId =0;
				 endId = tActiveSet.length;
				 var endSet=false;
				 for(i=0;i<tActiveSet.length;i++){
					// console.log($(tActiveSet[i]).attr(attrType));
				
					 if(i>0){
						 
						 seq = $(tActiveSet[i-1]).attr(attrType)==$(tActiveSet[i]).attr(attrType)-1;
						 //console.log(seq + " : " + i);
						
						if(!seq){
							
							if(clickIndex<=i){
								if(!endSet){
									endId=i;
									endSet=true
								}
							}else{
								startId=i;
							}
						
						}
						
						 
					 }
					 
					 
				 }
				 
				 //if(start==end)start=0;
				 var tActiveSet = $('*['+clueid+'="'+id+'"]');
				 //console.log(start + " : " + end );
				 activeSet =tActiveSet.slice(startId,endId);
				 
				
				 
				//activeSet=activeSet.length>0?activeSet:$('*[downclueid="'+id+'"]');
				
				//activeSetWord=activeSet.find('[word]');
				
				activeSet=activeSet.find('.cwd-tile-letter');
				
				var word=activeSet.attr('word');
				
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
					activeSet.attr('style','-webkit-animation-delay:0s');
					activeSet.addClass('wordSlide remove');
					removeOver=true;
					setTimeout(function(){
					clear(true);
					//activeSetWord.removeAttr('word');
					$('#words [word="'+word+'"]').removeClass('strikeout strikeacross');
					activeSet.removeAttr('word');
					removeOver=false;
					storeLevel();
					},500);
					
					return;
				}
				
				/* prevActiveSet = prevActiveSet?prevActiveSet:activeSet;
				
				prevActiveSet.removeClass('strikeout');
				prevActiveSet.removeClass('strikeacrossclueid');
				prevActiveSet.removeClass('strikedownclueid'); */
				
				$('#crossword .cwd-tile-letter')
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
					showLevelTime=activeSet.length;
					
				}
				
				storeLevel();
				
			});	
			
			
			
			
			
			
			
			
		}

			

function showLevel(){
	console.log(showLevelTime);
	if($('.cwd-tile-letter-inactive').length==0 && ( gametype.indexOf('Fruit')>-1 || gametype.indexOf('Animal')>-1 ) ) {
		
		var div1 = $('<div class="cwd-tile-letter-inactive">🍂</div>');
		var div2 = $('<div class="cwd-tile-letter-inactive">🌱</div>');
		var div3 = $('<div class="cwd-tile-letter-inactive">🍁</div>');
		var div4 = $('<div class="cwd-tile-letter-inactive">🌿</div>');
				
		
		
		div1.attr('style','position:absolute; top:2px; left:2px;-webkit-animation-delay:2s');
		div2.attr('style','position:absolute; top:2px; left:11px;');
		div3.attr('style','position:absolute; top:10px; left:11px; font-size:7px');
		div4.attr('style','position:absolute; top:8px; left:12px; font-size:9px;-webkit-animation-delay:5s');
		
		$('.cwd-tile-inactive').removeClass('d3');
		$('.cwd-tile-inactive').attr('style','position:relative');
		
		$('.cwd-tile-inactive').filter(':even').append(div1).append(div2).append(div3);
		div3 = div3.clone();
		div3.attr('style','position:absolute; top:2px; left:2px; font-size:10px')
		$('.cwd-tile-inactive').filter(':odd').append(div3).append(div4);
		
		
		
	}
	
	
	
	setTimeout(function(){
		
	//},(showLevelTime*500));
		showLevelTime=0;
		getLevel();
		
		clearLevelGrid();
		setStartEnd(currLevel);
		activeId =-1;
		clear(true);
		
		//$(".help").css('opacity','1');
		
	},(showLevelTime*600));
	
	setTimeout(function(){
	$(".wrapperContainer > .wrapper").remove();
	totalLevels = (totalLevels==0?mainTotalLevel:totalLevels);
		
		$(".wrapperContainer")
		.append($('<div class="wrapper" style="-webkit-animation-delay:0s" ><table width=100% ><tr><td></td><td class="score" align="left" >'+
			  (totalLevels)+'</td><td width="85%"></td></tr></table></div>'));
	},(showLevelTime*600)+800);
	
}
		    
function storeLevel(){
	
	
	
	var storage = window.localStorage?window.localStorage:localStorage;
	prevData=JSON.parse('{"selections":[],"currLevel":0,"level":0,"levelAnswered":0,"moreCount":0,"html":0}');

	prevData.currLevel=currLevel;
	prevData.level=level;
	prevData.moreCount=moreCount;
	prevData.levelAnswered=levelAnswered;
	//prevData.html=$('#cwd-grid').html();
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
	//console.log(prevData);
	//storage.removeItem('prevData');
}

function home(){
	if(helpOver){
	clickEffect($('.home'));
	firstLoad=true;
	//$(indexMain).find('.switch-field').attr('style',"visibility:hidden; -webkit-animation-delay:0s ;background-color:transparent; border:0px");
	setTimeout(function(){
		$('.centerbody').html(indexMain);
	},800);
	
	
	//$('.centerbody').find('.switch-field').attr('style',"visibility:hidden; -webkit-animation-delay:0s ;background-color:transparent; border:0px");
	}
}

function clickEffect(item){
	
	$(item).addClass('clickWord');
	setTimeout(function(){
		
		$(item).removeClass('clickWord');
	},500);
}

function clearAll(){
	if(helpOver){
		clickEffect($('.clear'));
		$('#words .strikeout').removeClass('strikeout strikeacrossclueid');	
		clearLevelGrid();
		clear(false);
	}
}

var helpOver=true;


var realSelectionTillLast;



function help(){
	clickEffect($('.help'));
	if(helpOver){
		
		var helpMoreWords=[['MAID','MONEY','FOGY']];
		realSelectionTillLast=JSON.stringify(selectionTillLast);
		var realCurrLevel= currLevel;
		
		var realRedChar=redChar;
		var realGreenChar=greenChar;
		greenChar="D";
		redChar="F";
		helpOver=false;
		currLevel=2;
		$('#words .strikeout').removeClass('strikeout strikeacrossclueid');	
		$('.home, .clear').css('background-color','lightgray');	
		clearLevelGrid();
		clear(false);
		selectionTillLast=[];
		popWords(helpMoreWords[0]);
		
		$('.word-container').css('position','relative').append($('<div class="word-dis" style="position:absolute; left:0px; top:0px; width:100%;height:100% ;background-color:transperant;z-index:10" />'));
		$('#crossword .cwd-tile-active').addClass('modal');
		$('#crossword .cwd-tile-active').removeClass('cwd-tile-highlight cwd-tile-incorrect');
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
		
		
		
		var pathArray =[$('[downclueid="0"]').get().slice(2,6).reverse(),
						$('[acrossclueid="3"]'),
						$('[downclueid="4"]').get().slice(0,4).reverse()
						
					   ];
		var stepCount=5;
		var stepChar = "✍️";
		if(gametype.indexOf('Fruit')>-1) stepChar = '🌱';
		if(gametype.indexOf('Animal')>-1) stepChar='🐾';
		if(gametype.indexOf('Sport')>-1) stepChar='🏃‍';
		$.each(pathArray, function(i, activeSetItem) {
			$(activeSetItem).addClass('cwd-tile-highlight');
			$.each(activeSetItem, function(j, activeTd ) {
				
			
				$(activeTd).find('.cwd-tile-letter:contains(" ")').
				attr('style',' -webkit-animation-delay:'+(stepCount++)+'s;').
				addClass('wordSlide add '+(i==1 && stepChar=='🐾'?' across ':'')).html(stepChar);
			
			});
		
		});
	
		var stepFrame=stepCount-5;
		
		setTimeout(function(){
			$('.cwd-tile-highlight').removeClass('cwd-tile-highlight');
			
			$('.cwd-tile-letter:contains('+stepChar+')').removeClass('wordSlide add').html(' ');
			
		},(stepFrame*1000)+5000);
		
		var offset=$(pathArray[0][2]).offset();
		
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style',
		'-webkit-animation-iteration-count: 1;position:absolute; left:'+  (offset.left)+'px; top:'+(offset.top+10)+
		'px; background-color:transparent;  -webkit-animation-delay:'+(stepFrame+6)+'s;font-size:30px');
		$('.centerbody').append(startHelp);
		setTimeout(function(){$(pathArray[0]).addClass('cwd-tile-highlight');},(stepFrame*1000)+8000);
		
		
		
		var offset=$('.wordset:eq(0)').offset();
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style',
		'-webkit-animation-iteration-count: 1;position:absolute; left:'+(offset.left+50)+'px; top:'+(offset.top+5)+
		'px; background-color:transparent;  -webkit-animation-delay:'+(stepFrame+9)+'s;font-size:30px');
		$('.centerbody').append(startHelp);
		//$('.wordset:eq(0)').attr('style','-webkit-animation-delay:11s;');
		
		setTimeout(function(){$('.wordset:eq(0)').find('.cwd-tile-letter').click();},(stepFrame*1000)+12000);
		
		
		
		
		
		var offset=$(pathArray[1][2]).offset();
		
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style',
		'-webkit-animation-iteration-count: 1;position:absolute; left:'+(offset.left)+'px; top:'+(offset.top+10)+
		'px; background-color:transparent;  -webkit-animation-delay:'+(stepFrame+13)+'s;font-size:30px');
		$('.centerbody').append(startHelp);
				
		setTimeout(function(){$(pathArray[0]).removeClass('cwd-tile-highlight ');
			$(pathArray[1]).addClass('cwd-tile-highlight ');
		},(stepFrame*1000)+15000);
		
			
		var offset=$('.wordset:eq(1)').offset();
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style',
		'-webkit-animation-iteration-count: 1;position:absolute; left:'+
		(offset.left+50)+'px; top:'+(offset.top+5)+
		'px; background-color:transparent;  -webkit-animation-delay:'+(stepFrame+16)+'s;font-size:30px');
		$('.centerbody').append(startHelp);
		//$('.wordset:eq(1)').attr('style','-webkit-animation-delay:18s;');
		
		setTimeout(function(){$('.wordset:eq(1)').find('.cwd-tile-letter').click();},(stepFrame*1000)+19000);
		
		
		
		
		
		var offset=$(pathArray[2][2]).offset();
		
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style',
		'-webkit-animation-iteration-count: 1;position:absolute; left:'+
		(offset.left)+'px; top:'+(offset.top+10)+
		'px; background-color:transparent;  -webkit-animation-delay:'+(stepFrame+20)+'s;font-size:30px');
		$('.centerbody').append(startHelp);
	
		setTimeout(function(){$(pathArray[1]).removeClass('cwd-tile-highlight ');
				      $(pathArray[2]).addClass('cwd-tile-highlight ');
		
		},(stepFrame*1000)+22000);
		
		var offset=$('.wordset:eq(2)').offset();
		var startHelp = $('<div class="wrapperHelpLClick" >👆</div>');
		//alert(offset);
		startHelp.attr('style',
		'-webkit-animation-iteration-count: 1;position:absolute; left:'+
		(offset.left+50)+'px; top:'+(offset.top+5)+
		'px; background-color:transparent;  -webkit-animation-delay:'+(stepFrame+23)+'s;font-size:30px');
		$('.centerbody').append(startHelp);
		//$('.wordset:eq(2)').attr('style','-webkit-animation-delay:25s;');
		
		setTimeout(function(){$('.wordset:eq(2)').find('.cwd-tile-letter').click();},(stepFrame*1000)+26000);
		
		
		
		
		
		setTimeout(function(){
			//showLevel();
			
			$(".wrapperContainer > .wrapper").remove();
			$(".wrapperContainer")
			.append($('<div class="wrapper" style="-webkit-animation-delay:1s" ><table width=100% ><tr><td></td><td class="score" align="left" >'+(totalLevels)+'</td><td width="85%"></td></tr></table></div>'));
	
	
			$(pathArray[2]).removeClass('cwd-tile-highlight ');
		
		},(stepFrame*1000)+27000);
		
		
		
		
		var offset=$('.arrow:eq(1)').offset();
		var startHelp = $('<div class="bounceside"><font style="background: linear-gradient(#EEEEEE, #DDFF96,#DDFF96);border-radius:6px;border:1px solid dimgray;padding:2px;" >More words</font> <font style="background-color:transparent;font-size:30px" >👉</font></div>');
		startHelp.attr('style','position:absolute;text-shadow:none;left:'+
				   (offset.left-130)+'px; top:'+(offset.top-15)+
				   'px; background-color:transparent; -webkit-animation-delay:'+(stepFrame+32)+'s;width:200px;');
		$('.centerbody').append(startHelp);
		
			
		setTimeout(function(){
			
			$('.wrapperHelpLClick').remove();
			$('.bounceside').remove();	
			activeId=-1;
			selectionTillLast=JSON.parse(realSelectionTillLast);
			currLevel= realCurrLevel;	
			redChar  =realRedChar;
			greenChar=realGreenChar;			
			clear(true);
			
			helpOver=true;		
			//$('#crossword').attr('style','-webkit-filter:none;');
			//$('#words').attr('style','-webkit-filter:none;');
			$('#crossword .cwd-tile-active').removeClass('modal');
			moreCount=0;
			popWords(moreWords[moreCount]);
			moreCount++;
			$('.home, .clear').css('background-color','#A5DC86');	
			$('.word-dis').remove();
		},(stepFrame*1000)+35000);
		
	}
	
}


