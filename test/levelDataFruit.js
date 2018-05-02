			var nextLevelHTML=[];
			var levelCorrectAns=[];
			var levelMoreWords=[];
			var levelStartCell=[];
			var levelEndCell=[];
			
			var emojiChar = {"A":'\ud83c\udf4a',"B":'\ud83c\udf4c',"C":'\ud83c\udf52',"D":'\ud83c\udf46',
							 "E":'\ud83e\udf55',"F":'\ud83c\udf6c',"G":'\ud83c\udf47',"H":'\ud83c\udf69',
							 "I":'\ud83e\udd55',"J":'\ud83c\udf66',"K":'\ud83c\udf4f',"L":'\ud83c\udf4b',
							 "M":'\ud83e\udd54',"N":'\ud83c\udf3d',"O":'\ud83c\udf51',"P":'\ud83c\udf4d',
							 "Q":'\ud83e\udf50',"R":'\ud83c\udf4e',"S":'\ud83c\udf53',"T":'\ud83c\udf45',
							 "U":'\ud83e\udd5d',"V":'\ud83c\udf6b',"W":'\ud83c\udf70',"X":'\ud83c\udf5a',
							 "Y":'\ud83c\udf60',"Z":'\ud83c\udf61'};

			var correctAns =[["RAGA","RANGE"/*,"APPLEPIE","LITTLEMAN","EXAM"*/],["DIAL","EIGHT"/*,"ALPHABET","ALCOHOLIC","EXAM"*/]];
			
			
			var moreWords =[
			["ABCDEFGH","IJKLMNOPQ","RSTUVWXYZ"],
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
			
			
			correctAns =[["TIME"/*,"ACTIVITY","COTTAGE","ONE","TAILORED","JOKERS","NATURE"*/],
			["GOOGLE"/*,"LOVE","EAGLE","STATUE","ATTITUDE","EIGHT","FIREWOOD","YELLOW","FAMILY"*/]];
				
			 moreWords =[
			["SIN","TAX","SOFT"],["FOUR","HIKE","EIGHTY"],["CARD","MISTY","RIDER"],["YOUNG","EAT","HUGE"],
			["RANGE","LIME","THRICE"],["BABY","PART","LIKE"],["GOAL","GHOST","LITTLE"],["GOLDEN","SUN","AUDIO"],
			["RIGHT","KITE","LOCK"],["DONKEY","ROCK","GRASS"],["BOXES","CRAZY","VIEW"],["JEWEL","JUMPER","RISK"],
			["KANNADA","HINDI","MARATHI"],["CREAM","ENGLISH","TOWN"],["GOWN","STOVE","CHAIN"],["MINT","TALL","MUST"]
			];
			
			startCell = [[12,2],[12,10]];
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
									//$('.play').show();
								}
							}
						}
					};
					
					xmlhttp.open("GET", baseurl+'remote-level'+(i+1)+'.html?'+Math.random() , false);
					xmlhttp.send();
				}
			});
