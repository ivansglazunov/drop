// Invert direction string.
// Drop.invert(key: String) => String
Drop.invert = function(key) { return Drop._invert[key]; };

Drop._invert = { 'top': 'bottom', 'right': 'left', 'bottom': 'top', 'left': 'right' };

// Convert direction key string into size key string.
// Drop.insize(key: String) => String
Drop.insize = function(key) { return Drop._insize[key]; };

Drop._insize = { 'left': 'width', 'right': 'width', 'top': 'height', 'bottom': 'height' };

// Convert direction key string into rotated direction key string.
// Return simplified version of direction. Only left and top.
// Drop.rotate(key: String) => String
Drop.rotate = function(key) { return Drop._rotate[key]; };

Drop._rotate = { 'left': 'top', 'right': 'top', 'top': 'left', 'bottom': 'left' };

// Generage coordinates object from (anchor: DOMElement).
// Drop.coordinates(anchor: DOMElement, placement: String) => coordinates: Object
Drop.coordinates = function(anchor, placement) {
    
    // Different jQuery method for getting position
    if (placement == 'global')
        var method = 'offset';
    else
        var method = 'position';
    
    // Generate base variables: left, top, width, height
    
    if (lodash.isElement(anchor)) {
        if (anchor instanceof SVGElement) {
            var box = anchor.getBBox();
            var $svg = $(anchor).parent('svg');
            var position = $svg[method]();
            var result = { left: box.x + position.left, top: box.y + position.top, width: box.width, height: box.height };
        } else if (anchor instanceof HTMLElement) {
            var $anchor = $(anchor);
            var position = $anchor[method]();
            var result = { left: position.left, top: position.top, width: $anchor.outerWidth(), height: $anchor.outerHeight() };
        } else {
            throw new Meteor.Error('Anchor is not a DOMElement.');
        }
    } else {
        throw new Meteor.Error('Anchor is not a DOMElement.');
    }
    
    // Generate helpful invert variables: right, bottom
    
    if (placement == 'global') {
        result.right = $(window).width() - result.width - result.left;
        result.bottom = $(window).height() - result.height - result.top;
    } else {
        result.right = result.width - result.left;
        result.bottom = result.height - result.top;
    }
    
    return result;
};