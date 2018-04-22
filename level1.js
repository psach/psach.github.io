		var tbody;
			var words = ["ONE","TWO","THREE","FOUR","FIVE","EIGHTY","REID","MUGGER","MOGTTGER","FETU","EAT"];
			var correctAns =[["RIMA","RANGE","APPLEPIE","LITTLEMAN","EXAM"],["DIAL","EIGHT","ALPHABET","ALCOHOLIC","EXAM"]];
			
			
			var moreWords =[
			["ONE","TWO","THREE"],["FOUR","FIVE","EIGHTY"],["REID","MUGGER","MOGTTGER"],["FETU","EAT","HUGE"],
			["ULTRA","NIKE","THRICE"],["BIGLETTER","RAMPART","LIKE"],["GOAL","CRICKETR","SOMEONE"],["MYCOUPONS","DANCE","TIME"],
			["MIGHT","KITE","JOCKEY"],["MOCKEY","TALKATIVE","TABLE"],["JOKER","JIKES","TELEVISION"],["SINGER","JUMPER","RISK"],
			["TAXI","HINDI","MARATHI"],["BANGLA","ENGLISH","APPLE"],["NIGHTY","DOWN","CLOWN"],["BITBIG","SMALL","OSSBSSAO"]
			
			];
			var activeSet;
	
			var id, clueid;
			
			//var startCell = ["[row=10][col=0]","[row=0][col=6]"];
			//var endCell=["[row=0][col=6]","[row=10][col=0]"];
			var startCell = [[10,0],[0,6]];
			var endCell=[[0,6],[10,0]];
			
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

			var nextLevel = $('<html>');
			