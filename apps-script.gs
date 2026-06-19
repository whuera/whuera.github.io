/**
 * Google Apps Script — Receptor de datos del modal de bienvenida
 * Versión: GET con parámetros en URL (más confiable sin autenticación)
 *
 * INSTRUCCIONES DE DESPLIEGUE:
 * 1. Abre la hoja de cálculo:
 *    https://docs.google.com/spreadsheets/d/1UNiXI7FDYq7L_74i9ZmWObtYpvaDZljJ2zVbIH-_cfg/edit
 *
 * 2. Ve a  Extensiones → Apps Script
 *
 * 3. Borra TODO el código existente y pega este archivo completo
 *
 * 4. Haz clic en  Implementar → Nueva implementación  (o editar la existente)
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta Google)
 *    - Quién tiene acceso: *** Cualquier persona ***
 *      (NO "Cualquier persona con una cuenta de Google" — debe ser sin restricción)
 *
 * 5. Haz clic en "Implementar"
 *    - Si te pide autorización, acepta todos los permisos
 *    - Copia la URL que aparece al final (termina en /exec)
 *
 * 6. En index.html línea ~706, reemplaza la URL actual con la nueva:
 *    const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/TU_ID/exec';
 *
 * IMPORTANTE: Cada vez que edites este script debes crear una NUEVA implementación.
 */

var SPREADSHEET_ID = '1UNiXI7FDYq7L_74i9ZmWObtYpvaDZljJ2zVbIH-_cfg';

function doGet(e) {
  try {
    var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();

    // Agrega cabeceras si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      var header = sheet.getRange(1, 1, 1, 4);
      header.setValues([['Fecha', 'Nombre', 'Email', 'Empresa']]);
      header.setFontWeight('bold');
      header.setBackground('#4a86e8');
      header.setFontColor('#ffffff');
    }

    var fecha   = e.parameter.fecha   || Utilities.formatDate(new Date(), 'America/Guayaquil', 'dd/MM/yyyy HH:mm:ss');
    var nombre  = e.parameter.nombre  || '';
    var email   = e.parameter.email   || '';
    var empresa = e.parameter.empresa || '';

    sheet.appendRow([fecha, nombre, email, empresa]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función de prueba — ejecútala manualmente desde el editor de Apps Script
// para verificar que el script tiene acceso a la hoja antes de deployar
function testInsert() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha', 'Nombre', 'Email', 'Empresa']);
  }

  sheet.appendRow([
    Utilities.formatDate(new Date(), 'America/Guayaquil', 'dd/MM/yyyy HH:mm:ss'),
    'Prueba Manual',
    'prueba@test.com',
    'Empresa de Prueba'
  ]);

  Logger.log('Fila insertada correctamente en la hoja.');
}
