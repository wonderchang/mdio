require('./app.styl');
App = require('./app.ls');

subject = location.search.split('?')[1]
doc = require('./script/'+subject+'/main.md');
baseUrl = location.origin+location.pathname+'?'+subject
app = new App(doc, baseUrl);
