			var nextLevelHTML=[];
			var levelCorrectAns=[];
			var levelMoreWords=[];
			var levelStartCell=[];
			var levelEndCell=[];

			
			var emojiChar = {"A":'A',"B":'B',"C":'C',"D":'D',
							 "E":'E',"F":'F',"G":'G',"H":'H',
							 "I":'I',"J":'J',"K":'K',"L":'L',
							 "M":'M',"N":'N',"O":'O',"P":'P',
							 "Q":'Q',"R":'R',"S":'S',"T":'T',
							 "U":'U',"V":'V',"W":'W',"X":'X',
							 "Y":'Y',"Z":'Z'};
							 
							 
			var correctAns =[["RAGA","RANGE"/*,"APPLEPIE","LITTLEMAN","EXAM"*/],["DIAL","EIGHT"/*,"ALPHABET","ALCOHOLIC","EXAM"*/]];
			
			
			var moreWords =[
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
			
			