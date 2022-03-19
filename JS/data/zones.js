class Zone {
    constructor(zone, base_cost = 100) {
        this.zone = zone;
        this.level = 0;
        this.shapes = [];
        this.tweens = [];
        this.cost_modifier = new Decimal(4.5);
        this.base_cost = base_cost;
    }

    get cost() {
        return new Decimal(this.base_cost).mul(this.cost_modifier.pow(this.level))
    }

    get modifier() {
        return 0.8 + this.zone * 0.1 + this.level * 0.05;
    }
    get offset() {
        return 1500 * this.zone;
    }

    upgrade() {
        this.level += 1;
        this.build();
    }
}

class Zone1 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1.6, 1.4, 1.2, 1];
    }

    build() {
        if (this.shapes.length == 0) {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 16; j++) {
                    var shape = matter.add
                        .image(
                            i * 68.5 + (j % 2) * 34,
                            this.offset + 200 + j * 75,
                            "rectangle",
                            null,
                            {
                                isStatic: true,
                            }
                        )
                        .setAngle(45);
                    this.shapes.push(shape);
                }
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i = 0; i < this.shapes.length; ++i) {
            this.shapes[i].setScale(this.levels[level])
        }
    }
}

class Zone2 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [1, 1.1, 1.2, 1.3, 1.45, 1.65, 1.9, 2.25, 2.75, 3.5];
    }

    build() {
        if (this.shapes.length == 0) {
            for (i = 0; i < 3; i++) {
                matter.add
                    .image(125, this.offset + 200 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(30, 1)
                    .setAngle(10);
                matter.add
                    .image(550, this.offset + 200 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(30, 1)
                    .setAngle(-10);
                for (j = 0; j < 2; ++j) {
                    var blade = matter.add
                        .image(340, this.offset + 400 + i * 400, "rectangle", null, {
                            isStatic: true,
                        })
                        .setScale(40, 1)
                        .setAngle(j * 90);
                    var tween = scene.tweens.add({
                        targets: blade,
                        rotation: Phaser.Math.DegToRad(360 + 90 * j),
                        duration: 100000,
                        ease: "Linear",
                        repeat: -1,
                    });
                    this.shapes.push(blade);
                    this.tweens.push(tween);
                }
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.tweens) {
            this.tweens[i].timeScale = this.levels[level];
        }
    }
}


class Zone3 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280];
    }

    build() {
        if (this.shapes.length == 0) {
            for (i = 0; i < 6; i++) {
                var shape1 = matter.add
                    .image(
                        340,
                        this.offset + 200 + i * 200,
                        "rectangle",
                        null,
                        {
                            isStatic: true,
                        }
                    )
                    .setScale(50, 1)
                    .setAngle(10);
                var shape2 = matter.add
                    .image(
                        340,
                        this.offset + 300 + i * 200,
                        "rectangle",
                        null,
                        {
                            isStatic: true,
                        }
                    )
                    .setScale(50, 1)
                    .setAngle(-10);
                this.shapes.push(shape1);
                this.shapes.push(shape2);
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.shapes) {
            let offset = i % 2 == 0 ? -this.levels[level] : this.levels[level]
            this.shapes[i].x = 340 + offset;
        }
    }
}


class Zone4 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [0.5, 0.47, 0.43, 0.4, 0.37, 0.33, 0.3, 0.27, 0.23, 0.2];
    }

    build() {
        if (this.shapes.length == 0) {
            for (let i = 0; i < 3; i++) {
                for (let m = 0; m < 2; ++m) {
                    for (let n = 0; n < 2; ++n) {
                        let x_offset = m * 240 + n * 480;
                        let y_offset = m * 200 + i * 400 + 275;
                        var shape = matter.add
                            .image(x_offset, this.offset + y_offset, "circle")
                            .setCircle(250,
                                {
                                    isStatic: true,
                                });
                        this.shapes.push(shape);
                    }
                }
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.shapes) {
            this.shapes[i].setScale(this.levels[level])
        }
    }
}


class Zone5 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [30, 35, 40, 45, 50, 60, 70, 75, 80, 85];
    }

    build() {
        if (this.shapes.length == 0) {
            for (i = 0; i < 12; i++) {
                for (j = 0; j < 8; j++) {
                    var shape1 = matter.add
                        .image(
                            10 + i * 60,
                            this.offset + 200 + j * 150,
                            "rectangle",
                            null,
                            {
                                isStatic: true,
                            }
                        )
                        .setScale(7, 1)
                    var shape2 = matter.add
                        .image(
                            40 + i * 60,
                            this.offset + 275 + j * 150,
                            "rectangle",
                            null,
                            {
                                isStatic: true,
                            }
                        )
                        .setScale(7, 1)
                    this.shapes.push(shape1);
                    this.shapes.push(shape2);
                }
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.shapes) {
            let angle = i % 2 == 0 ? this.levels[level] : 180 - this.levels[level];
            this.shapes[i].setAngle(angle);
        }
    }
}


