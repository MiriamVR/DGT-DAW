"use strict";

// Clase DGT Forma Nueva --------------------------------------------------------------------------------------
class DGT {
    constructor(){ // Constructor
        this.multas = [];
        this.personas = [];
    }


    // AltaConductor da de alta a un conductor
    altaConductor(oConductor){
        let oConductorExistente = null;

        oConductorExistente = _buscarConductor(oConductor.NIF);

        if(oConductorExistente == null){
            this.personas.push(oConductor);
            return true;
        }else{
        
            return false;
        }
    }
    
    // AltaGuardiaCivil da de alta a un conductor
    altaGuardiaCivil(oGuardiaCivil){
        let oGuardiaCivilExistente = null;

        oGuardiaCivilExistente = _buscarGuardia(oGuardiaCivil.NIF);

        if(oGuardiaCivilExistente == null){
            this.personas.push(oGuardiaCivil);
            return true;
        }else{
            
            return false;
        }
    }

    // registrarMulta nos registra una nueva multa
    registrarMulta(oMulta){
        let oMultaExistente = null;

        oMultaExistente = _buscarMulta(oMulta.idMulta);

        if(oMultaExistente == null){
            this.multas.push(oMulta);
            return true;
        }else{
            
            return false;
        }
    }

    // pagarMulta paga una multa que ya exista
    pagarMulta(idMulta){
        let oMultaExistente = null;

        oMultaExistente = _buscarMulta(idMulta);

        if(oMultaExistente == null){
            alert("Multa no registrada.");
           
        }else if(oMultaExistente !=null && oMultaExistente.pagada == true){
            alert("Multa pagada anteriormente.");

        }else{
            oMultaExistente.pagada = true;
            alert("La multa ha sido pagada correctamente.");
            ocultarFormularios();
        }
        
    }

    // listadoSaldoConductor nos saca los conductores y su saldo
    listadoSaldoConductor(){
        let sTabla = '<table border="1">';

        sTabla += "<thead><tr>";
        sTabla += "<th>NIF</th>";
        sTabla += "<th>Saldo pendiente</th>";
        sTabla += "</tr></thread>";

        // ABRE body tabla
        sTabla += "<tbody>";

        let oConductor = this.personas.filter(oP => oP instanceof Conductor);
        
        for(let i = 0; i<oConductor.length; i++){
            let saldo = 0;

            let multasPendientes = this.multas.filter(oP => oP.NIFConductor == oConductor[i].NIF && oP.pagada == false);

            if(multasPendientes.length != 0){
                sTabla += "<tr><td>"+oConductor[i].NIF;
             
            for(let j = 0; j<multasPendientes.length; j++){

                if(multasPendientes[j] instanceof Leve && multasPendientes[j].bonificada ==true){
                    saldo += multasPendientes[j].importe - (multasPendientes[j].importe*0.25);
                }else{
                    
                    saldo += multasPendientes[j].importe;
                }
                
            }
            sTabla += "</td><td>"+saldo+" €</td></tr>";

            }
        }
        sTabla += "</tbody><table>";
        
        return sTabla;
    }

    // listadoPuntosConductor nos saca los conductores y su saldo
    listadoPuntosConductor(){
        let sTabla = '<table border="1">';

        sTabla += "<thead><tr>";
        sTabla += "<th>NIF</th>";
        sTabla += "<th>Total Puntos</th>";
        sTabla += "</tr></thread>";

         // ABRE body tabla
        sTabla += "<tbody>";

        let oConductor = this.personas.filter(oP => oP instanceof Conductor);
        let multasGraves = this.multas.filter(oP => oP instanceof Grave );

        for(let k = 0; k<oConductor.length; k++){
            let sumPuntos = 0;

            for(let x = 0; x<multasGraves.length; x++){
                
                if(oConductor[k].NIF == multasGraves[x].NIFConductor){
                    sumPuntos = sumPuntos + multasGraves[x].puntos;
                }
            }
            if(sumPuntos>0){
                sTabla += "<tr><td>"+oConductor[k].NIF+"</td>";
                sTabla += "<td>"+sumPuntos+"</td></tr>";
            }
            
        }
        sTabla += "</tbody></table>";

        return sTabla;
    }

