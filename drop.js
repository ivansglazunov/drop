Drop = Template.Drop;

Drop._invert = { 'top': 'bottom', 'right': 'left', 'bottom': 'top', 'left': 'right', 'horizontal': 'vertical', 'vertical': 'horizontal', 'center': 'center', 'middle': 'middle' };

Drop._identity = { 't': 'top', 'r': 'right', 'b': 'bottom', 'l': 'left', 'm': 'middle', 'c': 'center' };

Drop._inaxys = { 'top': 'vertical', 'bottom': 'vertical', 'left': 'horizontal', 'right': 'horizontal' };

Drop._inpositions = { 'horizontal': 'left', 'vertical': 'top' };

Drop._axisize = { 'horizontal': 'width', 'vertical': 'height' };

Drop._numpositions = { 'left': 0, 'top': 0, 'center': 0.5, 'middle': 0.5, 'right': 1, 'bottom': 1 };

Drop.InstanceSchema = new SimpleSchema({
    template: {
        type: String,
        custom: function() {
            if (!(this.value in Template)) return 'notAllowed';
        }
    },
    trigger: {
        type: String
    },
    position: {
        type: [String],
        optional: true,
        minCount: 1,
        defaultValue: ['tcc']
    },
    _position: {
        type: new SimpleSchema({
            axis: { type: String },
            direction: { type: String },
            primaryKey: { type: String },
            secondaryKey: { type: String },
            primaryValue: { type: Number, decimal: true },
            secondaryValue: { type: Number, decimal: true },
            outerKey: { type: String },
            innerKey: { type: String },
            outerValue: { type: Number, decimal: true },
            innerValue: { type: Number, decimal: true },
            arrow: { type: Number, decimal: true },
            layer: { type: Number }
        }),
        optional: true
    }
});

Drop.instances = new Mongo.Collection(null, { ref: 'templ:drop.instances' });
Drop.instances.attachSchema(Drop.InstanceSchema);

Drop.nesting = new Mongo.Collection(null, { ref: 'templ:drop.nesting' });
Drop.nesting.attachGraph();
Drop.nesting.selection = Shuttler.Selection(Drop.nesting, { source: 'source' })
    .byPaths(Drop.nesting, { sources: ['source'], targets: ['target'] })
    .watchSelections().watchPaths(Drop.nesting)
    .recursionProtection()

Drop._triggers = {};

Drop._triggers.toggle = function() {
    var template = this;
    var instance;
    $(template.data._anchor).click(function() {
        if (instance) {
            Drop.hide(instance);
            instance = undefined;
        } else {
            instance = Drop.show(template.data._anchor, template.data);
        }
    });
};

Drop._triggers.tooltip = function() {
    var template = this;
    var instance;
    $(template.data._anchor).hover(function() {
        instance = Drop.show(template.data._anchor, template.data);
    }, function() {
        Drop.hide(instance);
        instance = undefined;
    });
};

Drop._triggers.dropmenu = function() {
    var template = this;
    var instance;
    
    template.data._timeout = undefined;
    
    template.data._setTimeout = function() {
        if (!template.data._timeout) {
            template.data._timeout = Meteor.setTimeout(function() {
                Drop.hide(instance);
                instance = undefined;
            }, Drop._triggers.dropmenu.delay);
        }
    };
    
    template.data._clearTimeout = function() {
        Meteor.clearTimeout(template.data._timeout);
        template.data._timeout = undefined;
    };
    
    template.data._watchInstance = function(instance) {
        $('[data-drop-instance='+instance+']').hover(function() {
            template.data._clearTimeout();
        }, function() {
            template.data._setTimeout();
        });
    };
    
    $(template.data._anchor).hover(function() {
        template.data._clearTimeout();
        
        if (!instance) {
            instance = Drop.show(template.data._anchor, template.data);
            
            template.data._watchInstance(instance);
            
            var observer = Drop.nesting.links.find.source(instance, Drop.nesting.selection.selectedQuery()).observe({
                added: function(nest) {
                    template.data._watchInstance(nest._target.id);
                }
            });
        }
    }, function() {
        template.data._setTimeout();
    });
};

Drop._triggers.dropmenu.delay = 50;

Drop._layer = 999999;

