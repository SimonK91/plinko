let zoneStrings = [
  "Shrinks Zone Diamonds",
  "Increase Cross Rotation",
  "Shrinks Ramp Width",
  "Decrease Circle Radius",
  "Straightens Lines",
  "Increases Pusher Speed",
  "Increases Convayer Speed",
  "Widens Channel",
];
let suffixes = [
  "M",
  "B",
  "T",
  "Qd",
  "Qn",
  "Sx",
  "Sp",
  "Oc",
  "N",
  "Dc",
  "UDc",
  "DDc",
  "TDc",
  "QaDc",
  "QiDc",
  "SxDc",
  "SpDc",
  "OcDc",
  "NDc",
  "Vi",
];

let saveInterval = 2000;  // 20 second save interval
let numberFormat = "eng";
let resetCounter = 0;
let gameState = getEmptyGameState();
let game;
var counter = 0; //spawn loop counter
var counter2 = 0; //title loop counter
var matter; //physics object
var balls = []; //ball array
var pointerdown = false; //mouse down flag
var isDragging = false; //mouse dragging flag
var startY = 0; // /
var lastY = 0; // | drag variables
var dirY = 0; // \
var camera; //camera object
var scene; //scene object
var zones = []; //array of zones
var lockedContainer; //locked button for next zone
var menuContainer; //menu container
var graphics; //graphics object
var fric = 0;
var selectedPanel = 0; //selected store panel
var zonePrices = [
  500, 2500, 50000, 750000, 15000000, 150000000, 2500000000, 55000000000,
];
var text;
var prestigeConfirm = false;
var currentTime;

$(document).ready(function () {
  $(window).focus(function () {
    updateProgress();
  });

  game = new Phaser.Game(config);
  $("#optsBall").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#ballShop").show();
    drawShopPanel();
  });
  $("#optsZone").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#zoneShop").show();
    drawShopPanel();
  });
  $("#optsToken").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#tokenShop").show();
    drawShopPanel();
  });
  $("#optsHelp").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#helpShop").show();
    drawShopPanel();
  });

  $(".ballUpgrade").on("click", function () {
    upgradeSpawn(spawns[$(this).attr("value")]);
  });

  $(".zoneUpgrade").on("click", function () {
    upgradeZone(zones[$(this).attr("value")]);
  });

  $(".tokenUpgrade").on("click", function () {
    upgradeToken(tokenUpgrades[$(this).attr("value")]);
  });

  $(".numOpt").on("click", function () {
    $(".numOpt").removeClass("selected");
    $(this).addClass("selected");
    numberFormat = $(this).attr("value");
    drawShopPanel();
  });

  $("#saveGame").on("click", function () {
    if ($(this).html() !== "Saved!") {
      $(this).html("Saved!");
      save();
      setTimeout(function () {
        $("#saveGame").html("Save Game");
      }, 3000);
    }
  });

  $("#saveGame").on("click", function () {
    if ($(this).html() !== "Saved!") {
      $(this).html("Saved!");
      save();
      setTimeout(function () {
        $("#saveGame").html("Save Game");
      }, 3000);
    }
  });

  $("#offlineClose").on("click", function () {
    $("#offlineProgress").hide();
  });

  $("#resetGame").on("click", function () {
    switch (resetCounter) {
      case 0:
        $(this).html("Confirm");
        resetCounter++;
        break;
      case 1:
        $(this).html("Ya Sure?");
        resetCounter++;
        break;
      case 2:
        $(this).html("100%?");
        resetCounter++;
        break;
      case 3:
        try {
          localStorage.removeItem("save");
        } catch (e) { }
        location.reload();
        break;
      default:
        break;
    }
  });

  $("#resetGame").on("mouseleave", function () {
    $(this).html("Hard Reset");
    resetCounter = 0;
  });

  $("#prestige").on("click", function () {
    if (!prestigeConfirm) {
      prestigeConfirm = true;
      $(this).html("Confirm");
    } else {
      prestige();
    }
  });

  $("#prestige").on("mouseleave", function () {
    $(this).html("Prestige");
    prestigeConfirm = false;
  });

});

var gameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
    this.load.image("rectangle", "assets/images/rectangle.png");
    this.load.image("clearRectangle", "assets/images/clearRectangle.png");
    this.load.image("circle", "assets/images/circle.png");
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("pres", "assets/images/pres.png");
    this.load.image("zone", "assets/images/zone.png");
    this.load.image("locked", "assets/images/locked.png");
    this.load.image("unlocked", "assets/images/unlocked.png");
    this.load.image("lockedUpgrade", "assets/images/lockedUpgrade.png");
    this.load.image("lockedStage", "assets/images/lockedStage.png");
    this.load.spritesheet("balls", "assets/images/balls.png", {
      frameWidth: 17,
      frameHeight: 17,
    });
  },

  create: function () {
    scene = this;
    matter = this.matter;
    camera = this.cameras.main;
    camera.setBackgroundColor("rgba(255, 255, 225, 0.5)");
    matter.world.setGravity(0, 0.0005, 1);
    $("#menuContainer").show();
    load();
    drawShopPanel();

    this.input.on("pointermove", (ptr) => {
      if (pointerdown && !isDragging) {
        if (ptr.y - startY != 0) {
          isDragging = true;
          lastY = ptr.y;
        }
      }
      if (isDragging) {
        var dy = ptr.y - lastY;
        dirY += dy;
        lastY = ptr.y;
      }
    });

    this.input.on("pointerup", (ptr, gameobs) => {
      pointerdown = false;
      isDragging = false;
    });

    this.input.on(
      "wheel",
      function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        camera.scrollY += deltaY * 0.5;
      }
    );

    this.adManager = new adManager();

    this.input.on("pointerdown", (ptr) => {
      const scale = 0.2 * tokenUpgrades["click_area"].getValue();
      let target = this.add.image(ptr.worldX, ptr.worldY, "circle").setScale(scale).setAlpha(0.3);
      scene.tweens.add({
        targets: target,
        alpha: 0,
        duration: 300,
        ease: "Linear",
        onComplete: function (tween, targets) {
          target.destroy();
        },
      });

      handleMouseBreak(ptr, scale);
      pointerdown = true;
      dirY = 0;
    });
  },

  update: function () {
    this.adManager.tick();
    if (counter % 600 === 0) {
      currentTime = Date.now();
    }

    camera.scrollY -= dirY / 0.15 / 100;
    dirY -= dirY / 0.6 / 100;
    if (dirY < 3 && dirY > -3) {
      dirY = 0;
    }

    for (var i = 0; i < spawns.length; i++) {
      if (spawns[i].level > 0) {
        let delayFrame = spawns[i].cooldown;
        if (scene.adManager.doubleSpawn) {
          delayFrame = Math.floor(delayFrame / 2);
        }
        if (counter % delayFrame == 0) {
          generateBall(
            spawns[i],
            delayFrame,
          );
        }
      }
    }

    if (counter % saveInterval == 0) {
      save();
    }

    counter++;
    for (let i = balls.length - 1; i >= 0; i--) {
      ball = balls[i];
      if (ball.y > ball.stage * 1500 - 70) {
        const multiplier = tokenUpgrades["zone_multiplier"].getValue().mul(zones[ball.stage - 1].modifier);
        scoreBall(ball, multiplier)
        let survival_chance = tokenUpgrades["ball_survival_chance"].getValue();
        if (scene.adManager.noDespawn) {
          survival_chance = 1;
        }
        if (randomChance() < survival_chance
          && ball.stage < zones.length
          && balls.length < 700
        ) {
          ball.stage++;
        } else {
          ball.destroy();
          balls.splice(i, 1);
        }
      }
    }
    if (
      this.input.mousePointer.y > 575 ||
      this.input.mousePointer.x > 680 ||
      this.input.mousePointer.y < 15 ||
      this.input.mousePointer.x < 0
    ) {
      pointerdown = false;
      isDragging = false;
    }
  },
});

var titleScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  preload: function () {
    this.load.image("logo", "assets/images/logo.png");
    this.load.image("start", "assets/images/start.png");
    this.load.json("logo", "assets/images/logo.json");
    this.load.spritesheet("balls", "assets/images/balls.png", {
      frameWidth: 17,
      frameHeight: 17,
    });
  },

  create: function () {
    console.log("verison 0.1.6");
    var Body = Phaser.Physics.Matter.Matter.Body;
    var Composite = Phaser.Physics.Matter.Matter.Composite;

    this.cameras.main.setBackgroundColor("rgba(255, 255, 225, 0.5)");
    this.matter.world.setGravity(0, 0.0005, 1);

    this.add.line(0, 0, 0, 30, 3000, 30, 0xf84d3e, 0.6);
    this.add.line(0, 0, 0, 70, 3000, 70, 0x0085f3, 0.6);
    this.add.line(0, 0, 0, 50, 3000, 50, 0xd06ab8, 0.6);

    var shapes = this.cache.json.get("logo");

    var composite = Composite.create();

    var fixtures = shapes.logo.fixtures;

    for (var i = 0; i < fixtures.length; i++) {
      var body = Body.create({
        isStatic: true,
      });

      _.each(fixtures[i].vertices, function (arr) {
        _.each(arr, function (r) {
          r.x += 300;
        });
      });

      Body.setParts(body, parseVertices(fixtures[i].vertices));

      Composite.addBody(composite, body);
    }
    this.matter.world.add(composite);
    this.add.sprite(540, 250, "logo");
    var startBtn = this.matter.add
      .image(540, 550, "start")
      .setStatic(true)
      .setInteractive();

    this.input.once(
      "pointerdown",
      function () {
        for (let i = balls.length - 1; i >= 0; i--) {
          ball = balls[i];
          ball.destroy();
          balls.splice(i, 1);
        }
        this.scene.start("gameScene");
      },
      this
    );

    startBtn.on("pointerover", function (pointer) {
      startBtn.setAlpha(0.6);
    });
    startBtn.on("pointerout", function (pointer) {
      startBtn.setAlpha(1);
    });
  },

  update: function () {
    if (counter2 % 20 == 0) {
      var x = Phaser.Math.Between(10, 1090);
      var ball1 = this.matter.add.image(x, 50, "balls", 0);
      ball1.setStatic(true);
      ball1.setScale(0.05);
      this.tweens.add({
        useFrames: true,
        targets: ball1,
        scaleX: 1,
        scaleY: 1,
        duration: 20,
        ease: "Linear",
        onComplete: function () {
          ball1.setStatic(false);
          ball1.setCircle();
          ball1.setFriction(0.01);
          ball1.setBounce(0.5);
          balls.push(ball1);
        },
      });
    }
    if (counter2 % 30 == 0) {
      var x = Phaser.Math.Between(10, 1090);
      var ball2 = this.matter.add.image(x, 70, "balls", 1);
      ball2.setStatic(true);
      ball2.setScale(0.05);
      this.tweens.add({
        useFrames: true,
        targets: ball2,
        scaleX: 1,
        scaleY: 1,
        duration: 30,
        ease: "Linear",
        onComplete: function () {
          ball2.setStatic(false);
          ball2.setCircle();
          ball2.setFriction(0.01);
          ball2.setBounce(0.5);
          balls.push(ball2);
        },
      });
    }
    if (counter2 % 40 == 0) {
      var x = Phaser.Math.Between(10, 1090);
      var ball3 = this.matter.add.image(x, 30, "balls", 2);
      ball3.setStatic(true);
      ball3.setScale(0.05);
      this.tweens.add({
        useFrames: true,
        targets: ball3,
        scaleX: 1,
        scaleY: 1,
        duration: 40,
        ease: "Linear",
        onComplete: function () {
          ball3.setStatic(false);
          ball3.setCircle();
          ball3.setFriction(0.01);
          ball3.setBounce(0.5);
          balls.push(ball3);
        },
      });
    }
    for (let i = balls.length - 1; i >= 0; i--) {
      ball = balls[i];
      if (ball.y > 1500) {
        ball.destroy();
        balls.splice(i, 1);
      }
    }
    counter2++;
  },
});

var config = {
  type: Phaser.AUTO,
  width: 1108,
  height: 595,
  parent: "Game",
  physics: {
    default: "matter",
    matter: {
      enableSleeping: false,
      gravityY: 0.0005,
      setBounds: {
        x: 0,
        y: 0,
        width: 1108,
        height: 2000,
      },
    },
  },
  pixelArt: false,
  scene: [titleScene, gameScene],
};

