function numberToBinaryWithNBits(number, n) {
  // Convert the number to binary
  let binary = number.toString(2);

  // Pad with leading zeros to make sure it has n bits
  while (binary.length < n) {
      binary = '0' + binary;
  }

  // If the binary representation is longer than n bits, truncate it
  if (binary.length > n) {
      binary = binary.slice(-n);
  }

  return binary;
}

class UnidadDeControl {
  constructor(memoria) {
    this._memoria = new Memoria(memoria);
    this._alu = new ALU();
    this._contador = 0;
    this._flag = true;
  }

  iniciar() {
    while(this._flag) {
      console.log('Ciclo de reloj: ', numberToBinaryWithNBits(this._contador, 4));

      let instruccion = this._memoria.leer(this._contador++); // Registro Instrucción
      console.log('Instrucción: ', numberToBinaryWithNBits(instruccion[0], 4) + numberToBinaryWithNBits(instruccion[1], 4));

      switch (instruccion[0]) { // Decodificador
        case 0: // SUMA
        this._alu.añadir(instruccion[1]);
          break;
        case 1: // RESTA
          this._alu.añadir(-1*instruccion[1]);
          break;
        case 2: // MOVER
          let dato = this._alu.getAcumulador();
          this._memoria.escribir(instruccion[1], dato);
          break;
        case 3: // FINALIZAR  
          this._flag = false;
          break;
      }
    }
  }
}

class Memoria {
  constructor(memoria) {
    this._memoria = memoria;
  }

  leer(direccion) {
    console.log('Direcciones: ', numberToBinaryWithNBits(direccion, 4));

    let dato = this._memoria[direccion];
    console.log('Datos: ', numberToBinaryWithNBits(dato[0], 4) + numberToBinaryWithNBits(dato[1], 4));

    return dato;
  }

  escribir(direccion, dato) {
    console.log('Direcciones: ', numberToBinaryWithNBits(direccion, 4));
    console.log('Datos: ', numberToBinaryWithNBits(dato, 4));

    this._memoria[direccion] = dato;
  }
}

class ALU {
    constructor() {
        this._acumulador = 0;
    }
    
    añadir(entrada) {
      console.log('Entrada: ', numberToBinaryWithNBits(entrada, 4));
      console.log('Acumulador: ', numberToBinaryWithNBits(this._acumulador, 4));
      this._acumulador += entrada;
      console.log('Salida: ', numberToBinaryWithNBits(this._acumulador, 4));
    }

    getAcumulador() {
      console.log('Acumulador: ', numberToBinaryWithNBits(this._acumulador, 4));
      return this._acumulador;
    }
}


let memoriaEjemplo = [
  [0, 5],
  [0, 6],
  [2, 4],
  [3, 0]
]

let unidadDeControl = new UnidadDeControl(memoriaEjemplo);
unidadDeControl.iniciar();
console.log('Memoria final: ', unidadDeControl._memoria._memoria);