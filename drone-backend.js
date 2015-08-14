var Cylon = require('cylon');
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
        driver: "ardrone-nav",
        connection: "ardrone"
            })

        .on("ready", fly);


// Fly the bot
function fly(robot) {

   bot = robot;

    bot.drone.disableEmergency();
    bot.drone.ftrim();

    bot.drone.takeoff();

    bot.drone.right(0.3);
    after(7*1000, function() {
        bot.drone.right(0);

    after(10*1000, function(){
    bot.drone.land();
    });

    after(15*1000, function() {
    bot.drone.stop();
    });

    });

bot.drone.config('general:navdata_demo', 'TRUE');
bot.nav.on("navdata", function(data) {
    console.log(data);


});

    bot.nav.on("altitudeChange", function(data) {
        console.log("Altitude:", data);
        if (altitude > 2) {
            bot.drone.land();
        }
    });
}

Cylon.start();



