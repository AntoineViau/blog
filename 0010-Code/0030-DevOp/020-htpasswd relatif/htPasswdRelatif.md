Apache ne permet pas de situer un fichier htpasswd relativement à un fichier htaccess.
Mon environnement de dev n'est pas identique à celui de prod.
Et pourtant, pour simplifier le déploiement je voudrais conserver les mêmes fichiers et éviter autant que possible d'avoir à écrire des scripts de déploiement.
Solution : 
export APACHE_ARGUMENTS=-Ddevelopment dans /etc/apache2/envvar

et dans le htaccess
DirectoryIndex index.html
<IfDefine !development>
    AuthName "..."
    AuthType Basic
    AuthUserFile "/home/pmu/src/server/admin/.htpasswd"
    Require valid-user
</IfDefine>


