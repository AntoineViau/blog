<!--
--- Layout: post
--- Title: Les grands principe derrière la syntaxe de templating d'AngularJS 2
--- Description: La syntaxe n'est jamais que le moyen de transport de la sémantique. Une fois que l'on a vu ça, c'est tout de suite moins angoissant !
-->

Les premiers éléments livrés par l'équipe d'AngularJS quand à la version 2 ont fait peur à pas mal de monde. Il y avait de quoi être surpris puisqu'ils ont annoncé une révolution complète à tous les niveaux du framework : 

  * ça ne sera plus du Javascript mais de l' AT-Script, puis finalement du TypeScript ; 
  * la structure générale tend vers une architecture résolument orientée composants ; 
  * la syntaxe HTML n'a plus rien à voir avec ce que nous utilisions (ng-model, ng-click, etc.).

Sur ce dernier point, [une excellente conférence de Misko Hevery](https://www.youtube.com/watch?v=-dMBcqwvYA0) a permis d'éclaircir le pourquoi et le comment qui en découle. A l'origine, il y a une recherche de simplification de la syntaxe par rapport à Angular 1.x, et la volonté de définir une sémantique claire et explicite. Comme il le dit très bien en préambule, l'appréciation d'une syntaxe est quelque chose d'éminemment subjectif. Certains préféreront utiliser des dièses, d'autres des crochets, des parenthèses, etc. L'important n'est pas les caractères choisis, mais le sens que l'on veut leur attribuer.

Dans cet esprit, AngularJS 2 cherche à suivre la sémantique - la raison d'être - du HTML : une version sérializée du DOM. *Autrement dit, HTML n'est jamais que la représentation textuelle de l'arbre du DOM où chaque élément est composé de propriétés, dispose de méthodes et reçoit/émet des événements*. Par exemple, l'élement INPUT :

  * propriétés : id, disabled, style, etc.
  * événements : onblur, onchange, etc.
  * méthodes : focus, blur, click, etc.

Partant de ce constat, AngularJS 2 veut directment intégrer cette représentation au sein du HTML. Ce qui se traduira ainsi : 

  * [property]="expression"
  * (event)="statement"
  * \#ref et ref.method()

Et concrètement ça donne quoi ?

    <input #myTextField type="text" />
    <button hidden="isButtonVisible" (click)="myTextField.focus()">Mettre le focus</button>

La propriété *hidden* de l'élément *button* est donc directement reliée à l'expression *isButtonVisible* (gérée dans le contrôleur). L'événement *onClick* va appeler la méthode *focus()* sur l'élément *input* référencé par *\#myTextField*.

Comme on le voit, cette syntaxe très générique réduit le nombre de règles et directives. Typiquement, les ng-blur, ng-src, ng-onclick, etc. disparaissent pour laisser place à une interaction directe avec le DOM. Je ne pense que la transition sera trop douloureuse une fois que l'on a compris la volonté de l'équipe d'AngularJS. Tout au plus il faudra se (re)plonger dans le fonctionnement du DOM, un peu comme à l'époque de JQuery.






