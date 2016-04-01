// Instances needed for the reactive drops control.
// They store only calculated data needed to rendering.
Drop.instances = new Mongo.Collection(null, { ref: 'templ:drop/instances' });
Drop.instances.attachSchema(new SimpleSchema({
    // templating settings
    template: {
        type: String, optional: true,
        autoValue: function() { if (!this.value) return Drop._template; }
    },
    theme: {
        type: String, optional: true,
        autoValue: function() { if (!this.value) return Drop._theme; }
    },
    placement: { type: String, optional: true, defaultValue: 'global' },
    location: { type: String, optional: true, defaultValue: 'outside', allowedValues: ['outside', 'inside'] },
    direction: { type: String, optional: true, defaultValue: 'top', allowedValues: ['top', 'right', 'bottom', 'left'] },
    layer: { type: Number, optional: true, defaultValue: 9999 },
    
    // prepare fields
    directionKey: { type: String, optional: true, allowedValues: ['top', 'right', 'bottom', 'left'] },
    directionValue: { type: Number, decimal: true, optional: true },
    additionalKey: { type: String, optional: true, allowedValues: ['top', 'right', 'bottom', 'left'] },
    additionalValue: { type: Number, decimal: true, optional: true },
    
    // unprepare fields
    positionValue: { type: Number, decimal: true, optional: true },
    alignmentValue: { type: Number, decimal: true, optional: true },
    width: { type: Number, decimal: true, optional: true },
    height: { type: Number, decimal: true, optional: true },
    
    // prepare state
    prepare: {
        type: Boolean, optional: true,
        autoValue: function() {
            if (this.isInsert) return true;
        }
    }
}));

Drop.instances.helpers({
    drop: function() {
        return Drop._instances[this._id];
    },
    arrowDirection: function() {
        if (this.drop().data.location == 'outside')
            return this.direction;
        else
            return Drop.invert(this.direction);
    },
    arrowValue: function() {
        return this.alignmentValue * this[Drop.insize(this.additionalKey)];
    }
});

Drop.instances.before.update(function(userId, doc, fieldNames, modifier, options) {
    if(!('$set' in modifier)) modifier.$set = {};
    if (!lodash.includes(fieldNames, 'prepare')) {
        modifier.$set.prepare = false;
    }
});

var keys = ['template', 'theme', 'placement', 'direction', 'layer', 'location'];
Drop.instances.after.update(function(userId, doc, fieldNames, modifier, options) {
    for (var k in keys) {
        if (this.previous[keys[k]] != doc[keys[k]]) {
            Drop.instances._transform(doc).drop().hide().show();
            break;
        }
    }
});

// Drops storage by instances id.
Drop._instances = {};