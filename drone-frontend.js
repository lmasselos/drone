var tracker;

function init() {
    tracker = initTracker("#droneView");
    droneConnection.connect(tracker, "#droneView .drone");
}

function initTracker(element) {
    var tracker = new tracking.ColorTracker();
    TrackerUtils.addTrackingColor("#A94A45", "red", tracker);
    TrackerUtils.addTrackingColor("#5EA24E", "green", tracker);
    TrackerUtils.startTrackingColors(tracker);

    tracker.on('track', function(event) {
        markColors(event.data, element);
        decideDroneMovement(event.data);
    });

    return tracker;
}

function markColors(colors, element) {
    var canvas = $(element + ' .canvas').get(0);
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    $(element + " .output").empty();
    for (var i = 0; i &lt; colors.length; i++) {
        drawRectangle(colors[i], context);
        writeRectangle(colors[i], element + " .output");
    }
}


function drawRectangle(rect, context) {
    context.strokeStyle = rect.color;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    context.font = '11px Helvetica';
    context.fillStyle = "#fff";
    context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
    context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
}


function writeRectangle(rect, element) {
    $(element)
        .append("&lt;p&gt;")
        .append(rect.color + ": " + rect.width + "X" + rect.height)
        .append(" @ " + rect.x + ":" + rect.y)
}

function decideDroneMovement(colors) {
    var move = {
        left: false,
        right: false
    };

    colors.forEach(function(rectangle) {
        if (rectangle.color === "green") {
            if (rectangle.width &gt; 250) {
                move.left = true;
            }
        }

        else if (rectangle.color === "red") {
            if (rectangle.width &gt; 250) {
                move.right = true;
            }
        }

    });

    console.log("Move", move);
    droneConnection.send(move);
}


window.addEventListener("load", init);