// Reglas de negocio puras (sin base de datos ni Express) para poder probarlas de forma unitaria.

const ROLES = { ESTUDIANTE: 1, DOCENTE: 2, COORDINADOR: 3 };
const TAMANO_MAXIMO_PDF = 10 * 1024 * 1024; // 10 MB (acuerdo del Sprint Review)
const TOTAL_FASES = 4; // Anteproyecto, Desarrollo, Dictamen, Examen
const FASE_EXAMEN = 4;
const DICTAMENES_VALIDOS = ['APROBADO', 'CON_OBSERVACIONES', 'RECHAZADO'];

const MESES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

/** Solo se aceptan correos institucionales de la UdeG (alumnos, académicos, docentes, administración). */
function esCorreoInstitucional(correo) {
  if (typeof correo !== 'string') return false;
  return /^[^\s@]+@([a-z0-9-]+\.)*udg\.mx$/i.test(correo.trim());
}

/** Un archivo es PDF si su tipo MIME es application/pdf y su extensión es .pdf. */
function esPDF(archivo) {
  if (!archivo || typeof archivo.originalname !== 'string') return false;
  return archivo.mimetype === 'application/pdf' && /\.pdf$/i.test(archivo.originalname);
}

/** El peso debe ser mayor a 0 y no exceder 10 MB. */
function pesoValido(bytes) {
  return Number.isFinite(bytes) && bytes > 0 && bytes <= TAMANO_MAXIMO_PDF;
}

/** 1536000 -> "1.46 MB" */
function formatearTamano(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Cantidad de entregas previas del mismo hito -> versión correlativa ("v1.0", "v2.0", ...). */
function siguienteVersion(entregasPrevias) {
  const n = Number.isInteger(entregasPrevias) && entregasPrevias > 0 ? entregasPrevias : 0;
  return `v${n + 1}.0`;
}

/**
 * HU-04: el dictamen debe ser uno de los 3 valores permitidos y llevar comentario.
 * El esquema define dictamenes.comentario como NOT NULL ("justificación obligatoria").
 */
function validarDictamen({ dictamen, comentario } = {}) {
  if (!DICTAMENES_VALIDOS.includes(dictamen)) {
    return { valido: false, error: 'El dictamen debe ser APROBADO, CON_OBSERVACIONES o RECHAZADO' };
  }
  if (typeof comentario !== 'string' || comentario.trim().length === 0) {
    return { valido: false, error: 'Debes redactar una justificación para emitir el dictamen' };
  }
  return { valido: true };
}

/** Avanza una fase sin pasar de la última (Examen). */
function siguienteFase(faseActual) {
  return Math.min(faseActual + 1, TOTAL_FASES);
}

/** Porcentaje de la línea de tiempo según la fase actual: fase 1 = 0 %, fase 4 = 75 %. */
function porcentajePorFase(fase) {
  return Math.round(((fase - 1) / TOTAL_FASES) * 100);
}

/** HU-07: solo se agenda examen con dictamen aprobatorio y sin observaciones pendientes. */
function puedeAgendarExamen(proyecto) {
  if (!proyecto) return false;
  if (['CON_OBSERVACIONES', 'RECHAZADO'].includes(proyecto.estado)) return false;
  return proyecto.estado === 'DICTAMEN_APROBADO' || proyecto.fase_actual_id >= FASE_EXAMEN;
}

/** "10:00 AM - 11:30 AM" -> { inicio: "10:00:00", fin: "11:30:00" } (formato del frontend). */
function parsearHorario(texto) {
  if (typeof texto !== 'string') return null;
  const partes = texto.split('-').map((p) => p.trim());
  if (partes.length !== 2) return null;

  const a24 = (h) => {
    const m = h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return null;
    let horas = parseInt(m[1], 10);
    const minutos = parseInt(m[2], 10);
    const sufijo = m[3] ? m[3].toUpperCase() : null;
    if (minutos > 59 || horas > 23 || (sufijo && (horas < 1 || horas > 12))) return null;
    if (sufijo === 'PM' && horas !== 12) horas += 12;
    if (sufijo === 'AM' && horas === 12) horas = 0;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
  };

  const inicio = a24(partes[0]);
  const fin = a24(partes[1]);
  if (!inicio || !fin || inicio >= fin) return null;
  return { inicio, fin };
}

/** "11 de Noviembre de 2026" o "2026-11-11" -> "2026-11-11". */
function parsearFecha(texto) {
  if (typeof texto !== 'string') return null;
  const t = texto.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;

  const m = t.match(/^(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})$/i);
  if (!m) return null;
  const mes = MESES[m[2].toLowerCase()];
  const dia = parseInt(m[1], 10);
  if (!mes || dia < 1 || dia > 31) return null;
  return `${m[3]}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

module.exports = {
  ROLES,
  TAMANO_MAXIMO_PDF,
  FASE_EXAMEN,
  esCorreoInstitucional,
  esPDF,
  pesoValido,
  formatearTamano,
  siguienteVersion,
  validarDictamen,
  siguienteFase,
  porcentajePorFase,
  puedeAgendarExamen,
  parsearHorario,
  parsearFecha,
};
