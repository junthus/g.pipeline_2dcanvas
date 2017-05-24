function Obj(model) {
    this.m_mv = mat4.create();
    this.m_s = mat4.create();
    this.m_r = mat4.create();
    this.m_t = mat4.create();

    this.model = model;
    this.children = [];
}

Obj.prototype.setTranslation = function(x, y, z) {
    this.m_t = mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        x, y, z, 1);
};


Obj.prototype.setScale = function(s) {
    this.m_s = mat4.fromValues(
                        s, 0, 0, 0,
                        0, s, 0, 0,
                        0, 0, s, 0,
                        0, 0, 0, 1);
};

Obj.prototype.resetRotate = function() {
    this.m_r = mat4.create();
};

Obj.prototype.setRotateX = function(degree) {
    var s = Math.sin(util.toRadian(degree));
    var c = Math.cos(util.toRadian(degree));
    var rx = mat4.fromValues(
                        1, 0, 0, 0, //x
                        0, c, -s, 0, //y
                        0, s, c, 0, //z
                        0, 0, 0, 1);

    mat4.multiply(this.m_r, rx, this.m_r);
};

Obj.prototype.setRotateY = function(degree) {
    var s = Math.sin(util.toRadian(degree));
    var c = Math.cos(util.toRadian(degree));
    var ry = mat4.fromValues(
                        c, 0, -s, 0, //x
                        0, 1, 0, 0, //y
                        s, 0, c, 0, //z
                        0, 0, 0, 1);

    mat4.multiply(this.m_r, ry, this.m_r);
};

Obj.prototype.addChild = function(obj) {
    this.children.push(obj);
};

Obj.prototype.getMat = function() {
    mat4.multiply(this.m_mv, this.m_s, mat4.create());
    mat4.multiply(this.m_mv, this.m_r, this.m_mv);
    mat4.multiply(this.m_mv, this.m_t, this.m_mv);

    return this.m_mv;
};

Obj.prototype.getMesh = function() {
    return this.model.getMesh();
};

Obj.prototype.getChildren = function() {
    return this.children;
};