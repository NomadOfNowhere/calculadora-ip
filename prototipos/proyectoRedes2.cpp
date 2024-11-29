#include <iostream>
#include <bitset>
#include <cmath>
using namespace std;

// Instrucciones de compilación:
// g++ proyecto2redes.cpp -o proyecto2redes.exe; .\proyecto2redes

class DireccionIP
{
private:
    int octeto1, octeto2, octeto3, octeto4;
    char clase;

public:
    // Constructor para inicializar los 4 octetos de la dirección IP
    DireccionIP(int o1, int o2, int o3, int o4)
    {
        // Asegurarnos de que cada octeto esté en el rango 0-255
        if ((o1 >= 0 && o1 <= 255) && (o2 >= 0 && o2 <= 255) &&
            (o3 >= 0 && o3 <= 255) && (o4 >= 0 && o4 <= 255))
        {
            octeto1 = o1;
            octeto2 = o2;
            octeto3 = o3;
            octeto4 = o4;

        }
        else
        {
            cout << "Error: Uno o más octetos están fuera del rango 0-255." << endl;
            exit(1);
        }
    }

    // Método para mostrar la dirección IP completa
    void mostrarDireccion()
    {
        cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << octeto4 << endl;
    }

    // Método para reconocer la clase a la cual pertenece la dirección IP.
    void reconocerClase()
    {
        if (octeto1 >= 1 && octeto1 <= 127)
        {
            this->clase = 'A';
            cout << "Clase A." << endl;
        }
        else if (octeto1 >= 128 && octeto1 <= 191)
        {
            this->clase = 'B';
            cout << "Clase B." << endl;
        }
        else if (octeto1 >= 192 && octeto1 <= 223)
        {
            this->clase = 'C';
            cout << "Clase C." << endl;
        }
        else if (octeto1 >= 224 && octeto1 <= 239)
        {
            this->clase = 'D';
            cout << "Clase D." << endl;
            cout << "No se asigna una máscara de red tradicional para la Clase D." << endl;
        }
        else if (octeto1 >= 240 && octeto1 <= 255)
        {
            this->clase = 'E';
            cout << "Clase E." << endl;
            cout << "No se asigna una máscara de red tradicional para la Clase E." << endl;
            exit(1);
        }
        else
        {
            cout << "La dirección IP no pertenece a una clase estándar (A, B, C, D o E)." << endl;
            exit(1);
        }
    }

    // Método para mostrar la máscara de red según el número de bits
    void mostrarMascaraPorBits(int bits, bitset<32> &mascara)
    {
        // Llenamos los primeros "bits" de la máscara con 1's de izquierda a derecha
        for (int i = 31; i >= 32 - bits; i--)
            mascara[i] = 1; // Poner 1 en los primeros "bits" (de izquierda a derecha)

        // Convertimos la máscara a una cadena binaria
        string mascaraBin = mascara.to_string(); // Genera un string de 32 caracteres (con 0 y 1)

        // Mostramos la máscara en formato binario
        cout << "- La máscara de red con " << bits << " bits es: ";
        for (int i = 0; i < 4; i++)
        {
            // Mostramos cada octeto de 8 bits
            cout << mascaraBin.substr(i * 8, 8); //--->(índice donde comienza, caracteres que toma desde el índice)
            if (i < 3)
                cout << "."; // Ponemos puntos entre los octetos
        }
        cout << endl;

        // Ahora calculamos los valores decimales de cada octeto
        int octeto1 = bitset<8>(mascaraBin.substr(0, 8)).to_ulong();
        int octeto2 = bitset<8>(mascaraBin.substr(8, 8)).to_ulong();
        int octeto3 = bitset<8>(mascaraBin.substr(16, 8)).to_ulong();
        int octeto4 = bitset<8>(mascaraBin.substr(24, 8)).to_ulong();

        // Mostrar la máscara de subred en formato decimal
        cout << "- La máscara de red con " << bits << " bits en formato decimal es: ";
        cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << octeto4 << endl;
    }

