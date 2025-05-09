// Definimos los barcos disponibles en el juego como un JSON
const barcosJSON = 
`[
    { "name": "Portaaviones", "size": 5 },
    { "name": "Acorazado", "size": 4 },
    { "name": "Crucero", "size": 3 },
    { "name": "Submarino", "size": 3 },
    { "name": "Destructor", "size": 2 }
]`;

// Convertimos el JSON de barcos a un array de objetos JavaScript
let arrayBarcos = JSON.parse(barcosJSON);
console.log(arrayBarcos); // Mostramos en consola el array resultante

// Variables globales para controlar selección y estado de los barcos
let barcoSeleccionado = null;           // Barco que el jugador ha elegido para colocar
let direccionBarco = "H";             // Dirección inicial: "H"=horizontal, "V"=vertical
let barcosColocados = [];               // Nombres de barcos ya colocados en el tablero

// Función para seleccionar un barco al hacer clic en su botón
function seleccionarBarco(barcoName, barcoSize) {
    // Guardamos el nombre y tamaño del barco seleccionado
    barcoSeleccionado = { nombre: barcoName, tamaño: barcoSize };
}

// Asociamos cada botón de barco a la función seleccionarBarco
document.getElementById("portaaviones").addEventListener("click", () => seleccionarBarco("Portaaviones", 5));
document.getElementById("acorazado").addEventListener("click", () => seleccionarBarco("Acorazado", 4));
document.getElementById("crucero").addEventListener("click", () => seleccionarBarco("Crucero", 3));
document.getElementById("submarino").addEventListener("click", () => seleccionarBarco("Submarino", 3));
document.getElementById("destructor").addEventListener("click", () => seleccionarBarco("Destructor", 2));

// Permitir rotar la dirección del barco presionando la tecla "R"
document.addEventListener("keydown", function(event) {
    if (event.key === "r" || event.key === "R") {
        // Alternamos entre horizontal y vertical
        direccionBarco = direccionBarco === "H" ? "V" : "H";
        console.log("Dirección del barco ahora es:", direccionBarco);
    }
});

// Función para colocar el barco seleccionado en el tablero del usuario
function colocarBarcoEnTablero(x, y) {
    if (!barcoSeleccionado) return; // Si no hay barco seleccionado, no hacemos nada

    const barco = barcoSeleccionado; // Objeto { nombre, tamaño }

    // Prevenir colocar el mismo barco dos veces
    if (barcosColocados.includes(barco.nombre)) {
        alert("Ya has colocado el " + barco.nombre);
        return;
    }

    // Verificamos si el espacio está libre y dentro del tablero
    if (tableroUsuario.verificarEspacio(x, y, barco.tamaño, direccionBarco)) {
        // Ubicamos el barco en la matriz de celdas
        tableroUsuario.ubicarBarco(x, y, barco.tamaño, direccionBarco, barco.nombre);
        // Redibujamos el tablero del usuario en pantalla
        tableroUsuario.mostrarTablero("contenedor2");
        barcosColocados.push(barco.nombre); // Añadimos a la lista de barcos colocados
        barcoSeleccionado = null; // Deseleccionamos el barco

        // Si ya hemos colocado todos, habilitamos el botón "Jugar"
        if (barcosColocados.length === arrayBarcos.length) {
            document.getElementById("jugar").disabled = false;
        }
    } else {
        alert("No se puede colocar el barco en esta posición.");
    }
}

// Escucha clicks sobre cada celda del tablero del usuario
const contenedorUsuario = document.getElementById("contenedor2");
contenedorUsuario.addEventListener("click", (event) => {
    if (event.target.tagName === "TD") {
        // Calculamos coordenadas basadas en el índice de fila y columna
        const x = event.target.parentNode.rowIndex - 1;
        const y = event.target.cellIndex - 1;
        if (x >= 0 && y >= 0) colocarBarcoEnTablero(x, y);
    }
});

// Clase que representa un tablero de 10x10
class Tablero {
    constructor(colocarBarcos = false) {
        this.tablero = this.crearTableroVacio(); // Matriz 10x10 de objetos Celda
        this.barcos = arrayBarcos;               // Referencia a arrayBarcos

        if (colocarBarcos) {
            this.colocarBarcos();               // Sólo para IA: coloca barcos aleatoriamente
        }
    }

