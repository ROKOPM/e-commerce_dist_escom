const URL = "/Servicio/rest/ws";
let id_usuario = null;
let token = null;
let fotoUsuario = null;
let fotoArticulo = null;

function get(id) { return document.getElementById(id); }
function ocultarTodo() {
  ["login","alta_usuario","menu","consulta_usuario","captura_articulo","compra_articulos","carrito"].forEach(id => get(id).classList.add("hidden"));
}
function ver(id) { ocultarTodo(); get(id).classList.remove("hidden"); }
function imgBase64(foto) { return foto ? "data:image/jpeg;base64," + foto : "/usuario_sin_foto.png"; }
function dinero(v) { return Number(v || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" }); }

function readSingleFile(files, imagen, destino) {
  const file = files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    imagen.src = reader.result;
    const base64 = reader.result.split(',')[1];
    if (destino === "fotoUsuario") fotoUsuario = base64;
    if (destino === "fotoArticulo") fotoArticulo = base64;
  };
  reader.readAsDataURL(file);
}

function sha256(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  var hash = sha256.h = sha256.h || [];
  var k = sha256.k = sha256.k || [];
  var primeCounter = k[lengthProperty];
  var isComposite = {};

  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) throw new Error('Solo se soporta ASCII');
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

function limpiaLogin() {
  get("login_email").value = "";
  get("login_password").value = "";
}
function limpiaAlta() {
  ["alta_email","alta_password","alta_nombre","alta_apellido_paterno","alta_apellido_materno","alta_fecha_nacimiento","alta_telefono","alta_genero"].forEach(id => get(id).value = "");
  get("alta_imagen").src = "/usuario_sin_foto.png";
  fotoUsuario = null;
}
function limpiaArticulo() {
  ["articulo_nombre","articulo_descripcion","articulo_precio","articulo_cantidad"].forEach(id => get(id).value = "");
  get("articulo_imagen").src = "/usuario_sin_foto.png";
  fotoArticulo = null;
}

function login() {
  const cliente = new WSClient(URL);
  cliente.get("login", { email: get("login_email").value, password: sha256(get("login_password").value) }, function(code, result) {
    if (code === 200) {
      id_usuario = result.id_usuario;
      token = result.token;
      ver("menu");
    } else alert(JSON.stringify(result));
  });
}

function salir() {
  id_usuario = null;
  token = null;
  limpiaLogin();
  ver("login");
}

function altaUsuario() {
  const cliente = new WSClient(URL);
  const password = get("alta_password").value;
  const usuario = {
    email: get("alta_email").value,
    password: password !== "" ? sha256(password) : password,
    nombre: get("alta_nombre").value,
    apellido_paterno: get("alta_apellido_paterno").value,
    apellido_materno: get("alta_apellido_materno").value !== "" ? get("alta_apellido_materno").value : null,
    fecha_nacimiento: get("alta_fecha_nacimiento").value !== "" ? new Date(get("alta_fecha_nacimiento").value).toISOString() : null,
    telefono: get("alta_telefono").value !== "" ? get("alta_telefono").value : null,
    genero: get("alta_genero").value === "Masculino" ? "M" : get("alta_genero").value === "Femenino" ? "F" : null,
    foto: fotoUsuario
  };
  cliente.post("alta_usuario", usuario, function(code, result) {
    if (code === 200) { alert("Se registró el usuario"); limpiaLogin(); ver("login"); }
    else alert(JSON.stringify(result));
  });
}

function formatearFecha(fecha) {
  const f = new Date(fecha);
  const y = f.getFullYear();
  const m = String(f.getMonth() + 1).padStart(2, '0');
  const d = String(f.getDate()).padStart(2, '0');
  const h = String(f.getHours()).padStart(2, '0');
  const min = String(f.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

function consultaUsuario() {
  const cliente = new WSClient(URL);
  cliente.get("consulta_usuario", { id_usuario, token }, function(code, result) {
    if (code === 200) {
      ver("consulta_usuario");
      get("consulta_email").value = result.email;
      get("consulta_password").value = "";
      get("consulta_nombre").value = result.nombre;
      get("consulta_apellido_paterno").value = result.apellido_paterno;
      get("consulta_apellido_materno").value = result.apellido_materno || "";
      get("consulta_fecha_nacimiento").value = formatearFecha(result.fecha_nacimiento);
      get("consulta_telefono").value = result.telefono || "";
      get("consulta_genero").value = result.genero === "M" ? "Masculino" : result.genero === "F" ? "Femenino" : "";
      fotoUsuario = result.foto;
      get("consulta_imagen").src = imgBase64(fotoUsuario);
    } else alert(JSON.stringify(result));
  });
}

function quitaFotoUsuario() {
  fotoUsuario = null;
  get("consulta_imagen").src = "/usuario_sin_foto.png";
  get("consulta_file").value = "";
}

function modificaUsuario() {
  const cliente = new WSClient(URL);
  const password = get("consulta_password").value;
  const usuario = {
    email: get("consulta_email").value,
    password: password !== "" ? sha256(password) : password,
    nombre: get("consulta_nombre").value,
    apellido_paterno: get("consulta_apellido_paterno").value,
    apellido_materno: get("consulta_apellido_materno").value !== "" ? get("consulta_apellido_materno").value : null,
    fecha_nacimiento: get("consulta_fecha_nacimiento").value !== "" ? new Date(get("consulta_fecha_nacimiento").value).toISOString() : null,
    telefono: get("consulta_telefono").value !== "" ? get("consulta_telefono").value : null,
    genero: get("consulta_genero").value === "Masculino" ? "M" : get("consulta_genero").value === "Femenino" ? "F" : null,
    foto: fotoUsuario
  };
  cliente.put("modifica_usuario", { id_usuario, token }, usuario, function(code, result) {
    if (code === 200) alert("Se modificó el perfil del usuario");
    else alert(JSON.stringify(result));
  });
}

function borraUsuario() {
  const cliente = new WSClient(URL);
  cliente.delete("borra_usuario", { id_usuario, token }, function(code, result) {
    if (code === 200) { alert("Se eliminó el perfil del usuario"); limpiaLogin(); ver("login"); }
    else alert(JSON.stringify(result));
  });
}

function altaArticulo() {
  const articulo = {
    nombre: get("articulo_nombre").value,
    descripcion: get("articulo_descripcion").value,
    precio: get("articulo_precio").value !== "" ? Number(get("articulo_precio").value) : null,
    cantidad: get("articulo_cantidad").value !== "" ? Number(get("articulo_cantidad").value) : null,
    foto: fotoArticulo
  };

  fetch(`${URL}/alta_articulo?id_usuario=${id_usuario}&token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articulo)
  })
  .then(respuesta => respuesta.json().then(data => {
    if (respuesta.status === 200) {
      alert("Artículo registrado correctamente");
      limpiaArticulo();
    } else {
      alert(JSON.stringify(data));
    }
  }))
  .catch(error => alert("Error: " + error.message));
}

function consultaArticulos() {
  const cliente = new WSClient(URL);
  cliente.get("consulta_articulos", { palabra: get("buscar_palabra").value, id_usuario, token }, function(code, result) {
    if (code !== 200) { alert(JSON.stringify(result)); return; }
    const cont = get("resultados_articulos");
    cont.innerHTML = "";
    if (result.length === 0) { cont.innerHTML = '<p class="small">No se encontraron artículos.</p>'; return; }
    result.forEach(a => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${imgBase64(a.foto)}" alt="${a.nombre}">
        <h3>${a.nombre}</h3>
        <p>${a.descripcion}</p>
        <p><strong>Precio:</strong> ${dinero(a.precio)}</p>
        <p class="small">Disponibles: ${a.cantidad}</p>
        <label>Cantidad</label>
        <input type="number" min="1" value="1" id="cantidad_${a.id_articulo}">
        <button class="success" ${a.cantidad <= 0 ? "disabled" : ""} onclick="compraArticulo(${a.id_articulo})">Compra</button>
      `;
      cont.appendChild(div);
    });
  });
}

