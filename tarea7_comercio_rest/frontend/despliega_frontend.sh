#!/bin/bash
set -e

if [ -z "$CATALINA_HOME" ]; then
  echo "ERROR: Debes definir CATALINA_HOME. Ejemplo:"
  echo "export CATALINA_HOME=/home/ubuntu/apache-tomcat-8.5.99"
  exit 1
fi

cp index.html "$CATALINA_HOME/webapps/ROOT/"
cp app.js "$CATALINA_HOME/webapps/ROOT/"
cp styles.css "$CATALINA_HOME/webapps/ROOT/"
cp WSClient.js "$CATALINA_HOME/webapps/ROOT/"
cp usuario_sin_foto.png "$CATALINA_HOME/webapps/ROOT/"
echo "Front-end copiado a $CATALINA_HOME/webapps/ROOT"