    // Método para calcular y mostrar los datos de la red IP
    void datosIPoriginal(DireccionIP ip, int bits)
    {
        // IP de Red
        cout << "- Dirección IP: ";
        ip.mostrarDireccion();

        // Clase A
        if (octeto1 >= 1 && octeto1 <= 127) // Clase A
        {
            // Red
            cout << "- Red: ";
            cout << octeto1 << "." << 0 << "." << 0 << "." << 0 << "/" << bits << endl;
            // IP inicio
            cout << "- IP Inicio: ";
            cout << octeto1 << "." << 0 << "." << 0 << "." << 1 << endl;
            // IP final
            cout << "- IP Final: ";
            cout << octeto1 << "." << 255 << "." << 255 << "." << 254 << endl;
            // IP broadcast
            cout << "- IP Broadcast: ";
            cout << octeto1 << "." << 255 << "." << 255 << "." << 255 << endl;
            // Número de host de la red
            cout << "- # de Hosts en la Red: ";
            int sum = pow(2, 24) - 2;
            cout << sum << endl;
        }
        // Clase B
        else if (octeto1 >= 128 && octeto1 <= 191) // Clase B
        {
            // Red
            cout << "- Red: ";
            cout << octeto1 << "." << octeto2 << "." << 0 << "." << 0 << "/" << bits << endl;
            // IP inicio
            cout << "- IP Inicio: ";
            cout << octeto1 << "." << octeto2 << "." << 0 << "." << 1 << endl;
            // IP final
            cout << "- IP Final: ";
            cout << octeto1 << "." << octeto2 << "." << 255 << "." << 254 << endl;
            // IP broadcast
            cout << "- IP Broadcast: ";
            cout << octeto1 << "." << octeto2 << "." << 255 << "." << 255 << endl;
            // Número de host de la red
            cout << "- # de Hosts en la Red: ";
            int sum1 = pow(2, 16) - 2;
            cout << sum1 << endl;
        }
        // Clase C
        else if (octeto1 >= 192 && octeto1 <= 223) // Clase C
        {
            // Red
            cout << "- Red: ";
            cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << 0 << "/" << bits << endl;
            // IP inicio
            cout << "- IP Inicio: ";
            cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << 1 << endl;
            // IP final
            cout << "- IP Final: ";
            cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << 254 << endl;
            // IP broadcast
            cout << "- IP Broadcast: ";
            cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << 255 << endl;
            // Número de host de la red
            cout << "- # de Hosts en la Red: ";
            int sum2 = pow(2, 8) - 2;
            cout << sum2 << endl;
        }
    }

    // Método para calcular los bits que se deben agregar
    int calcularBitsAgregar(int numSubRedes, int bitsActuales, int nuevaMascara = -1)
    {
        if (nuevaMascara == -1)
        {
            return ceil(log2(numSubRedes)); // Calculamos a partir de las subredes
        }
        else
        {
            return nuevaMascara - bitsActuales; // Calculamos a partir de la nueva máscara
        }
    }

    // Método para llenar la máscara de subred
    void llenarMascara(int bits, int bitsAgregar, bitset<32> &mascara)
    {
        mascara.reset(); // Resetea todos los bits a 0
        for (int i = 31; i >= 32 - (bits + bitsAgregar); i--)
        {
            mascara[i] = 1;
        }
    }

    // Método para mostrar la máscara en formato binario y decimal
    void mostrarMascara(int bitsCompletos, const bitset<32> &mascara)
    {
        string mascaraBin = mascara.to_string();
        cout << "- La máscara de SubRed con " << bitsCompletos << " bits en formato binario es: ";
        for (int i = 0; i < 4; i++)
        {
            cout << mascaraBin.substr(i * 8, 8);
            if (i < 3)
                cout << ".";
        }
        cout << endl;

        int octeto1 = bitset<8>(mascaraBin.substr(0, 8)).to_ulong();
        int octeto2 = bitset<8>(mascaraBin.substr(8, 8)).to_ulong();
        int octeto3 = bitset<8>(mascaraBin.substr(16, 8)).to_ulong();
        int octeto4 = bitset<8>(mascaraBin.substr(24, 8)).to_ulong();
        cout << "- La máscara de SubRed en formato decimal es: " << octeto1 << "." << octeto2 << "." << octeto3 << "." << octeto4 << endl;
    }

