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
        if (direccionBarco === "H") {
            direccionBarco = "V";
        } else {
            direccionBarco = "H";
        }
        console.log("Dirección del barco ahora es:", direccionBarco); //poder ver la posicion por consola 
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
    } else {
        alert("No se puede colocar el barco en esta posición.");
    }
}

// Escuchar clics en el tablero del usuario
const contenedorUsuario = document.getElementById("contenedor2");
contenedorUsuario.addEventListener("click", (event) => {
    if (event.target.tagName === "TD") {
        const x = event.target.parentNode.rowIndex;
        const y = event.target.cellIndex;
        colocarBarcoEnTablero(x, y);
    }
});

// -------------------------
// Clases Tablero y Celda
// -------------------------

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
    
        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");
    
                if (this.tablero[x][y].estadoCelda === "barco") {
                    celda.classList.add("celda-barco");
                    celda.innerText = this.tablero[x][y].nombreBarco[0];
                } else {
                    celda.classList.add("celda-agua");
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

// Crear los tableros una sola vez
const tableroIA = new Tablero(true);
const tableroUsuario = new Tablero(false);

// Mostrar ambos tableros
tableroIA.mostrarTablero("contenedor1");
tableroUsuario.mostrarTablero("contenedor2");

// Consola
console.log("Tablero de la IA:", tableroIA.tablero);
console.log("Tablero del Usuario:", tableroUsuario.tablero);