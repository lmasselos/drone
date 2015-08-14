var Cylon = require('cylon');
var utils = require('./utils/droneUtils.js');
var bot;

// Initialise the robot
Cylon.robot()
    .connection("ardrone", {
        adaptor: 'ardrone',
        port: '192.168.1.1'
    })
    .device("drone", {
        driver: "ardrone",
        connection: "ardrone"
    })
    .device("nav", {
        driver: "ardrone-nav",      // Combine with a second device to have more information
        connection: "ardrone"
    })
    .on("ready", fly);

function fly(robot) {
    bot = robot;

    bot.drone.getPngStream().on("data", utils.sendFrame);
    utils.instructionListener.on('move', moveDrone);

    bot.drone.disableEmergency();
    bot.drone.ftrim();

    bot.drone.takeoff();
    bot.drone.hover(15);

    bot.drone.right(0.3);
    after(18 * 1000, function () {
        bot.drone.right(0);
    });

    bot.drone.back(0.1);
    after(21 * 1000, function () {
        bot.drone.back(0);
    });

    bot.drone.left(0.1);
    after(24 * 1000, function () {
        bot.drone.left(0);
    });

    bot.drone.forward(0.1);
    after(27 * 1000, function () {
        bot.drone.forward(0);
    });


    after(30 * 1000, function () {
        bot.drone.land();
    });

    after(35 * 1000, function () {
        bot.drone.stop();
    });
}

function moveDrone(move) {
    console.log("received", move);
    if (move.left) {
        console.log("Moving left");
        bot.drone.left(0.2);
        bot.drone.forward(0);
        after(0.5*1000, function() {
            bot.drone.left(0);
            bot.drone.forward(0.05);
        });
    }

    if (move.right) {
        console.log("Moving right");
        bot.drone.right(0.2);
        bot.drone.forward(0);
        after(0.5*1000, function() {
            bot.drone.right(0);
            bot.drone.forward(0.05);
        });
    }
}

Cylon.start();