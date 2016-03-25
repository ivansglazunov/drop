Package.describe({
  name: 'templ:drop',
  version: '0.0.4',
  summary: 'Dropdowns, dropmenus, tooltips as templates.',
  git: 'https://github.com/meteor-templ/drop',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  
  api.use('mongo');
  api.use('ecmascript');
  api.use('templating');
  api.use('less');
  api.use('check');
  api.use('random');
  
  api.use('stevezhu:lodash@4.6.1');
  api.use('aldeed:collection2@2.9.0');
  api.use('matb33:collection-hooks@0.8.1');
  api.use('shuttler:selection@0.0.5');
  
  api.addFiles('drop.html', 'client');
  api.addFiles('drop.js', 'client');
  
  api.export('Drop');
});