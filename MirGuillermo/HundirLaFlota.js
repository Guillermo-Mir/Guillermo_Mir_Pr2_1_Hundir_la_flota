// ------------------ Datos iniciales de los barcos ------------------
// Declaramos los datos de los barcos como un string JSON con nombre y tamaño
const barcosJSON = 
`[
    { "name": "Portaaviones", "size": 5 },
    { "name": "Acorazado", "size": 4 },
    { "name": "Crucero", "size": 3 },
    { "name": "Submarino", "size": 3 },
    { "name": "Destructor", "size": 2 }
]`;

// Convertimos el string JSON en un array de objetos JavaScript
let arrayBarcos = JSON.parse(barcosJSON); // arrayBarcos tendrá objetos { name, size }
console.log(arrayBarcos); // Imprimimos en consola para verificar

// ------------------ Variables globales ------------------
let barcoSeleccionado = null;      // Guardará el barco que el jugador seleccionó
let direccionBarco = "H";          // Dirección actual del barco (H = horizontal, V = vertical)
let barcosColocados = [];          // Lista de nombres de barcos que ya fueron colocados

// ------------------ Selección de barcos ------------------
// Función para seleccionar un barco cuando se pulsa su botón
function seleccionarBarco(barcoName, barcoSize) {
    barcoSeleccionado = { nombre: barcoName, tamaño: barcoSize }; // Guardamos la selección
}

// Añadimos listeners a cada botón para seleccionar un barco
document.getElementById("portaaviones").addEventListener("click", () => seleccionarBarco("Portaaviones", 5));
document.getElementById("acorazado").addEventListener("click", () => seleccionarBarco("Acorazado", 4));
document.getElementById("crucero").addEventListener("click", () => seleccionarBarco("Crucero", 3));
document.getElementById("submarino").addEventListener("click", () => seleccionarBarco("Submarino", 3));
document.getElementById("destructor").addEventListener("click", () => seleccionarBarco("Destructor", 2));

// ------------------ Cambio de dirección (H ↔ V) ------------------
// Al presionar la tecla "R", cambiamos la dirección del barco
document.addEventListener("keydown", function(event) {
    if (event.key === "r" || event.key === "R") {
        direccionBarco = direccionBarco === "H" ? "V" : "H"; // Alterna entre H y V
        console.log("Dirección del barco ahora es:", direccionBarco); // Mostrar cambio
    }
});

// ------------------ Lógica para colocar barcos en el tablero ------------------
// Función que intenta colocar el barco seleccionado en las coordenadas dadas
function colocarBarcoEnTablero(x, y) {
    if (!barcoSeleccionado) return; // Si no se ha seleccionado barco, salir

    const barco = barcoSeleccionado;

    // Comprobamos si el barco ya fue colocado
    if (barcosColocados.includes(barco.nombre)) {
        alert("Ya has colocado el " + barco.nombre); // Mensaje de aviso
        return;
    }

    // Verificamos si hay espacio suficiente en el tablero
    if (tableroUsuario.verificarEspacio(x, y, barco.tamaño, direccionBarco)) {
        // Colocar barco en la matriz
        tableroUsuario.ubicarBarco(x, y, barco.tamaño, direccionBarco, barco.nombre);
        tableroUsuario.mostrarTablero("contenedor2"); // Refrescar visualmente el tablero

        barcosColocados.push(barco.nombre); // Añadir a la lista de barcos colocados
        barcoSeleccionado = null;           // Desseleccionamos el barco

        // Si ya se colocaron todos los barcos, habilitar el botón de jugar
        if (barcosColocados.length === arrayBarcos.length) {
            document.getElementById("jugar").disabled = false;
        }
    } else {
        alert("No se puede colocar el barco en esta posición."); // Posición inválida
    }
}

// ------------------ Manejo de clics en el tablero del usuario ------------------
// Detectar clic en una celda del tablero del jugador
const contenedorUsuario = document.getElementById("contenedor2");
contenedorUsuario.addEventListener("click", (event) => {
    if (event.target.tagName === "TD") {
        const x = event.target.parentNode.rowIndex - 1;  // Coordenada X (fila)
        const y = event.target.cellIndex - 1;            // Coordenada Y (columna)
        if (x >= 0 && y >= 0) colocarBarcoEnTablero(x, y); // Colocamos el barco
    }
});