    // listadoMultasPorGuardia genera un listado con los datos básicos de un guardia  y  el  numero  e  importe  total  de  multas  que  ha impuesto 
    listadoMultasPorGuardia(){
        let sTabla = '<table border="1"';

        sTabla += "<thread><tr>";
        sTabla += "<th>NIF</th>";
        sTabla += "<th>Nombre</th>";
        sTabla += "<th>Apellidos</th>";
        sTabla += "<th>Puesto</th>";
        sTabla += "<th>Número</th>";
        sTabla += "<th>Importe Total</th>";
        sTabla += "</tr></thread>";

        // ABRE body tabla
        sTabla += "<tbody>";

        let oGuardiaCivil = this.personas.filter(oP => oP instanceof GuardiaCivil);

        for(let i = 0; i< oGuardiaCivil.length; i++){
            let importeTotal = 0;
            let contador = 0;
            for(let j = 0; j<this.multas.length; j++){
                
                if(this.multas[j].NIFGuardia == oGuardiaCivil[i].NIF){
                    if(this.multas[j] instanceof Leve && this.multas[j].bonificada == true){
                        importeTotal += this.multas[j].importe - (this.multas[j].importe*0.25);
                    }else{
                        importeTotal += this.multas[j].importe;
                    }
                    
                    contador++;
                }
            }

            if(contador >0){
                // Saca el guardia
                sTabla += "<tr><td>"+oGuardiaCivil[i].NIF+"</td>";
                sTabla += "<td>"+oGuardiaCivil[i].nombre+"</td>";
                sTabla += "<td>"+oGuardiaCivil[i].apellidos+"</td>";
                sTabla += "<td>"+oGuardiaCivil[i].puesto+"</td>";
                sTabla += "<td>"+contador+"</td>";
                sTabla += "<td>"+importeTotal+" €</td></tr>";
            }
        }
        sTabla += "</tbody></table>";

        return sTabla;
    }

    listadoMultasPorFecha(fechaIni, fechaFin){
        
        //listadoMultasPorFecha –Realiza  un  listado  resumen  con  los  idMulta,  fecha  e importe de todas las multas entre las fechas dadas. Debe aparecer el importe total de todas las multas entre ambas fechas.
            let sTabla = '<table border="1">';
            sTabla += "<thread><tr>";
            sTabla += "<th>ID Multa</th>";
            sTabla += "<th>Fecha</th>";
            sTabla += "<th>Importe</th>";
            sTabla += "<th>Importe Total</th>";
            sTabla += "</tr></thread>";

            // ABRE el body tabla
            sTabla += "<tbody>";

        let importeTotal=0;

        for(let i = 0; i <this.multas.length; i++){
            if(this.multas[i].fecha >= Date.parse(fechaIni) && this.multas[i].fecha<= Date.parse(fechaFin)){

                var fecha = _formatearFecha(this.multas[i].fecha);

                sTabla+="<tr><td>"+this.multas[i].idMulta+"</td>";
                sTabla+="<td>"+fecha+"</td>";
                sTabla+="<td>"+this.multas[i].importe+" €</td>";
                sTabla+="<td>"+"-"+"</td></tr>";
                

                
                
                importeTotal+=this.multas[i].importe;
                
            }
        }

            sTabla+="<tr><td>"+"-"+"</td>";
            sTabla+="<td>"+"-"+"</td>";
            sTabla+="<td>"+"-"+"</td>";
            sTabla+="<td>"+importeTotal+" €</td></tr>"
            sTabla+="</tbody></table>"
            
            return sTabla;
        }

    // listadoConductores saca un listado con todos los datos de los conductores
    listadoConductores(){
        
        let sTabla = '<table border="1">';

        sTabla += "<thread><tr>";
        sTabla += "<th>NIF</th>";
        sTabla += "<th>Nombre</th>";
        sTabla += "<th>Apellidos</th>";
        sTabla += "<th>Direccion</th>";
        sTabla += "<th>Caducidad Carnet</th></tr></thread>";

        let oConductor = this.personas.filter(oP => oP instanceof Conductor);
        
        sTabla += "<tbody>";

        for (let oP of oConductor){
            sTabla += oP.toHTMLRow()+"</tr>";
        }
        sTabla += "</tr></tbody></table>";

        return sTabla;
    }

    listadoGuardiaCiviles(){
        let sTabla = '<table border="1"';

        sTabla += "<thread><tr>";
        sTabla += "<th>NIF</th>";
        sTabla += "<th>Nombre</th>";
        sTabla += "<th>Apellidos</th>";
        sTabla += "<th>Direccion</th>";
        sTabla += "<th>Puesto</th></tr>";

        let oGuardiaCivil = this.personas.filter(oP => oP instanceof GuardiaCivil);
        sTabla += "<tbody>";
        
        for(let oP of oGuardiaCivil){
            sTabla += oP.toHTMLRow()+"</tr>";
        }
        sTabla +="</tbody></table>";

        return sTabla;
    }

    // imprimirMulta saca la multa especificada
    imprimirMulta(idMulta){
        let oMultaExistente = null;
       oMultaExistente = _buscarMulta(idMulta);

       if(oMultaExistente==null)
       {
           return false;
       }
       else
       {
           return oMultaExistente;
       }
        
    }
}
// Clase Multa  --------------------------------------------------------------------------------------
class Multa {
    constructor(sIdMulta, sNIFConductor, sNIFGuardia, iImporte, bPagada, sDescripcion, dFecha){
        this.idMulta = sIdMulta;
        this.NIFConductor = sNIFConductor;
        this.NIFGuardia = sNIFGuardia;
        this.importe = iImporte;
        this.pagada = bPagada;
        this.descripcion = sDescripcion;
        this.fecha = dFecha;
    }
}

