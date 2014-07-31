$(function() {
	var OPTION_NEW_NODE = 1;
	var OPTION_RUN = 2;
	var ANT_ID = 0;
	var NODE_ID = 0;

	var mouseX = 0;
	var mouseY = 0;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var nodes = new Array();
	var ants = new Array();
	var selectedOption = OPTION_NEW_NODE;
	var tau = new Array();
	var antSpeed = 10;
	var animationSpeed = 40;

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
		this.currentNode = i;
		this.nextNode = -1;
		this.angle = 0;
		this.d = false;
		
		this.move = function(){

			if(nodes.length == 1){
				if(this.currentNode == 0){
					this.nextNode = 1;
				}else{
					this.nextNode = 0;
				}
			}else{

				if(this.nextNode == -1){
					this.nextNode = Math.floor(Math.random() * (nodes.length)) + 0;
					while(this.nextNode == this.currentNode){
						this.nextNode = Math.floor(Math.random() * (nodes.length)) + 0;
					}
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
				this.currentNode = this.nextNode;
				this.nextNode = -1;	
				this.x = node.x;			
				this.y = node.y;
				this.d = false;
			}
		}
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

	function drawLine(x0,y0,x1,y1){
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);			
		ctx.stroke();
	}

	function draw(){		
		ctx.clearRect (0 , 0 , canvas.width,canvas.height );		
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
		for(var i=0; i<nodes.length; i++){
			for(var j=0; j<nodes.length; j++){
				if(i != j){
					drawLine(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y)
				}
			}
		}

		nodes.forEach(function(node) {
			drawCircle(node.x,node.y,node.radius,node.id);
		});
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
			ants.push(new Ant(ANT_ID++,mouseX,mouseY));
			nodes.push(new Node(NODE_ID++,mouseX,mouseY));
			draw();
		}
	});

	$("#new-node").click(function(event) {
		selectedOption = OPTION_NEW_NODE;		
	});

	$("#start").click(function(event) {
		selectedOption = OPTION_RUN;
		disableAllButtons();
		$("#stop").removeAttr('disabled');
		move();		
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
			draw();
		}
	});

	$('#popover-settings').popover({
	  	html : true,
    	content: function() {
      		return $('#popover-settings-content').html();
    	}
	}).click(function () {
		$('#slider-animation').slider({
			min: 10,
			max: 200,
			value: animationSpeed
		}).on('slide', function (ev) {
            animationSpeed = ev.value;
        });
        $('#slider-ant-speed').slider({
			min: 1,
			max: 20,
			value: antSpeed
		}).on('slide', function (ev) {
            antSpeed = ev.value;
        });
        $('#close-settings').click(function(event){
			$('#popover-settings').popover('hide');
		});
	});	

	function move(){
		if(selectedOption !== OPTION_RUN){
			return;
		}

		ants.forEach(function(ant) {
			ant.move();
		});

		draw();

		if(selectedOption === OPTION_RUN){
			setTimeout(move,animationSpeed);
		}
	}

	function init(){
		resizeCanvas();	
		$("#stop").attr('disabled','disabled');
		draw();
	}

	init();
});	