// ------------------ Clase Tablero ------------------
// Representa un tablero de 10x10
class Tablero {
    constructor(colocarBarcos = false) {
        this.tablero = this.crearTableroVacio(); // Inicializa matriz 10x10 de celdas
        this.barcos = arrayBarcos;               // Usa los barcos definidos al inicio

        if (colocarBarcos) {
            this.colocarBarcos(); // Coloca barcos aleatoriamente (para IA)
        }
    }

    // Coloca todos los barcos aleatoriamente sin solaparlos
    colocarBarcos() {
        for (let barco of this.barcos) {
            let colocado = false;
            while (!colocado) {
                let x = Math.floor(Math.random() * 10);              // Posición aleatoria
                let y = Math.floor(Math.random() * 10);
                let direccion = Math.random() < 0.5 ? 'H' : 'V';     // Dirección aleatoria

                if (this.verificarEspacio(x, y, barco.size, direccion)) {
                    this.ubicarBarco(x, y, barco.size, direccion, barco.name);
                    colocado = true; // Salimos del bucle si se pudo colocar
                }
            }
        }
    }

    // Verifica si hay espacio disponible para colocar un barco en la dirección dada
    verificarEspacio(x, y, size, direccion) {
        if (direccion === 'H') {
            if (y + size > 10) return false; // Excede límites del tablero
            for (let i = 0; i < size; i++) {
                if (this.tablero[x][y + i].estadoCelda !== 'agua') return false;
            }
        } else {
            if (x + size > 10) return false;
            for (let i = 0; i < size; i++) {
                if (this.tablero[x + i][y].estadoCelda !== 'agua') return false;
            }
        }
        return true; // Espacio válido
    }

    // Coloca un barco en la matriz
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

    // Crea una matriz vacía de 10x10 celdas
    crearTableroVacio() {
        let tableroVacio = [];
        for (let x = 0; x < 10; x++) {
            let fila = [];
            for (let y = 0; y < 10; y++) {
                fila.push(new Celda('agua', false, x, y, null)); // Cada celda inicia como agua
            }
            tableroVacio.push(fila);
        }
        return tableroVacio;
    }

    // Muestra el tablero en un contenedor HTML
    mostrarTablero(contenedorID){
        const contenedor = document.getElementById(contenedorID);
        contenedor.innerHTML = ""; // Limpia contenido anterior
        const tabla = document.createElement("table");

        // Cabecera de columnas (0-9)
        let filaCabecera = document.createElement("tr");
        filaCabecera.appendChild(document.createElement("th"));
        for (let y = 0; y < 10; y++) {
            let th = document.createElement("th");
            th.innerText = y;
            filaCabecera.appendChild(th);
        }
        tabla.appendChild(filaCabecera);

        // Cuerpo de la tabla
        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            let th = document.createElement("th");
            th.innerText = x;
            fila.appendChild(th);

            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");

                // Estilos según si es tablero de IA o del jugador
                if (contenedorID === "contenedor1") {
                    celda.classList.add("celda-agua"); // IA no muestra barcos
                } else {
                    if (this.tablero[x][y].estadoCelda === "barco") {
                        celda.classList.add("celda-barco");
                        celda.innerText = this.tablero[x][y].nombreBarco[0]; // Primera letra
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

// ------------------ Clase Celda ------------------
// Representa una sola celda del tablero
class Celda {
    constructor(estadoCelda, estadoBarco, x, y, nombreBarco) {
        this.estadoCelda = estadoCelda; // 'agua', 'barco', 'tocado', etc.
        this.estadoBarco = estadoBarco; // Booleano: ha sido tocado o no
        this.x = x;
        this.y = y;
        this.nombreBarco = nombreBarco; // Nombre del barco, si hay
    }
}

// ------------------ Crear tableros ------------------
const tableroIA = new Tablero(true);    // Tablero de IA con barcos colocados aleatoriamente
const tableroUsuario = new Tablero(false); // Tablero del usuario vacío

tableroIA.mostrarTab
