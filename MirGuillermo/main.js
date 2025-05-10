import { barcosJSON } from './barcos.js';
import { Tablero } from './tablero.js';
import { Celda } from './celda.js';

// Convertimos el JSON de barcos a un array de objetos JavaScript
export let arrayBarcos = JSON.parse(barcosJSON);
console.log("Barcos disponibles:", arrayBarcos);

// Variables globales para controlar selección y estado de los barcos
let barcoSeleccionado = null;
let direccionBarco = "H"; // "H" = Horizontal, "V" = Vertical
let barcosColocados = [];

// Crear instancias de los tableros
const tableroIA = new Tablero(true);  // IA con barcos colocados aleatoriamente
const tableroUsuario = new Tablero(false); // Usuario vacío

// Función para inicializar el juego
function inicializarJuego() {
    // Dibujar tableros iniciales
    tableroIA.mostrarTablero("contenedor1");
    tableroUsuario.mostrarTablero("contenedor2");

    // Mostrar tablero por consola
    console.log("Tablero de la IA:", tableroIA.tablero);
    console.log("Tablero del Usuario:", tableroUsuario.tablero);

    // Configurar event listeners
    configurarEventListeners();

}

// Función para configurar todos los event listeners
function configurarEventListeners() {
    // Botones de selección de barcos
    document.getElementById("portaaviones").addEventListener("click", () => seleccionarBarco("Portaaviones", 5));
    document.getElementById("acorazado").addEventListener("click", () => seleccionarBarco("Acorazado", 4));
    document.getElementById("crucero").addEventListener("click", () => seleccionarBarco("Crucero", 3));
    document.getElementById("submarino").addEventListener("click", () => seleccionarBarco("Submarino", 3));
    document.getElementById("destructor").addEventListener("click", () => seleccionarBarco("Destructor", 2));

    // Rotar barco con tecla R
    document.addEventListener("keydown", function(event) {
        if (event.key === "r" || event.key === "R") {
            direccionBarco = direccionBarco === "H" ? "V" : "H";
            console.log("Dirección del barco cambiada a:", direccionBarco);
        }
    });

    // Colocar barcos en tablero usuario
    const contenedorUsuario = document.getElementById("contenedor2");
    contenedorUsuario.addEventListener("click", (event) => {
        if (event.target.tagName === "TD") {
            const x = event.target.parentNode.rowIndex - 1;
            const y = event.target.cellIndex - 1;
            if (x >= 0 && y >= 0) colocarBarcoEnTablero(x, y);
        }
    });

    // Botón Jugar
    document.getElementById("jugar").addEventListener("click", () => {
        if (barcosColocados.length === arrayBarcos.length) {
            document.getElementById("disparo-form").style.display = "block";
            document.getElementById("mensaje-disparo").innerText = "¡Comienza la partida!";
        } else {
            alert("Debes colocar todos los barcos primero!");
        }
    });

    // Botón Disparar
    document.getElementById("btnDisparar").addEventListener("click", () => {
        const x = parseInt(document.getElementById("coordX").value);
        const y = parseInt(document.getElementById("coordY").value);

        if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
            alert("Coordenadas inválidas. Usa números del 0 al 9.");
            return;
        }

        dispararJugador(x, y);
    });

    // Botón Guardar
    document.getElementById("btnGuardar").addEventListener("click", () => {
        const nombre = prompt("Introduce tu nombre para guardar la partida:");
        if (nombre) {
            guardarPartida(nombre, tableroUsuario, tableroIA);
        }
    });

    // Botón Cargar
    document.getElementById("btnCargar").addEventListener("click", async () => {
        const id = prompt("Introduce el ID de la partida que quieres cargar:");
        if (id) {
            const partida = await cargarPartida(id);
            if (partida) {
                recuperaTablerosApi(partida);
            }
        }
    });
}

// Función para seleccionar un barco
function seleccionarBarco(barcoName, barcoSize) {
    if (barcosColocados.includes(barcoName)) {
        alert(`Ya has colocado el ${barcoName}. Elige otro barco.`);
        return;
    }
    barcoSeleccionado = { nombre: barcoName, tamaño: barcoSize };
}

// Función para colocar barcos
function colocarBarcoEnTablero(x, y) {
    if (!barcoSeleccionado) {
        alert("Primero selecciona un barco haciendo clic en uno de los botones superiores");
        return;
    }

    const barco = barcoSeleccionado;

    if (tableroUsuario.verificarEspacio(x, y, barco.tamaño, direccionBarco)) {
        tableroUsuario.ubicarBarco(x, y, barco.tamaño, direccionBarco, barco.nombre);
        tableroUsuario.mostrarTablero("contenedor2");
        barcosColocados.push(barco.nombre);
        barcoSeleccionado = null;


        if (barcosColocados.length === arrayBarcos.length) {
            document.getElementById("jugar").disabled = false;
            console.log("Todos los barcos colocados. Listo para jugar!");
        }
    } else {
        alert("No se puede colocar el barco en esta posición. Intenta en otra ubicación.");
    }
}

