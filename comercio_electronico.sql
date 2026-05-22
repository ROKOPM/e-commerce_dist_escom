USE servicio_web;

CREATE TABLE stock (
    id_articulo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL
);

CREATE TABLE fotos_articulos (
    id_foto INT AUTO_INCREMENT PRIMARY KEY,
    foto LONGBLOB,
    id_articulo INT NOT NULL,
    FOREIGN KEY (id_articulo) REFERENCES stock(id_articulo)
);

CREATE TABLE carrito_compra (
    id_usuario INT NOT NULL,
    id_articulo INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_articulo) REFERENCES stock(id_articulo)
);

CREATE UNIQUE INDEX carrito_compra_1 
ON carrito_compra(id_usuario, id_articulo);
