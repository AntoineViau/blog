var sg = require('./static-generator');
var del = require('del');
var fs = require('fs');

del.sync(['./build/**/*']);
sg('./posts', './layouts', './build');

var generated1 = fs.readFileSync('./build/index.html').toString();

var fn = './layouts/base.html.twig';
var content = fs.readFileSync(fn).toString();
content += "aaaaaaaaaa\n";
fs.writeFileSync('./layouts/base.html.twig', content);


del.sync(['./build/**/*']);
sg('./posts', './layouts', './build');

var generated2 = fs.readFileSync('./build/index.html').toString();

if (generated1 == generated2) {
    console.warn('Toujours pas');
} else {
    console.log('ALL GOOD');
}