    // Método para calcular y mostrar la cantidad de hosts
    void calcularHosts(int bits, int bitsAgregar)
    {
        int ceros = 32 - (bits + bitsAgregar);
        int hosts = pow(2, ceros) - 2;
        cout << "- Hosts de SubRed ---> (2^" << ceros << ") - 2 = " << hosts << endl;
        cout << "- Subredes ---> (2^" << bitsAgregar << ") = " << pow(2, bitsAgregar) << endl;
        cout << "- Total de Hosts ---> (2^" << bitsAgregar << ") x (" << hosts << ") = " << pow(2, bitsAgregar) * hosts << endl;
    }

    // Método para calcular y mostrar la cantidad de saltos
    int calcularSaltos(int bitsAgregar, bitset<32> &mascara)
    {
        string mascaraBin = mascara.to_string();

        int octeto_1 = bitset<8>(mascaraBin.substr(0, 8)).to_ulong();
        int octeto_2 = bitset<8>(mascaraBin.substr(8, 8)).to_ulong();
        int octeto_3 = bitset<8>(mascaraBin.substr(16, 8)).to_ulong();
        int octeto_4 = bitset<8>(mascaraBin.substr(24, 8)).to_ulong();
        int saltos = 0; // Variable para almacenar el resultado de saltos

        cout << "Se calculan los octetos: " << octeto_1 << " - " << octeto_2 << " - " << octeto_3 << " - " << octeto_4 << endl;

        if (this->clase == 'A')
        {
            if (bitsAgregar <= 8)
            {
                saltos = pow(2, 8) - octeto_2;
                cout << "- Saltos ---> (2^8) - " << octeto_2 << " = " << saltos << endl; // Aquí ahora imprime 248
                cout << endl;
            }
            else if (bitsAgregar > 8 && bitsAgregar <= 16)
            {
                saltos = pow(2, 8) - octeto_3;
                cout << "- Saltos ---> (2^8) - " << octeto_3 << " = " << saltos << endl;
                cout << endl;
            }
            else if (bitsAgregar > 16 && bitsAgregar <= 24)
            {
                saltos = pow(2, 8) - octeto_4;
                cout << "- Saltos ---> (2^8) - " << octeto_4 << " = " << saltos << endl;
                cout << endl;
            }
        }

        else if (this->clase == 'B')
        {
            if (bitsAgregar <= 8)
            {
                saltos = pow(2, 8) - octeto_3;
                cout << "- Saltos ---> (2^8) - " << octeto_3 << " = " << saltos << endl;
                cout << endl;
            }
            else if (bitsAgregar > 8 && bitsAgregar <= 16)
            {
                saltos = pow(2, 8) - octeto_4;
                cout << "- Saltos ---> (2^8) - " << octeto_4 << " = " << saltos << endl;
                cout << endl;
            }
        }

        else if (this->clase == 'C')
        {
            if (bitsAgregar <= 8)
            {
                saltos = pow(2, 8) - octeto_4;
                cout << "- Saltos ---> (2^8) - " << octeto_4 << " = " << saltos << endl;
                cout << endl;
            }
        }

        return saltos; // Devuelve el valor calculado de saltos
    }

    // Métodos principales que usan los auxiliares
    void modificarMascaraOriginal(int numSubRedes, int bits, bitset<32> &mascara)
    {
        int saltos;
        int bitsAgregar = calcularBitsAgregar(numSubRedes, bits);
        int resBinario = pow(2, bitsAgregar);
        cout << "- Necesitamos agregar ----> " << bitsAgregar << " bits a la parte del host, ya que 2^" << bitsAgregar << " = " << resBinario << endl;

        llenarMascara(bits, bitsAgregar, mascara);
        mostrarMascara(bits + bitsAgregar, mascara);
        calcularHosts(bits, bitsAgregar);

        // Almacenamos el valor de saltos
        saltos = calcularSaltos(bitsAgregar, mascara);

        // Llamamos a datosSubRedes, pasando saltos calculado como parámetro
        datosSubRedes(bitsAgregar, bits, saltos);
    }

