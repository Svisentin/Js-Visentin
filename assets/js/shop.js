const main = document.querySelector('main');
const divContainer_stock = document.createElement("div");
divContainer_stock.classList.add("grid_stock");
divContainer_stock.style.justifyContent = "space-evenly";
divContainer_stock.style.alignItems = "center";
main.appendChild(divContainer_stock);
let productos = [];
let filtrosSeleccionados = {};
let productosFiltrados
////////////////////////Variables para usar con el carrito
let numerito = document.querySelector("#numerito");
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

///////////////////////Carga de clases para botones de filtro
let arrayBotonCategorias = document.querySelectorAll(".botonFiltroCategoria");
let arrayBotonMarca = document.querySelectorAll(".botonFiltroMarca");
let arrayBotonGratis = document.querySelectorAll(".botonFiltroGratis");
let arrayBotonPrecio = document.querySelectorAll(".botonFiltroPrecio");

agregarEventoClic(arrayBotonCategorias, "categoria");
agregarEventoClic(arrayBotonMarca, "marca");
agregarEventoClic(arrayBotonGratis, "envio");
agregarEventoClic(arrayBotonPrecio, "precio", true);

///////////////////////Carga de clases para botones de borrar filtro
let arrayBorrarTodos = document.querySelector(".borrarFiltroTodos");
let borrarFiltroPrecio= document.querySelector(".borrarFiltroPrecio")
let borrarFiltroCategoria= document.querySelector(".borrarFiltroCategoria")
let borrarFiltroMarca= document.querySelector(".borrarFiltroMarca")
let borrarFiltroEnvio= document.querySelector(".borrarFiltroEnvio")

arrayBorrarTodos.addEventListener("click", function(event) {
  event.preventDefault();
  limpiarFiltros();
  aplicarFiltros()
});
agregarEventoBorrarFiltro(borrarFiltroCategoria, "categoria");
agregarEventoBorrarFiltro(borrarFiltroMarca, "marca");
agregarEventoBorrarFiltro(borrarFiltroEnvio, "envio");
agregarEventoBorrarFiltro(borrarFiltroPrecio, "precio");

///////////////////////Orden ascendente o descendente de productos
let ascendente = document.querySelector(".botonAscendente")
let descendente = document.querySelector(".botonDescendente")
ascendente.addEventListener("click", function(event) {
  event.preventDefault();
  aplicarFiltros()
  ordenAscendente(productosFiltrados)
});
descendente.addEventListener("click", function(event) {
  event.preventDefault();
  aplicarFiltros()
  ordenDescendente(productosFiltrados)
});
///////////////////////Funciones para obtener y mostrar productos

async function obtenerProductos() {
  const productosJSON = await fetch('../js/productos.json');
  const data = await productosJSON.json();
  productos = data;
}
function mostrarProductos(productosMostrar) {
  divContainer_stock.innerHTML = "";

  productosMostrar.forEach((producto) => {
    let div_card = document.createElement("div");
    div_card.classList.add("card_stock");
    div_card.setAttribute("id", `${producto.id}`);
    div_card.innerHTML = `
      <p> ${producto.nombre}</p>
      <p> Código: ${producto.id}</p>
      <img src="../img/productos/${producto.nombre}${producto.id}.png" alt="${producto.nombre}">
      <p> Stock: ${producto.stock}</p>
      <p> Precio: $${producto.precioUnitario}</p>
      <a class="boton-agregar" id="${producto.id}"> Agregar</a><br>
      <span>Su producto se agregó al carrito</span>
    `;
    divContainer_stock.appendChild(div_card);
    
    actualizarBotones();
  });
}
obtenerProductos().then(() => {
    mostrarProductos(productos);
  })
  .catch(error => {
    console.error('ERROR AL CARGAR EL ARCHIVO JSON POR LO SIGUIENTE:', error);
  })
  .finally(() => {
    console.log('SE COMPLETÓ LA CARGA DE LOS OBJETOS DENTRO DEL ARRAY');
  });

///////////////////////Funciones para orden ascendente y desendente
function ordenAscendente(productosFiltrados){
  
  productosFiltrados.sort(function(a, b) {
    return a.precioUnitario - b.precioUnitario;
  });
  mostrarProductos(productosFiltrados)
  
}
function ordenDescendente(productosFiltrados){
  productosFiltrados.sort(function(a, b) {
    return b.precioUnitario - a.precioUnitario;
  });
  mostrarProductos(productosFiltrados)
}


///////////////////////Funciones y addEventListener para botones de filtros
function aplicarFiltros() {
   productosFiltrados = productos;
  // Aplicar filtros acumulados
  if (filtrosSeleccionados.categoria) {
    productosFiltrados = productosFiltrados.filter(producto => producto.categoria === filtrosSeleccionados.categoria);
  }
  if (filtrosSeleccionados.marca) {
    productosFiltrados = productosFiltrados.filter(producto => producto.marca === filtrosSeleccionados.marca);
  }
  if (filtrosSeleccionados.envio) {
    productosFiltrados = productosFiltrados.filter(producto => producto.envio === filtrosSeleccionados.envio);
  }
  if (filtrosSeleccionados.precio) {
    productosFiltrados = productosFiltrados.filter(producto => {
      if (filtrosSeleccionados.precio === "-5") {
        return producto.precioUnitario <= 5000;
      } else if (filtrosSeleccionados.precio === "+5") {
        return producto.precioUnitario >= 5000 && producto.precioUnitario <= 10000;
      } else if (filtrosSeleccionados.precio === "+10") {
        return producto.precioUnitario >= 10000 && producto.precioUnitario <= 15000;
      } else if (filtrosSeleccionados.precio === "+15") {
        return producto.precioUnitario > 15000;
      } else {
        return true;
      }
    });
  }
  if (productosFiltrados.length === 0) {
    mensajeCeroProductos()
  } else {
    mostrarProductos(productosFiltrados);
    mostrarBotonFiltro();
  }
}

