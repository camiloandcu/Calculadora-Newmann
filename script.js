function numberToBinaryWithNBits(number, n) {
  return number.toString(2).padStart(n, '0').slice(-n);
}

class UnidadDeControl {
  constructor(memoria) {
      this._memoria = new Memoria(memoria);
      this._alu = new ALU();
      this._contador = 0;
      this._paso = 0;
      this._instruccionActual = null;
      this._registroDirecciones = 0;
      this._registroDatos = [0, 0];
  }

  continuar() {
      this.limpiarDestacados();
      
      let pasos = [
          () => { 
              this._registroDirecciones = this._contador;
              this.destacar('contador-programa', 'registro-direcciones');
              this.actualizarVista();
          },
          () => { 
              this._contador++;
              this.destacar('contador-programa');
              this.actualizarVista();
          },
          () => { 
              console.log("Antes de leer memoria 1: " + this._registroDatos)
              this._registroDatos = this._memoria.leer(this._registroDirecciones);
              console.log("Cuando leyendo memoria 1: " + this._registroDatos)
              this.destacar('registro-direcciones', 'registro-datos', `memoria-${this._registroDirecciones}`);
              this.actualizarVista();
          },
          () => { 
              this._instruccionActual = this._registroDatos;
              this.destacar('registro-datos', 'registro-instrucciones');
              this.actualizarVista();
          },
          () => { 
              let operacion = this._instruccionActual[0];
              let operando = this._instruccionActual[1];
              this._registroDirecciones = operando;
              this.destacar('registro-instrucciones', 'registro-direcciones');
              this.actualizarVista();
          },
          () => { 
              console.log("Antes de leer memoria 2: " + this._registroDatos + "Dir: " + this._registroDirecciones)
              this._registroDatos = this._memoria.leer(this._registroDirecciones);
              console.log("Cuando leyendo memoria 2: " + this._registroDatos)
              this.destacar('registro-direcciones', 'registro-datos', `memoria-${this._registroDirecciones}`);
              this.actualizarVista();
          },
          () => { 
              console.log("Cuando setteando entrada: " + this._registroDatos)
              this._alu.setEntrada(this._registroDatos[1]);
              this.destacar('registro-datos', 'registro-entrada');
              this.actualizarVista();
          },
          () => { 
              let operacion = this._instruccionActual[0];
              if (operacion === 0) {
                  this._alu.sumar();
              } else if (operacion === 1) {
                  this._alu.restar();
              } else if (operacion === 2) {
                  this._memoria.escribir(this._registroDirecciones, [0, this._alu.getAcumulador()]);
                  this.destacar(`memoria-${this._registroDirecciones}`);
              }
              this.destacar('acumulador', 'registro-entrada');
              this.actualizarVista();
          }
      ];

      if (this._paso < pasos.length && this._contador < 4) {
          pasos[this._paso++]();
      } else {
        this._paso = 0
      }
  }

  actualizarVista() {
      document.getElementById('contador-programa').textContent = `Contador: ${numberToBinaryWithNBits(this._contador, 4)}`;
      document.getElementById('registro-direcciones').textContent = `Direcciones: ${numberToBinaryWithNBits(this._registroDirecciones, 4)}`;
      document.getElementById('registro-datos').textContent = `Datos: ${numberToBinaryWithNBits(this._registroDatos[1], 8)}`;
      document.getElementById('registro-instrucciones').textContent = `Instrucciones: ${numberToBinaryWithNBits(this._instruccionActual ? this._instruccionActual[0] : 0, 4)}${numberToBinaryWithNBits(this._instruccionActual ? this._instruccionActual[1] : 0, 4)}`;
      document.getElementById('acumulador').textContent = `Acumulador: ${numberToBinaryWithNBits(this._alu.getAcumulador(), 8)}`;
      document.getElementById('registro-entrada').textContent = `Entrada: ${numberToBinaryWithNBits(this._alu.getEntrada(), 8)}`;
  }

  destacar(...ids) {
      ids.forEach(id => document.getElementById(id)?.classList.add('destacado'));
  }

  limpiarDestacados() {
      document.querySelectorAll('.destacado').forEach(el => el.classList.remove('destacado'));
  }
}

class Memoria {
  constructor(memoria) {
      this._memoria = memoria;
      this.actualizarVista();
  }

  leer(direccion) {
      return this._memoria[direccion];
  }

  escribir(direccion, dato) {
      this._memoria[direccion] = dato;
      this.actualizarVista();
  }

  actualizarVista() {
      let tabla = document.getElementById('tabla-memoria');
      tabla.innerHTML = '';
      this._memoria.forEach((dato, i) => {
          let row = `<tr id="memoria-${i}"><td>${numberToBinaryWithNBits(i, 4)}</td><td>${numberToBinaryWithNBits(dato[0], 4)}${numberToBinaryWithNBits(dato[1], 4)}</td></tr>`;
          tabla.innerHTML += row;
      });
  }
}

class ALU {
  constructor() {
      this._acumulador = 0;
      this._entrada = 0;
  }

  setEntrada(valor) {
      this._entrada = valor;
      console.log(this._entrada);
  }

  getEntrada() { return this._entrada; }

  sumar() { this._acumulador += this._entrada;
    console.log(this._acumulador)
   }

  restar() { this._acumulador -= this._entrada; }

  getAcumulador() { return this._acumulador; }
}

let memoria = [[0, 4], [0, 5], [2, 6], [3, 0], [0,5], [0,6], [0,0]];
let uc = new UnidadDeControl(memoria);
document.getElementById('continuar').addEventListener('click', () => uc.continuar());
