const main = document.querySelector('main');
const divContainer_stock = document.createElement("div");
divContainer_stock.classList.add("grid_stock");
divContainer_stock.style.justifyContent = "space-evenly";
divContainer_stock.style.alignItems = "center";

main.appendChild(divContainer_stock);

let productos = [];

async function obtenerProductos() {
  const productosJSON = await fetch('../js/productos.json');
  const data = await productosJSON.json();
  productos = data;
}

obtenerProductos().then(() => {
  productos.forEach((producto) => {
    const div_card = document.createElement("div");
    div_card.classList.add("card_stock");
    div_card.innerHTML= `
      <p> Código: ${producto.id}</p>
      <p> ${producto.nombre}</p>
      <img src="../img/${producto.nombre}.png" alt="${producto.nombre}"> 
      <p> Stock: ${producto.stock}</p>
      <p> Precio: $${producto.precioUnitario}</p>
      <a class="boton-agregar" id="${producto.id}"> Agregar</a><br>
      <span>Su producto se agregó al carrito</span>
    `;
    divContainer_stock.appendChild(div_card);

    actualizarbotones();
  });
}).catch(error => {
  console.error('ERROR AL CARGAR EL ARCHIVO JSON POR LO SIGUIENTE:', error);
}).finally(() => {
  console.log('SE COMPLETÓ LA CARGA DE LOS OBJETOS DENTRO DEL ARRAY');
});

////////////////////////PARTE DE BOTONES AGREGAR////////////////////////

let numerito = document.querySelector("#numerito");

function actualizarbotones() {
  let botonesAgregarProd = document.querySelectorAll(".boton-agregar");

  botonesAgregarProd.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(e) {
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(producto => producto.id === parseInt(idBoton));

  if (productosEnCarrito.some(producto => producto.id === parseInt(idBoton))) {
    const index = productosEnCarrito.findIndex(producto => producto.id === parseInt(idBoton));
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();

  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

  seagrego();
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerHTML = nuevoNumerito;
}

function seagrego() {
  a = document.querySelector(".msg-producto");
  a.style.display = "inline";
  a.style.transition = "all 1s";
  a.style.opacity = "1";
  setTimeout(() => {
    a.style.opacity = "0";
  }, 1000);
}
