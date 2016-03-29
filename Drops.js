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
    this.data.drop().instance = this.$('>')[0];
    this.data.drop().tick();
});

// Remove initialized instance from drop.
Template.DropsInstance.onDestroyed(function() {
    if (this.data.drop()) delete this.data.drop().instance;
});