function generateBall(spawn, delayFrame) {
  let x = Phaser.Math.Between(10, 670);
  let value = spawn.value.mul(tokenUpgrades["ball_multiplier"].getValue());
  if (randomChance() < tokenUpgrades["double_ball_value_chance"].getValue()) {
    value = value.mul(2);
  }
  var ball = this.matter.add.image(x, spawn.y, "balls", spawns.indexOf(spawn));
  ball.setStatic(true);
  ball.setScale(0.05);
  scene.tweens.add({
    useFrames: true,
    targets: ball,
    scaleX: 1,
    scaleY: 1,
    duration: delayFrame,
    ease: "Linear",
    onComplete: function () {
      ball.setStatic(false);
      ball.setCircle();
      ball.setFriction(fric);
      ball.setBounce(0.5);
      ball.stage = spawn.stage;
      ball.value = value;
      balls.push(ball);
    },
  });
}

function generateZone(level = 0) {
  var zone = available_zones[zones.length]
  zones.push(zone);

  matter.world.setBounds(
    0,
    0,
    680,
    (zones.length) * 1500,
    32,
    true,
    true,
    true,
    false
  );
  camera.setBounds(0, 0, 680, zones.length * 1500).setName("main");

  zone.level = level
  zone.build();
  for (var i in spawns) {
    let spawn = spawns[i];
    if (spawn.stage == zones.length) {
      scene.add.line(0, 0, 0, spawn.y, 2000, spawn.y, spawn.color, 0.6)
    }
    spawn.enabled = spawn.stage <= zones.length;
  }

  if (zones.length < available_zones.length) {
    if (!lockedContainer) {
      lockedButton = scene.add.sprite(20, 20, "locked");
      lockedText = scene.add
        .text(-75, 11, "", {
          fontFamily: "Arial",
          fontSize: 16,
          color: "#f61a06",
          lineSpacing: 40,
        })
        .setFontStyle("bold");
      lockedContainer = scene.add
        .container(140, 0, [lockedButton, lockedText])
        .setAlpha(0.8)
        .setSize(280, 55)
        .setInteractive();

      lockedContainer.on("pointerup", function () {
        if (!lockedContainer.locked) {
          generateZone();
          spendMoney(lockedContainer.price);
          dirY = -200;
        }
      });
    }
    lockedContainer.y = zones.length * 1500 - 55;
    const lockPrice = new Decimal(zonePrices[zones.length]);
    lockedContainer.price = new Decimal(lockPrice);
    lockedContainer.list[1].text = displayNumber(lockPrice);
    checkLock();
  } else {
    lockedButton.destroy();
    lockedText.destroy();
  }

  for (j = 0; j < 70; j++) {
    if (j % 2 == 0)
      scene.add.line(
        0,
        0,
        j * 10,
        zones.length * 1500 - 70,
        j * 10 + 10,
        zones.length * 1500 - 70,
        0xf84d3e,
        0.4
      );
  }
}

function upgradeZone(zone) {
  var cost = zone.cost
  if (gameState.money.lt(cost)) {
    return;
  }
  zone.upgrade();
  spendMoney(cost);
}

function upgradeSpawn(spawn) {
  var cost = spawn.cost;
  if (gameState.money.lt(cost)) {
    return -1;
  }
  spawn.level++;
  spendMoney(cost);
}

function upgradeToken(token) {
  var cost = token.getCost();
  if (gameState.tokens.lt(cost) || token.level === token.maxLevel) {
    return -1;
  }
  gameState.tokens = gameState.tokens.minus(cost);
  $("#tokenValue").html(displayNumber(gameState.tokens));
  token.level++;
  checkLock();
  drawShopPanel();
}

