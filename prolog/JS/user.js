function updateOptions() {
    const selectBox = document.getElementById("category");
    const aptitudes = document.getElementById("aptitudes");
    const habilidades = document.getElementById("habilidades");
    
    if (selectBox.value === "aptitudes") {
        aptitudes.style.display = "block";
        habilidades.style.display = "none";
    } else {
        aptitudes.style.display = "none";
        habilidades.style.display = "block";
    }
}

function siguiente(){
    window.location.href = "/html/user_areas.html"

}

function obtenerDatos() {
    
    let datos = JSON.parse(localStorage.getItem('datos')) || {};

    let aptitudesSeleccionadas = [];
    let aptitudes = document.querySelectorAll("#aptitudes input[type='checkbox']:checked");
    aptitudes.forEach(opcion => {
        aptitudesSeleccionadas.push(opcion.parentElement.textContent.trim());
    });

    let habilidadesSeleccionadas = [];
    let habilidades = document.querySelectorAll("#habilidades input[type='checkbox']:checked");
    habilidades.forEach(opcion => {
        habilidadesSeleccionadas.push(opcion.parentElement.textContent.trim());
    });

    // Guardar en el objeto de datos
    datos["Aptitudes"] = aptitudesSeleccionadas;
    datos["Habilidades"] = habilidadesSeleccionadas;

    // Guardar en localStorage
    localStorage.setItem('datos', JSON.stringify(datos));
}

function verResultados() {
    
    let datos = JSON.parse(localStorage.getItem('datos')) || {}; // Recupera o inicializa

    
    let filas = document.querySelectorAll(".interests table tr");
    datos["Intereses"] = {};

    filas.forEach((fila, index) => {
        if (index > 0) {
            let area = fila.cells[0].innerText;
            let interes = fila.cells[1].querySelector("input").value || "0";
            datos["Intereses"][area] = interes + "%";
        }
    });

    
    datos["Preguntas"] = {};

    let preguntas = ["forma_aprendizaje", "trabajo_ideal", "trabajo_equipo", "tiempo_libre", "ambiente_trabajo"];

    preguntas.forEach(pregunta => {
        let seleccion = document.querySelector(`input[name="${pregunta}"]:checked`);
        datos["Preguntas"][pregunta] = seleccion ? seleccion.value : "No seleccionada";
    });

    // Guardar en localStorage
    localStorage.setItem("datos", JSON.stringify(datos));

    // Redirigir a resultados.html
    
    window.location.href = "/html/resultados.html";
    
}


function convertirHechos(datos) {
    let hechos = [];

    // Convertir aptitudes
    if (Array.isArray(datos.Aptitudes)) {
        datos.Aptitudes.forEach(aptitud => {
            hechos.push(`aptitud("${aptitud}").`);
        });
    }

    // Convertir habilidades
    if (Array.isArray(datos.Habilidades)) {
        datos.Habilidades.forEach(habilidad => {
            hechos.push(`habilidad("${habilidad}").`);
        });
    }

    // Convertir intereses
    if (datos.Intereses) {
        for (const [categoria, porcentaje] of Object.entries(datos.Intereses)) {
            const valor = parseInt(porcentaje.replace('%', ''));
            if (!isNaN(valor)) {
                hechos.push(`interes("${categoria}", ${valor}).`);
            }
        }
    }

    // Convertir respuestas
    if (datos.Preguntas) {
        for (const [pregunta, respuesta] of Object.entries(datos.Preguntas)) {
            hechos.push(`respuesta("${pregunta}", "${respuesta}").`);
        }
    }

    return hechos.join("\n");
}

function cargarDatos() {
    let datosUsuario = JSON.parse(localStorage.getItem('datos')) || {};
    let reglasConocimiento = localStorage.getItem('codigoProlog') || "";

    if (Object.keys(datosUsuario).length === 0 || !reglasConocimiento.trim()) {
        console.error("⚠️ No hay datos o reglas en localStorage.");
        return;
    }

    let prologHechos = convertirHechos(datosUsuario);
    let fullPrologCode = prologHechos + "\n" + reglasConocimiento;

    console.log("Hechos generados para Prolog:\n", prologHechos);
    console.log("Base de conocimiento cargada:\n", reglasConocimiento);

    const session = pl.create();
    session.consult(fullPrologCode, {
        success: function () {
            console.log("Base de conocimiento cargada en Prolog.");
            ejecutarConsulta(session);
        },
        error: function (err) {
            console.error("Error al cargar la base de conocimiento:", err);
        }
    });
}

function ejecutarConsulta(session) {
    session.query("carrera_recomendada(Carrera).", {
        success: function () {
            session.answers(
                function (answer) {
                    if (pl.type.is_substitution(answer)) {
                        let carrera = answer.lookup("Carrera").toString();
                        console.log("Carrera recomendada:", carrera);
                        calcularAfinidad(session, carrera);
                    }
                },
                function (err) {
                    console.error("Error en la consulta:", err);
                }
            );
        },
        error: function (err) {
            console.error("Error al ejecutar la consulta:", err);
        }
    });
}

function calcularAfinidad(session, carrera) {
    session.query(`afinidad_carrera("${carrera}", Afinidad).`, {
        success: function () {
            session.answers(
                function (answer) {
                    if (pl.type.is_substitution(answer)) {
                        let afinidad = answer.lookup("Afinidad").toString();
                        console.log(`Afinidad con ${carrera}: ${afinidad}%`);
                    }
                },
                function (err) {
                    console.error("Error en la consulta de afinidad:", err);
                }
            );
        },
        error: function (err) {
            console.error("Error al calcular afinidad:", err);
        }
    });
}



function borrar(){
    localStorage.removeItem("datos");

    window.location.href = "/html/inicio.html"

}