DROP DATABASE IF EXISTS tesistrack; -- Borra la BD si ya exixte una que se llame igual 
CREATE DATABASE tesistrack			-- Crea una nueva BD con ese nombre
	DEFAULT CHARACTER SET utf8mb4 	-- Permite "ñ" y tildes en nombres y contraseñas
    COLLATE utf8mb4_unicode_ci; 	-- Guarda mas bytes y soporta más caracteres y no distingue mayúsculas de minúsculas 

USE tesistrack;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. TABLA DE ROLES
-- ------------------------------------------------------------
CREATE TABLE roles (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

INSERT INTO roles (nombre) VALUES ('ESTUDIANTE'), ('DOCENTE'), ('COORDINADOR');

-- ------------------------------------------------------------
-- 2. TABLA DE USUARIOS
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_usuarios_id FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. TABLA DE FASES DEL PROCESO DE TITULACIÓN
-- ------------------------------------------------------------
CREATE TABLE fases (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL, -- Anteproyecto, Desarrollo, Dictamen, Examen --
    orden INT NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    PRIMARY KEY(id)
) ENGINE=InnoDB;

INSERT INTO fases (nombre, orden, descripcion) VALUES 
('Anteproyecto', 1, 'Registro e inicio del anteproyecto de titulación'),
('Desarrollo', 2, 'Elaboración del trabajo de investigación y avances'),
('Dictamen', 3, 'Evaluación y aprobación final por parte del comité/sinodales'),
('Examen', 4, 'Defensa de tesis y acto protocolario');

-- ------------------------------------------------------------
-- 4. TABLA HITOS (ESTUDIANTE)
-- ------------------------------------------------------------
CREATE TABLE hitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,          -- Ej: '1.1', '1.2', '2.1'
    nombre VARCHAR(150) NOT NULL,         -- Ej: 'Planteamiento del Problema'
    semana_sugerida VARCHAR(50) NOT NULL, -- Ej: 'Semana 2'
    fecha_limite DATE NOT NULL,
    fase_id INT NOT NULL,
    FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. TABLA DE PROYECTOS / TESIS
-- ------------------------------------------------------------
CREATE TABLE proyectos (
    id INT AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    estudiante_id INT NOT NULL UNIQUE, -- Un estudiante maneja un proyecto activo --
    fase_actual_id INT NOT NULL DEFAULT 1,
    porcentaje_avance INT DEFAULT 0, -- Barra de progreso en la línea de tiempo -- 
    estado ENUM('EN_PROGRESO', 'DICTAMEN_APROBADO', 'CON_OBSERVACIONES', 'RECHAZADO', 'FINALIZADO') DEFAULT 'EN_PROGRESO',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_proyectos_id FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
    CONSTRAINT fk_proyectos_fases FOREIGN KEY (fase_actual_id) REFERENCES fases(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. ASIGNACIÓN DE DOCENTES / ASESORES / SINODALES A PROYECTOS
-- ------------------------------------------------------------
CREATE TABLE proyecto_docentes (
    id INT AUTO_INCREMENT,
    proyecto_id INT NOT NULL,
    docente_id INT NOT NULL,
    tipo_rol ENUM('ASESOR', 'SINODAL') NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_docentes_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    CONSTRAINT fk_docentes_id FOREIGN KEY (docente_id) REFERENCES usuarios(id),
    UNIQUE(proyecto_id, docente_id, tipo_rol)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. TABLA DE ENTREGAS / VERSIONES DE DOCUMENTOS (PDF)
-- ------------------------------------------------------------
CREATE TABLE entregas (
	id INT AUTO_INCREMENT,
    proyecto_id INT NOT NULL,
    fase_id INT NOT NULL,
    hito_id INT NULL,
    codigo VARCHAR(20) NOT NULL, 
    numero_version VARCHAR(10) DEFAULT 'v1.0',
    archivo_url VARCHAR(255) NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    tamano VARCHAR(20) DEFAULT '0 MB',
    estado ENUM('EN_REVISION','CON_OBSERVACIONES','APROBADO') DEFAULT 'EN_REVISION',
    fecha_limite DATE NULL, 
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_entregas_proyectos FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    CONSTRAINT fk_entregas_fases FOREIGN KEY (fase_id) REFERENCES fases(id),
    CONSTRAINT fk_entregas_hitos FOREIGN KEY (hito_id) REFERENCES hitos(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. TABLA DE DICTÁMENES Y OBSERVACIONES DE DOCENTES
-- ------------------------------------------------------------
CREATE TABLE dictamenes (
    id INT AUTO_INCREMENT,
    entrega_id INT NOT NULL,
    docente_id INT NOT NULL,
    dictamen ENUM('APROBADO', 'CON_OBSERVACIONES', 'RECHAZADO') NOT NULL,
    comentario TEXT NOT NULL, -- Justificación obligatoria --
    fecha_dictamen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_dictamenes_entregas FOREIGN KEY (entrega_id) REFERENCES entregas(id) ON DELETE CASCADE,
    CONSTRAINT fk_dictamenes_id FOREIGN KEY (docente_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. TABLA DE NOTIFICACIONES
-- ------------------------------------------------------------
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('GENERAL', 'ENTREGA', 'EXAMEN', 'REVISOR', 'DICTAMEN') DEFAULT 'GENERAL', -- Tipo de alerta --
    mensaje VARCHAR(255) NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_notificaciones_id FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. TABLA DE DISPONIBILIDAD DE HORARIOS DE DOCENTES
-- ------------------------------------------------------------
CREATE TABLE disponibilidad_docentes (
    id INT AUTO_INCREMENT,
    docente_id INT NOT NULL,
    fecha_disponible DATE NOT NULL, 
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    modalidad VARCHAR(50) DEFAULT 'Presencial',
    ubicacion VARCHAR(150) DEFAULT 'Auditorio A - Edificio B',
    disponible BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(id),
    CONSTRAINT fk_disponibilidad_id FOREIGN KEY (docente_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. TABLA DE SOLICITUDES / AGENDADO DE EXAMEN DE TITULACIÓN
-- ------------------------------------------------------------
CREATE TABLE solicitudes_examen (
    id INT AUTO_INCREMENT,
    proyecto_id INT NOT NULL,
    disponibilidad_id INT NULL, -- Enlace directo al bloque seleccionado --
    opciones_horario INT CHECK (opciones_horario IN (1, 2, 3)), -- 3 opciones de postulación --
    fecha_propuesta DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    modalidad VARCHAR(50) DEFAULT 'Presencial',
    ubicacion VARCHAR(150) DEFAULT 'Auditorio A - Edificio B',
    estado ENUM('PENDIENTE', 'CONFIRMADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_solicitudes_id FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    CONSTRAINT fk_solicitudes_disp FOREIGN KEY (disponibilidad_id) REFERENCES disponibilidad_docentes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 12. TABLA DE ACTAS OFICIALES Y CÓDIGO QR
-- ------------------------------------------------------------
CREATE TABLE actas (
    id INT AUTO_INCREMENT,
    proyecto_id INT NOT NULL UNIQUE,
    folio VARCHAR(50) NOT NULL UNIQUE,
    codigo_qr_hash VARCHAR(255) NOT NULL,
    archivo_acta_url VARCHAR(255) NULL, -- URL para el botón "Descargar Acta" --
    fecha_expedicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_actas_id FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;