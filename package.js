Package.describe({
  name: 'templ:drop',
  version: '0.3.3',
  summary: 'Realy fully customizable, and reactive drops, dropdowns, tooltips and dropmenus for Meteor.',
  git: 'https://github.com/meteor-templ/drop',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  
  api.use('mongo');
  api.use('ecmascript');
  api.use('templating');
  api.use('less');
  api.use('random');
  
  api.use('stevezhu:lodash@4.6.1');
  api.use('aldeed:collection2@2.9.0');
  api.use('matb33:collection-hooks@0.8.1');
  api.use('dburles:collection-helpers@1.0.4');
  api.use('templ:dimentum@0.0.3');
  api.use('shuttler:selection@0.0.5');
  
  api.addFiles('class.js', 'client');
  api.addFiles('triggers.js', 'client');
  api.addFiles('instances.js', 'client');
  api.addFiles('watch.js', 'client');
  api.addFiles('Drop.html', 'client');
  api.addFiles('Drop.js', 'client');
  api.addFiles('Drops.html', 'client');
  api.addFiles('Drops.js', 'client');
  api.addFiles('body.html', 'client');
  api.addFiles('helpers.js', 'client');
  api.addFiles('Data.js', 'client');
  api.addFiles('nesting.js', 'client');
  
  api.addFiles('DropDefault.html', 'client');
  api.addFiles('DropDefault.less', 'client');
  
  api.addFiles('DropBootstrap.html', 'client');
  
  api.addFiles('DropDefaultTemplate.html', 'client');
  
  api.addFiles('Drop.less', 'client');
  
  api.addFiles('DropHide.html', 'client');
  api.addFiles('DropHide.js', 'client');
  
  api.export('Drop');
});