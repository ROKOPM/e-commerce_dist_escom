#!/bin/bash
set -e

if [ -z "$CATALINA_HOME" ]; then
  echo "ERROR: Debes definir CATALINA_HOME. Ejemplo:"
  echo "export CATALINA_HOME=/home/ubuntu/apache-tomcat-8.5.99"
  exit 1
fi

javac -cp "WEB-INF/lib/*:." servicio/Servicio.java
mkdir -p WEB-INF/classes/servicio
rm -f WEB-INF/classes/servicio/*
cp servicio/*.class WEB-INF/classes/servicio/.
jar cvf Servicio.war WEB-INF META-INF
rm -rf "$CATALINA_HOME/webapps/Servicio.war" "$CATALINA_HOME/webapps/Servicio"
cp Servicio.war "$CATALINA_HOME/webapps/."
echo "Servicio desplegado en $CATALINA_HOME/webapps/Servicio.war"
