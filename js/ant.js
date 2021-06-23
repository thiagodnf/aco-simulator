class Ant{

    constructor(canvas, x, y) {
        this.draw = canvas.makeAnt(x,y)

        this.speed = 0.1;
        this.target = {x:200, y:200}
    }

    isDone(){
        return this.draw.left == this.target.x && this.draw.top == this.target.y;
    }

    step(){

        if (this.isDone()) {
            return;
        }

        this.draw.set({
            top: this.draw.top + this.speed,
            left: this.draw.left + this.speed,
        })
    }
}
