function Sphere (longseg, latseg) {
    this.setSeg(longseg, latseg);
}

Sphere.prototype.setSeg = function(longseg, latseg) {
    this.longseg = longseg;
    this.latseg = latseg;
};

Sphere.prototype.getModel = function() {
    var model = [0, 1, 0]; // i = 0, 위쪽 꼭지점
    var r = 1;
    var theta, // y+ 축과 이루는 각도
        phi; // x+ 축과 이루는 각도

    var thetaUnit = Math.PI/this.longseg;
    var phiUnit = 2*Math.PI/this.latseg;

    for (var i = 1; i < this.longseg; i++) {
        theta = thetaUnit * i;

        for (var j = 0; j < this.latseg; j++) {
            phi = phiUnit * j;

            var z = r * Math.sin(theta) * Math.cos(phi);
            var x = r * Math.sin(theta) * Math.sin(phi);
            var y = r * Math.cos(theta);

            model = model.concat([x, y, z]);
        }
    }

    model = model.concat([0, -1, 0]); // i = longseg + 1, 아래쪽 꼭지점

    return model || [];
};

Sphere.prototype.getIndexes = function() {
    var indexes = [],
        last = (this.longseg -1) * this.latseg + 1,
        n = this.latseg;

    // 위 뚜껑
    for (var i = 0; i < this.latseg; i++) {
        if ((i + 1) === this.latseg) {
            indexes = indexes.concat([0, i+1, 1]);
        } else {
            indexes = indexes.concat([0, i+1, i+2]);
        }
    }

    // 몸통
    for (var row = 0; row < this.longseg-2; row++) {
        for (var i = 1; i <= this.latseg; i++) {
            var lt = row * n + i,
                lb = (row+1) * n + i,
                rt = lt + 1,
                rb = lb + 1;

            // 원으로 만나는 곳
            if (i === this.latseg) {
                rt = row * n + 1;
                rb = (row+1) * n + 1;
            }

            var trianglesEveryRect = [
                lt, lb, rb,
                lt, rb, rt
            ];
            // indexes.push(trianglesEveryRect);
            indexes = indexes.concat(trianglesEveryRect);
        }
    }

    // 아래 뚜껑
    for (var i = 0; i < this.latseg; i++) {
        var left = (this.longseg-2) * n + 1 + i;

        if (i + 1 === this.latseg) {
            indexes = indexes.concat([left, last, (this.longseg-2) * n + 1 ]);
        } else {
            indexes = indexes.concat([left, last, left + 1]);
        }
    }

    return indexes || [];
};

Sphere.prototype.getMesh = function(longseg, latseg) {
    if (longseg && latseg) {
        this.setSeg(longseg, latseg);
    }

    var model = this.getModel();
    var indexes = this.getIndexes();
    var triangles = [];

    for (var i = 0; i < indexes.length/3; i++) {
        var p1 = 3*indexes[i * 3];
        var p2 = 3*indexes[i * 3 + 1];
        var p3 = 3*indexes[i * 3 + 2];

        var triangle = [
            model[p1], model[p1 + 1], model[p1 + 2],
            model[p2], model[p2 + 1], model[p2 + 2],
            model[p3], model[p3 + 1], model[p3 + 2]
        ];

        triangles = triangles.concat(triangle);
    }

    return triangles;
};