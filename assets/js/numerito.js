
function obtenerCantidadCarrito() {
  const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
  let cantidadTotal = 0;

  if (productosEnCarrito) {
    for (const producto of productosEnCarrito) {
      cantidadTotal += producto.cantidad;
    }
  }

  return cantidadTotal;
}
const numerito = document.querySelector("#numerito");

function actualizarCantidadCarrito() {
  const cantidad = obtenerCantidadCarrito();
  numerito.textContent = cantidad;
}

actualizarCantidadCarrito();
