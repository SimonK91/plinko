function getCost(token) {
    return token.cost.mul(token.costModifier.pow(token.level + 2));
}
function getNextValue(token) {
    token.level += 1;
    let value = token.getValue();
    token.level -= 1;
    return value
}

var ball_multiplier = {};
ball_multiplier.level = 0;
ball_multiplier.valueModifier = new Decimal(1.1);
ball_multiplier.value = new Decimal(1);
ball_multiplier.costModifier = new Decimal(1.8);
ball_multiplier.cost = new Decimal(5);
ball_multiplier.getValue = function () {
    return ball_multiplier.value.mul(ball_multiplier.valueModifier.pow(ball_multiplier.level))
}
ball_multiplier.getNextValue = () => getNextValue(ball_multiplier);
ball_multiplier.getCost = () => getCost(ball_multiplier);

var ball_survival_chance = {};
ball_survival_chance.level = 0;
ball_survival_chance.value = new Decimal(30);
ball_survival_chance.costModifier = new Decimal(1.8);
ball_survival_chance.cost = new Decimal(10);
ball_survival_chance.maxLevel = 30;
ball_survival_chance.getValue = function () {
    return new Decimal(ball_survival_chance.value.add(ball_survival_chance.level)).div(100);
}
ball_survival_chance.getNextValue = () => getNextValue(ball_survival_chance);
ball_survival_chance.getCost = () => getCost(ball_survival_chance);

var double_ball_value_chance = {};
double_ball_value_chance.level = 0;
double_ball_value_chance.value = new Decimal(0);
double_ball_value_chance.costModifier = new Decimal(1.8);
double_ball_value_chance.cost = new Decimal(7.5);
double_ball_value_chance.maxLevel = 51;
double_ball_value_chance.getValue = function () {
    return new Decimal(double_ball_value_chance.level).div(100);
}
double_ball_value_chance.getNextValue = () => getNextValue(double_ball_value_chance);
double_ball_value_chance.getCost = () => getCost(double_ball_value_chance);

var click_area = {};
click_area.level = 0;
click_area.value = new Decimal(100);
click_area.costModifier = new Decimal(1.8);
click_area.cost = new Decimal(2);
click_area.maxLevel = 11;
click_area.getValue = function () {
    return new Decimal(1 + click_area.level * 0.5);
}
click_area.getNextValue = () => getNextValue(click_area);
click_area.getCost = () => getCost(click_area);

var click_multiplier = {};
click_multiplier.level = 0;
click_multiplier.valueModifier = new Decimal(1.1);
click_multiplier.value = new Decimal(125);
click_multiplier.costModifier = new Decimal(1.8);
click_multiplier.cost = new Decimal(12);
click_multiplier.getValue = function () {
    return click_multiplier.value.mul(click_multiplier.valueModifier.pow(click_multiplier.level)).div(100);
}
click_multiplier.getNextValue = () => getNextValue(click_multiplier);
click_multiplier.getCost = () => getCost(click_multiplier);

var zone_unlock_cost = {};
zone_unlock_cost.level = 0;
zone_unlock_cost.value = new Decimal(0);
zone_unlock_cost.costModifier = new Decimal(1.8);
zone_unlock_cost.cost = new Decimal(7.5);
zone_unlock_cost.maxLevel = 50;
zone_unlock_cost.getValue = function () {
    return new Decimal(1 - (zone_unlock_cost.level) / 100);
}
zone_unlock_cost.getNextValue = () => getNextValue(zone_unlock_cost);
zone_unlock_cost.getCost = () => getCost(zone_unlock_cost);

var zone_multiplier = {};
zone_multiplier.level = 0;
zone_multiplier.valueModifier = new Decimal(1.1);
zone_multiplier.value = new Decimal(100);
zone_multiplier.costModifier = new Decimal(1.8);
zone_multiplier.cost = new Decimal(5);
zone_multiplier.getValue = function () {
    return zone_multiplier.value.mul(
        zone_multiplier.valueModifier.pow(zone_multiplier.level)
    ).div(100)
}
zone_multiplier.getNextValue = () => getNextValue(zone_multiplier);
zone_multiplier.getCost = () => getCost(zone_multiplier);

var token_multiplier = {};
token_multiplier.level = 0;
token_multiplier.valueModifier = new Decimal(1.1);
token_multiplier.value = new Decimal(100);
token_multiplier.costModifier = new Decimal(1.8);
token_multiplier.cost = new Decimal(10);
token_multiplier.getValue = function () {
    return token_multiplier.value.mul(
        token_multiplier.valueModifier.pow(token_multiplier.level)
    ).div(100);
}
token_multiplier.getNextValue = () => getNextValue(token_multiplier);
token_multiplier.getCost = () => getCost(token_multiplier);

var tokenUpgrades = {
    "ball_multiplier": ball_multiplier,
    "ball_survival_chance": ball_survival_chance,
    "double_ball_value_chance": double_ball_value_chance,
    "click_area": click_area,
    "click_multiplier": click_multiplier,
    "zone_unlock_cost": zone_unlock_cost,
    "zone_multiplier": zone_multiplier,
    "token_multiplier": token_multiplier,
};

var tokenTemplate = JSON.parse(JSON.stringify(tokenUpgrades));
