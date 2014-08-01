$(function() {
	var OPTION_NEW_NODE = 1;
	var OPTION_RUN = 2;
	var ANT_ID = 0;
	var NODE_ID = 0;
	var ALPHA = 1;
	var BETA = 1;
	var RHO = 0.1;

	var mouseX = 0;
	var mouseY = 0;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var nodes = new Array();
	var ants = new Array();
	var selectedOption = OPTION_NEW_NODE;
	var tau = null;
	var dist = null;
	var antSpeed = 10;
	var animationSpeed = 21;
	var bestSolution = null;
	var showPheromone = true;
	var showBestSolution = false;

	//Load the Imagens

	var imgAnt = new Image();	
			
	imgAnt.onload = function(){
		console.log("The imagens has been loaded with success!");
	}

	imgAnt.src = 'img/ant.png';

	function Node(id,mouseX,mouseY){
		this.id = id;
		this.x = mouseX;
		this.y = mouseY;
		this.radius = 10;
	}

	function Ant(i,x,y){
		this.id = i;
		this.x = x;
		this.y = y;
		this.initialNode = i;
		this.currentNode = i;
		this.nextNode = -1;
		this.angle = 0;
		this.callback = null;
		this.start = false;
		this.nodesToVisit;
		this.visitedNodes;
		this.path = new Array(nodes.length);

		this.init = function(){
			this.nodesToVisit = new Array();
			this.visitedNodes = new Array();
			this.visitedNodes.push(this.initialNode);

			for(var i=0;i<nodes.length;i++){
	  			if(i != this.initialNode){
	  				this.nodesToVisit.push(i);
	  			}
	  		}
	  		for(var i=0;i<nodes.length;i++){
	  			this.path[i] = new Array(nodes.length);
	  			for(var j=0;j<nodes.length;j++){
	  				this.path[i][j] = 0;
	  			}
	  		}	  		
		}
		
		this.move = function(){
			if(this.start === false){
				return;
			}

			if(nodes.length == 1){
				if(this.currentNode == 0){
					this.nextNode = 1;
				}else{
					this.nextNode = 0;
				}
			}else{
				if(this.nextNode == -1){
					this.nextNode = this.doExploration(this.currentNode);
				}
			}

			var node = nodes[this.nextNode];

			//Define the angle
			
			var x = (node.x-this.x);
			var y = (node.y-this.y);
			var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));

			if(x > 0 && y < 0){	//Primeiro Quadrante
				this.angle = 90 - toDegrees(Math.asin(Math.abs(y/z)))
			}else if(x > 0 && y > 0){	//Segundo Quadrante
				this.angle = 180 - toDegrees(Math.acos(Math.abs(y/z)));
			}else if(x < 0 && y > 0){	//Terceiro Quadrante
				this.angle = 180 + toDegrees(Math.acos(Math.abs(y/z)))
			}else if(x < 0 && y < 0){	//Quarto Quadrante
				this.angle = toDegrees(Math.asin(x/z));
			}

			//Move the ant

			var cos0 = y/z;
			var sen0 = x/z;
			
			this.y += antSpeed*cos0;
			this.x += antSpeed*sen0;

			//Verify if the ant is into the Node
			if(Math.pow((node.x - this.x),2) + Math.pow((node.y - this.y),2) <= Math.pow(node.radius,2)){
				//Mark arc as visited
				this.path[this.currentNode][this.nextNode] = 1; 
				this.path[this.nextNode][this.currentNode] = 1;

				//Mark node as visited;
				this.visitedNodes.push(this.nextNode)

				//Define new position
				this.currentNode = this.nextNode;
				this.nextNode = -1;	
				this.x = node.x;			
				this.y = node.y;
				if(this.nodesToVisit.length == 0){
					if(this.currentNode !== this.initialNode){
						this.nextNode = this.initialNode;
					}else{
						this.start = false;
						if(this.callback !== null){
							this.callback();
						}						
					}
				}
			}
		}

		this.doExploration = function(i){
			var nextNode = -1;
			var sum = 0.0;

			// Update the sum
			this.nodesToVisit.forEach(function(j) {
				if (tau[i][j] == 0.0) {
					throw "tau == 0.0";
				}

				var tij = Math.pow(tau[i][j], ALPHA);
				var nij = Math.pow(getNij(i,j), BETA);
				sum += tij * nij;				
			});

			if (sum == 0.0) {
				throw "sum == 0.0";
			}

			var probability = new Array(nodes.length);
			
			for(var j=0;j<probability.length;j++){
				probability[j] = 0.0;
			}

			var sumProbability = 0.0;

			this.nodesToVisit.forEach(function(j) {
				var tij = Math.pow(tau[i][j], ALPHA);
				var nij = Math.pow(getNij(i,j), BETA);
				probability[j] = (tij * nij) / sum;
				sumProbability += probability[j];
			});

			// Select the next node by probability
			nextNode = rouletteWheel(probability, sumProbability);

			if (nextNode == -1) {
				throw "nextNode == -1";
			}

			// Find and remove node from an array
			var i = this.nodesToVisit.indexOf(nextNode);
			
			if(i != -1) {
				this.nodesToVisit.splice(i, 1);
			}else{
				throw "indexOf not found";
			}

			return nextNode;
		}
	}

	function rouletteWheel(probability, sumProbability) {
		var j = 0;
		var p = probability[j];
		//var r = PseudoRandom.randDouble(0.0, sumProbability);		
		var r = 0.0 + (Math.random() * (sumProbability - 0.0)) 
		//var r = Math.floor(Math.random() * (sumProbability)) + 0;

		while (p < r) {
			j = j + 1;
			p = p + probability[j];
		}

		return j;
	}

	function getNij(i,j){
		return 1.0 / dist[i][j];
	}

	function euclideanDistance(x1,y1, x2, y2){
	    var xDistance = Math.abs(x1 - x2);
	    var yDistance = Math.abs(y1 - y2);

		return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
	}

	function toDegrees(radians){
		return radians * (180/Math.PI);
	}

	function resizeCanvas() {
		canvas.width = $(".container").width();		
	}	

	function drawCircle(x,y,radius,label){
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fill();	
		ctx.fillStyle = "white";
		ctx.font="10px Arial";
		ctx.fillText(label,x-3,y+2);
	}

	function drawBestSolution(ant){
		if(ant == null){
			return;
		}

			ctx.beginPath();
			
		for (var h = 1; h < ant.visitedNodes.length; h++) {
			var i = ant.visitedNodes[h - 1];
			var j = ant.visitedNodes[h];
			
			drawLine(nodes[i].x-4,nodes[i].y-4,nodes[j].x-4,nodes[j].y-4,2,"red");
		}
	}

	function drawLine(x0,y0,x1,y1,lineWidth,color){
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);			
		ctx.stroke();
	}

	function draw(){		
		ctx.clearRect (0 , 0 , canvas.width,canvas.height );		
		if(showBestSolution === true){
			drawBestSolution(bestSolution);
		}
		drawNodes();
		drawAnts();			
	}

	function drawAnts(){
		ants.forEach(function(ant) {
			ctx.save();
			ctx.translate(ant.x, ant.y);
			ctx.rotate(ant.angle*(Math.PI/180));
			ctx.translate(-ant.x, -ant.y);
			ctx.drawImage(imgAnt, ant.x-10, ant.y-10,20,20);
			ctx.restore();			
		});
	}

	function drawNodes(){
		if(showPheromone === true){
			for(var i=0; i<nodes.length; i++){
				for(var j=0; j<nodes.length; j++){
					if(i != j){
						if(tau === null){
							drawLine(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y,1,"black");
						}else{
							drawLine(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y,tau[i][j],"black");
						}
					}
				}
			}
		}

		nodes.forEach(function(node) {
			drawCircle(node.x,node.y,node.radius,node.id);
		});
	}	

	function clone(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	function enableAllButtons(){
		$("#new-node").removeAttr('disabled');
		$("#start").removeAttr('disabled');
		$("#stop").removeAttr('disabled');
		$("#clear-all").removeAttr('disabled');
	}

	function disableAllButtons(){
		$("#new-node").attr('disabled','disabled');
		$("#start").attr('disabled','disabled');
		$("#stop").attr('disabled','disabled');
		$("#clear-all").attr('disabled','disabled');
	}
	
	//Remove context menu when user click with right button
	$(document).bind("contextmenu",function(e){
		return false;
	});
	
	$( "canvas" ).mousemove(function( event ) {
		var rect = canvas.getBoundingClientRect();
		
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;		
	}).click(function(event) {
		if (selectedOption == OPTION_NEW_NODE){
			//if(ants.length <= 0){
				ants.push(new Ant(ANT_ID++,mouseX,mouseY));
			//}
			nodes.push(new Node(NODE_ID++,mouseX,mouseY));
			draw();
		}
	});

	$("#new-node").click(function(event) {
		selectedOption = OPTION_NEW_NODE;		
	});

	$("#start").click(function(event) {
		if(nodes.length <= 1){
			alert("Before, you must add at least two nodes");
			return;
		}

		selectedOption = OPTION_RUN;
		disableAllButtons();
		$("#stop").removeAttr('disabled');
		start();		
	});

	$("#stop").click(function(event) {
		selectedOption = OPTION_NEW_NODE;
		enableAllButtons()	
		$("#stop").attr('disabled','disabled');			
	});

	$("#clear-all").click(function(event) {
		if(confirm("Are you sure?")){
			ants = new Array();
			nodes = new Array();
			ANT_ID = 0;
			NODE_ID = 0;
			bestSolution = null;
			draw();
		}
	});

	$('#settings').click(function () {
		$(".sidebar").animate({width: 'toggle'});
		$('#slider-animation').slider({
			min: 1,
			max: 40,
			value: 40-animationSpeed+1
		}).on('slide', function (ev) {
			animationSpeed = 40-ev.value+1;
	    });
	    $('#slider-ant-speed').slider({
			min: 1,
			max: 20,
			value: antSpeed
		}).on('slide', function (ev) {
	        antSpeed = ev.value;
	    });
	    $('#slider-alpha').slider({
			min: 0,
			max: 5,
			step: 0.5,
			value: ALPHA
		}).on('slide', function (ev) {
	        ALPHA = ev.value;
	    });
	    $('#slider-beta').slider({
			min: 0,
			max: 5,
			step: 0.5,
			value: BETA
		}).on('slide', function (ev) {
	        BETA = ev.value;
	    });
	});

	$('#close-settings').click(function () {
		$(".sidebar").animate({width: 'toggle'});
	});	
    
    $( "#select-show-pheromone" ).val(showPheromone.toString());
	$( "#select-show-best-solution" ).val(showBestSolution.toString());

	$( "#select-show-pheromone" ).change(function () {
		if(this.value == "true"){
			showPheromone = true;	
		}else{
			showPheromone = false;
		}
		
		draw();
  	});
  	$( "#select-show-best-solution" ).change(function () {
		if(this.value == "true"){
			showBestSolution = true;	
		}else{
			showBestSolution = false;
		}
		
		draw();
  	});
	

	

	function start(){
		//Create the pheremone
		tau = new Array(nodes.length);
		dist = new Array(nodes.length);
		for (var i = 0; i < nodes.length; i++) {
	    	tau[i] = new Array(nodes.length);
	    	dist[i] = new Array(nodes.length);
	  	}

	  	for(var i=0;i<nodes.length;i++){
	  		for(var j=0;j<nodes.length;j++){
	  			tau[i][j] = 1;
	  			dist[i][j] = 0;
	  		}
	  	}

	  	//convert coordinates to distance()
	  	for (var i = 0; i < nodes.length; i++) {
			for (var j = i; j < nodes.length; j++) {
				if (i != j) {
					var x1 = nodes[i].x;
					var y1 = nodes[i].y;
					var x2 = nodes[j].x;
					var y2 = nodes[j].y;

					dist[i][j] = euclideanDistance(x1,y1,x2,y2);
					dist[j][i] = dist[i][j];
				}
			}
		}

	  	ants.forEach(function(ant) {
	  		ant.start = true;
	  		ant.init();	  		
	  	});

		move();
	}

	var finishedAnts = 0;

	function move(){
		if(selectedOption !== OPTION_RUN){
			return;
		}

		ants.forEach(function(ant) {
			ant.move();
			ant.callback = function(){
				finishedAnts++;

				if(bestSolution == null ||  evaluate(ant) < evaluate(bestSolution)){
					bestSolution = clone(ant);
				}

				if(finishedAnts == ants.length){
					globalUpdateRule();
					finishedAnts = 0;
					//console.log("terminou");
					//console.log(ant.visitedNodes)
					ants.forEach(function(ant) {
				  		ant.start = true;
				  		ant.init();
				  	});
				}
			}
		});

		draw();

		if(selectedOption === OPTION_RUN){
			setTimeout(move,animationSpeed);
		}
	}

	function evaluate(ant){
		var totalDistance = 0;

		for (var h = 1; h < ant.visitedNodes.length; h++) {
			var i = ant.visitedNodes[h - 1];
			var j = ant.visitedNodes[h];
			totalDistance += dist[i][j];
		}

		return totalDistance;
	}

	function globalUpdateRule(){
		for (var i = 0; i < nodes.length; i++) {
			for (var j = i; j < nodes.length; j++) {
				if (i != j) {
					var deltaTau = 0.0;

					for (var k = 0; k < ants.length; k++) {
						if (ants[k].path[i][j] == 1) {
							//deltaTau += p.getDeltaTau(ant[k], i, j);
							deltaTau += 1/evaluate(ants[k]);
						}
					}

					var evaporation = (1.0 - RHO) * tau[i][j];
					var deposition = deltaTau;				

					tau[i][j] = evaporation + deposition;
					tau[j][i] = evaporation + deposition;
				}
			}
		}
	}

	function init(){
		resizeCanvas();	
		$("#stop").attr('disabled','disabled');
		draw();
	}

	init();
});	