    // Coloca todos los barcos en posiciones aleatorias sin superponer
    colocarBarcos() {
        for (let barco of this.barcos) {
            let colocado = false;
            while (!colocado) {
                // Generar coordenadas y dirección al azar
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);
                let direccion = Math.random() < 0.5 ? 'H' : 'V';

                if (this.verificarEspacio(x, y, barco.size, direccion)) {
                    // Si cabe, lo ubicamos y salimos del bucle
                    this.ubicarBarco(x, y, barco.size, direccion, barco.name);
                    colocado = true;
                }
            }
        }
    }

    // Verifica que una posición esté libre para un barco de tamaño dado
    verificarEspacio(x, y, size, direccion) {
        if (direccion === 'H') {
            if (y + size > 10) return false; // Excede columnas
            for (let i = 0; i < size; i++) {
                if (this.tablero[x][y + i].estadoCelda !== 'agua') return false;
            }
        } else {
            if (x + size > 10) return false; // Excede filas
            for (let i = 0; i < size; i++) {
                if (this.tablero[x + i][y].estadoCelda !== 'agua') return false;
            }
        }
        return true; // Espacio válido
    }

    // Marca en la matriz las celdas ocupadas por el barco
    ubicarBarco(x, y, size, direccion, nombre) {
        for (let i = 0; i < size; i++) {
            if (direccion === 'H') {
                this.tablero[x][y + i].estadoCelda = 'barco';     // Cambiamos estado a 'barco'
                this.tablero[x][y + i].nombreBarco = nombre;       // Almacenamos el nombre
            } else {
                this.tablero[x + i][y].estadoCelda = 'barco';
                this.tablero[x + i][y].nombreBarco = nombre;
            }
        }
    }

    // Genera una matriz 10x10 de celdas con estado inicial 'agua'
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

    // Dibuja el tablero en un contenedor HTML indicado por su ID
    mostrarTablero(contenedorID) {
        const contenedor = document.getElementById(contenedorID);
        contenedor.innerHTML = "";                   // Limpiar contenido previo
        const tabla = document.createElement("table");

        // Cabecera de coordenadas de columnas (0 a 9)
        let filaCabecera = document.createElement("tr");
        filaCabecera.appendChild(document.createElement("th")); // Celda vacía esquina
        for (let y = 0; y < 10; y++) {
            let th = document.createElement("th");
            th.innerText = y;
            filaCabecera.appendChild(th);
        }
        tabla.appendChild(filaCabecera);

        // Filas y celdas del tablero
        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            let th = document.createElement("th");
            th.innerText = x;     // Coordenada de fila
            fila.appendChild(th);
            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");

                if (contenedorID === "contenedor1") {
                    // Tablero IA siempre muestra solo agua inicialmente
                    celda.classList.add("celda-agua");
                } else {
                    // Tablero Usuario: si hay barco, lo pintamos
                    if (this.tablero[x][y].estadoCelda === "barco") {
                        celda.classList.add("celda-barco");
                        celda.innerText = this.tablero[x][y].nombreBarco[0]; // Inicial
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

    // Serializa el estado del tablero para enviarlo al servidor
    serialize() {
        return {
            tamaño: 10,
            casillas: this.tablero.map(fila =>
                fila.map(celda => celda.toJSON())
            )
        };
    }
}

// Clase que representa una sola celda del tablero
class Celda {
    constructor(estadoCelda, estadoBarco, x, y, nombreBarco) {
        this.estadoCelda = estadoCelda; // 'agua', 'barco', etc.
        this.estadoBarco = estadoBarco; // Booleano si ha sido tocado
        this.x = x;                      // Coordenada X
        this.y = y;                      // Coordenada Y
        this.nombreBarco = nombreBarco; // Nombre del barco en esa celda
    }
    
    // Devuelve un objeto JSON con los datos de la celda
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            estadoCelda: this.estadoCelda,
            nombreBarco: this.nombreBarco || "",
        };
    }
}

