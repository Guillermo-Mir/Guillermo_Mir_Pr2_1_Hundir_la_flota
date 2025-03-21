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
                let direccion;
                if (Math.random() < 0.5) {
                    direccion = 'horizontal';
                } else {
                    direccion = 'vertical';
                }
                if (this.verificarEspacio(x, y, barco.size, direccion)) {
                    this.ubicarBarco(x, y, barco.size, direccion, barco.name);
                    colocado = true;
                }
            }
        }
    }

    verificarEspacio(x, y, size, direccion) {
        if (direccion === 'horizontal') {
            if (y + size > 10) {
                return false;
            }
            for (let i = 0; i < size; i++) {
                if (this.tablero[x][y + i].estadoCelda !== 'agua') {
                    return false;
                }
            }
        } else {
            if (x + size > 10) {
                return false;
            }
            for (let i = 0; i < size; i++) {
                if (this.tablero[x + i][y].estadoCelda !== 'agua') {
                    return false;
                }
            }
        }
        return true;
    }

    ubicarBarco(x, y, size, direccion, nombre) {
        for (let i = 0; i < size; i++) {
            if (direccion === 'horizontal') {
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

    mostrarTableroIA() {
        const contenedor1 = document.getElementById("contenedor1");
        contenedor1.innerHTML = "";
        const tabla = document.createElement("table");

        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");
                celda.style.width = "30px";
                celda.style.height = "30px";
                celda.style.border = "1px solid black";
                celda.style.textAlign = "center";
                
                if (this.tablero[x][y].estadoCelda === "barco") {
                    celda.style.backgroundColor = "#868B91";
                    celda.innerText = this.tablero[x][y].nombreBarco[0];
                } else {
                    celda.style.backgroundColor = "#59A4D9";
                }
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        contenedor1.appendChild(tabla);
    }

    mostrarTableroUsuario() {
        const contenedor2 = document.getElementById("contenedor2");
        contenedor2.innerHTML = "";
        const tabla = document.createElement("table");

        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");
                celda.style.width = "30px";
                celda.style.height = "30px";
                celda.style.border = "1px solid black";
                celda.style.textAlign = "center";

                
                if (this.tablero[x][y].estadoCelda === "barco") {
                    celda.style.backgroundColor = "#868B91";
                    celda.innerText = this.tablero[x][y].nombreBarco[0];
                } else {
                    celda.style.backgroundColor = "#59A4D9";
                }
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        contenedor2.appendChild(tabla);
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

// Crear el tablero IA con barcos generados aleatoriamente
const tableroIA = new Tablero(true);

// Crear el tablero del usuario sin barcos aleatorios
const tableroUsuario = new Tablero(false);

// Mostrar ambos tableros
tableroIA.mostrarTableroIA();
tableroUsuario.mostrarTableroUsuario();

// Imprimir en consola los tableros para su análisis
console.log("Tablero de la IA:", tableroIA.tablero);
console.log("Tablero del Usuario:", tableroUsuario.tablero);