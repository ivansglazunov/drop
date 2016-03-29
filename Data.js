Drop.Data = class {
    constructor() {
        this.trigger = 'toggle';
        this.template = undefined;
        this.theme = undefined;
        this.placement = 'global';
        this.location = 'outside';
        this.direction = 'top';
        this.position = 0.5;
        this.alignment = 0.5;
    };
    instance() {
        return Drop.instances.findOne(this._instance);
    };
};