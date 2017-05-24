function Cube () {
}

Cube.prototype.getModel = function() {
    return [
            1, 1, -1, //뒤
            -1, 1, -1,
            -1, -1, -1,
            1, -1, -1,

            1, 1, 1, //앞
            -1, 1, 1,
            -1, -1, 1,
            1, -1, 1
        ];
};

Cube.prototype.getIndexes = function() {
    return [
        0, 3, 2,
        0, 2, 1, //뒤

        0, 1, 5,
        0, 5, 4, //위

        0, 4, 7,
        0, 7, 3, //오

        6, 5, 1,
        6, 1, 2, //왼

        6, 4, 5,
        6, 7, 4, //앞

        6, 2, 3,
        6, 3, 7 //밑
    ];
};

Cube.prototype.getMesh = function() {
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