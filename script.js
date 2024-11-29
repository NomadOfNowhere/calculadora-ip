// Variable global con los datos de la ip
let IPObj;

function formularioIP() {
   const ipInput = document.getElementById("direccionIP");
   const mascaraBitsInput = document.getElementById("mascaraBits");
   const caracteristicasDiv = document.getElementById("caracteristicas");
   const opcDiv = document.getElementById("opc");
   const btnBuscar = document.getElementById("botonBuscar");

   const direccionIP = ipInput.value;
   const mascaraBits = parseInt(mascaraBitsInput.value);

   const ipRegex = /^(?:[0-9]|[1-9][0-9]|1\d{2}|2[0-1]\d|22[0-3])(?:\.(?:[0-9]|[1-9][0-9]|1\d{2}|2[0-4]\d|25[0-5])){3}$/;

   if (ipRegex.test(direccionIP) && mascaraBits >= 0 && mascaraBits <= 32) {
       opcDiv.style.display = "block";

       // Crear objeto de la IP
       IPObj = new DireccionIP(direccionIP, mascaraBits);
       console.log(IPObj);

       caracteristicasDiv.innerHTML = obtenerTextoCaracteristicas();
   } else {
       alert("Por favor, introduce una dirección IP y máscara válidas.");
       opcDiv.style.display = "none";
       caracteristicasDiv.innerHTML = "";
   }
}



// Validación según la opción seleccionada
function formularioCalcular() {
   const numeroHostsInput = document.getElementById("numeroHosts");
   const nuevaMascaraInput = document.getElementById("nuevaMascara");
   const datosDiv = document.getElementById("datos");
   let content = "";

   // Se itera sobre un arreglo de objetos en la ip original que
   // contiene a las redes subneteadas

   if (document.getElementById("obtenerSubredes").checked) {
       const numeroHosts = parseInt(numeroHostsInput.value);
       if (numeroHosts > 0) {
            content="";

           // ****** Obtención de los datos de las subredes
           IPObj.modificarMascaraOriginal(numeroHosts);
           content += subredesText();

           for(let i = 0; i < IPObj.subredes.length; i++) {
                content += subredesInfo(IPObj.subredes[i], i+1);
           }
           // *********
       } 
       else {
           alert("Por favor, introduce un número válido de hosts.");
       }
   } else if (document.getElementById("modificarMascara").checked) {
       const nuevaMascara = parseInt(nuevaMascaraInput.value);
       if (nuevaMascara >= 0 && nuevaMascara <= 32 && nuevaMascara > IPObj.bits) {
        content="";

           // ***** Obtención de los datos de las subredes
           IPObj.modificarMascaraOriginal2(nuevaMascara);
           content += subredesText();

           for(let i = 0; i < IPObj.subredes.length; i++) {
                content += subredesInfo(IPObj.subredes[i], i+1);
           }
           // *****
       } 
       else {
           alert("Por favor, introduce un número válido de bits.");
       }
   } 
   else {
       alert("Por favor, selecciona una opción válida.");
   }
   datosDiv.innerHTML = content;
}

function actualizarVistaBotones() {
   const entradaHostsDiv = document.getElementById("entradaHosts");
   const entradaNuevaMascaraDiv = document.getElementById("entradaNuevaMascara");
   const botonBuscar = document.getElementById("botonBuscar");
   const botonCalcular = document.getElementById("botonCalcular");

   const radioObtenerSubredes = document.getElementById("obtenerSubredes");
   const radioModificarMascara = document.getElementById("modificarMascara");

   if (!radioObtenerSubredes.checked && !radioModificarMascara.checked) {
       entradaHostsDiv.style.display = "none";
       entradaNuevaMascaraDiv.style.display = "none";
       botonBuscar.style.display = "block";
       botonCalcular.style.display = "none";
   }
}

// Obtiene la máscara por defecto para la clase
function obtenerMascaraClase(clase) {
   switch (clase) {
       case "A": return 8;
       case "B": return 16;
       case "C": return 24;
       default: return null;
   }
}

   //Funcionamiento de deseleccion de radios (no tocar xd)
   function toggleRadio(radio) {
       if (radio.wasChecked) {
           radio.checked = false;
           radio.wasChecked = false;
           actualizarVistaBotones();
       } else {
           radio.wasChecked = true;

           const radios = document.getElementsByName(radio.name);
           radios.forEach((r) => {
               if (r !== radio) r.wasChecked = false;
           });
           mostrarEntradaAdicional(); // Actualizar vista
       }
   }
   
   // Función para manejar visibilidad de botones
   function mostrarEntradaAdicional() {
       const entradaHostsDiv = document.getElementById("entradaHosts");
       const entradaNuevaMascaraDiv = document.getElementById("entradaNuevaMascara");
       const botonBuscar = document.getElementById("botonBuscar");
       const botonCalcular = document.getElementById("botonCalcular");

       if (document.getElementById("obtenerSubredes").checked) {
           entradaHostsDiv.style.display = "block";
           entradaNuevaMascaraDiv.style.display = "none";
        //    botonBuscar.style.display = "none";  yo diría que el botón de buscar se muestre en todo momento
           botonCalcular.style.display = "block";
       } else if (document.getElementById("modificarMascara").checked) {
           entradaHostsDiv.style.display = "none";
           entradaNuevaMascaraDiv.style.display = "block";
        //    botonBuscar.style.display = "none";  yo diría que el botón de buscar se muestre en todo momento
           botonCalcular.style.display = "block";
       } else {
           entradaHostsDiv.style.display = "none";
           entradaNuevaMascaraDiv.style.display = "none";
           botonBuscar.style.display = "block";
           botonCalcular.style.display = "none";
       }
   }