Multa.prototype.toHTMLRow = function(){
    let sFila = "<tr>";
    sFila += "<td>" + this.idMulta + "</td>";
    sFila += "<td>" + this.NIFConductor + "</td>";
    sFila += "<td>" + this.NIFGuardia + "</td>";
    sFila += "<td>" + this.importe + "</td>";
    sFila += "<td>" + this.pagada + "</td>";
    sFila += "<td>" + this.descripcion + "</td>";
    sFila += "<td>" + this.fecha + "</td>";

    return sFila;
}

// Clase Leve --------------------------------------------------------------------------------------
class Leve extends Multa{
    constructor(idMulta, NIFConductor, NIFGuardia, importe, pagada, descripcion, fecha, bBonificada){
        super(idMulta, NIFConductor, NIFGuardia, importe, pagada, descripcion, fecha);
        this.bonificada = bBonificada;
    }
}

Leve.prototype.toHTMLRow = function(){
    let sFila = "<tr>";
    sFila += "<td>" + this.idMulta + "</td>";
    sFila += "<td>" + this.NIFConductor + "</td>";
    sFila += "<td>" + this.NIFGuardia + "</td>";
    sFila += "<td>" + this.importe + "</td>";
    sFila += "<td>" + this.pagada + "</td>";
    sFila += "<td>" + this.descripcion + "</td>";
    sFila += "<td>" + this.fecha + "</td>";
    sFila += "<td>" + this.bonificada + "</td>";

    return sFila;
}

//Clase Grave --------------------------------------------------------------------------------------
class Grave extends Multa{
    constructor(idMulta, NIFConductor, NIFGuardia, importe, pagada, descripcion, fecha, iPuntos){
        super(idMulta, NIFConductor, NIFGuardia, importe, pagada, descripcion, fecha);
        this.puntos = iPuntos;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7

// Clase Persona Forma Antigua --------------------------------------------------------------------------------------
function Persona(sNIF, sNombre, sApellidos, sDireccion){
    this.NIF = sNIF;
    this.nombre = sNombre;
    this.apellidos = sApellidos;
    this.direccion = sDireccion;
}

// Funciones de la clase Persona ------------------------------------------------------------------------------------
Persona.prototype.toHTMLRow = function(){
    let sFila = "<tr>";
    sFila += "<td>" + this.NIF +"</td>";
    sFila += "<td>" + this.nombre +"</td>";
    sFila += "<td>" + this.apellidos + "</td>";
    sFila += "<td>" + this.direccion + "</td>";

    return sFila;
}

// Clase Conductor Forma Antigua ---------------------------------------------------------------------------------------
function Conductor(sNIF, sNombre, sApellidos, sDireccion, dCaducidadCarnet){
    Persona.call(this, sNIF, sNombre, sApellidos, sDireccion); // Herencia de Persona
    this.caducidadCarnet = dCaducidadCarnet; // Nuevo atributo sólo de conductor
}

// Código para que la clase Conductor contenga la herencia y los métodos
Conductor.prototype = Object.create(Persona.prototype);
Conductor.prototype.constructor = Conductor;

Conductor.prototype.toHTMLRow = function(){
    let sFila = "<tr>";
    var fecha = _formatearFecha(this.caducidadCarnet);
    sFila += "<td>" + this.NIF + "</td>";
    sFila += "<td>" + this.nombre + "</td>";
    sFila += "<td>" + this.apellidos + "</td>";
    sFila += "<td>" + this.direccion + "</td>";
    sFila += "<td>" + fecha + "</td>";

    return sFila;
}


// Clase GuardiaCivil Forma Antigua --------------------------------------------------------------------------------------
function GuardiaCivil(sNIF, sNombre, sApellidos, sDireccion, sPuesto){
    Persona.call(this, sNIF, sNombre, sApellidos, sDireccion); // Herencia de Persona
    this.puesto = sPuesto; // Nuevo atributo sólo de guardia

}

// Código para que la clase GuardiaCivil contenga la herencia y los métodos
GuardiaCivil.prototype = Object.create(Persona.prototype);
GuardiaCivil.prototype.constructor = GuardiaCivil;

GuardiaCivil.prototype.toHTMLRow = function(){
    let sFila = "<tr>";
    sFila += "<td>" + this.NIF + "</td>";
    sFila += "<td>" + this.nombre + "</td>";
    sFila += "<td>" + this.apellidos + "</td>";
    sFila += "<td>" + this.direccion + "</td>";
    sFila += "<td>" + this.puesto + "</td>";

    return sFila;
}

