const barcosJSON = 
`[
    { "name": "Portaaviones", "size": 5 },
    { "name": "Acorazado", "size": 4 },
    { "name": "Crucero", "size": 3 },
    { "name": "Submarino", "size": 3 },
    { "name": "Destructor", "size": 2 }
]`;

let arrayBarcos = JSON.parse(barcosJSON);
console.log(arrayBarcos);

let barcoSeleccionado = null;
let direccionBarco = "H"; // "H"orizontal o "V"ertical
let barcosColocados = [];

function seleccionarBarco(barcoName, barcoSize) {
    barcoSeleccionado = { nombre: barcoName, tamaño: barcoSize };
}

// Asociar botones
document.getElementById("portaaviones").addEventListener("click", () => seleccionarBarco("Portaaviones", 5));
document.getElementById("acorazado").addEventListener("click", () => seleccionarBarco("Acorazado", 4));
document.getElementById("crucero").addEventListener("click", () => seleccionarBarco("Crucero", 3));
document.getElementById("submarino").addEventListener("click", () => seleccionarBarco("Submarino", 3));
document.getElementById("destructor").addEventListener("click", () => seleccionarBarco("Destructor", 2));

document.addEventListener("keydown", function(event) {
    if (event.key === "r" || event.key === "R") {
        direccionBarco = direccionBarco === "H" ? "V" : "H";
        console.log("Dirección del barco ahora es:", direccionBarco);
    }
});

function colocarBarcoEnTablero(x, y) {
    if (!barcoSeleccionado) return;

    const barco = barcoSeleccionado;

    if (barcosColocados.includes(barco.nombre)) {
        alert("Ya has colocado el " + barco.nombre);
        return;
    }

    if (tableroUsuario.verificarEspacio(x, y, barco.tamaño, direccionBarco)) {
        tableroUsuario.ubicarBarco(x, y, barco.tamaño, direccionBarco, barco.nombre);
        tableroUsuario.mostrarTablero("contenedor2");
        barcosColocados.push(barco.nombre);
        barcoSeleccionado = null;

        if (barcosColocados.length === arrayBarcos.length) {
            document.getElementById("jugar").disabled = false;
        }
    } else {
        alert("No se puede colocar el barco en esta posición.");
    }
}

const contenedorUsuario = document.getElementById("contenedor2");
contenedorUsuario.addEventListener("click", (event) => {
    if (event.target.tagName === "TD") {
        const x = event.target.parentNode.rowIndex - 1;
        const y = event.target.cellIndex - 1;
        if (x >= 0 && y >= 0) colocarBarcoEnTablero(x, y);
    }
});

class Tablero {
    constructor(colocarBarcos = false) {
        this.tablero = this.crearTableroVacio();
        this.barcos = arrayBarcos;

        if (colocarBarcos) {
            this.colocarBarcos();
        }
    }

    colocarBarcos() {
        for (let barco of this.barcos) {
            let colocado = false;
            while (!colocado) {
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);
                let direccion = Math.random() < 0.5 ? 'H' : 'V';

                if (this.verificarEspacio(x, y, barco.size, direccion)) {
                    this.ubicarBarco(x, y, barco.size, direccion, barco.name);
                    colocado = true;
                }
            }
        }
    }

    verificarEspacio(x, y, size, direccion) {
        if (direccion === 'H') {
            if (y + size > 10) return false;
            for (let i = 0; i < size; i++) {
                if (this.tablero[x][y + i].estadoCelda !== 'agua') return false;
            }
        } else {
            if (x + size > 10) return false;
            for (let i = 0; i < size; i++) {
                if (this.tablero[x + i][y].estadoCelda !== 'agua') return false;
            }
        }
        return true;
    }

    ubicarBarco(x, y, size, direccion, nombre) {
        for (let i = 0; i < size; i++) {
            if (direccion === 'H') {
                this.tablero[x][y + i].estadoCelda = 'barco';
                this.tablero[x][y + i].nombreBarco = nombre;
            } else {
                this.tablero[x + i][y].estadoCelda = 'barco';
                this.tablero[x + i][y].nombreBarco = nombre;
            }
        }
    }

    crearTableroVacio() {
        let tableroVacio = [];
        for (let x = 0; x < 10; x++) {
            let fila = [];
            for (let y = 0; y < 10; y++) {
                fila.push(new Celda('agua', false, x, y, null));
            }
            tableroVacio.push(fila);
        }
        return tableroVacio;
    }

    mostrarTablero(contenedorID){
        const contenedor = document.getElementById(contenedorID);
        contenedor.innerHTML = "";
        const tabla = document.createElement("table");

        // Cabecera con coordenadas Y (0-9)
        let filaCabecera = document.createElement("tr");
        filaCabecera.appendChild(document.createElement("th")); // espacio vacío esquina
        for (let y = 0; y < 10; y++) {
            let th = document.createElement("th");
            th.innerText = y;
            filaCabecera.appendChild(th);
        }
        tabla.appendChild(filaCabecera);

        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            let th = document.createElement("th");
            th.innerText = x; // Coordenadas X (0-9)
            fila.appendChild(th);
            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");

                if (contenedorID === "contenedor1") {
                    if (this.tablero[x][y].estadoCelda === "agua") {
                        celda.classList.add("celda-agua");
                    } else {
                        celda.classList.add("celda-agua");
                    }
                } else {
                    if (this.tablero[x][y].estadoCelda === "barco") {
                        celda.classList.add("celda-barco");
                        celda.innerText = this.tablero[x][y].nombreBarco[0];
                    } else {
                        celda.classList.add("celda-agua");
                    }
                }

                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        contenedor.appendChild(tabla);
    }
}