function displayNumber(y) {
  if (y == "MAX") {
    return y;
  }
  y = Decimal(y)
  try {
    if (y.e < 9) {
      return y
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      let ret = "";
      let str = y.toPrecision(y.e + 1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      let s0 = str.split(",")[0];
      let s1 = str.split(",")[1].substring(0, 4 - s0.length);
      let e = (str.split(",").length - 1) * 3;
      switch (numberFormat) {
        case "eng":
          ret = s0 + "." + s1 + "e+" + e;
          break;
        case "bad":
          ret = s0 + "." + s1 + " " + suffixes[str.split(",").length - 1 - 2];
          break;
        case "sci":
          ret = y.toPrecision(4);
        default:
          break;
      }
      return ret;
    }
  } catch (err) {
    return y;
  }
}

function checkLock() {
  if (zones.length < available_zones.length) {
    const mod = tokenUpgrades["zone_unlock_cost"].getValue();
    const lockPrice = new Decimal(lockedContainer.price * mod);
    lockedContainer.locked = gameState.money.lt(lockPrice);
    if (lockedContainer.locked) {
      lockedContainer.list[0].setTexture("locked");
      lockedContainer.list[1].setColor("#f61a06");
    } else {
      lockedContainer.list[0].setTexture("unlocked");
      lockedContainer.list[1].setColor("green");
    }
  }
}

function parseVertices(vertexSets, options) {
  var Matter = Phaser.Physics.Matter.Matter;

  var i, j, k, v, z;
  var parts = [];

  options = options || {};

  for (v = 0; v < vertexSets.length; v += 1) {
    parts.push(
      Matter.Body.create(
        Matter.Common.extend(
          {
            position: Matter.Vertices.centre(vertexSets[v]),
            vertices: vertexSets[v],
          },
          options
        )
      )
    );
  }

  // flag coincident part edges
  var coincidentMaxDist = 5;

  for (i = 0; i < parts.length; i++) {
    var partA = parts[i];

    for (j = i + 1; j < parts.length; j++) {
      var partB = parts[j];

      if (Matter.Bounds.overlaps(partA.bounds, partB.bounds)) {
        var pav = partA.vertices,
          pbv = partB.vertices;

        // iterate vertices of both parts
        for (k = 0; k < partA.vertices.length; k++) {
          for (z = 0; z < partB.vertices.length; z++) {
            // find distances between the vertices
            var da = Matter.Vector.magnitudeSquared(
              Matter.Vector.sub(pav[(k + 1) % pav.length], pbv[z])
            ),
              db = Matter.Vector.magnitudeSquared(
                Matter.Vector.sub(pav[k], pbv[(z + 1) % pbv.length])
              );

            // if both vertices are very close, consider the edge concident (internal)
            if (da < coincidentMaxDist && db < coincidentMaxDist) {
              pav[k].isInternal = true;
              pbv[z].isInternal = true;
            }
          }
        }
      }
    }
  }

  return parts;
}

function drawShopPanel() {
  $("#goldValue").html(displayNumber(gameState.money));
  $("#tokenValue").html(displayNumber(gameState.tokens));
  if ($("#ballShop").is(":visible")) {
    for (var i = 0; i < spawns.length; i++) {
      const spawn = spawns[i];
      if (!zones[spawn.stage - 1]) {
        $("#ball" + i + "Value").html("-");
        $("#ball" + i + "Cooldown").html("-");
        $("#ball" + i + "Cost").html("-");
        $("#ball" + i + "Level").html("-");
        $("#ball" + i + "Cost").css("color", "black");
        $("#ball" + i + "Lock").show();
      } else {
        const mod = tokenUpgrades["ball_multiplier"].getValue();
        if (spawn.level === 0) {
          $("#ball" + i + "Value").html(displayNumber(mod.mul(spawn.value)));
          $("#ball" + i + "Cooldown").html(displayNumber(spawn.cooldown));
        } else {
          $("#ball" + i + "Value").html(
            displayNumber(mod.mul(spawn.value)) +
            " > " +
            displayNumber(mod.mul(spawn.next_value))
          );
          $("#ball" + i + "Cooldown").html(
            displayNumber(spawn.cooldown) +
            " > " +
            displayNumber(spawn.next_cooldown)
          );
        }
        let cost = spawn.cost;
        let color = cost.lte(gameState.money) ? "black" : "red";
        $("#ball" + i + "Cost").html(displayNumber(cost));
        $("#ball" + i + "Level").html(spawn.level);
        $("#ball" + i + "Cost").css("color", color);
        $("#ball" + i + "Lock").hide();
      }
    }
  }
  if ($("#zoneShop").is(":visible")) {
    for (var i = 0; i < 8; i++) {
      if (zones.length > i) {
        $("#zone" + i + "Effect").html("Effect: " + zoneStrings[i]);
        const cost = zones[i].cost;
        let color = cost.lte(gameState.money) ? "black" : "red";
        $("#zone" + i + "cost").html(displayNumber(cost));
        $("#zone" + i + "cost").css("color", color);
        const mod = tokenUpgrades["zone_multiplier"].getValue();
        let modifier = new Decimal(zones[i].modifier).mul(mod);
        modifier = Math.round(modifier * 100) + "%";
        $("#zone" + i + "mod").html(modifier);
        $("#zone" + i + "Level").html(zones[i].level);
        $("#zone" + i + "Lock").hide();
      } else {
        $("#zone" + i + "Effect").html("Effect: ? ? ?");
        $("#zone" + i + "cost").html("---");
        $("#zone" + i + "mod").html("---");
        $("#zone" + i + "Level").html("---");
        $("#zone" + i + "Lock").show();
      }
    }
  }
  if ($("#tokenShop").is(":visible")) {
    $("#prestigeToken").html(displayNumber(calcuateTokens()));
    for (let upgrade_name in tokenUpgrades) {
      let tokenUpgrade = tokenUpgrades[upgrade_name];
      // Update bonus and cost
      if (tokenUpgrade.level !== tokenUpgrade.maxLevel) {
        $("#" + upgrade_name + "Value").html(
          displayNumber(tokenUpgrade.getValue().mul(100)) + "% > " +
          displayNumber(tokenUpgrade.getNextValue().mul(100)) + "%"
        );
        const cost = tokenUpgrade.getCost();
        let color = "black";
        if (cost.gte(gameState.tokens)) {
          color = "red";
        }
        $("#" + upgrade_name + "Cost").html(displayNumber(cost));
        $("#" + upgrade_name + "Cost").css("color", color);
      } else {
        $("#" + upgrade_name + "Value").html(
          displayNumber(tokenUpgrade.getValue().mul(100)) + "%"
        );
        $("#" + upgrade_name + "Cost").html("MAX");
      }
      // Update level
      if (tokenUpgrade.maxLevel === undefined) {
        $("#" + upgrade_name + "Level").html(tokenUpgrade.level);
      } else {
        $("#" + upgrade_name + "Level").html(
          (tokenUpgrade.level) + "/" + (tokenUpgrade.maxLevel)
        );
      }
    }
  }
}

function save() {
  const saveSpawns = [];
  _.each(spawns, function (spawn) {
    saveSpawns.push(spawn.level);
  });
  const saveZones = [];
  _.each(zones, function (zone) {
    saveZones.push(zone.level);
  });
  const saveTokenUpgrades = {};
  for (var upgrade_name in tokenUpgrades) {
    saveTokenUpgrades[upgrade_name] = tokenUpgrades[upgrade_name].level
  }
  gameState.time = Date.now();
  gameState.zones = saveZones;
  gameState.spawns = saveSpawns;
  gameState.tokenUpgrades = saveTokenUpgrades;
  if (typeof Storage !== "undefined") {
    localStorage.setItem("save", JSON.stringify(gameState));
  }
}

function load() {
  if (typeof Storage !== "undefined") {
    let save = localStorage.getItem("save");
    if (save) {
      save = JSON.parse(save);
      gameState = save
      gameState.money = new Decimal(gameState.money);
      gameState.totalMoney = new Decimal(gameState.totalMoney);
      gameState.tokens = new Decimal(gameState.tokens);
      gameState.sps = new Decimal(gameState.sps);


      $(".numOpt").removeClass("selected");
      $('.numOpt[value="' + gameState.numberFormat + '"').addClass("selected");

      for (var i = 0; i < save.spawns.length; ++i) {
        spawns[i].level = save.spawns[i]
      }
      for (var i = 0; i < save.zones.length; ++i) {
        generateZone(save.zones[i]);
      }
      for (var i in save.tokenUpgrades) {
        tokenUpgrades[i].level = save.tokenUpgrades[i];
      }
      if (save.zones.length == 0) {
        generateZone();
      }
      if (save.time) {
        currentTime = save.time;
        updateProgress();
        currentTime = Date.now();
      }
      return;
    }
  }
  // Default to generate first zone
  generateZone();
}

function prestige() {
  GAObject.submitEvent("prestige", 1);
  gameState.tokens = gameState.tokens.add(calcuateTokens());
  gameState.money = new Decimal(0);
  gameState.totalMoney = new Decimal(0);
  zones = [];
  lockedContainer = null;
  for (let i = balls.length - 1; i >= 0; i--) {
    ball = balls[i];
    ball.destroy();
  }
  balls = [];
  for (var i in spawns) {
    spawns[i].level = 0
  }
  spawns[0].levelUp()
  save();
  game.scene.getScene("gameScene").scene.restart();
}

function calcuateTokens() {
  let tokenCost = new Decimal(125000);
  let score = new Decimal(gameState.totalMoney);
  let tokens = new Decimal(0);
  const mod = tokenUpgrades["token_multiplier"].getValue()
  while (score.gte(tokenCost)) {
    score = score.minus(tokenCost);
    tokens = tokens.plus(1);
    tokenCost = tokenCost.mul(1.02);
  }
  return tokens.mul(mod).floor();
}

function updateProgress() {
  t = Date.now();
  const millis = (Date.now() - currentTime) / 1000;
  if (millis > 30) {
    let scorePerSecond = calculateScorePerSecond();
    addedScore = scorePerSecond.mul(millis);
    addMoney(addedScore);
    $("#offlineText").html(
      "Inactive for " +
      displayNumber(Math.floor(millis)) +
      " seconds<br/>Total Earned: " +
      displayNumber(addedScore)
    );
    $("#offlineProgress").show();
    drawShopPanel();
  }
}

function calculateScorePerSecond() {
  let scorePerSecond = new Decimal(0);
  for (var i = 0; i < spawns.length; i++) {
    if (spawns[i].level > 0 && zones[spawns[i].stage - 1]) {
      let cooldown = spawns[i].cooldown;
      const mod = tokenUpgrades["ball_multiplier"].getValue();
      const value = mod.mul(spawns[i].value);
      cooldown = cooldown / 100;
      let sps = value / cooldown;
      scorePerSecond = scorePerSecond.plus(sps);
    }
  }
  return scorePerSecond.gt(0) ? scorePerSecond : new Decimal(0);
}

function handleMouseBreak(point, scale) {

  let ballCount = 0;
  let maxDistance = scale * 250 + 7;
  let sqrMaxDistance = maxDistance * maxDistance;
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    let deltaX = ball.x - point.worldX;
    let deltaY = ball.y - point.worldY;
    let sqrDistanceToBall = deltaX * deltaX + deltaY * deltaY;
    if (sqrDistanceToBall < sqrMaxDistance) {
      ballCount++;
      scoreBall(ball, tokenUpgrades["click_multiplier"].getValue());
      ball.destroy();
      balls.splice(i, 1);
    }
  }
  return ballCount;
}

