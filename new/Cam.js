function Cam(fovy, aspect, near, far) {
    this.m_p = mat4.create();
    this.m_ti = mat4.create();

    mat4.perspective(this.m_p, util.toRadian(fovy), aspect, near, far);
};

Cam.prototype.getMat = function() {
    var mat = mat4.create();

    mat4.multiply(mat, this.m_p, this.m_ti);

    return mat;
};

Cam.prototype.move = function(x, y, z) {
    var mt = mat4.fromValues(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    x, y, z, 1);

    mat4.invert(this.m_ti, mt);
};