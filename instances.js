// Instances needed for the reactive drops control.
// They store only calculated data needed to rendering.
Drop.instances = new Mongo.Collection(null, { ref: 'templ:drop/instances' });
Drop.instances.attachSchema(new SimpleSchema({
    template: {
        type: String, optional: true,
        autoValue: function() { if (!this.value) return Drop._template; }
    },
    theme: {
        type: String, optional: true,
        autoValue: function() { if (!this.value) return Drop._theme; }
    },
    placement: { type: String },
    direction: { type: String, optional: true },
    layer: { type: Number, optional: true, defaultValue: 9999 },
    directionKey: { type: String, optional: true },
    directionValue: { type: Number, decimal: true, optional: true },
    additionalKey: { type: String, optional: true },
    additionalValue: { type: Number, decimal: true, optional: true },
    positionValue: { type: Number, decimal: true, optional: true },
    alignmentValue: { type: Number, decimal: true, optional: true },
    width: { type: Number, decimal: true, optional: true },
    height: { type: Number, decimal: true, optional: true }
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

// Insurance changes in drop size.
Drop.instances.find({}).observe({
    changed: function(newInstance, oldInstance) {
        Meteor.setTimeout(function() {
            if (Drop._instances[newInstance._id]) {
                var $drop = $(Drop._instances[newInstance._id].instance);
                if (
                    (oldInstance.width > $drop.width() + 5 || oldInstance.width < $drop.width() - 5)
                    ||
                    (oldInstance.height > $drop.height() + 5 || oldInstance.height < $drop.height() - 5)
                ) {
                    Drop._instances[newInstance._id].tick();
                }
            }
        }, 50);
    }
});

// Drops storage by instances id.
Drop._instances = {};