# Pruebas curl para el back-end

Ajusta estas variables antes de probar:

```bash
DOMINIO="https://TU_DOMINIO"
ID_USUARIO="1"
TOKEN="TOKEN_DEL_LOGIN"
```

## Login

```bash
curl -k "$DOMINIO/Servicio/rest/ws/login?email=correo%40prueba.com&password=HASH_SHA256"
```

## RF-BE-1 alta_articulo

```bash
curl -k -X POST "$DOMINIO/Servicio/rest/ws/alta_articulo?id_usuario=$ID_USUARIO&token=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Mayonesa",
    "descripcion":"Mayonesa de 390 g",
    "precio":45.50,
    "cantidad":20,
    "foto":null
  }'
```

## RF-BE-2 consulta_articulos

```bash
curl -k "$DOMINIO/Servicio/rest/ws/consulta_articulos?palabra=mayo&id_usuario=$ID_USUARIO&token=$TOKEN"
```

## RF-BE-3 compra_articulo

```bash
curl -k -X PUT "$DOMINIO/Servicio/rest/ws/compra_articulo?id_usuario=$ID_USUARIO&id_articulo=1&cantidad=2&token=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Consulta del carrito

```bash
curl -k "$DOMINIO/Servicio/rest/ws/consulta_carrito_compra?id_usuario=$ID_USUARIO&token=$TOKEN"
```

## RF-BE-4 elimina_articulo_carrito_compra

```bash
curl -k -X DELETE "$DOMINIO/Servicio/rest/ws/elimina_articulo_carrito_compra?id_usuario=$ID_USUARIO&id_articulo=1&token=$TOKEN"
```

## RF-BE-5 elimina_carrito_compra

```bash
curl -k -X DELETE "$DOMINIO/Servicio/rest/ws/elimina_carrito_compra?id_usuario=$ID_USUARIO&token=$TOKEN"
```

## RF-BE-3.3 compra_articulo sin stock suficiente

## Esta prueba valida que el servicio regrese HTTP 400 cuando la cantidad solicitada es mayor a la existencia del artículo.

```bash
curl -k -X PUT "$DOMINIO/Servicio/rest/ws/compra_articulo?id_usuario=$ID_USUARIO&id_articulo=1&cantidad=99999&token=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
