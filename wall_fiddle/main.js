var canvas = null;
var context = null;
var canvasWidth = 800;
var canvasHeight = 600;

window.onload = function(){
    console.log("Hello?");
    
	canvas = document.getElementById("displayCanvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	context = canvas.getContext("2d");
	var game = new Game(canvas, context);
	// Add the canvas boundaries as walls
	game.walls.push(new Wall(new Point(0, 0), new Point(0, canvas.height)));
	game.walls.push(new Wall(new Point(0, canvas.height), new Point(canvas.width, canvas.height)));
	game.walls.push(new Wall(new Point(canvas.width, canvas.height), new Point(canvas.width, 0)));
	game.walls.push(new Wall(new Point(canvas.width, 0), new Point(0, 0)))
	// Add additional walls
	game.walls.push(new Wall(new Point(100, 100), new Point(200, 100)));
	game.walls.push(new Wall(new Point(500, 300), new Point(600, 423)));
	game.walls.push(new Wall(new Point(400, 250), new Point(400, 500)));
	game.start();
}

function Game(canvas, context){
	this.canvas = canvas;
	this.context = context;
	this.inputManager = new InputManager(this);
	this.inputManager.init();
	this.clearColor = "#FFFFFF";
	this.walls = [];
	this.hitpoints = [];
}

Game.prototype.start = function(){
	this.update();
	this.render();
	window.requestAnimationFrame(this.start.bind(this));
}

Game.prototype.clear = function(){
	this.context.save();
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.fillStyle = this.clearColor;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.restore();
}

Game.prototype.update = function(){
	var mouseX = this.inputManager.mouseX;
	var mouseY = this.inputManager.mouseY;	
	this.hitpoints = [];
	// For every wall...
	for(var i = 0; i < this.walls.length; i++){
		var wall = this.walls[i];
		// Cast a ray to every point of the current wall
		for(var j = 0; j < wall.points.length; j++){
			var closestPoint = null;
			if(j == 0) closestPoint = wall.p1;
			if(j == 1) closestPoint = wall.p2;
			var ray = new Wall(new Point(mouseX, mouseY), new Point(closestPoint.x, closestPoint.y));
			var minDistance = ray.length();
			// Check every wall for intersection
			for(var k = 0; k < this.walls.length; k++){
				var checkWall = this.walls[k];
				if(wall != checkWall){
					if(checkWall.intersectsWith(ray)){
						// If checkWall intersects with our ray we have to check it's intersection point's distance
						// If the distance is smaller than the current minimum set intersectionPoint as the closest
						// point and save the distance.
						var intersectionPoint = checkWall.intersectionPoint(ray);
						var tempRay = new Wall(new Point(mouseX, mouseY), new Point(intersectionPoint.x, intersectionPoint.y));
						if(tempRay.length() < minDistance){
							closestPoint = intersectionPoint;
							minDistance = tempRay.length();
						}
					}
				}
			}
			this.hitpoints.push(closestPoint);
		}
	}
}

Game.prototype.render = function(){
	this.clear();
	this.context.save();
	// Render all the walls
	this.context.beginPath();
	for(var i = 0; i < this.walls.length; i++){
		var wall = this.walls[i];
		this.context.moveTo(wall.p1.x, wall.p1.y);
		this.context.lineTo(wall.p2.x, wall.p2.y);
	}
	this.context.stroke();
	// Render cursor's position
	this.context.fillStyle = "#FF0000";
	var mouseX = this.inputManager.mouseX;
	var mouseY = this.inputManager.mouseY;
	this.context.fillRect(mouseX-5, mouseY-5, 10, 10);
	// Render all the hitpoints
	this.context.fillStyle = "#0000FF";
	var mouseX = this.inputManager.mouseX;
	var mouseY = this.inputManager.mouseY;
	this.context.strokeStyle = "#FF0000",
	this.context.beginPath();
	for(var i = 0; i < this.hitpoints.length; i++){
		var hitpoint = this.hitpoints[i];
		this.context.moveTo(mouseX, mouseY);
		this.context.lineTo(hitpoint.x, hitpoint.y);
		this.context.fillRect(hitpoint.x-5, hitpoint.y-5, 10, 10);
	}
	this.context.stroke();
	this.context.restore();
}

function Wall(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
	this.p1.parent = this;
	this.p2.parent = this;
	this.points = [p1, p2];

	this.length = function(){
		return Math.sqrt(Math.pow(p2.x-p1.x, 2)+Math.pow(p2.y-p1.y, 2));
	}

	this.direction = function(){
		var vLength = this.length();
		return new Point((p2.x-p1.x)/vLength, (p2.y-p1.y)/vLength);
	}

	this.intersectsWith = function(wall){
		var a = this.p1;
		var b = this.p2;
		var c = wall.p1;
		var d = wall.p2;
		var cmp = new Point(c.x-a.x, c.y-a.y);
		var r = new Point(b.x-a.x, b.y-a.y);
		var s = new Point(d.x-c.x, d.y-c.y);

		var cmpxr = cmp.x*r.y-cmp.y*r.x;
		var cmpxs = cmp.x*s.y-cmp.y*s.x;
		var rxs = r.x*s.y-r.y*s.x;
		if(cmpxr == 0)
			return ((c.x-a.x < 0) != (c.x-b.x < 0))
				|| ((c.y-a.y < 0) != (c.y-b.y < 0));
		if(rxs == 0)
			return false;

		var rxsr = 1/rxs;
		var t = cmpxs*rxsr;
		var u = cmpxr*rxsr;
		return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
	}

	this.intersectionPoint = function(wall){
		var a = this.p1;
		var b = this.p2;
		var c = wall.p1;
		var d = wall.p2;
		
		var divider = ((a.x-b.x)*(c.y-d.y)-(a.y-b.y)*(c.x-d.x));
		if(divider == 0)
			return new Point(0, 0);
		var intersectionX = ((a.x*b.y-a.y*b.x)*(c.x-d.x)-(a.x-b.x)*(c.x*d.y-c.y*d.x))/divider;
		var intersectionY = ((a.x*b.y-a.y*b.x)*(c.y-d.y)-(a.y-b.y)*(c.x*d.y-c.y*d.x))/divider;
		
		return new Point(intersectionX, intersectionY);
	}
}

function Point(x, y){
	this.x = x;
	this.y = y;
	this.parent = null;
}

function InputManager(game){
	this.game = game;
	this.hoverOver = false;
	this.mouseX = 0;
	this.mouseY = 0;
}

InputManager.prototype.init = function(){
	this.game.canvas.addEventListener("mousemove", this.onMouseMove.bind(this), false);
	this.game.canvas.addEventListener("mouseover", this.onMouseOver.bind(this), false);
	this.game.canvas.addEventListener("mouseout", this.onMouseOut.bind(this), false);
}

InputManager.prototype.onMouseMove = function(e){
	var rect = this.game.canvas.getBoundingClientRect();
	this.mouseX = e.clientX - rect.left;
	this.mouseY = e.clientY - rect.top;
}

InputManager.prototype.onMouseOver = function(e){
	this.hoverOver = true;
}

InputManager.prototype.onMouseOut = function(e){
	this.hoverOver = false;
}