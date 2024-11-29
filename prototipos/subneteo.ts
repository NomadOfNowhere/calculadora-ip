class BitSet {
    private bits: boolean[];
    private sz: number;

    constructor(sz: number) {
        this.sz = sz;
        this.bits = new Array(sz).fill(false); // Inicializa un arreglo de 32 bits en `false` (0)
    }

    set(idx: number): void {
        if (idx >= 0 && idx < this.sz) {
            this.bits[idx] = true; // Establece el bit en `true` (1)
        }
    }

    get(idx: number): boolean {
        return this.bits[idx]; // Obtiene el valor del bit (0 o 1)
    }

    toggle(idx: number): void {
        if (idx >= 0 && idx < this.sz) {
            this.bits[idx] = !this.bits[idx]; // Cambia el valor del bit
        }
    }

    clear(idx: number): void {
        if (idx >= 0 && idx < this.sz) {
            this.bits[idx] = false; // Establece el bit en `false` (0)
        }
    }

    reset(): void {
        this.bits.fill(false); // Resetea todos los bits a `false`
    }

    toString(): string {
        // Invertir los bits para que el primer bit sea el más a la izquierda
        const aux: boolean[] = [...this.bits];
        return aux.reverse().map(bit => (bit ? '1' : '0')).join(''); // Convierte el arreglo de bits a una cadena de '1' y '0'
    }
};

class DireccionIP {
    // Atributos
    private octeto1: number;
    private octeto2: number;
    private octeto3: number;
    private octeto4: number;
    private bits: number;
    private clase: string;
    private IP: string = '';
    private red: string = '';
    private IPInicio: string = '';
    private IPFinal: string = '';
    private IPBroadcast: string = '';
    private hosts: number = 0;
    private mascaraBin: string = '';
    private mascaraDecimal: string = '';
    private mascara: BitSet;
    private saltos: number = 0;
    private numSubredes: string = '';
    private hostSubred: string = '';
    private totalHosts: string = '';
    private saltosText: string = '';
    private subredes: DireccionIP[] = [];
    private indice: number = 0;
    private bitsAgregar: number = 0;
    private bitsCompletos: number = 0;
    private mascaraSubnetBin: string = '';
    private mascaraSubnetDec: string = '';

    // Constructor para inicializar los 4 octetos de la dirección IP
    constructor(dirIp: string, mask: number);
    constructor(o1: number, o2: number, o3: number, o4: number, mask: number);
    public constructor(o1OrdirIp: number | string, o2OrMask: number, o3?: number, o4?: number, mask?: number) {
        let octetos: number[] = new Array(4);
        let bits: number;
        this.clase = '';

        // Si se introdujo una dirección ip como una cadena completa
        if(typeof o1OrdirIp === 'string' && o2OrMask != undefined && o3 === undefined && o4 === undefined && mask === undefined) {
            octetos = o1OrdirIp.split('.').map(octeto => parseInt(octeto, 10));  
            bits = o2OrMask;
        }
        // Si se introdujo como números por separado
        else if(typeof o1OrdirIp === 'number' && o2OrMask != undefined && typeof o3 === 'number' && typeof o4 === 'number' && typeof mask === 'number') {
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
                this.IP = `${this.octeto1}.${this.octeto2}.${this.octeto3}.${this.octeto4}`;
                this.mascara = new BitSet(32);
        }
        else {
            throw new Error("Error: Uno o más octetos están fuera del rango 0-255.");
        }
    }

    // Método para reconocer la clase a la cual pertenece la dirección IP.
    public static reconocerClase(octeto1: number): string {
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
    }

