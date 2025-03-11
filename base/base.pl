% Reglas para recomendar carreras basadas en los datos del usuario

% Regla para carreras en ingeniería
carrera_recomendada("Ingeniería Informática") :-
    interes("Ingeniería y tecnología", Valor),
    Valor >= 70,
    (habilidad("Resolver problemas matemáticos") ; aptitud("Facilidad para el razonamiento lógico")),
    (respuesta("forma_aprendizaje", "lectura") ; respuesta("trabajo_ideal", "matematicas")).

carrera_recomendada("Ingeniería Civil") :-
    interes("Ingeniería y tecnología", Valor),
    Valor >= 60,
    habilidad("Resolver problemas matemáticos"),
    respuesta("ambiente_trabajo", "oficina").

carrera_recomendada("Matemáticas") :-
    habilidad("Resolver problemas matemáticos"),
    aptitud("Facilidad para el razonamiento lógico"),
    respuesta("trabajo_ideal", "matematicas").

% Reglas para carreras en ciencias de la salud
carrera_recomendada("Medicina") :-
    interes("Ciencias de la salud", Valor),
    Valor >= 70,
    respuesta("tiempo_libre", "leer").

% Regla para determinar la afinidad de una carrera
afinidad_carrera(Carrera, Afinidad) :-
    carrera_recomendada(Carrera),
    calcular_afinidad(Carrera, Afinidad).

% Cálculo simple de afinidad basado en intereses
calcular_afinidad("Ingeniería Informática", Afinidad) :-
    interes("Ingeniería y tecnología", Valor),
    Afinidad is Valor.

calcular_afinidad("Medicina", Afinidad) :-
    interes("Ciencias de la salud", Valor),
    Afinidad is Valor.

% Regla por defecto
calcular_afinidad(_, 50).  % Afinidad por defecto