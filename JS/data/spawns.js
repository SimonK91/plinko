class Spawn {
    constructor(cooldown_start, cooldown_end, value, value_modifier, cost, cost_modifier, stage, y_offset, color) {
        this.cooldown_start = cooldown_start;
        this.speed_modifier = (cooldown_start - cooldown_end) / 10;

        this.stage = stage;
        this.y_offset = y_offset;
        this.color = color;
        this.enabled = false;

        this.base_value = new Decimal(value);
        this.value_modifier = new Decimal(value_modifier);

        this.base_cost = new Decimal(cost);
        this.cost_modifier = new Decimal(cost_modifier);
        this.level = 0;
    }

    levelUp() {
        this.level += 1;
    }

    get cost() {
        return this.base_cost.mul(this.cost_modifier.pow(this.level));
    }
    get value() {
        return this.base_value.mul(this.value_modifier.pow(this.level - 1));
    }
    get next_value() {
        return this.base_value.mul(this.value_modifier.pow(this.level));
    }
    get cooldown() {
        return this.cooldown_start - this.speed_modifier * Math.min(10, this.level - 1);
    }
    get next_cooldown() {
        if (this.level > 10) {
            return "MAX"
        }
        return this.cooldown_start - this.speed_modifier * (this.level);
    }
    get y() {
        return this.y_offset + (this.stage - 1) * 1500;
    }
}

spawn1 = new Spawn(300, 50, 55, 1.8, 20, 4.5, 1, 90, 0xf84d3e);
spawn1.levelUp();
spawn2 = new Spawn(350, 60, 80, 1.8, 100, 4.3, 1, 70, 0x0085f3);
spawn3 = new Spawn(400, 80, 110, 1.8, 1000, 4.1, 1, 50, 0xd06ab8);

spawn4 = new Spawn(450, 100, 150, 1.8, 7500, 3.9, 2, 30, 0x508a36);
spawn5 = new Spawn(500, 120, 170, 1.85, 20000, 3.7, 2, 50, 0x108a80);

spawn6 = new Spawn(600, 150, 190, 1.88, 60000, 3.5, 3, 70, 0xffb45a);

spawn7 = new Spawn(700, 200, 220, 1.89, 250000, 3.3, 4, 70, 0xa57b36);

spawn8 = new Spawn(900, 250, 250, 1.92, 1250000, 3.1, 5, 70, 0x727272);

spawn9 = new Spawn(1000, 300, 320, 1.95, 5000000, 2.9, 6, 70, 0x673eab);

spawn10 = new Spawn(1500, 400, 780, 2.0, 500000000, 2.7, 7, 70, 0x833b21);

var spawns = []; //spawns array
spawns.push(spawn1);
spawns.push(spawn2);
spawns.push(spawn3);
spawns.push(spawn4);
spawns.push(spawn5);
spawns.push(spawn6);
spawns.push(spawn7);
spawns.push(spawn8);
spawns.push(spawn9);
spawns.push(spawn10);

var spawnTemplate = JSON.parse(JSON.stringify(spawns));
