function numberToBinaryWithNBits(number, n) {
  let binary = number.toString(2);
  while (binary.length < n) binary = '0' + binary;
  return binary.slice(-n);
}

class UnidadDeControl {
  constructor(memoria) {
      this._memoria = new Memoria(memoria);
      this._alu = new ALU();
      this._contador = 0;
      this._flag = true;
  }

  async iniciar() {
      while (this._flag) {
          this.updateUI('pc', this._contador, 4);
          
          let instruccion = this._memoria.leer(this._contador++);
          this.updateUI('ri', instruccion[0] + instruccion[1], 8);

          switch (instruccion[0]) {
              case 0: this._alu.añadir(instruccion[1]); break;
              case 1: this._alu.añadir(-1 * instruccion[1]); break;
              case 2: 
                  let dato = this._alu.getAcumulador();
                  this._memoria.escribir(instruccion[1], dato);
                  break;
              case 3: this._flag = false; break;
          }
          await this.delay(2000);
      }
  }

  updateUI(elementId, value, bits) {
      let element = document.getElementById(elementId);
      element.classList.add('highlight');
      element.textContent = numberToBinaryWithNBits(value, bits);
      setTimeout(() => element.classList.remove('highlight'), 1500);
  }

  delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class Memoria {
  constructor(memoria) {
      this._memoria = memoria;
      this.render();
  }

  leer(direccion) {
      this.highlightMemory(direccion);
      return this._memoria[direccion];
  }

  escribir(direccion, dato) {
      this._memoria[direccion] = [dato >> 4, dato & 15];
      this.render();
  }

  render() {
      let table = document.getElementById("mem-table");
      table.innerHTML = "<p>Dirección - Contenido</p>";
      this._memoria.forEach((value, index) => {
          let binaryData = numberToBinaryWithNBits(value[0], 4) + numberToBinaryWithNBits(value[1], 4);
          table.innerHTML += `<p id="mem-${index}">${numberToBinaryWithNBits(index, 4)} - ${binaryData}</p>`;
      });
  }

  highlightMemory(direccion) {
      let element = document.getElementById(`mem-${direccion}`);
      element.classList.add('highlight');
      setTimeout(() => element.classList.remove('highlight'), 1500);
  }
}

class ALU {
  constructor() {
      this._acumulador = 0;
  }

  añadir(entrada) {
      this.updateUI('entrada', entrada, 8);
      this.updateUI('acumulador', this._acumulador, 8);
      this._acumulador += entrada;
      this.updateUI('acumulador', this._acumulador, 8);
  }

  getAcumulador() {
      this.updateUI('acumulador', this._acumulador, 8);
      return this._acumulador;
  }

  updateUI(elementId, value, bits) {
      let element = document.getElementById(elementId);
      element.classList.add('highlight');
      element.textContent = numberToBinaryWithNBits(value, bits);
      setTimeout(() => element.classList.remove('highlight'), 1500);
  }
}

document.getElementById("startButton").addEventListener("click", () => {
  let memoriaEjemplo = [[0, 5], [0, 6], [2, 4], [3, 0]];
  let unidadDeControl = new UnidadDeControl(memoriaEjemplo);
  unidadDeControl.iniciar();
});
