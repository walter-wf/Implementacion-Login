const socket = io();
const form = document.getElementById("newProductForm");
const productsBody = document.getElementById("productsBody");
const paginationButton = document.getElementById("paginationButton");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  console.log(datForm);
  const prod = Object.fromEntries(datForm);
  socket.emit("newProduct", prod);
  e.target.reset();
});

const createTableRow = (prod) => {
  let row = document.createElement("tr");
  row.innerHTML = `
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${prod.title}</td>
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${prod.description}</td>
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" class="m-auto">
    </td>
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">U$D ${prod.price}/Mo</td>
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${prod.category}</td>
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${prod.code}</td>
    <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <button class="btn btn-danger btn-sm" onclick="removeProduct('${prod._id}')">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    </td>
  `;
  row.id = `productRow${prod._id}`;
  return row;
};

const renderProducts = ({ payload }) => {
  productsBody.innerHTML = "";
  if (payload && Array.isArray(payload)) {
    payload.forEach((prod) => {
      const row = createTableRow(prod);
      productsBody.appendChild(row);
    });
  } else {
    console.error("Error al cargar los productos: datos no válidos");
  }
};

// Eliminar un producto
const removeProduct = (prodId) => {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    socket.emit("removeProduct", prodId);
  }
};

socket.on("prodsData", renderProducts);

socket.on("newProduct", (newProduct) => {
  const row = createTableRow(newProduct);
  productsBody.appendChild(row);
});

socket.on("productRemoved", (removedProductId) => {
  const tableRowToRemove = document.getElementById(
    `productRow${removedProductId}`
  );
  if (tableRowToRemove) {
    tableRowToRemove.remove();
  } else {
    console.error("No se encontró la fila del producto a eliminar");
  }
});

socket.emit("getProducts");