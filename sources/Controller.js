function Controller() {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    this.drawGrid();
    this.initCtxStyle();
    this.addEventListener();

    this.setup();
    this.execute();
}


Controller.prototype.setup = function() {
    this.v = {
                degree: 0,
                eye: [0,0,-20,1],
                at: [0,0,0],
                up: [0,1,0]
            };
    this.p = {
            n: 10,
            f: 110,
            fov: 45,
            m: 'perspective'
        };
    this.degree = 0;

    this.model = new Modeller(this.v, this.p);
};

Controller.prototype.execute = function() {
    var orthoScale = this.p.m === 'orthographic' ? document.getElementById('oscale').value : 1;


    var calculated = this.model.transform(this.degree);

    var coords = this.screenFitting(calculated, this.p.m, orthoScale);

    this.draw(coords);
};


Controller.prototype.screenFitting = function(characters, projection, scale) {
    var w = this.canvas.width/2,
        h = this.canvas.height/2;

    if (projection === 'perspective') {
        characters.forEach(function(vertice) {
            for (var i = 0, len = vertice.length; i < len; i++) {
                vertice[i][0] = (vertice[i][0] + 1) * w;
                vertice[i][1] = (vertice[i][1] + 1) * h;
            }
        });
    } else { //orthograph
        characters.forEach(function(vertice) {
            for (var i = 0, len = vertice.length; i < len; i++) {
                vertice[i][0] = vertice[i][0] * scale + w;
                vertice[i][1] = vertice[i][1] * scale + h;
            }
        });
    }

    return characters;
};

Controller.prototype.draw = function(characters) {
    var ctx = this.ctx;

    characters.forEach(function(vertice){
        for (var i = 0, len = vertice.length-1; i < len; i++) {
            var a = [
                        vertice[i][0],
                        vertice[i][1]
                    ],
                b = [
                        vertice[i+1][0],
                        vertice[i+1][1]
                    ];

            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.stroke();
        }
    });

    this.updateInputs();
};

Controller.prototype.rotate = function(e) {
    var target = e.target,
        content = target.textContent,
        step = 360/50,
        self = this;

    if (content === 'PLAY') {
        target.textContent = 'STOP';

        this.interval = window.setInterval(function(){

            self.degree += step;

            self.redraw();
        },100)
    } else {
        target.textContent = 'PLAY';
        window.clearInterval(this.interval);
    }
};

Controller.prototype.keyup = function(e) {
    e.preventDefault();
    e.stopPropagation();

    var keyCode = e.keyCode;

    if (keyCode < 37 || keyCode > 40) {
        return ;
    }

    switch(keyCode) {
        case 37: // left
            this.v.degree += 10;
            break;
        case 38: // up
            this.v.eye[2] -= 1;
            break;
        case 39: //right
            this.v.degree -= 10;
            break;
        case 40: //down
            this.v.eye[2] += 1;
            break;
        default:
            return;
    }

    this.model.updateView(this.v);
    this.redraw();
};

Controller.prototype.initCtxStyle = function() {
    this.ctx.strokeStyle = '#0000ff';
    this.ctx.save();
};

Controller.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Controller.prototype.addEventListener = function() {
    window.addEventListener('keyup', this.keyup.bind(this));
    document.getElementById('controls').addEventListener('keyup', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    document.getElementById('projection').addEventListener('change', this.projectionOnChange.bind(this));
    document.getElementById('playbtn').addEventListener('click', this.rotate.bind(this));
    document.getElementById('eyeY').addEventListener('change', this.viewYOnChange.bind(this));
};

Controller.prototype.projectionOnChange = function(e) {
    var target = e.target,
        name = target.name,
        val = target.value;

    var inputs = document.getElementById('projection').getElementsByTagName('input'),
        near = inputs[3],
        far = inputs[4];

    if (val === 'o' || name === 'oscale') {
        near.disabled = true;
        far.disabled = true;
        this.p.m = 'orthographic';
    } else {
        near.disabled = false;
        far.disabled = false;
        this.p.m = 'perspective';
        this.p.n = parseInt(near.value, 10);
        this.p.f = parseInt(far.value, 10);
    }

    this.model.updateProjection(this.p);
    this.redraw();
};

Controller.prototype.viewYOnChange = function(e) {
    var target = e.target,
        val = parseInt(target.value, 10);

    this.v.eye[1] = val;
    this.model.updateView(this.v);
    this.redraw();
};

Controller.prototype.updateInputs = function() {
    var view = document.getElementById('view').getElementsByTagName('input'),
        cam = document.getElementById('projection').getElementsByTagName('input');

    view[0].value = this.v.eye[1];
    view[1].value = this.v.eye[2];
    view[2].value = this.v.degree;

    cam[3].value = this.p.n;
    cam[4].value = this.p.f;
    cam[5].value = this.p.fov;
};

Controller.prototype.redraw = function() {
    this.clearCanvas();
    this.drawGrid();
    this.execute();
};

Controller.prototype.drawGrid = function() {
    var ctx = this.ctx,
        step = 10;

    ctx.save();

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#ccc';

    for (var i = step + 0.5; i < ctx.canvas.width; i += step ) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
    }

    for (var i = step + 0.5; i < ctx.canvas.height; i += step) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0,150);//x,y
    ctx.lineTo(600,150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300,0);
    ctx.lineTo(300,300);
    ctx.stroke();

    ctx.restore();
};