// (name: String, anchor: Coordinates, instance: Document) => Position
Drop._position = function(name, anchor, instance) {
    var name = name.split('');
    if (!name[0]) name[0] = 't';
    var position = {};
    position.direction = Drop._identity[name[0]];
    position.axis = Drop._inaxys[position.direction];
    if (!name[1]) {
        name[1] = position.axis == 'horizontal' ? 'm' : 'c';
    }
    if (!name[2]) {
        name[2] = position.axis == 'horizontal' ? 'm' : 'c';
    }
    position.primaryKey = Drop._invert[position.direction];
    position.secondaryKey = Drop._inpositions[Drop._invert[position.axis]];
    position.primaryValue = anchor[position.primaryKey] + anchor[Drop._axisize[position.axis]];
    position.outerKey = Drop._identity[name[1]];
    position.outerValue = Drop._numpositions[position.outerKey];
    position.innerKey = Drop._identity[name[2]];
    position.innerValue = Drop._numpositions[Drop._invert[position.innerKey]];
    position.secondaryValue = anchor[position.secondaryKey] + (anchor[Drop._axisize[Drop._inaxys[position.secondaryKey]]] * position.outerValue) - ($('[data-drop-instance='+instance._id+']')[Drop._axisize[Drop._inaxys[position.secondaryKey]]]() * position.innerValue);
    position.arrow = position.innerValue * $('[data-drop-instance='+instance._id+']')[Drop._axisize[Drop._inaxys[position.secondaryKey]]]();
    position.layer = Drop._layer;
    return position;
};

Drop._data = {};

Drop._anchors = {};

Drop.instances.after.remove(function(userId, doc) {
    var doc = Drop.instances._transform(doc);
    delete Drop._data[doc._id];
    Drop.nesting.remove(lodash.merge(doc.Ref('_source'), Drop.nesting.selection.selectorQuery()));
});

Drop.instances.after.update(function(userId, doc) {
    var doc = Drop.instances._transform(doc);
    Drop.nesting.links.find.source(doc, Drop.nesting.selection.selectorQuery()).forEach(function(nesting) {
        Drop.tick(nesting._target.id, Drop._data[nesting._target.id]._anchor);
    });
});

Drop.nesting.after.remove(function(userId, doc) {
    Drop.instances.remove(doc._target.id);
});

// (anchor: HTMLElement|Coordinates, data: Object) => instance: String
Drop.show = function(anchor, data) {
    var anchor = Drop.coordinates(anchor);
    var instance = Drop.instances.insert({
        template: data.template,
        trigger: data.trigger,
        position: data.position.split(' ')
    });
    Drop._data[instance] = data;
    Drop._anchors[data._anchorId].push(instance);
    if (data.parent) {
        Drop.nesting.link.insert(Drop.instances.findOne(data.parent), Drop.instances.findOne(instance));
    }
    Drop.tick(instance, anchor);
    return instance;
};

// (instance: String)
Drop.hide = function(instance) {
    if (Drop._data[instance])
        lodash.remove(Drop._anchors[Drop._data[instance]._anchorId], function(_instance) { return _instance == instance; });
    Drop.instances.remove(instance);
};

// (instance: String, anchor: HTMLElement|Coordinates)
Drop.tick = function(instance, anchor) {
    var anchor = Drop.coordinates(anchor);
    var instance = Drop.instances.findOne(instance);
    if (instance) {
        var positions = {}
        for (var p in instance.position) {
            positions[instance.position[p]] = Drop._position(instance.position[p], anchor, instance);
        }
        var position = positions[instance.position[0]];
        Drop.instances.update(instance._id, { $set: {
            '_position': position
        }});
    }
};

// (anchor: HTMLElement|Coordinates) => Coordinates
Drop.coordinates = function(anchor) {
    if (lodash.isElement(anchor)) {
        var $anchor = $(anchor);
        var offset = $anchor.offset();
        var result = { left: offset.left, top: offset.top, width: $anchor.outerWidth(), height: $anchor.outerHeight() };
    } else {
        var result = anchor;
    }
    result.right = $(window).width() - result.width - result.left;
    result.bottom = $(window).height() - result.height - result.top;
    return result;
};

Template.Drop.onRendered(function() {
    if (!this.data.trigger) this.data.trigger = 'toggle';
    if (!this.data.position) this.data.position = 'tcc';
    
    this.data._anchor = this.$('>')[0];
    this.data._anchorId = Random.id();
    Drop._anchors[this.data._anchorId] = [];
    $(this.data._anchor).attr('data-drop-anchor', this.data._anchorId);
    
    Drop._triggers[this.data.trigger].call(this);
});

Template.Drop.onDestroyed(function() {
    delete Drop._anchors[this.data._anchorId];
});

Template.Drops.helpers({
    drops: function() {
        return Drop.instances.find();
    }
});

Template.Drop.helpers({
    setElseBlock: function(block) {
        window._elseBlock = this._elseBlock = block;
    }
});

Template.DropInstance.onRendered(function() {
    Drop.tick(this.data._id, this.data._anchor);
});

Template.DropInstance.helpers({
    data: function() {
        return lodash.merge(this, Drop._data[this._id]);
    },
    contentDrop: function() {
        if (this.data && this.data._elseBlock) return this.data._elseBlock;
        return null;
    }
});