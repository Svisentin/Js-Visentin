const main = document.querySelector('main')
const divContainer_stock = document.createElement("div");
divContainer_stock.classList.add("grid_stock");
divContainer_stock.style.justifyContent = "space-evenly"
divContainer_stock.style.alignItems = "center"
let numerito = document.querySelector ( "#numerito")
let total = 0
let subtotal = 0 
main.appendChild(divContainer_stock);

let productosEnCarrito = [];

async function obtenerProductos() {
  productosEnCarrito = await JSON.parse(localStorage.getItem("productos-en-carrito"))
  if (!productosEnCarrito || productosEnCarrito.length === 0) {
    const msg = document.createElement("div");
    msg.classList.add("msg-carrito");
    msg.innerHTML= `
        <p>"Tu carrito ahora está vacío" </p>
        <p>"¡Pasate por nuestro SHOP a conocer lo mejor para vos!"</p>
        <a href="../pages/shop.html"> Haz click aca, no esperes mas!</a>
    `
    main.style.gridTemplateColumns = "30% auto"
    divContainer_stock.style.gridRow = "1 / span 1"
    divContainer_stock.style.gridTemplateColumns = "1fr"

   
    divContainer_stock.appendChild(msg); 
    
    
  } else {
    productosEnCarrito.forEach((producto) => {
    const div_card = document.createElement("div");
    div_card.classList.add("card_stock");
    subtotal = producto.precioUnitario * producto.cantidad;
    calcularTotal()
    
    div_card.innerHTML= `
      <div class="carrito1">
        <img src="../img/productos/${producto.nombre}${producto.id}.png" alt="${producto.nombre}"> 
        <br>
        <a class="boton-eliminar" id="${producto.id}"> Eliminar</a>
      </div>
      <div>
        <p> Código: ${producto.id}</p>
        <p> ${producto.nombre}</p>
      </div>
      <div>
        <p> Precio: $${producto.precioUnitario}</p>
        <p class="numCantidad${producto.id}" > Cantidad:  ${producto.cantidad}</p>
      </div>
      <div>
        <p class="">Subtotal: $ ${subtotal}</p>
      </div>
    `
    
    divContainer_stock.appendChild(div_card);

    
    actualizarBotones()
    actualizarNumerito()
    
    })
    const div_total = document.createElement("div");
    div_total.classList.add("card_stock");
    div_total.innerHTML = `
    <div></div>
    <div></div>
    
      <div>
        <p class="total">Total a pagar: $ ${total}</p>
      </div>
      <a id="botonCompra" class="boton-compra" > Continuar compra</a>

    `
    divContainer_stock.appendChild(div_total);
    botonCompras()
  }
  }

try {
  obtenerProductos()// Código que puede lanzar una excepción
} catch (error) {
  console.error('ERROR AL CARGAR LOS DATOS DEL LOCAL STORAGE:', error);// Código que se ejecuta si se produce una excepción
  // El argumento 'error' contiene información sobre la excepción
} finally {
  console.log('SE COMPLETÓ LA CARGA DE LOS OBJETOS DENTRO DEL ARRAY');// Código que se ejecuta siempre, independientemente de si se produjo una excepción o no
}

//////////////////////////PARTE DE BOTONES AGREGAR////////////////////////

function actualizarBotones() {
  let botonesEliminarProd = document.querySelectorAll (".boton-eliminar");

  botonesEliminarProd.forEach(boton => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}
function eliminarDelCarrito(e) {
  
    const idBoton = e.currentTarget.id;
    let numId = parseInt(idBoton)
    const productoEliminado = productosEnCarrito.find(producto => producto.id === parseInt(idBoton));
    
    if(productosEnCarrito.some(producto => producto.id === parseInt(idBoton))) {
        const index = productosEnCarrito.findIndex(producto => producto.id === parseInt(idBoton));
        if (productosEnCarrito[index].cantidad <= 1){
          productosEnCarrito.splice(index,1);//Se usa para eliminar el elemento
          location.reload();
        }else{
          productosEnCarrito[index].cantidad--;
          let a = document.querySelector (`.numCantidad${numId}`)
          let b = productosEnCarrito[index].cantidad
          a.textContent = `Cantidad: ${b}`
        }
        }

    actualizarNumerito()
    seelimino()

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    setTimeout (()=> {
      location.reload()
    },2000)
    
}
function actualizarNumerito () {
  let nuevoNumerito = productosEnCarrito.reduce((acc,producto)=> acc + producto.cantidad,0);
  numerito.innerHTML = nuevoNumerito
  
}
function seelimino(){
  a=document.querySelector(".msg-producto")
  a.style.display = "inline"
  a.style.transition="all 0.9s"
  a.style.opacity= "1"
  setTimeout(()=>{
    a.style.opacity= "0"
  },1000)
  

}

function calcularTotal() {
  total = productosEnCarrito.reduce((acc, producto) => {
    let asubtotal = producto.precioUnitario * producto.cantidad;
    return acc + asubtotal;
  }, 0);
}

function comprado() {
  const divContainer = document.createElement("div");
  divContainer.style.position = "fixed";
  divContainer.style.top = "0";
  divContainer.style.left = "0";
  divContainer.style.width = "100vw";
  divContainer.style.height = "100vh";
  divContainer.style.display = "flex";
  divContainer.style.justifyContent = "center";
  divContainer.style.alignItems = "center";
  divContainer.style.background = "rgba(0, 0, 0, 0.7)";
  divContainer.style.zIndex = "9999";

  const msg = document.createElement("div");
  msg.classList.add("comprado");
  msg.style.position = "fixed";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.padding = "40px";
  msg.style.textAlign = "center";
  msg.style.zIndex = "9999";
  msg.style.border = "2px double green";

  divContainer.appendChild(msg);
  document.body.appendChild(divContainer);

  let secondsLeft = 3;
  updateCountdown();

  function updateCountdown() {
    msg.innerHTML = `¡Muchas gracias por tu compra!<br><br> Te enviaremos al shop por si te olvidaste algo 😊<br><br><p class =cuenta>Redireccionando en ${secondsLeft} segundos...<p>`;
    secondsLeft--;

    if (secondsLeft >= 0) {
      setTimeout(updateCountdown, 1000);
    } else {
      localStorage.clear();
      window.location.href = "../pages/shop.html";
    }
  }
}

function botonCompras() {
  const botonCompra = document.getElementById("botonCompra");

  if (botonCompra) {
    botonCompra.addEventListener("click", function() {
      comprado();
    });
  }
}




