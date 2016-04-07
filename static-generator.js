 var dt = require('directory-tree');
 var fm = require('front-matter');
 var fs = require('fs');
 var md = require('markdown').markdown;
 var twig = require('twig').twig;
 var path = require('path');
 var ext = require('file-extension');
 var fse = require('fs-extra');

 // IIFE qui sera donc appelée dès l'inclusion.
 // Elle s'occupe de choisir la stratégie adaptée au contexte : node, web/amd, etc.
 // Elle prend en entrée une fonction qui renverra la fonction métier du module.
 // Question : pourquoi pas directement la fonction métier ?
 // Réponse : apparemment parce que AMD exige une fonction factory (fonction qui retourne une fonction)
 (function(m) {
   if (typeof exports === "object") {
     module.exports = m();
   } else if (typeof define === "function" && define.amd) {
     define([], m);
   } else {
     this.fileExtension = m();
   }
 })(function() {
   return function(postsDirectory, layoutsDirectory, buildDirectory) {
     var processDirectory = function(dir, includeDirs, cb) {
       dir.children.forEach(function(node) {
         if (node.type == 'file') {
           cb(node);
         }
         if (node.type == 'directory') {
           if (includeDirs) {
             cb(node, includeDirs, cb);
           }
           processDirectory(node, includeDirs, cb);
         }
       });
     };

     var tree = dt.directoryTree(postsDirectory);
     var categories = [];
     var posts = [];
     var pages = [];

     // Get types
     processDirectory(tree, true, function(node) {
       if (node.type == 'directory') {
         var subDirs = node.path.split('/');
         node.categoryName = subDirs[subDirs.length - 1].substr(4);
         node.buildDirectory = buildDirectory + '/' + node.path;
         categories.push(node);
       } else {
         node.dirname = path.dirname(node.path);
         node.buildDirectory = buildDirectory + '/' + node.dirname;
         node.ext = ext(node.name);
       }
     });

     // Read front-matter
     processDirectory(tree, false, function(node) {
       if (node.ext == 'md') {
         var content = fs.readFileSync(postsDirectory + '/' + node.path).toString();
         node.fm = fm(content);
         if (node.fm.attributes.layout) {
           if (node.fm.attributes.layout == 'post') {
             posts.push(node);
           }
           if (node.fm.attributes.layout == 'page') {
             pages.push(node);
           }
         }

       }
     });

     // convert markdown to html
     processDirectory(tree, false, function(node) {
       if (ext(node.name) == 'md') {
         var htmlContent = node.fm.body;
         node.html = md.toHTML(htmlContent);
       }
     });

     // templating
     processDirectory(tree, false, function(node) {
       node.templated = twig({
           path: layoutsDirectory + '/' + (node.fm && node.fm.attributes.layout ? node.fm.attributes.layout : 'post') + '.html.twig',
           async: false
         })
         .render({
           'nodes': tree,
           'categories': categories,
           'posts': posts,
           'body': node.html
         });
     });

     // create directories in build
     processDirectory(tree, true, function(node) {
       if (node.type == 'directory') {
         if (!fs.existsSync(node.buildDirectory)) {
           fs.mkdirSync(node.buildDirectory);
         }
       }
     });

     // copy posts
     processDirectory(tree, false, function(node) {
       fs.writeFileSync(node.buildDirectory + '/index.html', node.templated);
     });

     //copy assets
     processDirectory(tree, false, function(node) {
       if (ext(node.name) != 'md') {
         fse.copySync(postsDirectory + '/' + node.path, node.buildDirectory + '/' + node.name);
       }
     });

     //copy css and js
     var folders = ['css', 'js', 'img'];
     folders.forEach(function(folder) {
       fs.mkdirSync(buildDirectory + '/' + folder);
       fse.copySync(layoutsDirectory + '/' + folder, buildDirectory + '/' + folder);
     });
   };
 });