    void modificarMascaraOriginal2(int nuevaMascara, int bits, bitset<32> &mascara)
    {
        int saltos;
        int bitsAgregar = calcularBitsAgregar(-1, bits, nuevaMascara);
        cout << "- Necesitamos agregar ----> " << bitsAgregar << " bits a la parte del host." << endl;
        llenarMascara(bits, bitsAgregar, mascara);
        mostrarMascara(bits + bitsAgregar, mascara);
        calcularHosts(bits, bitsAgregar);

        // Almacenamos el valor de saltos
        saltos = calcularSaltos(bitsAgregar, mascara);

        // Llamamos a datosSubRedes, pasando saltos calculado como parámetro
        datosSubRedes(bitsAgregar, bits, saltos);
    }

    // Método para calcular los datos de cada subred generada en la opción (1) y (2)
    void datosSubRedes(int bitsAgregar, int bits, int saltos)
    {
        int count = 0, aux = 0, aux1 = 0;
        for (int i = 0; i < saltos * pow(2, bitsAgregar); i += saltos)
        {
            // Clase A
            if (this->clase == 'A') // Clase A
            {
                if (bitsAgregar <= 8)
                {
                    count++;
                    cout << "Subred #" << count << endl;
                    // IP de Red
                    cout << "- IP de SubRed: ";
                    cout << octeto1 << "." << i << "." << 0 << "." << 0 << "/" << bits + bitsAgregar << endl;
                    // IP inicio
                    cout << "- IP Inicio: ";
                    cout << octeto1 << "." << i << "." << 0 << "." << 1 << endl;
                    // IP final
                    cout << "- IP Final: ";
                    cout << octeto1 << "." << i + (saltos - 1) << "." << 255 << "." << 254 << endl;
                    // IP broadcast
                    cout << "- IP Broadcast: ";
                    cout << octeto1 << "." << i + (saltos - 1) << "." << 255 << "." << 255 << endl;
                    cout << endl;
                }

                else if (bitsAgregar > 8 && bitsAgregar <= 16)
                {
                    if ((count % (256 / saltos)) == 0 && count)
                    {
                        aux++;
                    }
                    count++;

                    cout << "Subred #" << count << endl;
                    // IP de Red
                    cout << "- IP de SubRed: ";
                    cout << octeto1 << "." << aux << "." << i % 256 << "." << 0 << "/" << bits + bitsAgregar << endl;
                    // IP inicio
                    cout << "- IP Inicio: ";
                    cout << octeto1 << "." << aux << "." << i % 256 << "." << 1 << endl;
                    // IP final
                    cout << "- IP Final: ";
                    cout << octeto1 << "." << aux << "." << (i + saltos - 1) % 256 << "." << 254 << endl;
                    // IP broadcast
                    cout << "- IP Broadcast: ";
                    cout << octeto1 << "." << aux << "." << (i + saltos - 1) % 256 << "." << 255 << endl;
                    cout << endl;
                }
                else if (bitsAgregar > 16 && bitsAgregar <= 24)
                {
                    if (aux == 255 && (count % (256 / saltos)) == 0 && count)
                    {
                        aux1++;
                        aux = 0;
                    }

                    else if ((count % (256 / saltos)) == 0 && count)
                    {
                        aux++;
                    }
                    count++;

                    cout << "Subred #" << count << endl;
                    // IP de Red
                    cout << "- IP de SubRed: ";
                    cout << octeto1 << "." << aux1 << "." << aux << "." << i % 256 << "/" << bits + bitsAgregar << endl;
                    // IP inicio
                    cout << "- IP Inicio: ";
                    cout << octeto1 << "." << aux1 << "." << aux << "." << (i + 1) % 256 << endl;
                    // IP final
                    cout << "- IP Final: ";
                    cout << octeto1 << "." << aux1 << "." << aux << "." << (i + saltos - 2) % 256 << endl;
                    // IP broadcast
                    cout << "- IP Broadcast: ";
                    cout << octeto1 << "." << aux1 << "." << aux << "." << (i + saltos - 1) % 256 << endl;
                    cout << endl;
                }
            }
            // Clase B
            else if (this->clase == 'B') // Clase B
            {
                if (bitsAgregar <= 8) // se altera el tercer octeto
                {
                    count++;
                    cout << "Subred #" << count << endl;
                    // IP de Red
                    cout << "- IP de SubRed: ";
                    cout << octeto1 << "." << octeto2 << "." << i << "." << 0 << "/" << bits + bitsAgregar << endl;
                    // IP inicio
                    cout << "- IP Inicio: ";
                    cout << octeto1 << "." << octeto2 << "." << i << "." << 1 << endl;
                    // IP final
                    cout << "- IP Final: ";
                    cout << octeto1 << "." << octeto2 << "." << i + (saltos - 1) << "." << 254 << endl;
                    // IP broadcast
                    cout << "- IP Broadcast: ";
                    cout << octeto1 << "." << octeto2 << "." << i + (saltos - 1) << "." << 255 << endl;
                    cout << endl;
                }

                else if (bitsAgregar > 8 && bitsAgregar <= 16) // se altera el tercer y cuarto octeto
                {
                    if ((count % (256 / saltos)) == 0 && count)
                    {
                        aux++;
                    }
                    count++;

                    cout << "Subred #" << count << endl;
                    // IP de Red
                    cout << "- IP de SubRed: ";
                    cout << octeto1 << "." << octeto2 << "." << aux << "." << i % 256 << "/" << bits + bitsAgregar << endl;
                    // IP inicio
                    cout << "- IP Inicio: ";
                    cout << octeto1 << "." << octeto2 << "." << aux << "." << (i + 1) % 256 << endl;
                    // IP final
                    cout << "- IP Final: ";
                    cout << octeto1 << "." << octeto2 << "." << aux << "." << (i + saltos - 2) % 256 << endl;
                    // IP broadcast
                    cout << "- IP Broadcast: ";
                    cout << octeto1 << "." << octeto2 << "." << aux << "." << (i + saltos - 1) % 256 << endl;
                    cout << endl;
                }
            }
            // Clase C
            else if (this->clase == 'C') // Clase C
            {
                if (bitsAgregar <= 8)
                {
                    count++;
                    cout << "Subred #" << count << endl;
                    // IP de Red
                    cout << "- IP de SubRed: ";
                    cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << i << "/" << bits + bitsAgregar << endl;
                    // IP inicio
                    cout << "- IP Inicio: ";
                    cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << i + 1 << endl;
                    // IP final
                    cout << "- IP Final: ";
                    cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << (i + saltos - 2) << endl;
                    // IP broadcast
                    cout << "- IP Broadcast: ";
                    cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << (i + saltos - 1) << endl;
                    cout << endl;
                }
            }
        }
    }

