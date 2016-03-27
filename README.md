# [Drop](http://templ.meteor.com/drop)

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
> (...data)

Template being declared around the anchor.

All possible arguments: [Data](#Data).

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

### Drop.init
> ([data](#Data): Object) => anchor: String

It activates a trigger for certain anchor. Scriptable initialization of drop.

```html
<template name="dropper">
    content
</template>
<template name="page">
    <button>anchor</button>
</template>
```

```js
Drop.init({ template: 'dropper', trigger: 'tooltip', position: 't', _anchor: $('button')[0] });
```

### Drop.show
> ([data](#Data): Object) => instance: String

Creates and shows a drop instance based on data positioning it to anchor.

Returns the `instance: String` of the instance in the collection `Drop.instances`.

---

Object `data` is available as context in template of drop instance.

```html
<template name="dropper">
    {{content}}
</template>
<template name="page">
    <button>anchor</button>
</template>
```

```js
Drop.show({ _anchor: $('button')[0], template: 'dropper', content: 'Example' });
```

### Drop.hide
> (instance: String)

Remove instance and all his children.

### Drop.tick
> (instance: String, anchor: Element|Coordinates)

Recalculate and repositioning drop instance relative to the new anchor position.

And all children will be repositioned as well.

### Drop._momentum
> String = 'dimentum'

You can set other plugin for momentum here.

### Data
> Object

Scheme of of possible data.

* `template: String` specifies a template for the drop
* `trigger: String` (`toggle`) specifies trigger to this drop
* `position: String` (`tcc`) specifies position or positions as (`t b r`)
* `theme: String` (`Drop._theme = undefined`) template wrapper
* `_anchor: Element|Coordinates` (required) pointer to the anchor of drop

Variable `this` is almost the same in the `template`s, `theme`s and `else` blocks.
It is always a document from collection `Drop.instances`.
There is always the arguments passed in `data`.
There is always useful for positioning data in `_position` variable.

### Coordinates
> Object

The unified form of coordinates for anchor. It can be transmitted instead of the real element.

* `width: Number`
* `height: Number`
* `left: Number`
* `top: Number`
* `right: Number`
* `bottom: Number`

### DropThemeBootstrap

You can set your `Template.DropThemeBootstrap._indent = 15` for arrow depending on your rounding.

## Versions

### 0.1.0
* Different API
* `Drop.init`

### 0.0.8
* [Dimentum](https://github.com/meteor-templ/dimentum)
* Many fixes...

### 0.0.1

* `dropdown` and `popover` triggers.

### 0.0.2

* `DropThemeBootstrap` template