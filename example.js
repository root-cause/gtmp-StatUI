var res = API.getScreenResolutionMaintainRatio();

var testStatBox = null;
var statItems = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

API.onResourceStart.connect(function() {
    testStatBox = resource.StatUI.createStatBox((res.Width / 2) - (431 / 2), res.Height / 2); // 431 = size of the statbox

    var damageStat = resource.StatUI.createStatItem("Damage", 40, 50); // stat's current value: 40, stat's max value: 50
    damageStat.parent = testStatBox; // adding StatItem to a StatBox - method 1

    var reloadStat = resource.StatUI.createStatItem("Reload Speed", 10, 10);
    testStatBox.addItem(reloadStat); // adding StatItem to a StatBox - method 2

    var ammoStat = resource.StatUI.createStatItem("Max. Ammo", 500, 10000);
    testStatBox.addItem(ammoStat);

    statItems.push(damageStat);
    statItems.push(reloadStat);
    statItems.push(ammoStat);

    testStatBox.visible = true;
});

API.onKeyDown.connect(function(e, key) {
    // Pressing E will toggle the visibility of stat box
    if (key.KeyCode == Keys.E) {
        testStatBox.visible = !testStatBox.visible;
    }

    // Pressing R will randomize values of stat items
    if (key.KeyCode == Keys.R) {
        for (var i = 0; i < statItems.length; i++) statItems[i].value = getRandomInt(0, statItems[i].maxValue);
    }
});

API.onResourceStop.connect(function() {
    testStatBox.delete();
});