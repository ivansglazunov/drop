Drop.nesting = new Mongo.Collection(null, { ref: 'templ:drop/nesting' });
Drop.nesting.attachGraph();
Drop.nesting.selection = Shuttler.Selection(Drop.nesting, { source: 'source' })
    .byPaths(Drop.nesting, { sources: ['source'], targets: ['target'] })
    .watchSelections().watchPaths(Drop.nesting)
    .recursionProtection()

Drop.instances.after.remove(function(userId, instance) {
    var instance = Drop.instances._transform(instance);
    var drop = instance.drop();
    delete Drop._instances[drop.data._instance];
    delete drop.data._instance;
    Drop.nesting.remove(lodash.merge(instance.Ref('_source'), Drop.nesting.selection.selectorQuery()));
});

Drop.instances.after.update(function(userId, instance) {
    var instance = Drop.instances._transform(instance);
    Drop.nesting.links.find.source(instance, Drop.nesting.selection.selectorQuery()).forEach(function(nesting) {
        var target = nesting.target();
        if (target) target.drop().tick();
    });
});

Drop.nesting.after.remove(function(userId, nest) {
    Drop.instances.remove(nest._target.id);
});