// Crear instancias de los tableros: IA coloca barcos aleatorios, usuario vacío
const tableroIA = new Tablero(true);
const tableroUsuario = new Tablero(false);

// Dibujar ambos tableros en pantalla
tableroIA.mostrarTablero("contenedor1");
tableroUsuario.mostrarTablero("contenedor2");

// Mostrar en consola la estructura interna para debugging
console.log("Tablero de la IA:", tableroIA.tablero);
console.log("Tablero del Usuario:", tableroUsuario.tablero);

// Elementos del DOM para controlar el juego (botón jugar, formulario disparo...)
const btnJugar = document.getElementById("jugar");
const formDisparo = document.getElementById("disparo-form");
const mensajeDisparo = document.getElementById("mensaje-disparo");
const coordX = document.getElementById("coordX");
const coordY = document.getElementById("coordY");
const btnDisparar = document.getElementById("btnDisparar");

// Al hacer click en "Jugar", mostramos el formulario de disparo
btnJugar.addEventListener("click", () => {
    formDisparo.style.display = "block";
    mensajeDisparo.innerText = "¡Comienza la partida!";
});

// Al hacer click en "Disparar", leemos las coordenadas e intentamos disparar
btnDisparar.addEventListener("click", () => {
    let x = parseInt(coordX.value);  // Coordenada X (columna)
    let y = parseInt(coordY.value);  // Coordenada Y (fila)
    
    // Validar valores
    if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
        alert("Coordenadas inválidas");
        return;
    }

    dispararJugador(x, y);  // Llamada a la función de disparo
});

// Función que gestiona el disparo del jugador sobre el tablero IA
function dispararJugador(x, y) {
    let celda = tableroIA.tablero[y][x];  // Accedemos con [fila][columna]
    const contenedor = document.getElementById("contenedor1");
    const celdaHTML = contenedor.querySelectorAll("tr")[y + 1].children[x + 1];

    if (celda.estadoCelda === "agua") {
        celdaHTML.classList.add("celda-agua-impacto"); // Marcar agua
        mensajeDisparo.innerText = "¡Agua! Turno de la IA.";
        setTimeout(turnoIA, 1000); // Pasamos el turno a la IA
    } else if (celda.estadoCelda === "barco") {
        celda.estadoCelda = "tocado";                 // Marcar tocado
        celdaHTML.classList.add("celda-tocado");
        mensajeDisparo.innerText = "¡Tocado! Puedes volver a disparar.";

        // Verificamos si se acabaron todos los barcos de la IA
        if (verificarFinDePartida(tableroIA, "Jugador")) {
            return;
        }
    } else if (celda.estadoCelda === "tocado") {
        mensajeDisparo.innerText = "Ya has disparado aquí."; // Mensaje si ya disparó
    }
}

// Turno de la IA: dispara hasta fallar, elige posiciones aleatorias
function turnoIA() {
    let disparado = false;
    while (!disparado) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let celda = tableroUsuario.tablero[y][x];

        const contenedor = document.getElementById("contenedor2");
        const celdaHTML = contenedor.querySelectorAll("tr")[y + 1].children[x + 1];

        if (celda.estadoCelda === "agua") {
            celda.estadoCelda = "falloIA";             // Marcar fallo IA
            celdaHTML.classList.add("celda-ataque-ia");
            mensajeDisparo.innerText = "IA: Agua. Tu turno.";
            disparado = true;
        } else if (celda.estadoCelda === "barco") {
            celda.estadoCelda = "tocadoIA";            // Marcar tocado IA
            celdaHTML.classList.add("celda-hundido");
            mensajeDisparo.innerText = "IA: ¡Tocado! IA vuelve a disparar.";

            // Verificar si la IA hundió todos tus barcos
            if (verificarFinDePartida(tableroUsuario, "IA")) {
                return;buzmxqh2k
            }
        }
    }
}

