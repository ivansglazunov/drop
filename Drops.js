Template.Drops.helpers({
    
    // List of drop instances for current drops placement.
    drops: function() {
        return Drop.instances.find({
            placement: this.placement
        });
    }
});

Template.DropsInstance.helpers({
    contentDrop: function() {
        if (this.drop() && this.drop().data.content) return this.drop().data.content;
        return null;
    }
});

// Initialize one instance in drop.
Template.DropsInstance.onRendered(function() {
    this.data.drop().tick();
});