// Función que gestiona el disparo del jugador
function dispararJugador(x, y) {
    const celda = tableroIA.tablero[y][x];
    const contenedor = document.getElementById("contenedor1");
    const celdaHTML = contenedor.querySelectorAll("tr")[y + 1].children[x + 1];
    const mensajeDisparo = document.getElementById("mensaje-disparo");

    if (celda.estadoCelda === "agua") {
        celda.estadoCelda = "agua-impacto";
        celdaHTML.classList.add("celda-agua-impacto");
        mensajeDisparo.innerText = "¡Agua! Turno de la IA.";
        setTimeout(turnoIA, 1000);
    } else if (celda.estadoCelda === "barco") {
        celda.estadoCelda = "tocado";
        celdaHTML.classList.add("celda-tocado");
        mensajeDisparo.innerText = "¡Tocado! Dispara otra vez.";

        if (verificarFinDePartida(tableroIA, "Jugador")) {
            return;
        }
    } else {
        mensajeDisparo.innerText = "Ya has disparado aquí. Elige otra coordenada.";
    }
}

// Turno de la IA
function turnoIA() {
    let disparado = false;
    while (!disparado) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const celda = tableroUsuario.tablero[y][x];
        const contenedor = document.getElementById("contenedor2");
        const celdaHTML = contenedor.querySelectorAll("tr")[y + 1].children[x + 1];
        const mensajeDisparo = document.getElementById("mensaje-disparo");

        if (celda.estadoCelda === "agua") {
            celda.estadoCelda = "ataque-ia";
            celdaHTML.classList.add("celda-ataque-ia");
            mensajeDisparo.innerText = "La IA ha disparado al agua. Tu turno.";
            disparado = true;
        } else if (celda.estadoCelda === "barco") {
            celda.estadoCelda = "hundido";
            celdaHTML.classList.add("celda-hundido");
            mensajeDisparo.innerText = "¡La IA ha tocado tu barco! Vuelve a disparar.";

            if (verificarFinDePartida(tableroUsuario, "IA")) {
                return;
            }
        }
    }
}

// Comprueba si un jugador ha ganado
function verificarFinDePartida(tablero, jugador) {
    for (let fila of tablero.tablero) {
        for (let celda of fila) {
            if (celda.estadoCelda === "barco") {
                return false;
            }
        }
    }
    finalizarPartida(jugador);
    return true;
}

// Finaliza la partida
function finalizarPartida(ganador) {
    const mensajeDisparo = document.getElementById("mensaje-disparo");
    mensajeDisparo.innerText = `¡${ganador} ha ganado la partida!`;

    document.getElementById("disparo-form").style.display = "none";
    document.getElementById("jugar").disabled = true;
    document.getElementById("btnDisparar").disabled = true;

    setTimeout(() => {
        if (confirm(`¡${ganador} ha ganado! ¿Quieres jugar otra partida?`)) {
            location.reload();
        }
    }, 500);
}

// Guardar partida en el servidor
async function guardarPartida(nombreJugador, tableroJugador, tableroIA) {
    const partida = {
        jugador: nombreJugador,
        tableroJugador: JSON.stringify(tableroJugador.serialize()),
        tableroIA: JSON.stringify(tableroIA.serialize()),
        barcosColocados: barcosColocados,
        direccionBarco: direccionBarco
    };

    try {
        const response = await fetch("http://localhost:3000/partidas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partida)
        });

        if (!response.ok) throw new Error("Error al guardar la partida");

        const data = await response.json();
        console.log("Partida guardada:", data);
        alert(`Partida guardada con éxito! ID: ${data.id}`);
        return data.id;
    } catch (err) {
        console.error("Error:", err);
        alert("Error al guardar la partida. Verifica que el servidor esté funcionando.");
    }
}

// Cargar partida desde el servidor
async function cargarPartida(id) {
    try {
        const response = await fetch(`http://localhost:3000/partidas/${id}`);
        if (!response.ok) throw new Error("No se encontró la partida");

        const data = await response.json();
        console.log("Partida cargada:", data);
        return data;
    } catch (err) {
        console.error("Error:", err);
        alert("Error al cargar la partida. Verifica el ID y que el servidor esté funcionando.");
        return null;
    }
}

// Recupera los tableros desde los datos de la API
function recuperaTablerosApi(partida) {
    barcosColocados = partida.barcosColocados || [];
    direccionBarco = partida.direccionBarco || 'H';

    const dataJugador = typeof partida.tableroJugador === 'string' ? 
        JSON.parse(partida.tableroJugador) : partida.tableroJugador;
    const dataIA = typeof partida.tableroIA === 'string' ? 
        JSON.parse(partida.tableroIA) : partida.tableroIA;

    tableroUsuario.tablero = dataJugador.casillas.map(fila =>
        fila.map(celda => new Celda(
            celda.estadoCelda,
            celda.estadoCelda !== 'agua',
            celda.x,
            celda.y,
            celda.nombreBarco
        ))
    );

    tableroIA.tablero = dataIA.casillas.map(fila =>
        fila.map(celda => new Celda(
            celda.estadoCelda,
            celda.estadoCelda !== 'agua',
            celda.x,
            celda.y,
            celda.nombreBarco
        ))
    );

    tableroUsuario.mostrarTablero("contenedor2");
    tableroIA.mostrarTablero("contenedor1");

    console.log("Tablero Usuario (partida cargada):", tableroUsuario);
    console.log("Tablero IA (partida cargada):", tableroIA);

    if (barcosColocados.length === arrayBarcos.length) {
        document.getElementById("jugar").disabled = false;
    }

    document.getElementById("disparo-form").style.display = "block";
    document.getElementById("mensaje-disparo").innerText = "Partida cargada. ¡Continúa jugando!";
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarJuego);
