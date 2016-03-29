// Class of one drop. Building automatically in the template.
// new Drop(data?: Data)
Drop = function(data) {
    
    if (!(this instanceof Drop))
        return new Drop(data);
    
    // Default data
    this.data = new Drop.Data();
    
    // Reset data.
    this.tick(data);
};

// It recalculates the position of drop, and merge old data with new data.
// drop.tick(data?: Data)
Drop.prototype.tick = function(data) {
    if (data) {
        lodash.mergeWith(this.data, data, function(dst, src, key) {
            if (key in ['instance', 'anchor', '_anchor']) return src;
        });
    }
    
    // If anchor sended.
    if (this.data.anchor) {
        
        // Recalculate anchor coordinates.
        this.data._anchor = Drop.coordinates(this.data.anchor, this.data.placement);
        
        // Apply recalculated position to instance.
        if (this.data._instance) {
            Drop.instances.update(
                this.data._instance,
                { $set: this.calc() }
            );
        }
    }
};

// It shows drop if hidden, and merge old data with new data.
// Need for this.data.anchor field.
// drop.show(data?: Data)
Drop.prototype.show = function(data) {
    
    if (!this.data.anchor)
        throw new Meteor.Error('Anchor is not defined.');
    
    // Reset data.
    this.tick(data);
    
    if (!this.data._instance) {
        // Pregenerated id for prepare _instances storage.
        var _id = Random.id();
        Drop._instances[_id] = this;
        // Put instance into data context.
        this.data._instance = Drop.instances.insert(
            lodash.merge({
                _id: _id
            }, this.calc())
        );
        
        if (this.data.parent && this.data.parent._instance) {
            Drop.nesting.link.insert(
                Drop.instances.findOne(this.data.parent._instance),
                Drop.instances.findOne(this.data._instance)
            );
        }
    }
    
    // Reset data.
    this.tick(data);
};

// It hides drop if shown.
// drop.hide()
Drop.prototype.hide = function() {
    if (this.data._instance) {
        Drop.instances.remove(this.data._instance);
    }
};

// Construct and return trigger by name of trigger in `Drop.triggers` object.
// drop.trigger(name: String) => Trigger
Drop.prototype.trigger = function(name) {
    if (Drop.triggers[name])
        return new Drop.triggers[name](this);
}

// Calculate instance keys and values.
// Need for this.data._anchor field.
// drop.calc() => Object
Drop.prototype.calc = function() {
    var result = {};
    
    // Reactive template and theme switch
    if (this.data.theme) result.theme = this.data.theme;
    if (this.data.template) result.template = this.data.template;
    
    // Placement can be changed.
    result.placement = this.data.placement?this.data.placement:'global';
    
    result.direction = this.data.direction?this.data.direction:'top';
    
    // Positioning of drop instance without knowledge about size of drop.
    
    if (this.data.location == 'outside') {
        result.directionKey = Drop.invert(result.direction);
        result.directionValue = this.data._anchor[result.directionKey] + this.data._anchor[Drop.insize(result.directionKey)];
    } else if (this.data.location == 'inside') {
        result.directionKey = result.direction;
        result.directionValue = this.data._anchor[result.directionKey];
    }
    
    // For example if direction is top then additional is left.
    result.additionalKey = Drop.rotate(result.directionKey);
    
    // It is important! On first calling for instance, template is not yet rendered.
    // Should be safe to display drop but not show it.
    
    if (!this.instance) {
        
        // Print off the screen for a moment
        result.directionKey = 'top';
        result.directionValue = -9999999;
        result.additionalKey = 'left';
        result.additionalValue = -9999999;
        
    } else {
        
        result.positionValue = typeof(this.data.position) == 'number'?this.data.position:0.5;
        result.alignmentValue = typeof(this.data.alignment) == 'number'?this.data.alignment:0.5;
        
        result.width = $(this.instance).outerWidth();
        result.height = $(this.instance).outerHeight();
        
        // Calculate currect drop coordinates seeing position and alignment.
        result.additionalValue =
            this.data._anchor[result.additionalKey] + (
                this.data._anchor[Drop.insize(result.additionalKey)] * result.positionValue
            ) - (
                result[Drop.insize(result.additionalKey)] * result.alignmentValue
            );
    }
    
    return result;
};