class Zone6 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [1, 1.1, 1.2, 1.3, 1.45, 1.65, 1.9, 2.25, 2.75, 3.5];
    }

    build() {
        if (this.shapes.length == 0) {
            for (i = 0; i < 3; i++) {
                matter.add
                    .image(200, this.offset + 400 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(8)
                    .setAngle(45);
                matter.add
                    .image(480, this.offset + 400 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(8)
                    .setAngle(45);
                matter.add
                    .image(340, this.offset + 400 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(20, 1);
                matter.add
                    .image(150, this.offset + 200 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(30, 1)
                    .setAngle(10);
                matter.add
                    .image(530, this.offset + 200 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(30, 1)
                    .setAngle(-10);
                var pusher1 = matter.add
                    .image(200, this.offset + 400 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(1, 12);
                var pusher2 = matter.add
                    .image(480, this.offset + 400 + i * 400, "rectangle", null, {
                        isStatic: true,
                    })
                    .setScale(1, 12);
                var tween1 = scene.tweens.add({
                    targets: pusher1,
                    x: 480,
                    duration: 37500,
                    ease: "Linear",
                    repeat: -1,
                });
                var tween2 = scene.tweens.add({
                    targets: pusher2,
                    x: 200,
                    duration: 37500,
                    ease: "Linear",
                    repeat: -1,
                });
                this.shapes.push(pusher1);
                this.shapes.push(pusher2);
                this.tweens.push(tween1);
                this.tweens.push(tween2);
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.tweens) {
            this.tweens[i].timeScale = this.levels[level];
        }
    }
}


class Zone7 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [1, 1.1, 1.2, 1.3, 1.45, 1.65, 1.9, 2.25, 2.75, 3.5];
    }

    build() {
        if (this.shapes.length == 0) {
            for (var i = 0; i < 3; i++) {
                this._make_elevator(12, 1, -50, 300 + i * 400);
                this._make_elevator(12, -1, 700, 500 + i * 400);
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.tweens) {
            this.tweens[i].timeScale = this.levels[level];
        }
    }

    _make_elevator(steps, direction, x_offset, y_offset) {
        let stepsize = [50, 10];
        let angle = direction < 0 ? -10 : 10;
        let dir_str = direction < 0 ? "-=" : "+=";
        let x_step = direction < 0 ? -stepsize[0] : stepsize[0];
        let y_step = stepsize[1];
        for (var j = 0; j < steps; ++j) {
            var shape = matter.add
                .image(
                    x_offset + j * x_step,
                    this.offset + y_offset - j * y_step,
                    "rectangle",
                    null,
                    {
                        isStatic: true,
                    }
                )
                .setScale(4, 2)
                .setAngle(angle);
            var tween;
            if (j < steps - 1) {
                tween = scene.tweens.add({
                    targets: shape,
                    x: dir_str + stepsize[0].toString(),
                    y: "-=" + stepsize[1].toString(),
                    duration: 12500,
                    ease: "Linear",
                    repeat: -1,
                });
            } else {
                tween = scene.tweens.add({
                    targets: shape,
                    x: dir_str + (stepsize[0] / 2).toString(),
                    y: "-=" + (stepsize[1] / 2).toString(),
                    scaleY: 0.01,
                    scaleX: 0.01,
                    duration: 12500,
                    ease: "Linear",
                    repeat: -1,
                });
            }
            this.shapes.push(shape);
            this.tweens.push(tween);
        }
    }
}


class Zone8 extends Zone {
    constructor(zone, base_cost) {
        super(zone, base_cost);
        this.levels = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135];
    }

    build() {
        if (this.shapes.length == 0) {
            let build_data = [[200, 10], [330, -10]];
            for (let i = 0; i < 6; i++) {
                for (let j in build_data) {
                    var shape = matter.add
                        .image(
                            0,
                            this.offset + build_data[j][0] + i * 200,
                            "rectangle",
                            null,
                            {
                                isStatic: true,
                            }
                        )
                        .setScale(70, 1)
                        .setAngle(build_data[j][1]);
                    this.shapes.push(shape);
                }
            }
            build_data = [[300, -10], [430, 10]];
            for (let i = 0; i < 5; i++) {
                for (let j in build_data) {
                    var shape = matter.add
                        .image(
                            0,
                            this.offset + build_data[j][0] + i * 200,
                            "rectangle",
                            null,
                            {
                                isStatic: true,
                            }
                        )
                        .setScale(70, 1)
                        .setAngle(build_data[j][1]);
                    this.shapes.push(shape);
                }
            }
        }
        let level = Math.min(this.levels.length - 1, this.level)
        for (var i in this.shapes) {
            let x = i < 12 ? 200 - this.levels[level] : 550 + this.levels[level];
            console.log(x)
            this.shapes[i].setX(x);
        }
    }
}

available_zones = [
    new Zone1(0, 500),
    new Zone2(1, 2500),
    new Zone3(2, 50000),
    new Zone4(3, 750000),
    new Zone5(4, 15000000),
    new Zone6(5, 150000000),
    new Zone7(6, 2500000000),
    new Zone8(7, 55000000000),
]