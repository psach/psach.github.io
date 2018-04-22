var nextLevelHTML;
			var tbody;
			var words = ["ONE","TWO","THREE","FOUR","FIVE","EIGHTY","REID","MUGGER","MOGTTGER","FETU","EAT"];
			
			var correctAns =[["TIME","ACTIVITY","COTTAGE","ONE","TAILORED","JOKERS","NATURE"],["GOOGLE","LOVE","EAGLE","STATUE","ATTITUDE","EIGHT","FIREWOOD","YELLOW","FAMILY"]];
				
			var moreWords =[
			["SIN","TWO","THREE"],["FOUR","HIKE","EIGHTY"],["REID","MUGGER","MOGTTGER"],["FETU","EAT","HUGE"],
			["RANGE","LIME","THRICE"],["BIGWORD","RAMPART","LIKE"],["GOAL","CRICKETR","LITTLE"],["MYCOUPONS","DANCE","GAME"],
			["RIGHT","KITE","JOCKEY"],["DONKEY","TALKATIVE","COORG"],["JOKER","JIKES","TELEVISION"],["SINGER","JUMPER","RISK"],
			["KANNADA","HINDI","MARATHI"],["BANGLA","ENGLISH","TOWN"],["GOWN","DOWN","CLOWN"],["BITBIG","SMALL","JUST"]
			];
			var activeSet;
	
			var id, clueid;
			
			//var startCell = ["[row=14][col=2]","[row=0][col=10]","[row=14][col=14]"];
			var startCell = [[12,2],[12,10]];
			
			//var endCell=["[row=0][col=10]","[row=14][col=2]","[row=0][col=0]"];
			var endCell=[[0,10],[0,0]];
			
			var moreCount=1;
			var insertCorrect=0;
			var levelAnswered=0;
			var currLevel=0;
			var stringCorrect ="";
			var selectionTillLast=[];
			var greenChar, redChar;
			var start,end;
			var activeId;
			var randomString='';
			
			var xmlhttp = new XMLHttpRequest();

			// Callback function when XMLHttpRequest is ready
			xmlhttp.onreadystatechange=function(){
				if (xmlhttp.readyState === 4){
					if (xmlhttp.status === 200) {
						nextLevelHTML=xmlhttp.responseText;
						//alert(nextLevelHTML);
					}
				}
			};
			
			xmlhttp.open("GET", 'https://psach.github.io/remote-level2.html' , true);
			xmlhttp.send();
			