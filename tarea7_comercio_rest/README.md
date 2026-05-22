# Tarea 7 - Prototipo de comercio electrónico REST

## Descripción

Este repositorio contiene el desarrollo de la **Tarea 7: Prototipo de un sistema de comercio electrónico utilizando un servicio web REST para Tomcat**.

El proyecto extiende la aplicación de tres capas de la Tarea 1, agregando funcionalidades de comercio electrónico: captura de artículos, consulta de artículos, compra, carrito de compra y eliminación de artículos del carrito.

## Arquitectura

El sistema conserva la arquitectura de tres capas:

1. **Front-end:** aplicación web HTML, CSS y JavaScript.
2. **Back-end:** servicio web REST en Java desplegado sobre Apache Tomcat.
3. **Base de datos:** MySQL usando la base `servicio_web`.

## Estructura del proyecto

```text
tarea7_Pineda/
├── backend/
│   ├── META-INF/
│   │   └── context.xml
│   ├── WEB-INF/
│   │   └── web.xml
│   ├── servicio/
│   │   ├── Articulo.java
│   │   ├── CarritoItem.java
│   │   ├── Respuesta.java
│   │   ├── Servicio.java
│   │   └── Usuario.java
│   ├── compila.sh
│   └── compila.bat
├── database/
│   └── comercio_electronico.sql
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   ├── WSClient.js
│   └── usuario_sin_foto.png
├── docs/
│   └── capturas/
├── e-commerce_dist_escom/
├── comercio_electronico.sql
└── README.md
```

## Base de datos

El script SQL se encuentra en:

```text
database/comercio_electronico.sql
```

También hay una copia en la raíz del repositorio:

```text
comercio_electronico.sql
```

El script crea las tablas:

- `stock`
- `fotos_articulos`
- `carrito_compra`

Además, crea el índice único:

```sql
CREATE UNIQUE INDEX carrito_compra_1
ON carrito_compra(id_usuario, id_articulo);
```

## Configuración de `context.xml`

Antes de desplegar el servicio, editar:

```text
backend/META-INF/context.xml
```

Colocar el usuario y contraseña de MySQL:

```xml
username="TU_USUARIO_MYSQL"
password="TU_PASSWORD_MYSQL"
```

No se recomienda subir credenciales reales a GitHub.

## Compilación del back-end

Definir variables de entorno:

```bash
export JAVA_HOME=/usr
export CATALINA_HOME=/home/ubuntu/apache-tomcat-8.5.99
```

Entrar a la carpeta del back-end:

```bash
cd backend
```

Compilar:

```bash
javac -cp "WEB-INF/lib/*:." servicio/Servicio.java
```

Empaquetar:

```bash
rm -f WEB-INF/classes/servicio/*
cp servicio/*.class WEB-INF/classes/servicio/.
jar cvf Servicio.war WEB-INF META-INF
```

Desplegar en Tomcat:

```bash
rm -rf $CATALINA_HOME/webapps/Servicio.war $CATALINA_HOME/webapps/Servicio
cp Servicio.war $CATALINA_HOME/webapps/.
```

También se puede usar:

```bash
sh compila.sh
```

## Publicación del front-end

Copiar los archivos del front-end al directorio `ROOT` de Tomcat:

```bash
cp frontend/index.html $CATALINA_HOME/webapps/ROOT/
cp frontend/app.js $CATALINA_HOME/webapps/ROOT/
cp frontend/styles.css $CATALINA_HOME/webapps/ROOT/
cp frontend/WSClient.js $CATALINA_HOME/webapps/ROOT/
cp frontend/usuario_sin_foto.png $CATALINA_HOME/webapps/ROOT/
```

Abrir en el navegador:

```text
https://TU_DOMINIO/index.html
```

## Métodos REST agregados

### `POST /Servicio/rest/ws/alta_articulo`

Da de alta un artículo en `stock` y su foto en `fotos_articulos`.

### `GET /Servicio/rest/ws/consulta_articulos`

Busca artículos por palabra clave en los campos `nombre` y `descripcion`.

### `PUT /Servicio/rest/ws/compra_articulo`

Agrega un artículo al carrito y descuenta la cantidad comprada del stock.

### `GET /Servicio/rest/ws/consulta_carrito_compra`

Consulta los artículos agregados al carrito del usuario.

Este método se agregó para poder mostrar la pantalla **Artículos en el carrito** desde el front-end.

### `DELETE /Servicio/rest/ws/elimina_articulo_carrito_compra`

Elimina un artículo del carrito y regresa su cantidad al stock.

### `DELETE /Servicio/rest/ws/elimina_carrito_compra`

Vacía el carrito completo del usuario y regresa todas las cantidades al stock.

## Pruebas

Las pruebas del back-end deben realizarse desde una computadora local usando `curl`.

Las pruebas del front-end deben realizarse desde un dispositivo móvil, como teléfono celular o tableta.

## Máquina virtual

La máquina virtual en Azure debe crearse a partir de la imagen de la tarea anterior y nombrarse con el formato:

```text
T7-2022630548
```

## Entrega

La entrega debe incluir:

1. Reporte PDF con portada, índice, desarrollo, pruebas y conclusiones.
2. Código fuente del back-end: `context.xml` y archivos `.java`.
3. Archivos del front-end: `.html`, `.js`, `.css`, imágenes, etc.
4. Script SQL de creación de base de datos.

## Autor

Ricardo Antonio Pimentel González