    // Método para calcular y mostrar los datos de la red IP SUBNETEADA
    void datosSubNeteo(int bitsAgregar, int bits, int saltos)
    {
        int count = 0, aux = 0, aux1 = 0, detener = 0, despues = 0;
        // Clase A
        if (this->clase == 'A') // Clase A
        {
            if (bitsAgregar <= 8)
            {
                for (int i = 0; i <= octeto2; i += saltos)
                {
                    detener = i;
                }
                despues = detener + saltos;

                // IP de Red
                cout << "- IP de SubRed: ";
                cout << octeto1 << "." << detener << "." << 0 << "." << 0 << "/" << bits << endl;
                // IP inicio
                cout << "- IP Inicio: ";
                cout << octeto1 << "." << detener << "." << 0 << "." << 1 << endl;
                // IP final
                cout << "- IP Final: ";
                cout << octeto1 << "." << despues - 1 << "." << 255 << "." << 254 << endl;
                // IP broadcast
                cout << "- IP Broadcast: ";
                cout << octeto1 << "." << despues - 1 << "." << 255 << "." << 255 << endl;
                // # de Hosts
                cout << "- # de Hosts en la Red: ";
                int sum2 = pow(2, 32 - bits) - 2;
                cout << sum2 << endl;
                cout << endl;
            }

            else if (bitsAgregar > 8 && bitsAgregar <= 16)
            {
                for (int i = 0; i <= octeto3; i += saltos)
                {
                    detener = i;
                }
                despues = detener + saltos;

                // IP de Red
                cout << "- SubRed: ";
                cout << octeto1 << "." << octeto2 << "." << detener << "." << 0 << "/" << bits << endl;
                // IP inicio
                // IP inicio
                cout << "- IP Inicio: ";
                cout << octeto1 << "." << octeto2 << "." << detener << "." << 1 << endl;
                // IP final
                cout << "- IP Final: ";
                cout << octeto1 << "." << octeto2 << "." << despues - 1 << "." << 254 << endl;
                // IP broadcast
                cout << "- IP Broadcast: ";
                cout << octeto1 << "." << octeto2 << "." << despues - 1 << "." << 255 << endl;
                // # de Hosts
                cout << "- # de Hosts en la Red: ";
                int sum2 = pow(2, 32 - bits) - 2;
                cout << sum2 << endl;
                cout << endl;
            }
            else if (bitsAgregar > 16 && bitsAgregar <= 24)
            {
                for (int i = 0; i <= octeto4; i += saltos)
                {
                    detener = i;
                }
                despues = detener + saltos;

                // IP de Red
                cout << "- IP de SubRed: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << detener << "/" << bits << endl;
                // IP inicio
                cout << "- IP Inicio: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << detener + 1 << endl;
                // IP final
                cout << "- IP Final: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << despues - 2 << endl;
                // IP broadcast
                cout << "- IP Broadcast: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << despues - 1 << endl;
                // # de Hosts
                cout << "- # de Hosts en la Red: ";
                int sum2 = pow(2, 32 - bits) - 2;
                cout << sum2 << endl;
                cout << endl;
            }
        }
        // Clase B
        else if (this->clase == 'B')
        {

            if (bitsAgregar <= 8) // se altera el tercer octeto
            {
                for (int i = 0; i <= octeto3; i += saltos)
                {
                    detener = i;
                }
                despues = detener + saltos;

                // IP de Red
                cout << "- IP de SubRed: ";
                cout << octeto1 << "." << octeto2 << "." << detener << "." << 0 << "/" << bits << endl;
                // IP inicio
                cout << "- IP Inicio: ";
                cout << octeto1 << "." << octeto2 << "." << detener << "." << 1 << endl;
                // IP final
                cout << "- IP Final: ";
                cout << octeto1 << "." << octeto2 << "." << despues - 1 << "." << 254 << endl;
                // IP broadcast
                cout << "- IP Broadcast: ";
                cout << octeto1 << "." << octeto2 << "." << despues - 1 << "." << 255 << endl;
                // # de Hosts
                cout << "- # de Hosts en la Red: ";
                int sum2 = pow(2, 32 - bits) - 2;
                cout << sum2 << endl;
                cout << endl;
            }

            else if (bitsAgregar > 8 && bitsAgregar <= 16) // se altera el tercer y cuarto octeto
            {
                for (int i = 0; i <= octeto4; i += saltos)
                {
                    detener = i;
                }
                despues = detener + saltos;

                // IP de Red
                cout << "- IP de SubRed: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << detener << "/" << bits << endl;
                // IP inicio
                cout << "- IP Inicio: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << detener + 1 << endl;
                // IP final
                cout << "- IP Final: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << despues - 2 << endl;
                // IP broadcast
                cout << "- IP Broadcast: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << despues - 1 << endl;
                // # de Hosts
                cout << "- # de Hosts en la Red: ";
                int sum2 = pow(2, 32 - bits) - 2;
                cout << sum2 << endl;
                cout << endl;
            }
        }
        // Clase C
        else if (this->clase == 'C') // Clase C
        {
            if (bitsAgregar <= 8)
            {
                for (int i = 0; i <= octeto4; i += saltos)
                {
                    detener = i;
                }
                despues = detener + saltos;

                // IP de Red
                cout << "- IP de SubRed: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << detener << "/" << bits << endl;
                // IP inicio
                cout << "- IP Inicio: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << detener + 1 << endl;
                // IP final
                cout << "- IP Final: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << despues - 2 << endl;
                // IP broadcast
                cout << "- IP Broadcast: ";
                cout << octeto1 << "." << octeto2 << "." << octeto3 << "." << despues - 1 << endl;
                // # de Hosts
                cout << "- # de Hosts en la Red: ";
                int sum2 = pow(2, 32 - bits) - 2;
                cout << sum2 << endl;
                cout << endl;
            }
        }
    }