    // Método para mostrar la máscara de red según el número de bits
    public mostrarMascaraPorBits(): void {
        // Llenamos los primeros "bits" de la máscara con 1's de izquierda a derecha
        for (let i = 31; i >= 32 - this.bits; i--) {
            this.mascara.set(i); // Poner 1 en los primeros "bits" (de izquierda a derecha)
        }

        // Convertimos la máscara a una cadena binaria
        const mascaraBin: string = this.mascara.toString(); // Genera un string de 32 caracteres (con 0 y 1)

        // Mostramos la máscara en formato binario
        const partesBinarias: string[] = [];

        for (let i = 0; i < 4; i++) {
            // Agregamos cada octeto de 8 bits
            partesBinarias.push(mascaraBin.substring(i * 8, i * 8 + 8));  // Substring de 8 bits
        }
        this.mascaraBin = partesBinarias.join(".");

        // Ahora calculamos los valores decimales de cada octeto
        const octeto1 = parseInt(mascaraBin.substring(0, 8), 2);
        const octeto2 = parseInt(mascaraBin.substring(8, 16), 2);
        const octeto3 = parseInt(mascaraBin.substring(16, 24), 2);
        const octeto4 = parseInt(mascaraBin.substring(24, 32), 2);

        // Mostrar la máscara de subred en formato decimal
        this.mascaraDecimal = `${octeto1}.${octeto2}.${octeto3}.${octeto4}`;
    }

    // Método para calcular y mostrar los datos de la red IP
    public datosIPoriginal(): void {
        // Clase A
        if (this.octeto1 >= 1 && this.octeto1 <= 127) // Clase A
        {
            // Red
            this.red = `${this.octeto1}.0.0.0/${this.bits}`;
            // IP inicio
            this.IPInicio = `${this.octeto1}.0.0.1`;
            // IP final
            this.IPFinal = `${this.octeto1}.255.255.254`;
            // IP broadcast
            this.IPBroadcast = `${this.octeto1}.255.255.255`;
            // Número de host de la red
            const hosts = Math.pow(2, 24) - 2;
            this.hosts = hosts;
        }
        // Clase B
        else if (this.octeto1 >= 128 && this.octeto1 <= 191) // Clase B
        {
            // Red
            this.red = `${this.octeto1}.${this.octeto2}.0.0/${this.bits}`;
            // IP inicio
            this.IPInicio = `${this.octeto1}.${this.octeto2}.0.1`;
            // IP final
            this.IPFinal = `${this.octeto1}.${this.octeto2}.255.254`;
            // IP broadcast
            this.IPBroadcast = `${this.octeto1}.${this.octeto2}.255.255`;
            // Número de host de la red
            const hosts = Math.pow(2, 16) - 2;
            this.hosts = hosts;
        }
        // Clase C
        else if (this.octeto1 >= 192 && this.octeto1 <= 223) // Clase C
        {
            // Red
            this.red = `${this.octeto1}.${this.octeto2}.${this.octeto3}.0/${this.bits}`;
            // IP inicio
            this.IPInicio = `${this.octeto1}.${this.octeto2}.${this.octeto3}.1`;
            // IP final
            this.IPFinal = `${this.octeto1}.${this.octeto2}.${this.octeto3}.254`;
            // IP broadcast
            this.IPBroadcast = `${this.octeto1}.${this.octeto2}.${this.octeto3}.255`;
            // Número de host de la red
            const hosts = Math.pow(2, 8) - 2;
            this.hosts = hosts;
        }
        else {
        }
    }

    // Método para calcular los bits que se deben agregar
    public calcularBitsAgregar(numSubRedes: number, nuevaMascara: number = -1): number {
        if (nuevaMascara === -1) {
            return Math.ceil(Math.log2(numSubRedes)); // Calculamos a partir de las subredes
        }
        else {
            return nuevaMascara - this.bits; // Calculamos a partir de la nueva máscara
        }
    }

    // Método para llenar la máscara de subred
    public llenarMascara() {
        this.mascara.reset(); // Resetea todos los bits a 0
        for (let i = 31; i >= 32 - (this.bits + this.bitsAgregar); i--) {
            this.mascara.set(i);
        }
    }