function scoreBall(ball, multiplier = 1) {
  let value = ball.value.mul(multiplier);
  if (scene.adManager.doublePoints) {
    value = value.mul(2);
  }

  if (ball.y > camera.scrollY && ball.y < camera.scrollY + 600) {
    const text = scene.add.text(ball.x, ball.y, displayNumber(value), {
      fontFamily: "Arial",
      fontSize: 12,
      color: "#ffff00",
    });
    scene.tweens.add({
      targets: text,
      y: ball.y - 50,
      duration: 700,
      ease: "Linear",
      onComplete: function (tween, targets) {
        text.destroy();
      },
    });
  }
  addMoney(value);
}

function randomChance() {
  return Phaser.Math.Between(0, 99) / 100;
}

function getEmptyGameState() {
  return {
    money: Decimal(0),
    totalMoney: Decimal(0),
    tokens: Decimal(0),
    sps: Decimal(0),
    time: Date.now(),
    spawns: spawnLevels,
    numberFormat: numberFormat,
    tokenUpgrades: tokenUpgrades,
    zones: [],
  };
}

function addMoney(amount) {
  gameState.money = gameState.money.add(amount)
  gameState.totalMoney = gameState.totalMoney.add(amount);
  $("#goldValue").html(displayNumber(gameState.money));
  checkLock();
  drawShopPanel();
}

function spendMoney(amount) {
  gameState.money = gameState.money.sub(amount)
  checkLock();
  drawShopPanel();
}
