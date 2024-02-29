const socket = io();

const btnChat = document.querySelector("#botonChat");
const parrafosMensajes = document.querySelector("#parrafosMensajes");
const valueInput = document.querySelector("#chatBox");

let userEmail;
Swal.fire({
    title: "Ingrese un usuario",
    text: "Por favor ingrese su usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "Ingrese un usuario correctamente";
    },
    allowOutsideClick: false,
}).then((resultado) => {
    userEmail = resultado.value;
    socket.emit("loadChats");
});

btnChat.addEventListener("click", () => {
    const message = valueInput.value.trim();
    console.log(message)
    if (message.length > 0) {
        socket.emit("newMessage", { email: userEmail, message });
        valueInput.value = "";
    } else {
        console.log("El mensaje está vacío");
    }
});

socket.on("showMessages", (messages) => {
    parrafosMensajes.innerHTML = ""; 
    messages.forEach(message => {
        displayMessage(message);
    });
});

socket.on("newMessage", (newMessage) => {
    displayMessage(newMessage);
});

function displayMessage(message) {
    parrafosMensajes.innerHTML += `
        <li class="liParrafosMensajes">
            <div class="spanContainer">
                <p>${message.postTime}</p>
                <p>${message.email}:</p>
            </div>
            <p class="userMessage">${message.message}</p>
        </li>
    `;
}