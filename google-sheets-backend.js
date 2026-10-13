/**
 * =======================================================================
 * GOOGLE APPS SCRIPT - BASE DE DATOS EN LA NUBE PARA LA REVELACIÓN DE SEXO
 * =======================================================================
 * Este script convierte una simple Hoja de Cálculo de Google (Google Sheets)
 * en una Base de Datos en Tiempo Real 100% GRATUITA y permanente.
 *
 * Con esto:
 * 1. Cuando cualquier persona vote desde su celular, el voto se guarda en la nube
 *    y todas las demás personas del mundo verán el porcentaje actualizado.
 * 2. Cada confirmación de asistencia (RSVP) se guardará automáticamente en tu
 *    hoja de Google Sheets con nombre, teléfono, acompañantes, votos y dedicatorias.
 *
 * -----------------------------------------------------------------------
 * PASOS PARA ACTIVARLO EN 2 MINUTOS:
 * -----------------------------------------------------------------------
 * 1. Entra a https://sheets.new (crea una nueva hoja de cálculo en tu Google Drive).
 * 2. En el menú superior haz clic en: Extensiones > Apps Script.
 * 3. Borra todo el código que aparezca allí y PEGA TODO ESTE ARCHIVO.
 * 4. Arriba a la derecha, haz clic en el botón azul: "Implementar" > "Nueva implementación".
 * 5. Haz clic en el ícono de engranaje (⚙️) al lado de "Seleccionar tipo" y elige: "Aplicación web".
 * 6. Configura:
 *    - Descripción: "API Revelacion Sexo"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier usuario" (o "Anyone")  <--- ¡MUY IMPORTANTE!
 * 7. Haz clic en "Implementar", autoriza los permisos de Google.
 * 8. Copia la "URL de la aplicación web" (termina en /exec).
 * 9. Pega esa URL en tu Panel Privado de la invitación (/admin) o en src/config/eventConfig.js.
 * =======================================================================
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetVotes = getOrCreateSheet(ss, "Votos", ["boy", "girl"]);
    var sheetGuests = getOrCreateSheet(ss, "Invitados", [
      "ID Pase", "Nombre Completo", "WhatsApp", "Correo", 
      "¿Asiste?", "Adultos", "Niños", "Acompañantes", 
      "Predicción", "Restricción / Alergia", "Aporte Voluntario", "Dedicatoria", "Fecha"
    ]);

    // Leer Votos
    if (sheetVotes.getLastRow() < 2) {
      sheetVotes.getRange(2, 1, 1, 2).setValues([[0, 0]]);
    }
    var voteValues = sheetVotes.getRange(2, 1, 1, 2).getValues()[0];
    var boyCount = Number(voteValues[0]) || 0;
    var girlCount = Number(voteValues[1]) || 0;

    // Leer Invitados
    var guestList = [];
    var lastRow = sheetGuests.getLastRow();
    var lastCol = Math.max(12, sheetGuests.getLastColumn());
    if (lastRow > 1) {
      var rows = sheetGuests.getRange(2, 1, lastRow - 1, lastCol).getValues();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (r[0]) {
          var companions = r[7] ? String(r[7]).split(', ') : [];
          var hasContribCol = lastCol >= 13;
          guestList.push({
            id: String(r[0]),
            fullName: String(r[1] || ''),
            phone: String(r[2] || ''),
            email: String(r[3] || ''),
            attending: String(r[4] || 'yes'),
            adultsCount: Number(r[5]) || 0,
            childrenCount: Number(r[6]) || 0,
            companions: companions,
            teamVote: String(r[8] || 'boy'),
            dietary: String(r[9] || ''),
            contribution: hasContribCol ? String(r[10] || '') : '',
            message: hasContribCol ? String(r[11] || '') : String(r[10] || ''),
            createdAt: (hasContribCol && r[12]) ? new Date(r[12]).toISOString() : (r[11] ? new Date(r[11]).toISOString() : new Date().toISOString())
          });
        }
      }
    }

    var output = {
      status: "success",
      votes: { boy: boyCount, girl: girlCount },
      guests: guestList
    };

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. REGISTRAR VOTO EN LA NUBE
    if (action === "vote") {
      var sheetVotes = getOrCreateSheet(ss, "Votos", ["boy", "girl"]);
      if (sheetVotes.getLastRow() < 2) {
        sheetVotes.getRange(2, 1, 1, 2).setValues([[0, 0]]);
      }

      var currentVotes = sheetVotes.getRange(2, 1, 1, 2).getValues()[0];
      var boy = Number(currentVotes[0]) || 0;
      var girl = Number(currentVotes[1]) || 0;

      // Si cambió de voto previamente
      if (data.previousVote === "boy" && boy > 0) boy--;
      if (data.previousVote === "girl" && girl > 0) girl--;

      if (data.team === "boy") boy++;
      if (data.team === "girl") girl++;

      sheetVotes.getRange(2, 1, 1, 2).setValues([[boy, girl]]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        votes: { boy: boy, girl: girl }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. REGISTRAR INVITADO / CONFIRMACIÓN RSVP EN LA NUBE
    if (action === "rsvp") {
      var g = data.guest;
      var sheetGuests = getOrCreateSheet(ss, "Invitados", [
        "ID Pase", "Nombre Completo", "WhatsApp", "Correo", 
        "¿Asiste?", "Adultos", "Niños", "Acompañantes", 
        "Predicción", "Restricción / Alergia", "Aporte Voluntario", "Dedicatoria", "Fecha"
      ]);

      var companionsStr = Array.isArray(g.companions) ? g.companions.join(', ') : (g.companions || '');
      var newRow = [
        g.id,
        g.fullName,
        g.phone,
        g.email || '',
        g.attending || 'yes',
        g.adultsCount || 0,
        g.childrenCount || 0,
        companionsStr,
        g.teamVote || 'boy',
        g.dietary || '',
        g.contribution || '',
        g.message || '',
        new Date().toISOString()
      ];

      // Verificar si ya existía para actualizar o agregar
      var lastRow = sheetGuests.getLastRow();
      var foundRow = 0;
      if (lastRow > 1) {
        var phones = sheetGuests.getRange(2, 3, lastRow - 1, 1).getValues();
        for (var p = 0; p < phones.length; p++) {
          if (String(phones[p][0]) === String(g.phone)) {
            foundRow = p + 2;
            break;
          }
        }
      }

      if (foundRow > 0) {
        sheetGuests.getRange(foundRow, 1, 1, newRow.length).setValues([newRow]);
      } else {
        sheetGuests.appendRow(newRow);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        id: g.id
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. REINICIAR DATOS A CERO
    if (action === "reset_all") {
      var sheetV = getOrCreateSheet(ss, "Votos", ["boy", "girl"]);
      sheetV.getRange(2, 1, 1, 2).setValues([[0, 0]]);

      var sheetG = getOrCreateSheet(ss, "Invitados", [
        "ID Pase", "Nombre Completo", "WhatsApp", "Correo", 
        "¿Asiste?", "Adultos", "Niños", "Acompañantes", 
        "Predicción", "Restricción / Alergia", "Dedicatoria", "Fecha"
      ]);
      if (sheetG.getLastRow() > 1) {
        sheetG.deleteRows(2, sheetG.getLastRow() - 1);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Base de datos reiniciada a cero"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Acción no reconocida"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0 && headers && headers.length > 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
  }
  return sheet;
}
