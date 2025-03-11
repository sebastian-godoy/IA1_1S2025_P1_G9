
let facultades = [];
        
function eliminar_facultad(index) {
    if (confirm("¿Está seguro de eliminar esta facultad?")) {
            facultades.splice(index, 1);
            actualizarTablaFacultades();
            alert("Facultad eliminada");
        }
    }
        
function editarItem(index) {
    const facultad = facultades[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("editText").value = facultad;
    document.getElementById("editModal").style.display = "flex";
}
        
function guardar() {
    const index = parseInt(document.getElementById("editIndex").value);
    const nuevoValor = document.getElementById("editText").value.trim();
            
    if (nuevoValor === "") {
        alert("El nombre de la facultad no puede estar vacío");
        return;
    }
            
    facultades[index] = nuevoValor;
    actualizarTablaFacultades();
        closeModal();
}
        
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}
        
function triggerFileInput() {
    document.getElementById("fileInput").click();
}
        
        // Función para procesar el archivo .pl
function procesarArchivoPL(event) {
    const file = event.target.files[0];
    if (!file) return;
            
        const reader = new FileReader();
        reader.onload = function(e) {
        const contenido = e.target.result;
        extraerFacultades(contenido);
    };
        reader.readAsText(file);
}
        
        // Función para extraer facultades del contenido del archivo
function extraerFacultades(contenido) {
    facultades = [];
    const regex = /facultad\('([^']+)'\)/g;
    let match;
            
           
    while ((match = regex.exec(contenido)) !== null) {
        const nombreFacultad = match[1];
        facultades.push(nombreFacultad);
    }
            
        // Actualizar la tabla con las facultades encontradas
    actualizarTablaFacultades();
}
        
// Función para actualizar la tabla de facultades
function actualizarTablaFacultades() {
    const tabla = document.getElementById("tablaFacultades");
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
            
    // Agregar cada facultad a la tabla
    facultades.forEach((facultad, index) => {
        const nuevaFila = tabla.insertRow();
                
        // Insertar celdas
        const celdaNombre = nuevaFila.insertCell();
        celdaNombre.textContent = facultad;
                
        const celdaAcciones = nuevaFila.insertCell();
            celdaAcciones.className = "actions";
            celdaAcciones.innerHTML = `<button onclick="editarItem(${index})">✏</button><button onclick="eliminar_facultad(${index})">🗑</button>`;
        });
}
        
// Función para generar el contenido del archivo .pl
function generarArchivoPL() {
    let contenido = "";
    facultades.forEach(facultad => {
        contenido += `facultad('${facultad}')\n`;
    });
        return contenido;
}
        
// Función para descargar el archivo .pl
function descargarArchivoPL() {
    const contenido = generarArchivoPL();
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
            
    const a = document.createElement('a');
    a.href = url;
    a.download = 'facultades.pl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
        
// Función para agregar nueva facultad
function agregarFacultad() {
    const nuevaFacultad = prompt("Ingrese el nombre de la nueva facultad:");
    if (nuevaFacultad && nuevaFacultad.trim() !== "") {
        facultades.push(nuevaFacultad.trim());
        actualizarTablaFacultades();
    }
}
        
// Asignar eventos cuando se carga el DOM
document.addEventListener("DOMContentLoaded", function() {
document.getElementById("fileInput").addEventListener("change", procesarArchivoPL);
document.getElementById("btnDescargar").addEventListener("click", descargarArchivoPL);
document.getElementById("btnAgregar").addEventListener("click", agregarFacultad);
});


function cerrarSesion() {
    alert('Sesión cerrada');
    window.location.href = "/html/inicio.html"
}