    // Metodo para unir todo de subneteo
    void subNeteo(int bits, bitset<32> &mascara)
    {
        int saltos;
        int bitsAgregar = 0;
        reconocerClase();
        if (this->clase == 'A')
        {
            bitsAgregar = bits - 8;
        }
        else if (this->clase == 'B')
        {
            bitsAgregar = bits - 16;
        }
        else if (this->clase == 'C')
        {
            bitsAgregar = bits - 24;
        }

        // Almacenamos el valor de saltos
        saltos = calcularSaltos(bitsAgregar, mascara);

        // Llamamos a datosSubNeteo,, pasando saltos calculado como parámetro
        datosSubNeteo(bitsAgregar, bits, saltos);
    }

    // Menú de opciones
    void calculadoraIP(int bits, bitset<32> &mascara, DireccionIP ip)
    {
        int numSubRedes, nuevaMascara, opcion, bitsAgregar;
        if (bits <= 32 && bits >= 0)
        {
            cout << "La dirección IP pertenece a: ";
            reconocerClase();
            // Mostramos la clase a la que pertenece (si es red y no subred)
            if (bits == 8 && this->clase == 'A' || bits == 16 && this->clase == 'B' || bits == 24 && this->clase == 'C')
            {
                cout << "Datos de la dirección IP: " << endl;
                datosIPoriginal(ip, bits);

                // Mostramos la máscara de red según los bits ingresados (en decimal y en binario)
                mostrarMascaraPorBits(bits, mascara);
                cout << endl;
                cout << "Ingrese una opción ---> : (1) Obtener SubRedes o (2) Modificar máscara de IP de red/x" << endl;
                cin >> opcion;

                switch (opcion)
                {
                case 1:
                    cout << endl;
                    cout << "¿Cuántas subredes quiere obtener? ----> ";
                    cin >> numSubRedes;
                    cout << "Datos de las subredes:" << endl;
                    modificarMascaraOriginal(numSubRedes, bits, mascara);
                    break;
                case 2:
                    cout << endl;
                    cout << "¿De cuántos bits quiere que sea la NUEVA máscara de SubRed? ----> ";
                    cin >> nuevaMascara;
                    cout << endl;
                    if (nuevaMascara >= 0 && nuevaMascara <= 32 && nuevaMascara > bits)
                    {
                        cout << "Datos de las SubRedes:" << endl;
                        modificarMascaraOriginal2(nuevaMascara, bits, mascara);
                        break;
                    }
                    else
                    {
                        cout << "No es un número de bits válidos para la máscara" << endl;
                        exit(1);
                    }

                default:
                    cout << "Ingresa una opción correcta";
                    break;
                }
            }
            else
            {
                cout << "La dirección IP está subneteada." << endl;
                cout << endl;
                // Datos de la dirección ip subneteada
                cout << "Datos de la dirección IP subneteada: " << endl;
                // Mostramos la dirección IP subneteada completa :)
                cout << "- Dirección IP: ";
                mostrarDireccion();
                // Mostramos la máscara de subred según los bits ingresados (en decimal y en binario)
                mostrarMascaraPorBits(bits, mascara);
                cout << endl;
                cout << "Los datos de la IP de SubRed son: " << endl;
                subNeteo(bits, mascara);
            }
        }
        else
        {
            cout << "Error: El número de bits debe estar entre 0 y 32." << endl;
            exit(0);
        }
    }
};

int main()
{
    int o1, o2, o3, o4, bits, opcion;
    char punto; // Almacenamos los puntos entre los octetos
    // Creamos una máscara con los primeros "bits" como 1 y el resto como 0
    bitset<32> mascara; // Mascara de 32 bits

    // Solicitamos al usuario que ingrese la dirección IP
    cout << "Ingrese la dirección IP (Red o Host): ";
    cin >> o1 >> punto >> o2 >> punto >> o3 >> punto >> o4;

    // Se crea la dirección IP con los valores ingresados
    DireccionIP ip(o1, o2, o3, o4);

    // Mostramos la dirección IP completa :)
    cout << "Dirección IP: ";
    ip.mostrarDireccion();

    // Pedimos al usuario que ingrese el número de bits de la máscara
    cout << "Ingrese el número de bits de la máscara de Red (0-32): ";
    cin >> bits;

    // Menú
    ip.calculadoraIP(bits, mascara, ip);

    return 0;
}
