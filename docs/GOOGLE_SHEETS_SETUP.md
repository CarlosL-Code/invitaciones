# 📊 Integración Gratuita con Google Sheets (Paso a Paso)

Esta configuración permite que cada vez que un invitado confirme su asistencia o vote, se agregue **automáticamente una nueva fila en tiempo real a una hoja de cálculo en tu Google Drive**, sin pagar nada.

---

### Paso 1: Crear la Hoja de Google Sheets
1. Entra a [Google Sheets](https://sheets.google.com) y crea una hoja nueva llamada **"Invitados Revelación - Estefanía y Carlos"**.
2. En la primera fila (Fila 1), coloca los siguientes encabezados en las columnas A a L:
   - **A:** ID Pase
   - **B:** Nombre Completo
   - **C:** WhatsApp
   - **D:** Correo
   - **E:** ¿Asiste?
   - **F:** Adultos
   - **G:** Niños
   - **H:** Acompañantes
   - **I:** Team Votado
   - **J:** Aporte Mesa Dulce
   - **K:** Alergias / Dieta
   - **L:** Dedicatoria

---

### Paso 2: Crear el Script Receptor (Google Apps Script)
1. En la misma hoja de cálculo, haz clic en el menú superior: **Extensiones > Apps Script**.
2. Borra el código existente y pega exactamente este script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'rsvp_submission') {
      var d = payload.data;
      var companions = Array.isArray(d.companions) ? d.companions.join(', ') : (d.companionNames || '');
      
      sheet.appendRow([
        d.id || '',
        d.fullName || '',
        d.phone || '',
        d.email || '',
        d.attending === 'yes' ? 'SÍ' : 'NO',
        d.adultsCount || 0,
        d.childrenCount || 0,
        companions,
        d.teamVote === 'boy' ? 'Niño' : 'Niña',
        d.sharingContribution || 'Solo compañía',
        d.dietary || 'Ninguna',
        d.message || '',
        new Date()
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Haz clic en **Guardar** (ícono de disquete).
4. Arriba a la derecha, haz clic en el botón azul **Implementar > Nueva implementación**.
5. En el engranaje tipo selector, elige **Aplicación web**.
6. Configura lo siguiente:
   - **Descripción:** Receptor RSVP Revelación
   - **Ejecutar como:** Yo (tu correo)
   - **Quién tiene acceso:** **Cualquier persona** (importante para que la web pueda enviar datos).
7. Haz clic en **Implementar**, autoriza los permisos y **copia la URL de la aplicación web** que te entrega (termina en `/exec`).

---

### Paso 3: Conectar la URL en el Proyecto
Abre el archivo `src/config/eventConfig.js` y pega tu URL:

```javascript
  // src/config/eventConfig.js
  cloudSync: {
    enabled: true,
    endpointUrl: "https://script.google.com/macros/s/TU_CODIGO_DE_APPS_SCRIPT/exec", 
  },
```

¡Listo! Cada vez que un invitado llene su confirmación:
1. Se guardará en la nube en tu Google Sheets en vivo.
2. Se enviará a tu WhatsApp con formato elegante.
3. Se guardará en la base de datos local del navegador.
