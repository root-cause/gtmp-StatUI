const barWidth = 200;
const barHeight = 10;

var statBoxes = [];

// StatBox class
class StatBox {
    constructor(x, y) {
        this.drawX = x;
        this.drawY = y;
        this.items = [];
        this.visible = false;
    }

    render() {
        if (!this.visible || this.items.length < 1) return;
        API.drawGameTexture("commonmenu", "gradient_bgd", this.drawX, this.drawY, 431, (this.items.length * 40) + 10, 0, 255, 255, 255, 255);
        for (var i = 0; i < this.items.length; i++) this.items[i].render(i * 40);
    }

    addItem(item) {
        if (item._parent != null) item._parent.removeItem(item);
        item._parent = this;
        this.items.push(item);
    }

    removeItem(item) {
        var index = this.items.indexOf(item);
        if (index !== -1) {
            item._parent = null;
            this.items.splice(index, 1);
        }
    }

    clear() {
        for (var i = 0; i < this.items.length; i++) this.items[i]._parent = null;
        while (this.items.length) this.items.pop();
    }

    delete() {
        var index = statBoxes.indexOf(this);
        if (index !== -1) {
            for (var i = 0; i < this.items.length; i++) this.items[i]._parent = null;
            statBoxes.splice(index, 1);
        }
    }
}

// StatItem class
class StatItem {
    constructor(name, currentValue, maxValue) {
        this.name = name;
        this._value = clamp(currentValue, 0, maxValue);
        this._maxValue = maxValue;
        this._parent = null;
    }

    render(offset) {
        if (this._parent == null) return;
        API.drawText(this.name, this._parent.drawX + 10, this._parent.drawY + offset + 10, 0.35, 255, 255, 255, 255, 0, 0, false, false, 0);
        API.drawRectangle(this._parent.drawX + 219, this._parent.drawY + offset + 22, barWidth, barHeight, 155, 155, 155, 255);
        API.drawRectangle(this._parent.drawX + 219, this._parent.drawY + offset + 22, (barWidth / this._maxValue) * this._value, barHeight, 255, 255, 255, 255);
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = clamp(newValue, 0, this._maxValue);
    }

    get maxValue() {
        return this._maxValue;
    }

    set maxValue(newMaxValue) {
        this._maxValue = newMaxValue;
        if (this._value > newMaxValue) this._value = newMaxValue;
    }

    get parent() {
        return this._parent;
    }

    set parent(newParent) {
        if (this._parent != null) {
            var index = this._parent.items.indexOf(this);
            if (index !== -1) this._parent.items.splice(index, 1);
        }

        this._parent = newParent;
        if (newParent != null) newParent.items.push(this);
    }
}

// functions
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function createStatBox(x, y) {
    var newBox = new StatBox(x, y);
    statBoxes.push(newBox);

    return newBox;
}

function createStatItem(name, currentValue, maxValue) {
    return new StatItem(name, currentValue, maxValue);
}

// events
API.onUpdate.connect(function() {
    if (statBoxes.length < 1) return;
    for (var i = 0; i < statBoxes.length; i++) statBoxes[i].render();
});