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
    direction: { type: String, optional: true, defaultValue: 'top' },
    layer: { type: Number, optional: true, defaultValue: 9999 },
    
    // prepare fields
    directionKey: { type: String, optional: true },
    directionValue: { type: Number, decimal: true, optional: true },
    additionalKey: { type: String, optional: true },
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
            else if (this.isUpdate) {
                if (Drop.instances.findOne(this.docId).prepare) {
                    return false;
                }
            }
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
    if (lodash.includes(fieldNames, 'theme') && lodash.includes(fieldNames, 'template') && lodash.includes(fieldNames, 'direction') && lodash.includes(fieldNames, 'placement')) {
        if(!('$set' in modifier)) modifier.$set = {};
        modifier.$set.prepare = true;
    }
});

// Insurance changes in drop size.
Drop.instances.find({}).observe({
    changed: function(newInstance, oldInstance) {
        if (newInstance.prepare) {
            Meteor.setTimeout(function() {
                Drop._instances[newInstance._id].tick();
            }, 0);
        }
    }
});

// Drops storage by instances id.
Drop._instances = {};