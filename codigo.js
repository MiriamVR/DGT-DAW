"use strict";

// Programa principal ***********************
var oDGT = new DGT();

// ocultarFormularios(); 
ocultarFormularios();

// Oculta los formularios por defecto -----------------------------------------------------------------------------------------------
function ocultarFormularios() {
  formAltaConductor.style.display = "none";
  formRegistroMulta.style.display = "none";
  formPagarMulta.style.display = "none";
  formImprimirMulta.style.display = "none";
  formListarMultasFecha.style.display = "none";
  document.getElementById("titulo").innerHTML = "";
  document.getElementById("areaListado").innerHTML = "";
}


// Muestra el formulario de Alta Persona -----------------------------------------------------------------------------------------------
function mostrarAltaPersona() {
  ocultarFormularios();
  formAltaConductor.style.display = "block";
}

// Muestra el formulario de Registro Multa -----------------------------------------------------------------------------------------------
function mostrarRegistroMulta() {
  ocultarFormularios();
  formRegistroMulta.style.display = "block";
}

// Muestra el formulario de Pagar Multa -----------------------------------------------------------------------------------------------
function mostrarPagarMulta() {
  ocultarFormularios();
  formPagarMulta.style.display = "block";
}

// Muestra el formulario de Imprimir Multa -----------------------------------------------------------------------------------------------
function mostrarImprimirMulta() {
  ocultarFormularios();
  formImprimirMulta.style.display = "block";
}

//Muestra el formulario para elegir dis fechas y mostrar un listado de multas entre esas fechas
function mostrarListadoMultasPorFecha() {
  ocultarFormularios();
  formListarMultasFecha.style.display = "block";
}

// Acepta el Alta de la persona creada -----------------------------------------------------------------------------------------------
function aceptarAltaPersona() {
  let sNIF = formAltaConductor.txtNIF.value.trim();
  let sNombre = formAltaConductor.txtNombre.value.trim();
  let sApellidos = formAltaConductor.txtApellidos.value.trim();
  let sDireccion = formAltaConductor.txtDireccion.value.trim();
  let sCaducidad = Date.parse(formAltaConductor.txtCaducidadCarnet.value.trim());
  let sPuesto = formAltaConductor.txtPuestoGuardia.value.trim() + "";
  console.log(formAltaConductor.txtCaducidadCarnet.value.trim());
  if (sPuesto != "" && isNaN(sCaducidad) == false) {
    let oCG = new Conductor(sNIF, sNombre, sApellidos, sDireccion, sCaducidad);
    if (oDGT.altaConductor(oCG)) {
      alert("El conductor ha sido dado de alta correctamente");
      ocultarFormularios();
    }
    else {
      alert("Este conductor ya está registrado");
    }

    let oGC = new GuardiaCivil(sNIF, sNombre, sApellidos, sDireccion, sPuesto);
    if (oDGT.altaGuardiaCivil(oGC)) {
      alert("El guardia civil ha sido dado de alta correctamente");
      ocultarFormularios();
    }
    else {
      alert("Este guardia civil ya está registrado");
    }
  }
  else if (sPuesto == "" && isNaN(sCaducidad) == false) {
    let oC = new Conductor(sNIF, sNombre, sApellidos, sDireccion, sCaducidad);
    if (oDGT.altaConductor(oC)) {
      alert("El conductor ha sido dado de alta correctamente");
      ocultarFormularios();
    }
    else {
      alert("Este conductor ya está registrado");
    }
  } else if (sPuesto != "" && isNaN(sCaducidad) == true) {
    let oP = new GuardiaCivil(sNIF, sNombre, sApellidos, sDireccion, sPuesto);
    if (oDGT.altaGuardiaCivil(oP)) {
      alert("El guardia civil ha sido dado de alta correctamente");
      ocultarFormularios();
    }
    else {
      alert("Este guardia civil ya está registrado");
    }
  } else {
    alert("Rellene los datos para continuar");
  }
}

