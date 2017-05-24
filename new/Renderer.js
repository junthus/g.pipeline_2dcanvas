function Renderer(el) {
    this._rootTargets = {};

    var el = document.getElementById('canvas');

    this.ctx = el.getContext('2d');
    this.viewport = [el.width, el.height];

    this.mvStack = [];
}

Renderer.prototype.setFront = function(face) {
    this._front = face;
};

Renderer.prototype.setCam = function(camMatrix) {
    this._cam = camMatrix;
};

Renderer.prototype.link = function(obj) {
    var key = util.uid();

    this._rootTargets[key] = obj;

    return key;
};

Renderer.prototype.renderPoints = function() {

};

Renderer.prototype.renderWires = function() {
    var ctx = this.ctx;

    ctx.clearRect(0, 0, this.viewport[0], this.viewport[1]);
    ctx.beginPath();
    ctx.moveTo(0,0);

    for (var id in this._rootTargets) {
        if (!this._rootTargets.hasOwnProperty(id)) continue;

        var target = this._rootTargets[id];

        this._renderWiresRepeat(target);
    }
};

Renderer.prototype._getStackedMvMatrix = function() {
    var mv = mat4.create();

    for (var i = this.mvStack.length; i > 0; i--) {
        mat4.multiply(mv, this.mvStack[i-1], mv);
    }

    return mv;
};
Renderer.prototype._renderWiresRepeat = function(target) {
    var ctx = this.ctx;

    this.mvStack.push(mat4.clone(target.getMat()));
    var mv = this._getStackedMvMatrix();
    var mvp = mat4.create();

    mat4.multiply(mvp, this._cam, mv);

    var mesh = target.getMesh();
    var p = this._getProjectedMesh(mesh, mvp);

    for (var i = 0; i < p.length/6; i++) {

        var triangle = [
            p[i * 6], p[i * 6 + 1],
            p[i * 6 + 2], p[i * 6 + 3],
            p[i * 6 + 4], p[i * 6 + 5]
        ];

        if (!this._cull(triangle)) continue;

        var startX, startY;
        for (var j = 0; j < 3; j++) {
            var x = triangle[j * 2] *this.viewport[0]/2 + this.viewport[0]/2,
                y = triangle[j * 2 + 1] *this.viewport[1]/2 + this.viewport[1]/2;

            if (j === 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                startX = x;
                startY = y;
            } else if (j === 2) {
                ctx.lineTo(x, y);
                ctx.lineTo(startX, startY);
            } else {
                ctx.lineTo(x, y);
            }

            ctx.stroke();
        }
    }

    var children = target.getChildren();

    for (var j = 0; j < children.length; j++) {
        this._renderWiresRepeat(children[j]);
    }

    this.mvStack.pop();

    // console.log(this.mvStack); // should be []
};

Renderer.prototype.render = Renderer.prototype.renderWires;

Renderer.prototype._cull = function(triangle) {
    var a = triangle[0],
        b = triangle[1],
        c = triangle[2],
        d = triangle[3],
        e = triangle[4],
        f = triangle[5];

    return (this._front === 'ccw' ?
            (a*d + c*f + e*b - c*b - e*d - a*f) > 0 :
            (a*d + c*f + e*b - c*b - e*d - a*f) < 0);
};

Renderer.prototype._getProjectedMesh = function(mesh, mvp) {
    var projectedTriangle = [];

    for (var i = 0; i < mesh.length/3; i++) {
        var out = vec4.create();

        var point = vec4.fromValues(
                                    mesh[i * 3],
                                    mesh[i * 3 + 1],
                                    mesh[i * 3 + 2],
                                    1);

        mat4.multiply(out, mvp, point);

        var w = out[3];
        var x = out[0]/w;
        var y = out[1]/w;

        projectedTriangle = projectedTriangle.concat([x, y]);
    }

    return projectedTriangle;
}