///////////////////////Funcion para cuando no hay productos para esos filtros 
function mensajeCeroProductos(){
  divContainer_stock.innerHTML =""
    limpiarFiltros()
    borrarFiltroPrecio.style.display = "none";
    borrarFiltroCategoria.style.display = "none";
    borrarFiltroEnvio.style.display = "none";
    borrarFiltroMarca.style.display = "none";

    const divContainer = document.createElement("div");
    divContainer.style.position = "fixed";
    divContainer.style.top = "0";
    divContainer.style.left = "0";
    divContainer.style.width = "100vw";
    divContainer.style.height = "100vh";
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.style.background = "rgba(0, 0, 0, 0.5)";
    divContainer.style.zIndex = "9999";

    const msg = document.createElement("div");
    msg.classList.add("noneProductos");
    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.padding = "40px";
    msg.style.textAlign = "center";
    msg.style.zIndex = "9999";
    msg.style.border = "2px double green";
    msg.innerHTML = `Ups! No tenemos productos para los filtros elegidos<br><br> Volvamos para que encuentres lo tuyo😊<br><br><a href="../pages/shop.html" class="shopi"> Haz click aqui</a>`;
  
    divContainer.appendChild(msg);
    document.body.appendChild(divContainer);
    
}
///////////////////////Funcion que agrega los eventListener a todos los filtros juntos y tmb con la clase active
function agregarEventoClic(arrayBotones, propiedad, valorDefault) {
  arrayBotones.forEach(function(boton) {
    boton.addEventListener("click", function(event) {
      let elemento = event.target.id;
     

      event.preventDefault();
      quitarActive(arrayBotones)
      event.target.classList.add("active"); //Al elemento clickeado se le asigna la clase active
    
      productosFiltrados = productos.filter(producto => producto[propiedad] === elemento);
      mostrarProductos(productosFiltrados);
      filtrosSeleccionados[propiedad] = elemento;
     
      aplicarFiltros();
    });
  });
}

///////////////////////Funciones para borrar filtros
function agregarEventoBorrarFiltro(boton, propiedad) {
  boton.addEventListener("click", function(event) {
    event.preventDefault();
    let valor = filtrosSeleccionados[propiedad] //Tomo el valor para luego sacar la clase
    delete filtrosSeleccionados[propiedad];
    aplicarFiltros();
    document.getElementById(valor).classList.remove("active");
  });
}
function limpiarFiltros() {
  filtrosSeleccionados = {};
  quitarActive(arrayBotonCategorias);
  quitarActive(arrayBotonMarca);
  quitarActive(arrayBotonGratis);
  quitarActive(arrayBotonPrecio);
}
function mostrarBotonFiltro() {
  if (filtrosSeleccionados.categoria) {
    borrarFiltroCategoria.style.display = "inline";
    borrarFiltroCategoria.innerHTML = `${filtrosSeleccionados.categoria}<span class="mdi mdi-filter-remove"></span>`;
  } else {
    borrarFiltroCategoria.style.display = "none";
  }

  if (filtrosSeleccionados.marca) {
    borrarFiltroMarca.style.display = "inline";
    borrarFiltroMarca.innerHTML = `${filtrosSeleccionados.marca}<span class="mdi mdi-filter-remove"></span>`;
  } else {
    borrarFiltroMarca.style.display = "none";
  }

  if (filtrosSeleccionados.envio) {
    borrarFiltroEnvio.style.display = "inline";
    borrarFiltroEnvio.innerHTML = `${filtrosSeleccionados.envio}<span class="mdi mdi-filter-remove"></span>`;
  } else {
    borrarFiltroEnvio.style.display = "none";
  }

  if (filtrosSeleccionados.precio) {
    borrarFiltroPrecio.style.display = "inline";
    if (filtrosSeleccionados.precio === "-5"){
    borrarFiltroPrecio.innerHTML = `Hasta $5000<span class="mdi mdi-filter-remove"></span>`;
    }else if (filtrosSeleccionados.precio === "+5"){
    borrarFiltroPrecio.innerHTML = `De $5000 a $10000<span class="mdi mdi-filter-remove"></span>`;
    }else if (filtrosSeleccionados.precio === "+10"){
    borrarFiltroPrecio.innerHTML = `De $10000 a $15000<span class="mdi mdi-filter-remove"></span>`;
    }else {
    borrarFiltroPrecio.innerHTML = `De $20000<span class="mdi mdi-filter-remove"></span>`;
    } 
  }else {
    borrarFiltroPrecio.style.display = "none";
  }

}
function quitarActive(arrayBotones) {
  arrayBotones.forEach(function (boton) {
    boton.classList.remove("active");
  });
  
}

////////////////////////Botones para agregar al carrito
function actualizarBotones() {
  let botonesAgregarProd = document.querySelectorAll(".boton-agregar");
  botonesAgregarProd.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}
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

  msgProdAgregado();
}
function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerHTML = nuevoNumerito;
}
function msgProdAgregado() {
  const a = document.querySelector(".msg-producto");
  a.style.display = "inline";
  a.style.transition = "all 1s";
  a.style.opacity = "1";
  setTimeout(() => {
    a.style.opacity = "0";
  }, 1000);
}