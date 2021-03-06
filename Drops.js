Template.Drops.helpers({
    
    // List of drop instances for current drops placement.
    drops: function() {
        return Drop.instances.find({
            placement: this.placement
        });
    },
    
    plugin: function() {
        return Drop._momentum;
    }
});

// Initialize one instance in drop.
Template.DropsInstance.onRendered(function() {
    this.data.drop().tick();
});