Drop.triggers = {};

Drop.Trigger = class {
    constructor(drop) {
        if (!drop.data.anchor)
            throw new Meteor.Error('Anchor is not defined.');
        this.drop = drop;
    }
};

// Anchor click to toggle drop.
// new Drop.triggers.toggle(drop: Drop)
Drop.triggers.toggle = class extends Drop.Trigger {
    constructor(drop) {
        super(drop);
        this.handler = function () { 
            if (drop.data._instance) drop.hide();
            else drop.show();
        }
        $(drop.data.anchor).on('click', this.handler);
    };
    destroy() {
        $(this.drop.data.anchor).off('click', this.handler);
    };
};

// Anchor hover.
// new Drop.triggers.tooltip(drop: Drop)
Drop.triggers.tooltip = class extends Drop.Trigger {
    constructor(drop) {
        super(drop);
        this.mouseenter = () => {
            this.clear();
            this.pause = true;
            Meteor.setTimeout(() => { this.pause = false; }, 500);
            drop.show();
        }
        this.mouseleave = () => {
            this.clear();
            if (this.pause) this.close();
            else drop.hide();
        }
        this.close = () => {
            if (!this.timeout)
                this.timeout = Meteor.setTimeout(function() { drop.hide(); }, 500);
        }
        this.clear = () => {
            Meteor.clearTimeout(this.timeout);
            delete this.timeout;
        }
        $(drop.data.anchor).on('mouseenter', this.mouseenter);
        $(drop.data.anchor).on('mouseleave', this.mouseleave);
    };
    destroy() {
        $(this.drop.data.anchor).off('mouseenter', this.mouseenter);
        $(this.drop.data.anchor).off('mouseleave', this.mouseleave);
    };
};

// Anchor and drop hover.
// new Drop.triggers.dropmenu(drop: Drop)
Drop.triggers.dropmenu = class extends Drop.Trigger {
    constructor(drop) {
        super(drop);
        this.delay = Drop.triggers.dropmenu.delay;
        this.watch = (_instance) => {
            $('[data-templ-drop='+_instance+']').hover(() => { this.clear(); }, () => { this.close(); });
        };
        this.mouseenter = () => {
            this.clear();
            if (!drop.data._instance) {
                drop.show();
                this.watch(drop.data._instance);
                this.observer = Drop.nesting.links.find.source(drop.data._instance, Drop.nesting.selection.selectedQuery()).observe({
                    added: (nest) => { this.watch(nest._target.id); }
                });
            }
        }
        this.mouseleave = () => {
            this.clear();
            this.close();
        }
        this.close = () => {
            if (!this.timeout)
                this.timeout = Meteor.setTimeout(() => {
                    drop.hide();
                    if (this.observer) this.observer.stop();
                }, this.delay);
        }
        this.clear = () => {
            Meteor.clearTimeout(this.timeout);
            delete this.timeout;
        }
        $(drop.data.anchor).on('mouseenter', this.mouseenter);
        $(drop.data.anchor).on('mouseleave', this.mouseleave);
    };
    destroy() {
        $(this.drop.data.anchor).off('mouseenter', this.mouseenter);
        $(this.drop.data.anchor).off('mouseleave', this.mouseleave);
    };
};

Drop.triggers.dropmenu.delay = 50;

// Anchor click to show, outside click to hide.
// new Drop.triggers.dropdown(drop: Drop)
Drop.triggers.dropdown = class extends Drop.Trigger {
    constructor(drop) {
        super(drop);
        this.watch = (_instance) => {
            $('[data-templ-drop='+_instance+']').hover(
                () => { this.hover = true; },
                () => { this.hover = false; }
            );
        };
        this.document = () => {
            if (this.anchor) return this.anchor = false;
            if (!this.hover) {
                drop.hide();
            }
        };
        this.click = () => {
            if (!drop.data._instance) {
                this.anchor = true;
                drop.show();
                this.watch(drop.data._instance);
                this.observer = Drop.nesting.links.find.source(drop.data._instance, Drop.nesting.selection.selectedQuery()).observe({
                    added: (nest) => { this.watch(nest._target.id); }
                });
            }
        }
        $(drop.data.anchor).on('click', this.click);
        $(document).on('click', this.document);
    };
    destroy() {
        $(this.drop.data.anchor).off('click', this.click);
        $(document).off('click', this.document);
    };
};

// Anchor click to show, everywhere click to hide.
// new Drop.triggers.popover(drop: Drop)
Drop.triggers.popover = class extends Drop.Trigger {
    constructor(drop) {
        super(drop);
        this.document = () => {
            if (this.anchor) return this.anchor = false;
            if (drop.data._instance) drop.hide();
        };
        this.click = () => {
            if (!drop.data._instance) {
                this.anchor = true;
                drop.show();
            }
        }
        $(drop.data.anchor).on('click', this.click);
        $(document).on('click', this.document);
    };
    destroy() {
        $(this.drop.data.anchor).off('click', this.click);
        $(document).off('click', this.document);
    };
};