// Función para obtener el texto de características
function obtenerTextoCaracteristicas() {
    const mascaraClase = obtenerMascaraClase(IPObj.clase);
    console.log(IPObj.bits);
    IPObj.mostrarMascaraPorBits();
    
    // Si la red no está subneteada
    if (IPObj.bits === mascaraClase) {
        IPObj.datosIPoriginal();
        return `
            <h4>Caracteristicas de la Red</h4><br>
            <p>- Dirección de Clase: ${IPObj.clase}</p>
            <p>- Dirección IP: ${IPObj.IP}</p>
            <p>- Red: ${IPObj.red}</p>
            <p>- IP Inicio: ${IPObj.IPInicio}</p>
            <p>- IP Final: ${IPObj.IPFinal}</p>
            <p>- IP Broadcast: ${IPObj.IPBroadcast} </p>
            <p>- # de Hosts en la Red: ${IPObj.hosts} </p>
            <p>- Máscara de Red en Bits: ${IPObj.mascaraBin}</p>
            <p>- Máscara de Red en Decimal: ${IPObj.mascaraDecimal}</p>
        `;
    } 
    // Subneteo de red
    else {
            IPObj.subNeteo();
            if(IPObj.bits < 31) {
                    return `
                    <h4>Caracteristicas de la Red</h4>
                    <p>La dirección IP está subneteada.</p>
                    <p>Datos de la dirección IP subneteada:</p>
                    <ul>
                        <li>Dirección IP: ${IPObj.IP}</li>
                        <li>Máscara de Red en Bits: ${IPObj.mascaraBin}/${IPObj.bits} </li>
                        <li>Máscara de Red en Decimal: ${IPObj.mascaraDecimal}/${IPObj.bits} </li>
                    </ul>
                    <p>Los datos de la IP de SubRed son:</p>
                    <ul>
                        <li>Saltos --> ${IPObj.saltos}</li>
                        <li>IP de SubRed: ${IPObj.red} </li>
                        <li>IP Inicio: ${IPObj.IPInicio}</li>
                        <li>IP Final: ${IPObj.IPFinal}</li>
                        <li>IP Broadcast: ${IPObj.IPBroadcast}</li>
                        <li># de Hosts: ${IPObj.hosts}</li>
                    </ul>
                `;
            }
            // Si la red quiere una máscara de 31 bits
            else if(IPObj.bits == 31) {
                return `
                <h4>Caracteristicas de la Red</h4>
                <p>La dirección IP está subneteada.</p>
                <p>Datos de la dirección IP subneteada:</p>
                <ul>
                    <li>Dirección IP: ${IPObj.IP}</li>
                    <li>Máscara de Red en Bits: ${IPObj.mascaraBin}/${IPObj.bits} </li>
                    <li>Máscara de Red en Decimal: ${IPObj.mascaraDecimal}/${IPObj.bits} </li>
                </ul>
                <p>Los datos de la IP de SubRed son:</p>
                <ul>
                    <li>Saltos --> ${IPObj.saltos}</li>
                    <li>IP de SubRed: ${IPObj.red} </li>
                    <li>IP Broadcast: ${IPObj.IPBroadcast}</li>
                    <li># de Hosts: ${IPObj.hosts}</li>
                </ul>
            `;
            }
            // Si la red requiere una máscara de 32 bits
            else if(IPObj.bits == 32) {
                    return `
                    <h4>Caracteristicas de la Red</h4>
                    <p>La dirección IP está subneteada.</p>
                    <p>Datos de la dirección IP subneteada:</p>
                    <ul>
                        <li>Dirección IP: ${IPObj.IP}</li>
                        <li>Máscara de Red en Bits: ${IPObj.mascaraBin}/${IPObj.bits} </li>
                        <li>Máscara de Red en Decimal: ${IPObj.mascaraDecimal}/${IPObj.bits} </li>
                    </ul>
                `;
            }
    }
 }
 
 // Función para obtener la información de las subredes que se generan
 function subredesInfo(IP, indice) {
    return `
         <ul>
             <li>Subred #${indice} </li>
             <ul>
                 <li>IP de SubRed: ${IP.red} </li>
                 <li>IP Inicio: ${IP.IPInicio}</li>
                 <li>IP Final: ${IP.IPFinal}</li>
                 <li>IP Broadcast: ${IP.IPBroadcast}</li>
             </ul>
        </ul>
    `;
 }

// Características generales de la red subneteada
function subredesText() {
    return `
    <ul>
        <li>Datos de las subredes: </li>
        <ul>
            <li>Necesitamos agregar----> ${IPObj.bitsAgregar} bits a la parte del host, ya que 2^${IPObj.bitsAgregar} = ${Math.pow(2, IPObj.bitsAgregar)}</li> </li>
            <li>La máscara de SubRed en formato binario es: ${IPObj.mascaraSubnetBin} </li>
            <li>La máscara de SubRed en formato decimal es: ${IPObj.mascaraSubnetDec} </li>
            <li>Hosts de Subred ---> ${IPObj.hostSubred} </li>
            <li>Subredes ---> ${IPObj.numSubredes} </li>
            <li>Total de Hosts ---> ${IPObj.totalHosts} </li>
            <li>Saltos ---> ${IPObj.saltosText} </li>
        </ul>
    </ul>
    <p>&nbsp;</p>
    `;
}