// Deshabilita controles y ofrece reiniciar la partida
function finalizarPartida() {
    formDisparo.style.display = "none";
    btnJugar.disabled = true;
    btnDisparar.disabled = true;
    coordX.disabled = true;
    coordY.disabled = true;

    setTimeout(() => {
        const reiniciar = confirm("¿ La partida ha finalizado, quieres jugar otra vez?");
        if (reiniciar) location.reload();
    }, 500);
}

  
      async function guardarPartida(nombreJugador, tableroJugador, tableroIA) {
      const partida = {
        jugador: nombreJugador,
        tableroJugador: JSON.stringify(tableroJugador),
        tableroIA:      JSON.stringify(tableroIA)
      };
    
      try {
            const response = await fetch("http://localhost:3000/partidas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify(partida)
            });
    
            if (!response.ok) throw new Error("Error al guardar la partida");
    
            const data = await response.json();
            console.log("Partida guardada con éxito:", data);
            return data.id; // ID de la partida
        } catch (err) {
            console.error("Error:", err);
        }
    }
    
    async function cargarPartida(id) {
      try {
        const response = await fetch(`http://localhost:3000/partidas/${id}`);
        if (!response.ok) throw new Error("No se encontró la partida");
  
        const data = await response.json();
        alert("Partida cargada")
        console.log("Partida cargada:", data);
        return data;
    } catch (err) {
        console.error("Error:", err);
    }
  }
  
  // Asociar eventos a botones de guardar y cargar partida
  document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = prompt("¿Cómo te llamas?");
    guardarPartida(nombre, tableroUsuario, tableroIA);
  });
  
  document.getElementById("btnCargar").addEventListener("click", async () => { 
    const id = prompt("Introduce el ID de la partida:");
    const partida = await cargarPartida(id); // <<<<< AQUI EL CAMBIO: poner "await"
  
    if (partida) {
      recuperaTablerosApi(partida);
    } else {
      alert("No se pudo cargar la partida.");
    }
  });
  
  function recuperaTablerosApi(partida) {
    // 1) Restaurar lista de barcos colocados y dirección
    barcosColocados = Array.isArray(partida.barcosColocados)
        ? partida.barcosColocados
        : [];
    direccionBarco = partida.direccionBarco || 'H';
  
    // 2) Parsear los tableros si vienen como string
    const dataJugador = typeof partida.tableroJugador === 'string'
        ? JSON.parse(partida.tableroJugador)
        : partida.tableroJugador;
    const dataIA = typeof partida.tableroIA === 'string'
        ? JSON.parse(partida.tableroIA)
        : partida.tableroIA;
  
    // 3) Helper para determinar el estado real de la celda
    const getEstado = (cell) => {
        // Si en tu JSON usas "ocupada": true/false, lo convertimos a 'barco' o 'agua'
        if (cell.estadoCelda) return cell.estadoCelda;
        return cell.ocupada ? 'barco' : 'agua';
    };
  
    // 4) Reconstruir matriz de celdas del usuario
    if (dataJugador && Array.isArray(dataJugador.casillas)) {
        tableroUsuario.tablero = dataJugador.casillas.map(fila =>
            fila.map(celda =>
                new Celda(
                    getEstado(celda),
                    false,
                    celda.x,
                    celda.y,
                    celda.nombreBarco || ''
                )
            )
        );
        console.log('Tablero Usuario (partida cargada)');
        console.log(tableroUsuario)
    } else {
        console.error('Formato inválido de tableroJugador:', dataJugador);
    }
  
    // 5) Reconstruir matriz de celdas de la IA
    if (dataIA && Array.isArray(dataIA.casillas)) {
        tableroIA.tablero = dataIA.casillas.map(fila =>
            fila.map(celda =>
                new Celda(
                    getEstado(celda),
                    false,
                    celda.x,
                    celda.y,
                    celda.nombreBarco || ''
                )
            )
        );
        console.log('Tablero IA (partida cargada)');
        console.log(tableroIA);
    } else {
        console.error('Formato inválido de tableroIA:', dataIA);
    }
  
    // 6) Redibujar ambos tableros
    tableroUsuario.mostrarTablero('contenedor2');
    tableroIA.mostrarTablero('contenedor1');
  
    // 7) Mostrar formulario de disparo
    formDisparo.style.display = 'block';
  }
  
  
  
  
  



