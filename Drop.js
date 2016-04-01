Template.DropCore.onRendered(function() {
    var data = this.data.data;
    data.anchor = this.$('>')[0];
    data.__drop = new Drop(data);
    if (data.trigger)
        data._trigger = data.__drop.trigger(data.__drop.data.trigger);
    data.__drop.watchWindow().watchDrag();
});

Template.DropCore.onDestroyed(function() {
    if (this.data.data.__drop) this.data.data.__drop.hide();
});

Template.Drop.helpers({
    id: function() { return Random.id(); },
    setContent: function(elseBlock) { this.content = elseBlock; }
});