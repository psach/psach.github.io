			var nextLevelHTML=[];
			var levelCorrectAns=[];
			var levelMoreWords=[];
			var levelStartCell=[];
			var levelEndCell=[];

			
							 
			var correctAns =[["RAGA","RANGE","APPLEPIE","LITTLEMAN","EXAM"],["DIAL","EIGHT","ALPHABET","ALCOHOLIC","EXAM"]];
			
			
			var moreWords =[
			/*["ABCDEFGH","IJKLMNOPQ","RSTUVWXYZ"],*/
			["ONE","TWO","THREE"],["FOUR","FIVE","EIGHTY"],["RAID","RAJU","MOTOR"],["FINE","EAT","HUGE"],
			["ULTRA","NIKE","THRICE"],["STRONG","ALERT","LIKE"],["GOAL","CRICKET","SOMEONE"],["COUPON","DANCE","TIME"],
			["MIGHT","KITE","JOCKEY"],["MOCKEY","TALK","TABLE"],["JOKER","JAVA","MOBILE"],["SINGER","JUMPER","RISK"],
			["TAXI","HINDI","MARATHI"],["AXE","ENGLISH","APPLE"],["NIGHT","DOWN","CLOWN"],["ZEBRA","SMALL","OBJECT"]
			
			];
			
			var startCell = [[10,0],[0,6]];
			var endCell=[[0,6],[10,0]];
			
			levelMoreWords.push(moreWords);
			levelCorrectAns.push(correctAns);
			levelStartCell.push(startCell);
			levelEndCell.push(endCell);
			
			
			/*correctAns =[["TIME","ACTIVITY","COTTAGE","ONE","TAILORED","JOKERS","NATURE"],
			["GOOGLE","LOVE","EAGLE","STATUE","ATTITUDE","EIGHT","FIREWOOD","YELLOW","FAMILY"]];*/
			correctAns =[
			["MIND","CREAM","ONE","GOOGLE","TUNNEL","NURSE","ELEPHANT","CHAT","JACKET"],["TIME","TEACH","HOME","MORE","DIARY","ICE","BALANCED","MEDAL","RHYMES","GRASSY","JOKING"]];
				
			 moreWords =[
			["SIN","TAX","SOFT"],["FOUR","HIKE","EIGHTY"],["CARD","MISTY","RIDER"],["YOUNG","EAT","HUGE"],
			["RANGE","LIME","THRICE"],["BABY","PART","LIKE"],["GOAL","GHOST","LITTLE"],["GOLDEN","SUN","AUDIO"],
			["RIGHT","KITE","LOCK"],["DONKEY","ROCK","GRASS"],["BOXES","CRAZY","VIEW"],["JEWEL","JUMPER","RISK"],
			["KANNADA","HINDI","MARATHI"],["MAID","ENGLISH","TOWN"],["GOWN","STOVE","CHAIN"],["MINT","TALL","MUST"]
			];
			
			startCell = [[10,4],[10,0]];
     		endCell=[[0,10],[0,0]];
			
			
			levelMoreWords.push(moreWords);
			levelCorrectAns.push(correctAns);
			levelStartCell.push(startCell);
			levelEndCell.push(endCell);
			
			var levels=levelMoreWords.length;
			
			$(function(){
				for(i=0; i<levels;i++){
					var xmlhttp = new XMLHttpRequest();

					// Callback function when XMLHttpRequest is ready
					xmlhttp.onreadystatechange=function(){
						if (xmlhttp.readyState === 4){
							if (xmlhttp.status === 200) {
								nextLevelHTML[i]=xmlhttp.responseText;
								//alert(nextLevelHTML);
								if(i==levels-1) {
									document.querySelectorAll('.play')[0].style.visibility='visible';
									//document.querySelectorAll('.play')[1].style.visibility='visible';
									//$('.play').show();
								}
							}
						}
					};
					
					xmlhttp.open("GET", baseurl+'remote-level'+(i+1)+'.html?'+Math.random() , false);
					xmlhttp.send();
				}
			});