    // Método para mostrar la máscara en formato binario y decimal
    public mostrarMascara(bitsCompletos: number): void {
        const mascaraBin = this.mascara.toString();  // Cadena binaria de la máscara
        this.bitsCompletos = bitsCompletos;

        const partesBinarias: string[] = [];
        for (let i = 0; i < 4; i++) {
            partesBinarias.push(mascaraBin.substring(i * 8, i * 8 + 8));
        }
        this.mascaraSubnetBin = partesBinarias.join(".");

        // Convertir cada octeto binario a decimal
        const octeto1 = parseInt(mascaraBin.substring(0, 8), 2);
        const octeto2 = parseInt(mascaraBin.substring(8, 16), 2);
        const octeto3 = parseInt(mascaraBin.substring(16, 24), 2);
        const octeto4 = parseInt(mascaraBin.substring(24, 32), 2);
        this.mascaraSubnetDec = `${octeto1}.${octeto2}.${octeto3}.${octeto4}`
    }

    // Método para calcular y mostrar la cantidad de hosts
    public calcularHosts(): void {
        const ceros: number = 32 - (this.bits + this.bitsAgregar); // Bits restantes en la máscara
        const hosts: number = Math.pow(2, ceros) - 2; // Hosts por subred
        const subredes = Math.pow(2, this.bitsAgregar); // Cantidad de subredes
        const totalHosts = subredes * hosts; // Total de hosts

        this.hostSubred = `(2^${ceros}) - 2 = ${hosts}`;
        this.numSubredes = `(2^${this.bitsAgregar}) = ${subredes}`;
        this.totalHosts = `(2^${this.bitsAgregar}) x (${hosts}) = ${totalHosts}`;
    }


