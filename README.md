# Drop

[Examples](http://meteor-templ.herokuapp.com/drop) [GitHub](https://github.com/meteor-templ/drop) [Atmosphere.js](atmospherejs.com/templ/drop)

Realy fully customizable, and reactive drops, dropdowns, tooltips and dropmenus for Meteor.

## Install

```
meteor add templ:drop
```

## Documentation

### Drop
> new Drop(data: [Data](#data))

Class of one drop. Building automatically in the template [Template.Drop](#templatedrop).

#### Drop._theme
> String = 'DropDefault'

Default theme.

#### Drop._template
> String = 'DropDefaultTemplate'

Default template.

#### drop.tick
> drop.tick(data: [Data](#data))

It recalculates the position of drop, and merge old data with new data.

#### drop.show
> drop.show(data: [Data](#data))

It shows drop if hidden, and merge old data with new data.

#### drop.hide
> drop.hide()

It hides drop if shown.

#### drop.trigger
> drop.trigger(name: String) => Drop.Trigger

Construct and return trigger by name of trigger in `Drop.triggers` object.

#### drop.calc
> drop.calc()

Calculate instance keys and values.

### Data

Drop custom variables and drop options context.

System variables:

* `anchor: DOMELement` required link to anchor
* `trigger: String` the trigger is activated automatically only when using [Template.Drop](#templatedrop)
* `template?: String = 'DropDefaultTemplate'` template of this drop
* `content?: Template` template passed into template with [Template.Drop](#templatedrop) `{{else}}` block
* `theme?: String = 'DropDefault'` theme template of this drop
* `placement?: String = 'global'` placement drop into body root element or into called [Template.Drops](#templatedrops)
* `location?: 'outside'|'inside'` visual location relative drop
* `direction?: 'top'|'right'|'bottom'|'left' = 'top'` direction of drop
* `position?: Number = 0.5` 0-1
* `alignment?: Number = 0.5` 0-1
* `layer?: Number = 9999` z-index of drop

### Drop.instances
> Mongo.Collection

Local collection with drop instances.

> It is not recommended to make changes.


### Drop.nesting
> Mongo.Collection

Local collection with [graph](https://github.com/meteor-shuttler/graph) of drop nesting.

> It is not recommended to make changes.


### Drop.triggers

#### toggle
> new Drop.triggers.toggle(drop: Drop)

Anchor click to toggle drop.

#### tooltip
> new Drop.triggers.tooltip(drop: Drop)

Anchor hover.

#### dropmenu
> new Drop.triggers.dropmenu(drop: Drop)

Anchor and drop hover.

#### dropdown
> new Drop.triggers.dropdown(drop: Drop)

Anchor click to show, outside click to hide.

#### popover
> new Drop.triggers.popover(drop: Drop)

Anchor click to show, everywhere click to hide.

### Template.Drop
Template for easy automatic drop assembly.

Inside, must be one root tag!

It takes as arguments [Data](#data) object with anchor key.

```html
{{#Drop template='example'}}
    <button>anchor</button>
{{/Drop}}
```

As the `{{else}}` block can be passed `content` template variable.

```html
{{#Drop template='example'}}
    <button>anchor</button>
{{else}}
    custom content
{{/Drop}}
```

### Template.Drops
It allows you to create an area for drops rendering.

```html
{{>Drops placement='myPlacement'}}
{{#Drop template='example' placement='myPlacement'}}
    <button>anchor</button>
{{/Drop}}
```

### Template.DropDefault
Standard independent `theme` template of drop.

### Template.DropBootstrap
The `theme` template uses Bootstrap classes.

## Versions

### 0.2.5
* Fix `hover`

### 0.2.2
* Fix data bag

### 0.2.0
* New objective syntax
* New reactive logic
* New position-alignment logic
* New location logic
* New placement logic

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