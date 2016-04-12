Objectif :
Mettre en place un environnement Git pour la sauvegarde des sources, l'intégration continue et le déploiement.
Dans le cas de PMU voici ce qui a été fait : 

1) un compte Linux pmu a été créé sur le serveur.  Il contient le repo git (~/pmu.git) mais aussi des dossiers de déploiements et d'intégration.

2) Le repo git possède un pmu.git/hooks/post-receive. Ce script va simplement faire un pull dans ~/src après chaque push.
Petit piège ici : 
Si on bosse avec git < 1.8.x le script est obligé de faire un cd /home/pmu/src avant le git pull. Or, il semble qu'il y ait un bug sur le pull en dehors du working dir.
Il faut donc faire un git fetch suivi d'un git merge pour reconstituer le comportement d'un git pull.

3) Après cela on a des sources à jour dans ~/src. On peut les utiliser pour faire une passe d'intégration continue et/ou de déploiement.

4) Le déploiement devrait se faire dans un dossier à part (genre ~/www). Il faut bien prendre en compte que Symfony est assez sensible à son environnement.
Cela veut dire qu'il faut copier les sources du projet. Puis faire un composer update pour mettre en place l'environnement complet.
Pourquoi ne pas travailler directement depuis les sources d'origine : parce que Symfony génère à son installation un cache où il y a du binaire. 
Et même si PHP est interprété, c'est plutôt sale de faire une copie brute des sources et surtout ressources sur l'environnement de déploiement.
Dans l'absolu, il ne faut copier que nos fichiers à nous (rien à Symfony et autres vendors), ie. le dossier pmu/server/symfony/src


Configuration SSH pour Git.
L'idée est de pouvoir push facilement et rapidement. 
On installe le remote : 

    git remote add pmu-emotions.fr ssh://pmu@pmu.pmu-emotions.fr/~/pmu.git

Il faut configurer le serveur pour utiliser des clefs : 
    
    ssh-keygen -t dsa

On transfère le fichier id_dsa (clef privée) sur le client (machine de dév) et on colle le fichier id_dsa.pub dans .ssh/authorized_keys sur le serveur. 
Au passage on renomme la clef privée en quelque chose de compréhensible et descriptif : 

    mv id_dsa pmu@pmu-emotions.fr

Note : oui, oui, pmu@pmu-emotions.fr est bien un nom de fichier valide.

A ce stade on peut se connecter en SSH avec la clef. Pour rappel : à la création du couple clefs publique/privée, on peut encoder la clef privée avec une passphrase. Si un vilain vole le fichier de clef privée, il ne pourra rien en faire s'il n'a pas la passphrase.

Le problème à présent est de permettre à Git de se connecter via SSH avec la clef privée.
On a bien dit à Git quel protocole utiliser (par le préfixe ssh://), quel compte (pmu), quelle adresse (@pmu-emotions.fr) et quel dossier (~/pmu.git ou le ~ correspond au dossier home du compte pmu). Mais on ne lui a pas dit quelle clef utiliser et avec quelle passphrase éventuelle.
En fait, on ne peut pas le faire au niveau de Git. C'est au niveau du système (sur le client) qu'on va automatiser l'authentification.

Pour ce faire, on installe le fichier ~/.ssh/config : 
Host pmu-emotions.fr
 IdentitfyFile chemin/vers/ma/clef-privee.pem

Attention à l'espace au début de la seconde ligne.
Le fichier ~/.ssh/config et le fichier clef privée doivent être obligatoirement go-rwx et u+rw (ou bien encore chmod 600)

Maintenant, on peut faire du git push sans problème. 
Il faudra simplement taper la passphrase à chaque fois s'il y en a une.

Pour éviter de taper la passphrase à chaque fois, on peut utiliser ssh-agent pour la stocker en mémoire.
Pour ce faire on commence par :
eval "$(ssh-agent)"
ssh-agent tout seul génère du script shell pour exporter les variables nécessaire à la communication avec ssh-agent.
Pour ajouter une clef : ssh-add keyFile