// Acepta el Alta de la multa -----------------------------------------------------------------------------------------------
function aceptarAltaMulta() {
  let sIdMulta = formRegistroMulta.txtIdMulta.value.trim();
  let sNIFConductor = formRegistroMulta.txtNIFConductor.value.trim();
  let sNIFGuardia = formRegistroMulta.txtNIFGuardia.value.trim();
  let sImporte = parseFloat(formRegistroMulta.txtImporteMulta.value.trim());
  let sPagada = false;
  let sDescripcion = formRegistroMulta.txtDescripcion.value;
  let sFecha = formRegistroMulta.txtFechaMulta.value;

  let sConductor = null;
  sConductor = _buscarConductor(sNIFConductor);
  let sGuardia = null;
  sGuardia = _buscarGuardia(sNIFGuardia);

  if (sConductor == null) {
    alert("El conductor no está registrado");
  }
  else if (sGuardia == null) {
    alert("El guardia civil no está registrado");
  }
  else {
    let oMulta;
    if (formRegistroMulta.rbTipoMulta.value == "leve") {
      let sBonificada = false;
      if (formRegistroMulta.ckMultaBonif.checked) {
        sBonificada = true;
      }
      oMulta = new Leve(sIdMulta, sNIFConductor, sNIFGuardia, sImporte, sPagada, sDescripcion, sFecha, sBonificada);
    } else {
      let sPuntos = formRegistroMulta.txtPtosSustraidos.value.trim();
      oMulta = new Grave(sIdMulta, sNIFConductor, sNIFGuardia, sImporte, sPagada, sDescripcion, sFecha, sPuntos);
    }

    if (oDGT.registrarMulta(oMulta)) {
      alert("La multa se ha registrado correctamente");
      ocultarFormularios();
    } else {
      alert("Esta multa ya ha sido registrada");
    }
  }
}

// Pagar Multa
function aceptarPagarMulta() {
  let idMultaBuscada = formPagarMulta.txtIdMulta.value.trim();

  if (formPagarMulta.ckMultaPagada.checked) {
    oDGT.pagarMulta(idMultaBuscada);
  }
  else {
    alert("La casilla debe estar seleccionada para cambiar el estado de la multa a pagado")
  }
}

//////////////////////////////////////////////////////////////////////////////

// Para mostrar los listados -----------------------------------------------


function mostrarListadoSaldoConductor() {
  ocultarFormularios();
  let sListado = oDGT.listadoSaldoConductor();
  document.getElementById("areaListado").innerHTML = sListado;
  document.getElementById("titulo").innerHTML = "Listado Conductores Saldo Pendiente";
}

function mostrarListadoPuntosConductor() {
  ocultarFormularios();
  let sListado = oDGT.listadoPuntosConductor();
  document.getElementById("titulo").innerHTML = "Listado Puntos Multa por Conductor";
  document.getElementById("areaListado").innerHTML = sListado;
}

function mostrarListadoMultasPorGuardia() {
  ocultarFormularios();
  let sListado = oDGT.listadoMultasPorGuardia();
  document.getElementById("titulo").innerHTML = "Listado Multas por Guardia";
  document.getElementById("areaListado").innerHTML = sListado;

}

function botonListarMultasPorFechas() {
  ocultarFormularios();

  let fechaInicial = formListarMultasFecha.txtFechaInicio.value;
  let fechaFinal = formListarMultasFecha.txtFechaFin.value;

  let sListado = oDGT.listadoMultasPorFecha(fechaInicial, fechaFinal);

  document.getElementById("titulo").innerHTML = "Listado de Multas por Fechas";
  document.getElementById("areaListado").innerHTML = sListado;
}

function mostrarListadoConductores() {
  ocultarFormularios();
  let sListado = oDGT.listadoConductores();
  document.getElementById("titulo").innerHTML = "Listado Conductores";
  document.getElementById("areaListado").innerHTML = sListado;
}

function mostrarListadoGuardias() {
  ocultarFormularios();
  let sListado = oDGT.listadoGuardiaCiviles();
  document.getElementById("titulo").innerHTML = "Listado Guardias Civiles";
  document.getElementById("areaListado").innerHTML = sListado;
}

////////////////////////////////////////////////////////////////////////////////////////

