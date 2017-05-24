function Modeller(v, p){
    this.mStack = new Stack();
    this.v;
    this.p;

    if (v) this.updateView(v);
    if (p) this.updateProjection(p);

    this.originalModels.forEach(function(model){
        model.forEach(function(vertax){
            vertax.push(0,1);
        });
    });

    this.init();
}

Modeller.prototype = Object.create(Graphics.prototype);
Modeller.prototype.constructor = Modeller;

Modeller.prototype.originalModels = [
    [[0,0], [0,5], [1,5], [1,3], [2,3], [2,5], [3,5], [3,0], [2,0], [2,2], [1,2], [1,0], [0,0]], //H
    [[0,0], [0,5], [3,5], [3,4], [1,4], [1,3], [3,3], [3,2], [1,2], [1,1], [3,1], [3,0], [0,0]], //E
    [[0,0], [0,5], [1,5], [1,1], [3,1], [3,0], [0,0]], //L
    [[0,0], [0,5], [1,5], [1,1], [3,1], [3,0], [0,0]], //L
    [[0,0], [0,5], [3,5], [3,0], [0,0], [1,1], [1,4], [2,4], [2,1], [1,1]], //O
];

Modeller.prototype.init = function() {
    var self = this,
        models = [],
        width = 3,
        height = 5,
        interval = 0.5,
        num = this.originalModels.length,
        start = (((width + interval) * num) - interval) / 2;

    this.originalModels.forEach(function(model, i){
        var position = {
                        x: ((width + interval) * i) - start + width/2,
                        y: -height/2,
                        z: 0,
                        degree: 0
                    };

        models.push(new Element(model, position));
    });

    this.group = new Element(models, {x:-width/2, y:0, z:0, degree:0});
};

Modeller.prototype.updateView = function(v) {
    this.v = v ? this.getViewingMatrix(v) : this.v;
};

Modeller.prototype.updateProjection = function(p) {
    this.p = p ? this.getProjectionMatrix(p) : this.p;
};

Modeller.prototype.transform = function(degree) {
    var self = this,
        rotateM = this.getYRotationMatrix(degree),
        transformed = [];

    this.mStack.pushMatrix();
    this.mStack.setMatrix(this.group.m);
    this.mStack.setMatrix(rotateM);

    this.group.model.forEach(function(model){
        self.mStack.pushMatrix();
        self.mStack.setMatrix(model.m);
        self.mStack.setMatrix(rotateM);

        transformed.push(self.piping(model));

        self.mStack.popMatrix();
    });

    this.mStack.popMatrix();

    return transformed;
};

Modeller.prototype.piping = function(character) {
    var calculated = [];

    var m = this.mStack.getMatrix();

    var pipe = m.x(this.v).x(this.p);

    character.model.forEach(function(vertax){
        calculated.push(new Matrix([vertax]).x(pipe).project());
    });

    return calculated;
};