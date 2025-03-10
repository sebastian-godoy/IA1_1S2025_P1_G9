function login(event) {
    event.preventDefault(); // Detiene el envío del formulario

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var message = document.getElementById("message");

    console.log(email, password);

    if (email === "admin@gmail.com" && password === "admin") {
        console.log("Bienvenido");
        message.style.color = "green";
        message.textContent = "✅ Login exitoso, redirigiendo...";

        setTimeout(() => {
            window.location.href = "/html/admin.html"; // Redirige después de 1 segundo
        }, 1000);
    } else {
        console.log("Error de autenticación");
        message.style.color = "red";
        message.textContent = "❌ Usuario o contraseña incorrectos";
    }
}