    // Método para calcular y mostrar la cantidad de saltos
    public calcularSaltos(): void {
        const mascaraBin = this.mascara.toString();  // Cadena binaria de la máscara
        const octeto_1 = parseInt(mascaraBin.substring(0, 8), 2);
        const octeto_2 = parseInt(mascaraBin.substring(8, 16), 2);
        const octeto_3 = parseInt(mascaraBin.substring(16, 24), 2);
        const octeto_4 = parseInt(mascaraBin.substring(24, 32), 2);

        if (this.clase === 'A') {
            if (this.bitsAgregar <= 8) {
                this.saltos = Math.pow(2, 8) - octeto_2;
                this.saltosText = `(2^8) - ${octeto_2} = ${this.saltos}`;
            }
            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                this.saltos = Math.pow(2, 8) - octeto_3;
                this.saltosText = `(2^8) - ${octeto_3} = ${this.saltos}`;
            }
            else if (this.bitsAgregar > 16 && this.bitsAgregar <= 24) {
                this.saltos = Math.pow(2, 8) - octeto_4;
                this.saltosText = `(2^8) - ${octeto_4} = ${this.saltos}`;
            }
        }
        else if (this.clase === 'B') {
            if (this.bitsAgregar <= 8) {
                this.saltos = Math.pow(2, 8) - octeto_3;
                this.saltosText = `(2^8) - ${octeto_3} = ${this.saltos}`;
            }
            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                this.saltos = Math.pow(2, 8) - octeto_4;
                this.saltosText = `(2^8) - ${octeto_4} = ${this.saltos}`;
            }
        }
        else if (this.clase === 'C') {
            if (this.bitsAgregar <= 8) {
                this.saltos = Math.pow(2, 8) - octeto_4;
                this.saltosText = `(2^8) - ${octeto_4} = ${this.saltos}`;
            }
        }
    }



    // Métodos principales que usan los auxiliares
    public modificarMascaraOriginal(numSubRedes: number): void {
        this.bitsAgregar = this.calcularBitsAgregar(numSubRedes);
        const resBinario: number = Math.pow(2, this.bitsAgregar);

        this.llenarMascara(); 
        this.mostrarMascara(this.bits + this.bitsAgregar);
        this.calcularHosts();

        // Almacenamos el valor de saltos
        this.calcularSaltos();

        // Llamamos a datosSubRedes, pasando saltos calculado como parámetro
        this.datosSubRedes();
    }

    public modificarMascaraOriginal2(nuevaMascara: number, bits: number, mascara: BitSet): void {
        this.bitsAgregar = this.calcularBitsAgregar(-1, nuevaMascara);

        this.llenarMascara();
        this.mostrarMascara(bits + this.bitsAgregar);
        this.calcularHosts();

        // Almacenamos el valor de saltos
        this.calcularSaltos();

        // Llamamos a datosSubRedes, pasando saltos calculado como parámetro
        this.datosSubRedes();
    }


    // Método para calcular los datos de cada subred generada en la opción (1) y (2)
    public datosSubRedes(): void {
        let count = 0, aux = 0, aux1 = 0;
        for (let i = 0; i < this.saltos * Math.pow(2, this.bitsAgregar); i += this.saltos) {
            // Clase A
            const auxIP: DireccionIP = new DireccionIP(this.IP, this.bits + this.bitsAgregar);
            auxIP.indice = ++count;

            if (this.clase === 'A') // Clase A
            {
                if (this.bitsAgregar <= 8) {
                    // IP de Red
                    auxIP.red = `${this.octeto1}.${i}.0.0/${this.bits + this.bitsAgregar}`;
                    // IP inicio
                    auxIP.IPInicio = `${this.octeto1}.${i}.0.1`;
                    // IP final
                    auxIP.IPFinal = `${this.octeto1}.${i + (this.saltos - 1)}.255.254`;
                    // IP broadcast
                    auxIP.IPBroadcast = `${this.octeto1}.${i + (this.saltos - 1)}.255.255`;
                }

                else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) {
                    if ((count % (256 / this.saltos)) === 0 && count) {
                        aux++;
                    }
                    // IP de Red
                    auxIP.red = `${this.octeto1}.${aux}.${i % 256}.0/${this.bits + this.bitsAgregar}`;
                    // IP inicio
                    auxIP.IPInicio = `${this.octeto1}.${aux}.${i % 256}.1`;
                    // IP final
                    auxIP.IPFinal = `${this.octeto1}.${aux}.${(i + this.saltos - 1) % 256}.254`;
                    // IP broadcast
                    auxIP.IPBroadcast = `${this.octeto1}.${aux}.${(i + this.saltos - 1) % 256}.255`;
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
                    auxIP.red = `${this.octeto1}.${aux1}.${aux}.${i % 256}/${this.bits + this.bitsAgregar}`;
                    // IP inicio
                    auxIP.IPInicio = `${this.octeto1}.${aux1}.${aux}.${(i + 1) % 256}`;
                    // IP final
                    auxIP.IPFinal = `${this.octeto1}.${aux1}.${aux}.${(i + this.saltos - 2) % 256}`;
                    // IP broadcast
                    auxIP.IPBroadcast = `${this.octeto1}.${aux1}.${aux}.${(i + this.saltos - 1) % 256}`;
                }
            }

            // Clase B
            else if (this.clase === 'B') // Clase B
            {
                if (this.bitsAgregar <= 8) // se altera el tercer octeto
                {
                    // IP de Red
                    auxIP.red = `${this.octeto1}.${this.octeto2}.${i}.0/${this.bits + this.bitsAgregar}`;
                    // IP inicio
                    auxIP.IPInicio = `${this.octeto1}.${this.octeto2}.${i}.1`;
                    // IP final
                    auxIP.IPFinal = `${this.octeto1}.${this.octeto2}.${i + (this.saltos - 1)}.254`;
                    // IP broadcast
                    auxIP.IPBroadcast = `${this.octeto1}.${this.octeto2}.${i + (this.saltos - 1)}.255`;
                }

                else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) // se altera el tercer y cuarto octeto
                {
                    if ((count % (256 / this.saltos)) === 0 && count) {
                        aux++;
                    }
                    // IP de Red
                    auxIP.red = `${this.octeto1}.${this.octeto2}.${aux}.${i % 256}/${this.bits + this.bitsAgregar}`;
                    // IP inicio
                    auxIP.IPInicio = `${this.octeto1}.${this.octeto2}.${aux}.${(i + 1) % 256}`;
                    // IP final
                    auxIP.IPFinal = `${this.octeto1}.${this.octeto2}.${aux}.${(i + this.saltos - 2) % 256}`;
                    // IP broadcast
                    auxIP.IPBroadcast = `${this.octeto1}.${this.octeto2}.${aux}.${(i + this.saltos - 1) % 256}`;
                }
            }

            // Clase C
            else if (this.clase === 'C') // Clase C
            {
                if (this.bitsAgregar <= 8) {
                    // IP de Red
                    auxIP.red = `${this.octeto1}.${this.octeto2}.${this.octeto3}.${i}/${this.bits + this.bitsAgregar}`;
                    // IP inicio
                    auxIP.IPInicio = `${this.octeto1}.${this.octeto2}.${this.octeto3}.${i + 1}`;
                    // IP final
                    auxIP.IPFinal = `${this.octeto1}.${this.octeto2}.${this.octeto3}.${i + this.saltos - 2}`;
                    // IP broadcast
                    auxIP.IPBroadcast = `${this.octeto1}.${this.octeto2}.${this.octeto3}.${i + this.saltos - 1}`;
                }
            }

            this.subredes.push(auxIP);
        }
    }


    
    // Método para calcular y mostrar los datos de la red IP SUBNETEADA
    public datosSubNeteo(): void
    {
        let count = 0, aux = 0, aux1 = 0, detener = 0, despues = 0;
        // Clase A
        if (this.clase === 'A') // Clase A
        {
            if (this.bitsAgregar <= 8)
            {
                for (let i = 0; i <= this.octeto2; i += this.saltos)
                {
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
                const sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }

            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16)
            {
                for (let i = 0; i <= this.octeto3; i += this.saltos)
                {
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
                const sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
            else if (this.bitsAgregar > 16 && this.bitsAgregar <= 24)
            {
                for (let i = 0; i <= this.octeto4; i += this.saltos)
                {
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
                const sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
        }
        // Clase B
        else if (this.clase === 'B')
        {

            if (this.bitsAgregar <= 8) // se altera el tercer octeto
            {
                for (let i = 0; i <= this.octeto3; i += this.saltos)
                {
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
                const sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }

            else if (this.bitsAgregar > 8 && this.bitsAgregar <= 16) // se altera el tercer y cuarto octeto
            {
                for (let i = 0; i <= this.octeto4; i += this.saltos)
                {
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
                const sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
        }
        // Clase C
        else if (this.clase === 'C') // Clase C
        {
            if (this.bitsAgregar <= 8)
            {
                for (let i = 0; i <= this.octeto4; i += this.saltos)
                {
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
                const sum2 = Math.pow(2, 32 - this.bits) - 2;
                this.hosts = sum2;
            }
        }
    }

    // Metodo para unir todo de subneteo
    public subNeteo(): void
    {
        this.bitsAgregar = 0;
        if (this.clase === 'A')
        {
            this.bitsAgregar = this.bits - 8;
        }
        else if (this.clase === 'B')
        {
            this.bitsAgregar = this.bits - 16;
        }
        else if (this.clase === 'C')
        {
            this.bitsAgregar = this.bits - 24;
        }

        // Almacenamos el valor de saltos
        this.calcularSaltos();

        // Llamamos a datosSubNeteo,, pasando saltos calculado como parámetro
        this.datosSubNeteo();
    }
};