// Para imprimir la multa ---------------------------------------------------------------------------------------
function botonImprimirMulta() {
  let oMultaBuscada = null;
  let idMultaDada = formImprimirMulta.txtIdMulta.value.trim();
  oMultaBuscada = _buscarMulta(idMultaDada);

  if (oMultaBuscada == null) {
    alert("Esta multa no existe");

  } else {
    var fecha = _formatearFecha(oMultaBuscada.fecha);
    var multa = window.open("plantillaMulta.html");
    multa.document.write('<head><title>Multa</title><meta charset="utf-8"></head>');


    if (oMultaBuscada instanceof Leve) {
      multa.document.write('<h1>Multa</h1>');
      multa.document.write('<table border="1">');
      multa.document.write('<tr>');
      multa.document.write('<td>ID Multa</td><td id="idMulta">' + oMultaBuscada.idMulta + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>NIF Conductor</td><td id="nifConductor">' + oMultaBuscada.NIFConductor + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>NIF Guardia Civil</td><td id="nifGuardia">' + oMultaBuscada.NIFGuardia + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Importe</td><td id="importe">' + oMultaBuscada.importe + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Pagada</td><td id="pagada">');

      if (oMultaBuscada.pagada) {
        multa.document.write("Si");
      } else {
        multa.document.write("No");
      };

      multa.document.write('</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Descripción</td><td id="descripcion">' + oMultaBuscada.descripcion + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Fecha</td><td id="fecha">' + fecha + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Bonificada</td><td id="bonificada">');
      if (oMultaBuscada.bonificada) {
        multa.document.write("Si");
      } else {
        multa.document.write("No");
      };

      multa.document.write('</td>');
      multa.document.write('</tr>');
      multa.document.write('</table>');

    } else {

      multa.document.write('<h1>Multa</h1>');
      multa.document.write('<table border="1">');
      multa.document.write('<tr>');
      multa.document.write('<td>Id Multa</td><td id="idMulta">' + oMultaBuscada.idMulta + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>NIF Conductor</td><td id="nifConductor">' + oMultaBuscada.NIFConductor + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>NIF Guardia Civil</td><td id="nifGuardia">' + oMultaBuscada.NIFGuardia + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Importe</td><td id="importe">' + oMultaBuscada.importe + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Pagada</td><td id="pagada">');

      if (oMultaBuscada.pagada) {
        multa.document.write("Si");
      } else {
        multa.document.write("No");
      };

      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Descripción</td><td id="descripcion">' + oMultaBuscada.descripcion + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Fecha</td><td id="fecha">' + fecha + '</td>');
      multa.document.write('</tr>');
      multa.document.write('<tr>');
      multa.document.write('<td>Puntos</td><td id="puntos">' + oMultaBuscada.puntos + '</td>');
      multa.document.write('</tr>');
      multa.document.write('</table>');
    }
  }
}

// Funciones secundarias (buscar, fechas...)
function _buscarConductor(NIFBuscado) {
  let oConductorExistente = null;

  oConductorExistente = oDGT.personas.find(oConductor => oConductor.NIF == NIFBuscado && oConductor instanceof Conductor);

  return oConductorExistente;
}

function _buscarGuardia(NIFBuscado) {
  let oGuardiaExistente = null;

  oGuardiaExistente = oDGT.personas.find(oGuardia => oGuardia.NIF == NIFBuscado && oGuardia instanceof GuardiaCivil);

  return oGuardiaExistente;
}
function _buscarMulta(idMultaBuscada) {
  let oMultaExistente = null;

  oMultaExistente = oDGT.multas.find(oMulta => oMulta.idMulta == idMultaBuscada);

  return oMultaExistente;
}
function _formatearFecha(fecha) {

  let fechaForm = "";
  var fechaNueva = new Date(fecha);

  var dia = fechaNueva.getDate();
  var mes = fechaNueva.getMonth();
  var anyo = fechaNueva.getFullYear();
  fechaForm += dia + "/" + mes + "/" + anyo;

  return fechaForm;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Datos base ///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


var c1 = new Conductor("11111111A", "Daddy", "Yankee", "Limbo Nº 1", Date.parse("2050-02-01"));
var c2 = new Conductor("11111111B", "Luis", "Fonsi", "Despacito Nº 2", Date.parse("2050-02-02"));
var c3 = new Conductor("11111111C", "J", "Balvin", "Morado Nº 3", Date.parse("2050-03-03"));

oDGT.altaConductor(c1);
oDGT.altaConductor(c2);
oDGT.altaConductor(c3);

var g1 = new GuardiaCivil("11111111D", "C", "Tangana", "Demasiadas Mujeres Nº 4", "Oficial");
var g2 = new GuardiaCivil("11111111E", "Bad", "Bunny", "Oasis Nº 5", "Teneinte");
var g3 = new GuardiaCivil("11111111F", "Juan", "Magán", "Angelito Nº 6", "Sargento");

oDGT.altaGuardiaCivil(g1);
oDGT.altaGuardiaCivil(g2);
oDGT.altaGuardiaCivil(g3);

var c4 = new Conductor("11111111G", "Bad", "Gyal", "Alocao Nº 7", Date.parse("2050-04-04"));
var g4 = new GuardiaCivil("11111111G", "Bad", "Gyal", "Alocao Nº 7", "Cabo");
oDGT.altaConductor(c4);
oDGT.altaGuardiaCivil(g4);

var m1 = new Leve("m1", "11111111A", "11111111D", 100.00, false, "Exceso de flow", Date.parse("2020-12-15"), false);
var m2 = new Leve("m2", "11111111B", "11111111E", 100.00, false, "Exceso de flow", Date.parse("2020-12-23"), true);
oDGT.registrarMulta(m1);
oDGT.registrarMulta(m2);

var m3 = new Grave("m3", "11111111C", "11111111D", 500.50, false, "Temeridad en la pista", Date.parse("2020-12-17"), 3);
var m4 = new Grave("m4", "11111111A", "11111111E", 500.50, false, "Arrebatao", Date.parse("2020-12-07"), 10);
oDGT.registrarMulta(m3);
oDGT.registrarMulta(m4);