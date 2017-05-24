function Stack(){
    this.stack = [];
}

//set where to start the current object transformations!
/*
    glPushMatrix()
    glMultMatrix(...)//Shoulder transform
    glPushMatrix()
    glMultMatrix(...)//elbow transform
    glPushMatrix()
    glMultMatrix(...)//finger transform
    glPopMatrix()
    glPopMatrix()
    glPopMatrix()
*/
Stack.prototype.pushMatrix = function() {
    var idx = this.stack.length;

    if (idx === 0) {
        this.stack.push(new Matrix()); //I
    } else {
        this.stack.push(this.stack[idx-1]);
    }
};

Stack.prototype.popMatrix = function() {
    var idx = this.stack.length;

    if (idx === 0) {
        throw new Error(['anything stacked here, you must be wrooooooong']);
    } else {
        this.stack.pop(this.stack[idx-1]);
    }
};

Stack.prototype.setMatrix = function(matrix) {
    var idx = this.stack.length,
        m = this.stack[idx-1];

    this.stack[idx-1] = m.x(matrix);
};

Stack.prototype.getMatrix = function() {
    var idx = this.stack.length;

    return this.stack[idx-1];
};