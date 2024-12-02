var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BitSet = /** @class */ (function () {
    function BitSet(sz) {
        this.sz = sz;
        this.bits = new Array(sz).fill(false); // Inicializa un arreglo de 32 bits en `false` (0)
    }
    BitSet.prototype.set = function (idx) {
        if (idx >= 0 && idx < this.sz) {
            this.bits[idx] = true; // Establece el bit en `true` (1)
        }
    };
    BitSet.prototype.get = function (idx) {
        return this.bits[idx]; // Obtiene el valor del bit (0 o 1)
    };
    BitSet.prototype.toggle = function (idx) {
        if (idx >= 0 && idx < this.sz) {
            this.bits[idx] = !this.bits[idx]; // Cambia el valor del bit
        }
    };
    BitSet.prototype.clear = function (idx) {
        if (idx >= 0 && idx < this.sz) {
            this.bits[idx] = false; // Establece el bit en `false` (0)
        }
    };
    BitSet.prototype.reset = function () {
        this.bits.fill(false); // Resetea todos los bits a `false`
    };
    BitSet.prototype.toString = function () {
        // Invertir los bits para que el primer bit sea el más a la izquierda
        var aux = __spreadArray([], this.bits, true);
        return aux.reverse().map(function (bit) { return (bit ? '1' : '0'); }).join(''); // Convierte el arreglo de bits a una cadena de '1' y '0'
    };
    return BitSet;
}());
;
var DireccionIP = /** @class */ (function () {
    function DireccionIP(o1OrdirIp, o2OrMask, o3, o4, mask) {
        this.IP = '';
        this.red = '';
        this.IPInicio = '';
        this.IPFinal = '';
        this.IPBroadcast = '';
        this.hosts = 0;
        this.mascaraBin = '';
        this.mascaraDecimal = '';
        this.saltos = 0;
        this.numSubredes = '';
        this.hostSubred = '';
        this.totalHosts = '';
        this.saltosText = '';
        this.subredes = [];
        this.indice = 0;
        this.bitsAgregar = 0;
        this.bitsCompletos = 0;
        this.mascaraSubnetBin = '';
        this.mascaraSubnetDec = '';
        var octetos = new Array(4);
        var bits;
        this.clase = '';
        // Si se introdujo una dirección ip como una cadena completa
        if (typeof o1OrdirIp === 'string' && o2OrMask != undefined && o3 === undefined && o4 === undefined && mask === undefined) {
            octetos = o1OrdirIp.split('.').map(function (octeto) { return parseInt(octeto, 10); });
            bits = o2OrMask;
        }
        // Si se introdujo como números por separado
        else if (typeof o1OrdirIp === 'number' && o2OrMask != undefined && typeof o3 === 'number' && typeof o4 === 'number' && typeof mask === 'number') {
            octetos[0] = o1OrdirIp;
            octetos[1] = o2OrMask;
            octetos[2] = o3;
            octetos[3] = o4;
            bits = o2OrMask;
        }
        else {
            throw new Error("¡Error! Entrada inválida");
        }
        // Asegurarnos de que cada octeto esté en el rango 0-255
        if ((octetos[0] >= 0 && octetos[0] <= 255) && (octetos[1] >= 0 && octetos[1] <= 255) &&
            (octetos[2] >= 0 && octetos[2] <= 255) && (octetos[3] >= 0 && octetos[3] <= 255)) {
            this.octeto1 = octetos[0];
            this.octeto2 = octetos[1];
            this.octeto3 = octetos[2];
            this.octeto4 = octetos[3];
            this.bits = bits;
            this.clase = DireccionIP.reconocerClase(octetos[0]);
            this.IP = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".").concat(this.octeto4);
            this.mascara = new BitSet(32);
        }
        else {
            throw new Error("Error: Uno o más octetos están fuera del rango 0-255.");
        }
    }
    // Método para reconocer la clase a la cual pertenece la dirección IP.
    DireccionIP.reconocerClase = function (octeto1) {
        if (octeto1 >= 1 && octeto1 <= 127) {
            return 'A';
        }
        else if (octeto1 >= 128 && octeto1 <= 191) {
            return 'B';
        }
        else if (octeto1 >= 192 && octeto1 <= 223) {
            return 'C';
        }
        else if (octeto1 >= 224 && octeto1 <= 239) {
            return 'D';
        }
        else if (octeto1 >= 240 && octeto1 <= 255) {
            return 'E';
        }
        else {
            throw new Error("La dirección IP no pertenece a una clase estándar (A, B, C, D o E).");
        }
    };
    // Método para mostrar la máscara de red según el número de bits
    DireccionIP.prototype.mostrarMascaraPorBits = function () {
        // Llenamos los primeros "bits" de la máscara con 1's de izquierda a derecha
        for (var i = 31; i >= 32 - this.bits; i--) {
            this.mascara.set(i); // Poner 1 en los primeros "bits" (de izquierda a derecha)
        }
        // Convertimos la máscara a una cadena binaria
        var mascaraBin = this.mascara.toString(); // Genera un string de 32 caracteres (con 0 y 1)
        // Mostramos la máscara en formato binario
        var partesBinarias = [];
        for (var i = 0; i < 4; i++) {
            // Agregamos cada octeto de 8 bits
            partesBinarias.push(mascaraBin.substring(i * 8, i * 8 + 8)); // Substring de 8 bits
        }
        this.mascaraBin = partesBinarias.join(".");
        // Ahora calculamos los valores decimales de cada octeto
        var octeto1 = parseInt(mascaraBin.substring(0, 8), 2);
        var octeto2 = parseInt(mascaraBin.substring(8, 16), 2);
        var octeto3 = parseInt(mascaraBin.substring(16, 24), 2);
        var octeto4 = parseInt(mascaraBin.substring(24, 32), 2);
        // Mostrar la máscara de subred en formato decimal
        this.mascaraDecimal = "".concat(octeto1, ".").concat(octeto2, ".").concat(octeto3, ".").concat(octeto4);
    };
    // Método para calcular y mostrar los datos de la red IP
    DireccionIP.prototype.datosIPoriginal = function () {
        // Clase A
        if (this.octeto1 >= 1 && this.octeto1 <= 127) // Clase A
         {
            // Red
            this.red = "".concat(this.octeto1, ".0.0.0/").concat(this.bits);
            // IP inicio
            this.IPInicio = "".concat(this.octeto1, ".0.0.1");
            // IP final
            this.IPFinal = "".concat(this.octeto1, ".255.255.254");
            // IP broadcast
            this.IPBroadcast = "".concat(this.octeto1, ".255.255.255");
            // Número de host de la red
            var hosts = Math.pow(2, 24) - 2;
            this.hosts = hosts;
        }
        // Clase B
        else if (this.octeto1 >= 128 && this.octeto1 <= 191) // Clase B
         {
            // Red
            this.red = "".concat(this.octeto1, ".").concat(this.octeto2, ".0.0/").concat(this.bits);
            // IP inicio
            this.IPInicio = "".concat(this.octeto1, ".").concat(this.octeto2, ".0.1");
            // IP final
            this.IPFinal = "".concat(this.octeto1, ".").concat(this.octeto2, ".255.254");
            // IP broadcast
            this.IPBroadcast = "".concat(this.octeto1, ".").concat(this.octeto2, ".255.255");
            // Número de host de la red
            var hosts = Math.pow(2, 16) - 2;
            this.hosts = hosts;
        }
        // Clase C
        else if (this.octeto1 >= 192 && this.octeto1 <= 223) // Clase C
         {
            // Red
            this.red = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".0/").concat(this.bits);
            // IP inicio
            this.IPInicio = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".1");
            // IP final
            this.IPFinal = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".254");
            // IP broadcast
            this.IPBroadcast = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".255");
            // Número de host de la red
            var hosts = Math.pow(2, 8) - 2;
            this.hosts = hosts;
        }
        else {
        }
    };
    // Método para calcular los bits que se deben agregar
    DireccionIP.prototype.calcularBitsAgregar = function (numSubRedes, nuevaMascara) {
        if (nuevaMascara === void 0) { nuevaMascara = -1; }
        if (nuevaMascara === -1) {
            return Math.ceil(Math.log2(numSubRedes)); // Calculamos a partir de las subredes
        }
        else {
            return nuevaMascara - this.bits; // Calculamos a partir de la nueva máscara
        }
    };
    // Método para llenar la máscara de subred
    DireccionIP.prototype.llenarMascara = function () {
        this.mascara.reset(); // Resetea todos los bits a 0
        for (var i = 31; i >= 32 - (this.bits + this.bitsAgregar); i--) {
            this.mascara.set(i);
        }
    };
    // Método para mostrar la máscara en formato binario y decimal
    DireccionIP.prototype.mostrarMascara = function (bitsCompletos) {
        var mascaraBin = this.mascara.toString(); // Cadena binaria de la máscara
        this.bitsCompletos = bitsCompletos;
        var partesBinarias = [];
        for (var i = 0; i < 4; i++) {
            partesBinarias.push(mascaraBin.substring(i * 8, i * 8 + 8));
        }
        this.mascaraSubnetBin = partesBinarias.join(".");
        // Convertir cada octeto binario a decimal
        var octeto1 = parseInt(mascaraBin.substring(0, 8), 2);
        var octeto2 = parseInt(mascaraBin.substring(8, 16), 2);
        var octeto3 = parseInt(mascaraBin.substring(16, 24), 2);
        var octeto4 = parseInt(mascaraBin.substring(24, 32), 2);
        this.mascaraSubnetDec = "".concat(octeto1, ".").concat(octeto2, ".").concat(octeto3, ".").concat(octeto4);
    };
    // Método para calcular y mostrar la cantidad de hosts
    DireccionIP.prototype.calcularHosts = function () {
        var ceros = 32 - (this.bits + this.bitsAgregar); // Bits restantes en la máscara
        var hosts = Math.pow(2, ceros) - 2; // Hosts por subred
        var subredes = Math.pow(2, this.bitsAgregar); // Cantidad de subredes
        var totalHosts = subredes * hosts; // Total de hosts
        this.hostSubred = "(2^".concat(ceros, ") - 2 = ").concat(hosts);
        this.numSubredes = "(2^".concat(this.bitsAgregar, ") = ").concat(subredes);
        this.totalHosts = "(2^".concat(this.bitsAgregar, ") x (").concat(hosts, ") = ").concat(totalHosts);
    };
    // Método para calcular y mostrar la cantidad de saltos
    DireccionIP.prototype.calcularSaltos = function () {
        var mascaraBin = this.mascara.toString(); // Cadena binaria de la máscara
        var octeto_1 = parseInt(mascaraBin.substring(0, 8), 2);
        var octeto_2 = parseInt(mascaraBin.substring(8, 16), 2);
        var octeto_3 = parseInt(mascaraBin.substring(16, 24), 2);
        var octeto_4 = parseInt(mascaraBin.substring(24, 32), 2);
        if (this.clase === 'A') {
            if (this.bitsAgregar <= 8) {
                this.saltos = Math.pow(2, 8) - octeto_2;
                this.saltosText = "(2^8) - ".concat(octeto_2, " = ").concat(this.saltos);
            }
            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                this.saltos = Math.pow(2, 8) - octeto_3;
                this.saltosText = "(2^8) - ".concat(octeto_3, " = ").concat(this.saltos);
            }
            else if (this.bitsAgregar > 16 && this.bitsAgregar <= 24) {
                this.saltos = Math.pow(2, 8) - octeto_4;
                this.saltosText = "(2^8) - ".concat(octeto_4, " = ").concat(this.saltos);
            }
        }
        else if (this.clase === 'B') {
            if (this.bitsAgregar <= 8) {
                this.saltos = Math.pow(2, 8) - octeto_3;
                this.saltosText = "(2^8) - ".concat(octeto_3, " = ").concat(this.saltos);
            }
            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                this.saltos = Math.pow(2, 8) - octeto_4;
                this.saltosText = "(2^8) - ".concat(octeto_4, " = ").concat(this.saltos);
            }
        }
        else if (this.clase === 'C') {
            if (this.bitsAgregar <= 8) {
                this.saltos = Math.pow(2, 8) - octeto_4;
                this.saltosText = "(2^8) - ".concat(octeto_4, " = ").concat(this.saltos);
            }
        }
    };
    // Métodos principales que usan los auxiliares
    DireccionIP.prototype.modificarMascaraOriginal = function (numSubRedes) {
        this.bitsAgregar = this.calcularBitsAgregar(numSubRedes);
        var resBinario = Math.pow(2, this.bitsAgregar);
        this.llenarMascara();
        this.mostrarMascara(this.bits + this.bitsAgregar);
        this.calcularHosts();
        // Almacenamos el valor de saltos
        this.calcularSaltos();
        // Llamamos a datosSubRedes, pasando saltos calculado como parámetro
        this.datosSubRedes();
    };
    DireccionIP.prototype.modificarMascaraOriginal2 = function (nuevaMascara, bits, mascara) {
        this.bitsAgregar = this.calcularBitsAgregar(-1, nuevaMascara);
        this.llenarMascara();
        this.mostrarMascara(bits + this.bitsAgregar);
        this.calcularHosts();
        // Almacenamos el valor de saltos
        this.calcularSaltos();
        // Llamamos a datosSubRedes, pasando saltos calculado como parámetro
        this.datosSubRedes();
    };
    // Método para calcular los datos de cada subred generada en la opción (1) y (2)
    DireccionIP.prototype.datosSubRedes = function () {
        var count = 0, aux = 0, aux1 = 0;
        this.subredes = [];
        for (var i = 0; i < this.saltos * Math.pow(2, this.bitsAgregar) && this.subredes.length <= 100000; i += this.saltos) {
            // Clase A
            var auxIP = new DireccionIP(this.IP, this.bits + this.bitsAgregar);
            auxIP.indice = ++count;
            if (this.clase === 'A') // Clase A
             {
                if (this.bitsAgregar <= 8) {
                    // IP de Red
                    auxIP.red = "".concat(this.octeto1, ".").concat(i, ".0.0/").concat(this.bits + this.bitsAgregar);
                    // IP inicio
                    auxIP.IPInicio = "".concat(this.octeto1, ".").concat(i, ".0.1");
                    // IP final
                    auxIP.IPFinal = "".concat(this.octeto1, ".").concat(i + (this.saltos - 1), ".255.254");
                    // IP broadcast
                    auxIP.IPBroadcast = "".concat(this.octeto1, ".").concat(i + (this.saltos - 1), ".255.255");
                }
                else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                    if ((count % (256 / this.saltos)) === 0 && count) {
                        aux++;
                    }
                    // IP de Red
                    auxIP.red = "".concat(this.octeto1, ".").concat(aux, ".").concat(i % 256, ".0/").concat(this.bits + this.bitsAgregar);
                    // IP inicio
                    auxIP.IPInicio = "".concat(this.octeto1, ".").concat(aux, ".").concat(i % 256, ".1");
                    // IP final
                    auxIP.IPFinal = "".concat(this.octeto1, ".").concat(aux, ".").concat((i + this.saltos - 1) % 256, ".254");
                    // IP broadcast
                    auxIP.IPBroadcast = "".concat(this.octeto1, ".").concat(aux, ".").concat((i + this.saltos - 1) % 256, ".255");
                }
                else if (this.bitsAgregar > 16 && this.bitsAgregar <= 24) {
                    if (aux == 255 && (count % (256 / this.saltos)) === 0 && count) {
                        aux1++;
                        aux = 0;
                    }
                    else if ((count % (256 / this.saltos)) === 0 && count) {
                        aux++;
                    }
                    // IP de Red
                    auxIP.red = "".concat(this.octeto1, ".").concat(aux1, ".").concat(aux, ".").concat(i % 256, "/").concat(this.bits + this.bitsAgregar);
                    // IP inicio
                    auxIP.IPInicio = "".concat(this.octeto1, ".").concat(aux1, ".").concat(aux, ".").concat((i + 1) % 256);
                    // IP final
                    auxIP.IPFinal = "".concat(this.octeto1, ".").concat(aux1, ".").concat(aux, ".").concat((i + this.saltos - 2) % 256);
                    // IP broadcast
                    auxIP.IPBroadcast = "".concat(this.octeto1, ".").concat(aux1, ".").concat(aux, ".").concat((i + this.saltos - 1) % 256);
                }
            }
            // Clase B
            else if (this.clase === 'B') // Clase B
             {
                if (this.bitsAgregar <= 8) // se altera el tercer octeto
                 {
                    // IP de Red
                    auxIP.red = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(i, ".0/").concat(this.bits + this.bitsAgregar);
                    // IP inicio
                    auxIP.IPInicio = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(i, ".1");
                    // IP final
                    auxIP.IPFinal = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(i + (this.saltos - 1), ".254");
                    // IP broadcast
                    auxIP.IPBroadcast = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(i + (this.saltos - 1), ".255");
                }
                else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) // se altera el tercer y cuarto octeto
                 {
                    if ((count % (256 / this.saltos)) === 0 && count) {
                        aux++;
                    }
                    // IP de Red
                    auxIP.red = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(aux, ".").concat(i % 256, "/").concat(this.bits + this.bitsAgregar);
                    // IP inicio
                    auxIP.IPInicio = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(aux, ".").concat((i + 1) % 256);
                    // IP final
                    auxIP.IPFinal = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(aux, ".").concat((i + this.saltos - 2) % 256);
                    // IP broadcast
                    auxIP.IPBroadcast = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(aux, ".").concat((i + this.saltos - 1) % 256);
                }
            }
            // Clase C
            else if (this.clase === 'C') // Clase C
             {
                if (this.bitsAgregar <= 8) {
                    // IP de Red
                    auxIP.red = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".").concat(i, "/").concat(this.bits + this.bitsAgregar);
                    // IP inicio
                    auxIP.IPInicio = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".").concat(i + 1);
                    // IP final
                    auxIP.IPFinal = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".").concat(i + this.saltos - 2);
                    // IP broadcast
                    auxIP.IPBroadcast = "".concat(this.octeto1, ".").concat(this.octeto2, ".").concat(this.octeto3, ".").concat(i + this.saltos - 1);
                }
            }
            this.subredes.push(auxIP);
        }
    };
    // Método para calcular y mostrar los datos de la red IP SUBNETEADA
    DireccionIP.prototype.datosSubNeteo = function () {
        var count = 0, aux = 0, aux1 = 0, detener = 0, despues = 0;
        // Clase A
        if (this.clase === 'A') // Clase A
         {
            if (this.bitsAgregar <= 8) {
                for (var i = 0; i <= this.octeto2; i += this.saltos) {
                    detener = i;
                }
                despues = detener + this.saltos;
                // IP de Red
                this.red = this.octeto1 + "." + detener + ".0.0/" + this.bits;
                // IP inicio
                this.IPInicio = this.octeto1 + "." + detener + ".0.1";
                // IP final
                this.IPFinal = this.octeto1 + "." + (despues - 1) + ".255.254";
                // IP broadcast
                this.IPBroadcast = this.octeto1 + "." + (despues - 1) + ".255.255";
                // # de Hosts
                var sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                for (var i = 0; i <= this.octeto3; i += this.saltos) {
                    detener = i;
                }
                despues = detener + this.saltos;
                // IP de SubRed
                this.red = this.octeto1 + "." + this.octeto2 + "." + detener + ".0/" + this.bits;
                // IP inicio
                this.IPInicio = this.octeto1 + "." + this.octeto2 + "." + detener + ".1";
                // IP final
                this.IPFinal = this.octeto1 + "." + this.octeto2 + "." + (despues - 1) + ".254";
                // IP broadcast
                this.IPBroadcast = this.octeto1 + "." + this.octeto2 + "." + (despues - 1) + ".255";
                // # de Hosts
                var sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
            else if (this.bitsAgregar > 16 && this.bitsAgregar <= 24) {
                for (var i = 0; i <= this.octeto4; i += this.saltos) {
                    detener = i;
                }
                despues = detener + this.saltos;
                // IP de SubRed
                this.red = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + detener + "/" + this.bits;
                // IP inicio
                this.IPInicio = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (detener + 1);
                // IP final
                this.IPFinal = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (despues - 2);
                // IP broadcast
                this.IPBroadcast = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (despues - 1);
                // # de Hosts
                var sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
        }
        // Clase B
        else if (this.clase === 'B') {
            if (this.bitsAgregar <= 8) // se altera el tercer octeto
             {
                for (var i = 0; i <= this.octeto3; i += this.saltos) {
                    detener = i;
                }
                despues = detener + this.saltos;
                // IP de SubRed
                this.red = this.octeto1 + "." + this.octeto2 + "." + detener + ".0/" + this.bits;
                // IP inicio
                this.IPInicio = this.octeto1 + "." + this.octeto2 + "." + detener + ".1";
                // IP final
                this.IPFinal = this.octeto1 + "." + this.octeto2 + "." + (despues - 1) + ".254";
                // IP broadcast
                this.IPBroadcast = this.octeto1 + "." + this.octeto2 + "." + (despues - 1) + ".255";
                // # de Hosts
                var sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) // se altera el tercer y cuarto octeto
             {
                for (var i = 0; i <= this.octeto4; i += this.saltos) {
                    detener = i;
                }
                despues = detener + this.saltos;
                // IP de SubRed
                this.red = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + detener + "/" + this.bits;
                // IP inicio
                this.IPInicio = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (detener + 1);
                // IP final
                this.IPFinal = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (despues - 2);
                // IP broadcast
                this.IPBroadcast = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (despues - 1);
                // # de Hosts
                var sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
        }
        // Clase C
        else if (this.clase === 'C') // Clase C
         {
            if (this.bitsAgregar <= 8) {
                for (var i = 0; i <= this.octeto4; i += this.saltos) {
                    detener = i;
                }
                despues = detener + this.saltos;
                // IP de SubRed
                this.red = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + detener + "/" + this.bits;
                // IP inicio
                this.IPInicio = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (detener + 1);
                // IP final
                this.IPFinal = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (despues - 2);
                // IP broadcast
                this.IPBroadcast = this.octeto1 + "." + this.octeto2 + "." + this.octeto3 + "." + (despues - 1);
                // # de Hosts
                var sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
        }
    };
    // Metodo para unir todo de subneteo
    DireccionIP.prototype.subNeteo = function () {
        this.bitsAgregar = 0;
        if (this.clase === 'A') {
            this.bitsAgregar = this.bits - 8;
        }
        else if (this.clase === 'B') {
            this.bitsAgregar = this.bits - 16;
        }
        else if (this.clase === 'C') {
            this.bitsAgregar = this.bits - 24;
        }
        // Almacenamos el valor de saltos
        this.calcularSaltos();
        // Llamamos a datosSubNeteo,, pasando saltos calculado como parámetro
        this.datosSubNeteo();
    };
    return DireccionIP;
}());
;
