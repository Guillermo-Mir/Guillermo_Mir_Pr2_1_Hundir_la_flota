import { Celda } from './celda.js';
import { arrayBarcos } from './main.js';

export class Tablero {
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

    mostrarTablero(contenedorID) {
        const contenedor = document.getElementById(contenedorID);
        contenedor.innerHTML = "";
        const tabla = document.createElement("table");

        let filaCabecera = document.createElement("tr");
        filaCabecera.appendChild(document.createElement("th"));
        for (let y = 0; y < 10; y++) {
            let th = document.createElement("th");
            th.innerText = y;
            filaCabecera.appendChild(th);
        }
        tabla.appendChild(filaCabecera);

        for (let x = 0; x < 10; x++) {
            let fila = document.createElement("tr");
            let th = document.createElement("th");
            th.innerText = x;
            fila.appendChild(th);
            for (let y = 0; y < 10; y++) {
                let celda = document.createElement("td");

                if (contenedorID === "contenedor1") {
                    celda.classList.add("celda-agua");
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

    serialize() {
        return {
            tamaño: 10,
            casillas: this.tablero.map(fila =>
                fila.map(celda => celda.toJSON())
            )
        };
    }
}