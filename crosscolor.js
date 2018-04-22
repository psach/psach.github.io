
		
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
					activeSet.parent().removeClass('cwd-tile-highlight');
					activeSet.parent().addClass('cwd-tile-incorrect');
				
				}else{
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
					
					if(levelAnswered==correctAns.length-1 && answered ){
						//answered=false;
						moreCount=1;
						insertCorrect=0;
						levelAnswered=0;
						currLevel=0;
						stringCorrect ="";
						selectionTillLast=[];
						greenChar, redChar;
						start,end;
						activeId;
						randomString='';
						//window.location.replace(nextLevel);
						//$('head').load('https://drive.google.com/uc?export=download&id=1HTs_G_XQciOrSrUbMJKAtCmhdBTImiy-');
						play();
						
						 // this will load a full screen ad on startup
						  AdMob.prepareInterstitial({
							adId: admobid.interstitial,
							isTesting: true, // TODO: remove this line when release
							autoShow: true
						  });
						  
						  
					}else{
					
						if(answered){
							levelAnswered++;
							setStartEnd(++currLevel);
							
						}
					}
					
				};
				
			});	
			}
			
			function clear(){
					var clearGrid =$("#crossword").find(".cwd-tile-active");
					clearGrid.removeAttr('class');
					clearGrid.addClass('cwd-tile cwd-tile-active');
					var gridChild=clearGrid.find('.cwd-tile-letter');
					gridChild.html(' ');
					gridChild.removeAttr('class');
					gridChild.addClass('cwd-tile-letter');
					
					start = $("[row="+startCell[currLevel][0]+"][col="+startCell[currLevel][1]+"]");
					end = $("[row="+endCell[currLevel][0]+"][col="+endCell[currLevel][1]+"]");
				
				
					start.addClass("green");
					start.find('.cwd-tile-letter').html(greenChar);
					end.addClass("red");
					end.find('.cwd-tile-letter').html(redChar);
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
			
			function setStartEnd(level){
				
				
  
					selectionTillLast=[];
					randomString='';
				
					$.each(correctAns[level], function(i, correctWord) {
					
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
					
				
				//alert(level);
				
				var correctAnsItem=correctAns[level];
				currLevel=level;
				
				
				if (endCell[level][0]<startCell[level][0]){
					greenChar=correctAnsItem[0][correctAnsItem[0].length-1];
					redChar = correctAnsItem[correctAnsItem.length-1][0];
					
				}else{
					greenChar=correctAnsItem[0][0];
					redChar = correctAnsItem[correctAnsItem.length-1][correctAnsItem[correctAnsItem.length-1].length-1];
					
					
				}
				start = $("[row="+startCell[level][0]+"][col="+startCell[level][1]+"]");
				start.addClass("green");
				
				start.find('.cwd-tile-letter').html(greenChar);
				
				end = $("[row="+endCell[level][0]+"][col="+endCell[level][1]+"]");
				end.addClass("red");
				end.find('.cwd-tile-letter').html(redChar);
				
				var gridParent = $("#cwd-grid").parent();
				var gridClone = $("#cwd-grid").clone(true);
				$("#cwd-grid").remove();
				
				gridClone.appendTo(gridParent).fadeOut('slow').fadeIn('slow');
				
	
			
			}
			
			function loadCW() {
				
				// TODO: replace the following ad units with your own
				if( /(android)/i.test(navigator.userAgent) ) {
				  admobid = { // for Android
					banner: 'ca-app-pub-3940256099942544/6300978111',
					interstitial: 'ca-app-pub-3940256099942544/1033173712',
					rewardvideo: 'ca-app-pub-3940256099942544/5224354917',
				  };
				} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
				  admobid = { // for iOS
					banner: 'ca-app-pub-3940256099942544/4480807092',
					interstitial: 'ca-app-pub-3940256099942544/4411468910',
					rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
				  };
				} else {
				  admobid = { // for Windows Phone
					banner: 'ca-app-pub-6869992474017983/8878394753',
					interstitial: 'ca-app-pub-6869992474017983/1355127956',
					rewardvideo: '',
				  };
				}

				
				
				if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
					document.addEventListener('deviceready', initApp, false);
				} else {
					initApp();
				}



			//$('#ccwordjs').load('https://drive.google.com/uc?export=download&id=1rezomHcxVkhzqCIbAP7UjH2UgkNAlXK1');
			//$.mobile.loading().hide();
			//$('head').append('<script src="https://drive.google.com/uc?export=download&id=1rezomHcxVkhzqCIbAP7UjH2UgkNAlXK1" />');
			tbody = $('#words');
			
			setStartEnd(currLevel);
			popWords(moreWords[0]);
			
			
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
				if(activeSet && activeSet.text().trim().length==activeSet.length)clear();
				
			
				
							
				
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
			
			
		
			$("#crossword").find(".cwd-tile-active").click(function() {
			
				$(".cwd-tile").removeClass("cwd-tile-highlight");	
				$(".cwd-tile").removeClass("cwd-tile-incorrect");	
				
				
				
				
				$(this).addClass("cwd-tile-highlight");
				
				
				
				 id = $(this).attr('acrossclueid');
				
				 clueid=id?'acrossclueid':'downclueid';
				
				id = id?id:$(this).attr('downclueid');
				
				
				
				
				activeSet= $('*['+clueid+'="'+id+'"]');
				
				//activeSet=activeSet.length>0?activeSet:$('*[downclueid="'+id+'"]');
				activeSet.addClass("cwd-tile-highlight");
				
				activeSet=activeSet.find('.cwd-tile-letter');
				activeId=id;
				
				
				
				
				
			});	
			
			
			
			
			
			
			
			
		}
		




function initApp() {
  if (! AdMob ) { alert( 'admob plugin not ready' ); return; }

  // this will create a banner on startup
  AdMob.createBanner( {
    adId: admobid.banner,
    position: AdMob.AD_POSITION.TOP_CENTER,
    isTesting: true, // TODO: remove this line when release
    overlap: false,
    offsetTopBar: false,
    bgColor: 'black'
  } );

 
}

			
        
		   