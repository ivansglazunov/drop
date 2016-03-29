Drop.prototype.watchWindow = function() {
    $(window).on('resize scroll', () => {
        this.tick();
    });
    return this;
};

Drop.prototype.watchDrag = function() {
    $(this.data.anchor).on('drag dragstart dragstop', () => {
        this.tick();
    });
    return this;
};