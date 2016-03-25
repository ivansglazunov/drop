# Drop

Realy fully customizable, and reactive drops, dropdowns, tooltips and dropmenus for Meteor.

## Install

```
meteor add templ:drop
```

## [Examples](http://templ.meteor.com/drop)

## Documentation

### Template.Drops

Template print isntances of all drops.

Be sure to place the root of the document.

```html
<body>
    {{> Drops}}
</body>
```

### Template.Drop

Template being declared around the anchor.

It activates a specific trigger for a given drop. All its arguments are passed directly to the `data` argument to` Drop.show`.

```html
<template name="dropper">
    content
</template>
<template name="page">
    {{#Drop template='dropper' trigger='tooltip' position='t'}}
        <button>anchor</button>
    {{/Drop}}
</template>
```

##### Content transfer.

You can transfer a template in `else` block.

```html
<template name="dropper">
    {{UI.contentBlock}}
</template>
<template name="page">
    {{#Drop template='dropper' trigger='tooltip' position='t'}}
        <button>anchor</button>
    {{else}}
        Tansfered content.
    {{/Drop}}
</template>
```

### Drop.show
> (anchor: HTMLElement|Coordinates, data: Object) => instance: String

Creates a drop instance based on data positioning it to anchor.

Returns the `id: String` of the instance in the collection `Drop.instances`.

---

Object `data` is available as context in template of drop instance.

```html
<template name="dropper">
    {{content}}
</template>
```

```js
Drop.show($('button')[0], { template: 'dropper', content: 'Example' });
```

---

The variables context of the drop instance.

Adding few extra variables.

* `_anchor` HTMLElement|Coordinates sended in to `Drop.show`.
* `_anchorId` is id in `Drop._anchors[_anchorId]` container for drop instances id of current anchor.
* `_id` is id in the collection `Drop.instances`.
* `_position` Calculated variables for positioning the drop and custom arrow.

### Drop.hide
> (instance: String)

Remove instance and all his children.

### Drop.tick
> (instance: String, anchor: HTMLElement|Coordinates)

Recalculate and repositioning drop instance relative to the new anchor position.

And all children will be repositioned as well.

### Data
> Object

Scheme of of possible data.

* `template` (required) specifies a template for the drop
* `trigger` (`toggle`) specifies trigger to this drop
* `position` (`tcc`) specifies position or positions as (`t b r`)

### Position
> Object

The object passed into instance drop as the `_position`.

Generated function `Drop._position`.

### Coordinates
> Object

Anchor correct coordinates.

* `width` Number
* `height` Number
* `left` Number
* `top` Number
* `right` Number
* `bottom` Number

## Versions

### 0.0.1

* `dropdown` and `popover` triggers.