class Celda {
    constructor(estadoCelda, estadoBarco, x, y, nombreBarco) {
        this.estadoCelda = estadoCelda;
        this.estadoBarco = estadoBarco;
        this.x = x;
        this.y = y;
        this.nombreBarco = nombreBarco;
    }
}

const tableroIA = new Tablero(true);
const tableroUsuario = new Tablero(false);

tableroIA.mostrarTablero("contenedor1");
tableroUsuario.mostrarTablero("contenedor2");

console.log("Tablero de la IA:", tableroIA.tablero);
console.log("Tablero del Usuario:", tableroUsuario.tablero);

// Botón Jugar y lógica de disparo
const btnJugar = document.getElementById("jugar");
const formDisparo = document.getElementById("disparo-form");
const mensajeDisparo = document.getElementById("mensaje-disparo");
const coordX = document.getElementById("coordX");
const coordY = document.getElementById("coordY");
const btnDisparar = document.getElementById("btnDisparar");

btnJugar.addEventListener("click", () => {
    formDisparo.style.display = "block";
    mensajeDisparo.innerText = "¡Comienza la partida!";
});

btnDisparar.addEventListener("click", () => {
    let x = parseInt(coordX.value);  // cordX es ahora la coordenada horizontal (X)
    let y = parseInt(coordY.value);  // cordY es ahora la coordenada vertical (Y)
    
    if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
        alert("Coordenadas inválidas");
        return;
    }

    dispararJugador(x, y);  // Llamar a la función dispararJugador con las coordenadas correctas
});

function dispararJugador(x, y) {
    let celda = tableroIA.tablero[y][x];  // y,x porque Y es fila y X es columna
    const contenedor = document.getElementById("contenedor1");
    const celdaHTML = contenedor.querySelectorAll("tr")[y + 1].children[x + 1];

    if (celda.estadoCelda === "agua") {
        celdaHTML.classList.add("celda-agua-impacto");
        mensajeDisparo.innerText = "¡Agua! Turno de la IA.";
        setTimeout(turnoIA, 1000);
    } else if (celda.estadoCelda === "barco") {
        celda.estadoCelda = "tocado";
        celdaHTML.classList.add("celda-tocado");
        mensajeDisparo.innerText = "¡Tocado! Puedes volver a disparar.";

        if (verificarFinDePartida(tableroIA, "Jugador")) {
            return; // Terminar si el jugador ganó
        }
    } else if (celda.estadoCelda === "tocado") {
        mensajeDisparo.innerText = "Ya has disparado aquí.";
    }
}


function turnoIA() {
    let disparado = false;
    while (!disparado) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let celda = tableroUsuario.tablero[y][x];

        const contenedor = document.getElementById("contenedor2");
        const celdaHTML = contenedor.querySelectorAll("tr")[y + 1].children[x + 1];

        if (celda.estadoCelda === "agua") {
            celda.estadoCelda = "falloIA";
            celdaHTML.classList.add("celda-ataque-ia");
            mensajeDisparo.innerText = "IA: Agua. Tu turno.";
            disparado = true;
        } else if (celda.estadoCelda === "barco") {
            celda.estadoCelda = "tocadoIA";
            celdaHTML.classList.add("celda-hundido");
            mensajeDisparo.innerText = "IA: ¡Tocado! IA vuelve a disparar.";

            if (verificarFinDePartida(tableroUsuario, "IA")) {
                return; // Terminar si la IA ganó
            }
        }
    }
}


function verificarFinDePartida(tablero, jugador) {
    for (let fila of tablero.tablero) {
        for (let celda of fila) {
            if (celda.estadoCelda === "barco") {
                return false; // Aún queda al menos un barco
            }
        }
    }
    mensajeDisparo.innerText = `¡${jugador} ha ganado la partida! 🎉`;
    finalizarPartida();
    return true;
}

function finalizarPartida() {
    formDisparo.style.display = "none";
    btnJugar.disabled = true;
    btnDisparar.disabled = true;
    coordX.disabled = true;
    coordY.disabled = true;

    setTimeout(() => {
        const reiniciar = confirm("¿Quieres jugar otra vez?");
        if (reiniciar) {
            location.reload(); // Recarga la página para reiniciar todo
        }
    }, 500); // Espera medio segundo para mostrar el mensaje de victoria primero
}