function compraArticulo(id_articulo) {
  const cantidad = Number(get("cantidad_" + id_articulo).value || 1);

  if (cantidad <= 0) {
    alert("La cantidad debe ser mayor a cero");
    return;
  }

  const cliente = new WSClient(URL);
  cliente.put("compra_articulo", { id_usuario, id_articulo, cantidad, token }, {}, function(code, result) {
    if (code === 200) {
      alert("Artículo agregado al carrito");
      consultaArticulos();
    } else {
      alert(JSON.stringify(result));
    }
  });
}

function consultaCarrito() {
  const cliente = new WSClient(URL);
  cliente.get("consulta_carrito_compra", { id_usuario, token }, function(code, result) {
    if (code !== 200) { alert(JSON.stringify(result)); return; }
    ver("carrito");
    const cont = get("resultados_carrito");
    cont.innerHTML = "";
    let total = 0;
    if (result.length === 0) cont.innerHTML = '<p class="small">El carrito está vacío.</p>';
    result.forEach(item => {
      total += Number(item.costo || 0);
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${imgBase64(item.foto)}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <p><strong>Cantidad:</strong> ${item.cantidad}</p>
        <p><strong>Precio:</strong> ${dinero(item.precio)}</p>
        <p><strong>Costo:</strong> ${dinero(item.costo)}</p>
        <button class="danger" onclick="eliminaArticuloCarrito(${item.id_articulo})">Eliminar artículo</button>
      `;
      cont.appendChild(div);
    });
    get("total_carrito").innerText = "Total: " + dinero(total);
  });
}

function eliminaArticuloCarrito(id_articulo) {
  const cliente = new WSClient(URL);
  cliente.delete("elimina_articulo_carrito_compra", { id_usuario, id_articulo, token }, function(code, result) {
    if (code === 200) consultaCarrito();
    else alert(JSON.stringify(result));
  });
}

function eliminaCarrito() {
  const cliente = new WSClient(URL);
  cliente.delete("elimina_carrito_compra", { id_usuario, token }, function(code, result) {
    if (code === 200) consultaCarrito();
    else alert(JSON.stringify(result));
  });
}
