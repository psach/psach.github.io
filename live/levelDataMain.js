			var nextLevelHTML=[];
			var levelCorrectAns=[];
			var levelMoreWords=[];
			var levelStartCell=[];
			var levelEndCell=[];
			

			var tcorrectAns =[
				["PAPER","USER","SEA","CARTOON"],
				["YOU","QUIZ","PIZZA","ZOO","COCONUT"],
				["ROAD","RELAX","FLEX"],
				["CARAMEL","TEA","STAR","WATER","MINT"]
				];
			
			
			var tmoreWords =[
			
			["ONE","TWO","THREE"],["FOUR","FIVE","EIGHTY"],["RAID","RAJU","MOTOR"],["FINE","EAT","HUGE"],
			["ULTRA","NIKE","THRICE"],["STRONG","ALERT","LIKE"],["GOAL","CRICKET","SOMEONE"],["COUPON","DANCE","TIME"],
			["MIGHT","KITE","JOCKEY"],["MOCKEY","TALK","TABLE"],["JOKER","JACK","MOBILE"],["SINGER","JUMPER","RISK"],
			["TAXI","HINDI","MARATHI"],["AXE","ENGLISH","APPLE"],["NIGHT","DOWN","CLOWN"],["ZEBRA","SMALL","OBJECT"]
			
			];
			
			var tstartCell = [[3,0,0],[1,0,0],[6,0,1],[6,6,1]];
			var tendCell=[[6,6,1],[5,6,1],[0,4,0],[0,2,0]];
		
			
			levelMoreWords.push(tmoreWords);
			levelCorrectAns.push(tcorrectAns);
			levelStartCell.push(tstartCell);
			levelEndCell.push(tendCell);
			
			
			var tcorrectAns =[
				["NOBLE","BIG","GOLD","DROP","OLD"]
				];
			
			
			var tmoreWords =[
			
			["ONE","TWO","THREE"],["FOUR","FIVE","EIGHTY"],["RAID","RAJU","MOTOR"],["FINE","EAT","HUGE"],
			["ULTRA","NIKE","THRICE"],["STRONG","ALERT","LIKE"],["GOAL","CRICKET","SOMEONE"],["COUPON","DANCE","TIME"],
			["MIGHT","KITE","JOCKEY"],["MOCKEY","TALK","TABLE"],["JOKER","JACK","MOBILE"],["SINGER","JUMPER","RISK"],
			["TAXI","HINDI","MARATHI"],["AXE","ENGLISH","APPLE"],["NIGHT","DOWN","CLOWN"],["ZEBRA","SMALL","OBJECT"]
			
			];
			
			var tstartCell = [[2,0,0]];
			var tendCell=[[6,7,1]];
		
			
			levelMoreWords.push(tmoreWords);
			levelCorrectAns.push(tcorrectAns);
			levelStartCell.push(tstartCell);
			levelEndCell.push(tendCell);
			
			
			var tcorrectAns =[
				["QUEEN","BEE","BABIES","SUPERB"]
				];
			
			
			var tmoreWords =[
			
			["ONE","TWO","THREE"],["FOUR","FIVE","EIGHTY"],["RAID","RAJU","MOTOR"],["FINE","EAT","HUGE"],
			["ULTRA","NIKE","THRICE"],["STRONG","ALERT","LIKE"],["GOAL","CRICKET","SOMEONE"],["COUPON","DANCE","TIME"],
			["MIGHT","KITE","JOCKEY"],["MOCKEY","TALK","TABLE"],["JOKER","JACK","MOBILE"],["SINGER","JUMPER","RISK"],
			["TAXI","HINDI","MARATHI"],["AXE","ENGLISH","APPLE"],["NIGHT","DOWN","CLOWN"],["ZEBRA","SMALL","OBJECT"]
			
			];
			
			var tstartCell = [[7,0,0]];
			var tendCell=[[0,0,0]];
		
			
			levelMoreWords.push(tmoreWords);
			levelCorrectAns.push(tcorrectAns);
			levelStartCell.push(tstartCell);
			levelEndCell.push(tendCell);
			
							 
			var tcorrectAns =[
			["RAM","RANGE","APPLEPIE","LITTLEMAN","EXAM"],
			["DIAL","EAT","ALPHABET","ALCOHOLIC","EIGHT"]
			];
			
			
			var tmoreWords =[
			
			["ONE","TWO","THREE"],["FOUR","FIVE","EIGHTY"],["RAID","RAJU","MOTOR"],["FINE","GOAT","HUGE"],
			["ULTRA","NIKE","THRICE"],["STRONG","ALERT","LIKE"],["GOAL","CRICKET","SOMEONE"],["COUPON","DANCE","TIME"],
			["MIGHT","KITE","JOCKEY"],["MOCKEY","TALK","TABLE"],["JOKER","JACK","MOBILE"],["SINGER","JUMPER","RISK"],
			["TAXI","HINDI","MARATHI"],["AXE","ENGLISH","APPLE"],["NIGHT","DOWN","CLOWN"],["ZEBRA","SMALL","OBJECT"]
			
			];
			
			var tstartCell = [[9,0,1],[0,6,0]];
			var tendCell=[[0,6,0],[9,0,1]];
			
			levelMoreWords.push(tmoreWords);
			levelCorrectAns.push(tcorrectAns);
			levelStartCell.push(tstartCell);
			levelEndCell.push(tendCell);
			
			
			/*correctAns =[["TIME","ACTIVITY","COTTAGE","ONE","TAILORED","JOKERS","NATURE"],
			["GOOGLE","LOVE","EAGLE","STATUE","ATTITUDE","EIGHT","FIREWOOD","YELLOW","FAMILY"]];*/
			tcorrectAns =[
			["MIND","CREAM","ONE","GOOGLE","TUNNEL","NURSE","ELEPHANT","CHAT","JACKET"],
			["TIME","TEACH","HOME","MORE","DIARY","ICE","BALANCED","MEDAL","RHYMES","GRASSY","JOKING"]
			];
				
			tmoreWords =[
			["SIN","TAX","SOFT"],["FOUR","HIKE","EIGHTY"],["CARD","MISTY","RIDER"],["YOUNG","EAT","HUGE"],
			["RANGE","LIME","THRICE"],["BABY","PART","LIKE"],["GOAL","GHOST","LITTLE"],["GOLDEN","SUN","AUDIO"],
			["RIGHT","KITE","LOCK"],["DONKEY","ROCK","GRASS"],["BOXES","CRAZY","VIEW"],["JEWEL","JUMPER","RISK"],
			["KANNADA","HINDI","MARATHI"],["MAID","ENGLISH","TOWN"],["GOWN","STOVE","CHAIN"],["MINT","TALL","MUST"]
			];
			
			tstartCell = [[10,4,1],[10,0,1]];
     		tendCell=[[0,10,0],[0,0,0]];
			
			
			levelMoreWords.push(tmoreWords);
			levelCorrectAns.push(tcorrectAns);
			levelStartCell.push(tstartCell);
			levelEndCell.push(tendCell);
			
			var levels=levelMoreWords.length;
			var totalLevels = 0;
			var mainTotalLevel=0;
			
			
			$(function(){
				for(i=0; i<levels;i++){
					var xmlhttp = new XMLHttpRequest();

					// Callback function when XMLHttpRequest is ready
					xmlhttp.onreadystatechange=function(){
						if (xmlhttp.readyState === 4){
							if (xmlhttp.status === 200) {
								nextLevelHTML[i]=xmlhttp.responseText;
								
								mainTotalLevel+=levelCorrectAns[i].length;
								//alert(nextLevelHTML);
								if(i==levels-1) {
									document.querySelectorAll('.play')[0].style.visibility='visible';
									document.querySelectorAll('.restart')[0].style.visibility='visible';
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
