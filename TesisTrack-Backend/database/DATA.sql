USE tesistrack;
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas si contenían datos previos para evitar duplicados 
TRUNCATE TABLE actas;
TRUNCATE TABLE solicitudes_examen;
TRUNCATE TABLE disponibilidad_docentes;
TRUNCATE TABLE notificaciones;
TRUNCATE TABLE dictamenes;
TRUNCATE TABLE entregas;
TRUNCATE TABLE proyecto_docentes;
TRUNCATE TABLE proyectos;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE hitos;

-- ------------------------------------------------------------
-- 1. INSERTAR HITOS (ENTREGABLES PREDETERMINADOS)
-- ------------------------------------------------------------
INSERT INTO hitos (codigo, nombre, semana_sugerida, fecha_limite, fase_id) VALUES
-- Fase 1: Anteproyecto
('1.1', 'Planteamiento del Problema', 'Semana 2', '2026-09-05', 1),
('1.2', 'Protocolo y Justificación', 'Semana 4', '2026-09-19', 1),
-- Fase 2: Desarrollo
('2.1', 'Marco Teórico y Citación APA 7', 'Semana 6', '2026-10-15', 2),
('2.2', 'Avance de Arquitectura (MVP)', 'Semana 8', '2026-10-29', 2),
('2.3', 'Pruebas y Evaluación Final', 'Semana 10', '2026-11-12', 2),
-- Fase 3: Dictamen
('3.1', 'Asignación de Revisores de Dictamen', 'Semana 11', '2026-11-26', 3),
('3.2', 'Evaluación y Veredicto del Comité', 'Semana 14', '2026-12-03', 3),
-- Fase 4: Examen
('4.1', 'Postulación y Programación de Fecha de Examen', 'Semana 15', '2026-12-10', 4),
('4.2', 'Defensa Pública de Tesis', 'Semana 17', '2026-12-18', 4);

-- ----------------------------------------------------------------
-- 2. USUARIOS CON CONTRASEÑA ENCRIPTADA INDIVIDUAL 
-- ----------------------------------------------------------------

INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol_id) VALUES

-- Coordinación -> Contraseña: COORD2026
('Estefania Guadalupe', 		'Villegas Cruz', 		'coordinacion.titulacion@udg.mx', 		'$2b$10$hJHUgkgpJq6uhoxUh9Mx5eFdhZubzRF3blzzqaCNl/4gDlsbr9od.', 	3),

-- Docentes -> Contraseñas: DOC100001 a DOC100015
('María Daniela', 				'Rosas García', 		'maria.rosas@docentes.udg.mx', 			'$2b$10$lpuUcFmG6C6kr9AAFp1NvuGEBUVGm9Om0gH3KvALID.9hrXYWTwMe', 	2), -- DOC100001
('Jeronimo', 					'Duran Curiel', 		'jeronimo.duran@docentes.udg.mx', 		'$2b$10$haZa6gbaPJUzi6Q6OzShZuN5ZFFg2l4UIkL2P1j/B7hdPSg6BeqSK', 	2), -- DOC100002
('Rocio Athziri', 				'Padilla Medina', 		'rocio.padilla@docentes.udg.mx', 		'$2b$10$3bOYYSgb.ULX3SDw9i/1kup.NZ/tALbXy7IkqsCPH6ghSqFONYohy', 	2), -- DOC100003
('Dayann', 						'Álvarez Ramos', 		'dayann.alvarez@docentes.udg.mx', 		'$2b$10$kx3IWwFX1WOMMVn5zqgR/.LBrIAL/vFJWw7nxfd7XlCTDM5USILui', 	2), -- DOC100004
('Kalim Essau', 				'Brambila Cardenas', 	'kalim.brambila@docentes.udg.mx', 		'$2b$10$4yNTQunNbsVUHjiKlUfVquRVaHGMDsYtg0NcWSF4aqPfTUsICuksK', 	2), -- DOC100005
('Deborah Leticia', 			'Villaseñor Basulto', 	'deborah.villaseñor@docentes.udg.mx', 	'$2b$10$wPbw/JRPnXG37OoUGCSgY.VlAbU081625ZEGemyH.DWJeZpnkVG1e', 	2), -- DOC100006
('Rúben Ulises', 				'Orozco Magallanes', 	'ruben.orozco@docentes.udg.mx', 		'$2b$10$GUrbk3xSsLx8gzqrV4KVL.T0BoTVtI436Nryf5xHGWJuU8/4B.YKK', 	2), -- DOC100007
('Noé', 						'Zermeño Mejía', 		'noe.zermeño@docentes.udg.mx', 			'$2b$10$1EHwiQizK617aZARWNMqH.8PfcWYUjLh27v8j3ELMjKVhuW/bKpdO', 	2), -- DOC100008
('Vicente', 					'Meza Gutiérrez', 		'vicente.meza@docentes.udg.mx', 		'$2b$10$hfrzNsySRNNOhpmhoyOS7OrwS6.ScE/lFsFoEq32lscS871rBueka', 	2), -- DOC100009
('Carlos Alexis', 				'Hernández Flores', 	'carlos.hernandez@docentes.udg.mx', 	'$2b$10$Yd0o9pmuJSp.KUGHi8QsXuuZt2Qc3i0A6nfjRKl1vkKl7WCkL2AYm', 	2), -- DOC100010
('Gerardo',						'Martínez Teran', 		'gerardo.martinez@docentes.udg.mx', 	'$2b$10$vI5youbF/bnZQnmmDbnVP.0G982D2nmNKooCnvAbGsBMCwNi8UeAK', 	2), -- DOC100011
('Jorge Alberto', 				'Ramírez Ortega', 		'jorge.ramirez@docentes.udg.mx', 		'$2b$10$M0bBJ6GuioRPyJ.rCE3jhOmzAZhN1a2UxfRsVLNqIZW0kwTdUJNpe', 	2), -- DOC100012
('Alfredo Netzahualcóyotl', 	'Torres López',			'alfredo.torres@docentes.udg.mx', 		'$2b$10$kNTAo87XWmuDs.XKCdsiE.XrxxZZ.1UECSnVKWtNpzyqBDIRq7eb6', 	2), -- DOC100013
('Móises', 						'Carrera Núñez', 		'moises.carrera@docentes.udg.mx', 		'$2b$10$K7aMyyBOUpUDDtAKAEI6P.syRnDWnRIc9OhMBGMSisWPoU1lfOdYa', 	2), -- DOC100014
('Héctor Alejandro', 			'Gálvez López', 		'hector.galvez@docentes.udg.mx', 		'$2b$10$Rke.H/wwq.lBmCxG7elhgOMuWpoYSu83Z6ZZ/vqZEgIIh2NUyilHi', 	2), -- DOC100015

-- Estudiantes -> Contraseñas: DNI100001 a DNI100028
('Marisol', 					'Huerta Catarino', 		'marisol.huerta@alumnos.udg.mx', 		'$2b$10$tcftZtN6sCNG1CqL8ivIH.XlhA/7BiBhiCGJaqL0ZqMtbrCMiBfoe', 	1), -- DNI100001
('Laura Paola', 				'García Casillas', 		'laura.garcia@alumnos.udg.mx', 			'$2b$10$DPzShEkwYzZWJCzw3OAAieIU3BxsJVSpkJo5obBy6SPVbGpLyBfpO', 	1), -- DNI100002
('Isaí', 						'Plascencia Tapia', 	'isai.plascencia@alumnos.udg.mx', 		'$2b$10$QbVSFrYufuIDSQooRjSPNuI4JGSM03MAiZWahXFa/mJeAYvWMlTV2', 	1), -- DNI100003
('Héctor Jovany', 				'Padilla López', 		'hector.jovany@alumnos.udg.mx', 		'$2b$10$bMvhvsgXHQNAn4g..oo9NuU11vrsTiMLGGnfjiSuYdOwVx.ANzBl2', 	1), -- DNI100004
('Gaizka Alejandro', 			'Camacho Torres', 		'gaizka.camacho@alumnos.udg.mx', 		'$2b$10$lHc5Gd7jSjUmDwfRUt2AzObXFaTvd0XdK0qEmnPfMXRrTrO8u.1GK', 	1), -- DNI100005
('Jahir Israel', 				'Berumen García', 		'jahir.berumen@alumnos.udg.mx', 		'$2b$10$RmmEG4lBJPrgHuGuAiz8h.OMmUEuHOkvUzxQppoEYs7s1fb80EjiS', 	1), -- DNI100006
('Orlando Fabián', 				'Fierros Garrido', 		'orlando.fierros@alumnos.udg.mx', 		'$2b$10$01OfSQyEk3g1wEWCP8GI6uV8XRQkSiIlltvH.MSbwm/SVUPx.gwjq', 	1), -- DNI100007
('Benito Daniel', 				'Flores Rodríguez', 	'benito.flores@alumnos.udg.mx', 		'$2b$10$FFfnz2amCciS4S21zPUyG.KU/PjaIlOUH6B31BupAAa3.6tPq2.XS', 	1), -- DNI100008
('Ángel Alberto', 				'Gónzalez Flores', 		'angel.gonzalez@alumnos.udg.mx', 		'$2b$10$Hvvcw7b0/fXq36tMXQifQulox.AP.Z2QZyvOZE8Wc5ZnvsaffBPKS', 	1), -- DNI100009
('Erik Damian', 				'Guardado Rodríguez', 	'erik.guardado@alumnos.udg.mx', 		'$2b$10$yzz5SYIKfr82v9/DCkMe2.jPYDRuVw2t5YdpXPrX2TdmH6D4aciVG', 	1), -- DNI100010
('Gustavo', 					'Gutiérrez Llamas', 	'gustavo.gutierrez@alumnos.udg.mx', 	'$2b$10$ZG218mMAnm9QWyaujQnBlORALWSXP22OZYpWi4gD9Pys.WHuqYdV6', 	1), -- DNI100011
('Armando Rodrigo', 			'Hernández Barba', 		'armando.hernandez@alumnos.udg.mx', 	'$2b$10$ABPy2.sxGA5.xuNuZwhSiOCKWMIpP8GPhrxsbLdtWx16tEeIqgKES', 	1), -- DNI100012
('Christopher Jovanny', 		'Herrera Rentería', 	'christopher.herrera@alumnos.udg.mx', 	'$2b$10$GYk15kr9ufCQDVo6A5cXvOgZku1ps3lf35BQxfUEMGby0fzsF03CS', 	1), -- DNI100013
('Miguel Ángel', 				'Lobo Nicolás', 		'miguel.lobo@alumnos.udg.mx', 			'$2b$10$JVJdGRhg/WdqRlsWX5qjcOpuSk0.VWHHToFCQafEQYwHd/oCl.VsK', 	1), -- DNI100014
('Alberto', 					'López Sánchez', 		'alberto.lopez@alumnos.udg.mx', 		'$2b$10$fOVjkjKUZvtvbqniLUdc6.yfF6hnnVIhYXgndnXh1d3gd3K59ymVe', 	1), -- DNI100015
('César', 						'Medina Hernández', 	'cesar.medina@alumnos.udg.mx', 			'$2b$10$srJjE.WhbOs3xoAGm5q1Re4325A2X4ISO4eK2PdiO2b22ORr//EIe', 	1), -- DNI100016
('Daniel Alejandro', 			'Medina Mena', 			'daniel.medina@alumnos.udg.mx', 		'$2b$10$aWwFOX3Nkpeq8dX.g/L8L.Cfbt.6JxnKcedcwJ5At6u0QGIt5SfBe', 	1), -- DNI100017
('Manuel Osvaldo', 				'Montes Blancarte', 	'manuel.montes@alumnos.udg.mx', 		'$2b$10$Obk1jO2MqubnEGS7KNdR7ePzkpftkOKrbMmK/26ooldGUgmidVoCm', 	1), -- DNI100018
('Saul Emiliano', 				'Mora Famoso', 			'saul.mora@alumnos.udg.mx', 			'$2b$10$r.gA/MtWbkdTmn1ihzcSUuiIhkQ9PBFnkVHUdZZ4JDBvS0y.hUZlO', 	1), -- DNI100019
('Itzel Arleth', 				'Padilla Segura', 		'itzel.padilla@alumnos.udg.mx', 		'$2b$10$cmzYwtumbKR3khC/tD.gxuLH.SklkSFPmPwkahINtksbQanc1HLVy', 	1), -- DNI100020
('Kevin Leonardo', 				'Pérez Beltrán', 		'kevin.perez@alumnos.udg.mx', 			'$2b$10$RfTz72q/jM/pcTwyITL9vePP5sba91H0J/XHvJUjcIoDy6Of.5N56', 	1), -- DNI100021
('Ramiro', 						'Preciado Martínez', 	'ramiro.preciado@alumnos.udg.mx', 		'$2b$10$Y45U6UPIetnAtu3EkfX//.WWti3YxqnOUgNBbpGuGGI.6NaSnpgZq', 	1), -- DNI100022
('Gael Iosef', 					'Ramírez Marmolejo', 	'gael.ramirez@alumnos.udg.mx', 			'$2b$10$bjf8a1Qq9mmQQUMlark1t.tWszFuk/ynP2KoKJS1ekFaXAhVCjFre', 	1), -- DNI100023
('Marcos Karim', 				'Ramírez Medrano', 		'marcos.ramirez@alumnos.udg.mx', 		'$2b$10$cuA3g6g2sU9hsNOWWo/sHu0pF2nvGtr9Mc91E9siIROlyBzh9CDba', 	1), -- DNI100024
('Eric Yael', 					'Reyes Romero', 		'eric.reyes@alumnos.udg.mx', 			'$2b$10$aF1s/gQDBv3D1zjAQ4Y.DOsk9QILNAJBcIza8ipUe.y03x7Ku12kO', 	1), -- DNI100025
('Fernando Daniel', 			'Serrano Islas', 		'fernando.serrano@alumnos.udg.mx', 		'$2b$10$L9ROTRrwcEXorybYO4n4CurKzXWlofjFKfUleUqrGQ8696YZtfE5G', 	1), -- DNI100026
('Edgar Adrián', 				'Uribe Presas', 		'edgar.uribe@alumnos.udg.mx', 			'$2b$10$wyXU46GV0zvKOUbHvNLgCu340T48LNQ.33eh6JJ8y/i0guS13QZD2', 	1), -- DNI100027
('Paulina Lizette', 			'Villalpando Guizar', 	'paulina.villalpando@alumnos.udg.mx', 	'$2b$10$6Rr1KsaTIUDvN6hrd8Yn5u5V5GyXct04dl15LczFRSSR0DTxTNrjK', 	1); -- DNI100028

-- Generar códigos aleatorios institucionales únicos (9 dígitos) para estudiantes
UPDATE usuarios 
SET codigo = CONCAT('218', FLOOR(100000 + RAND() * 900000))
WHERE rol_id = 1;

-- ------------------------------------------------------------
-- 3. INSERTAR PROYECTOS DE TESIS
-- Vinculados a los IDs de los estudiantes (17 a 44)
-- ------------------------------------------------------------

INSERT INTO proyectos (titulo, estudiante_id, fase_actual_id, porcentaje_avance, estado) VALUES

-- Marisol Huerta Catarino (ID: 17)
('Plataforma Web para la Gestión de Titulación Universitaria', 17, 2, 45, 'EN_PROGRESO'),

-- Laura Paola García Casillas (ID: 18)
('Sistema de Control e Inventario para Microempresas Locales', 18, 1, 20, 'EN_PROGRESO'),

-- Isaí Plascencia Tapia (ID: 19)
('Aplicación Móvil para el Monitoreo de Signos Vitales en Tiempo Real', 19, 3, 80, 'DICTAMEN_APROBADO'),

-- Héctor Jovany Padilla López (ID: 20)
('Optimización de Rutas de Transporte Urbano Mediante Inteligencia Artificial', 20, 2, 60, 'CON_OBSERVACIONES'),

-- Gaizka Alejandro Camacho Torres (ID: 21)
('Plataforma E-learning Interactiva con Gamificación para Educación Básica', 21, 1, 15, 'EN_PROGRESO'),

-- Jahir Israel Berumen García (ID: 22)
('Sistema de Monitoreo Agrícola Automatizado con Redes de Sensores IoT', 22, 4, 100, 'FINALIZADO'),

-- Orlando Fabián Fierros Garrido (ID: 23)
('Red Neural Convolucional para la Detección Temprana de Plagas en CULTIVOS', 23, 2, 50, 'EN_PROGRESO'),

-- Benito Daniel Flores Rodríguez (ID: 24)
('Sistema de Reconocimiento Facial para Control de Acceso Institucional', 24, 3, 85, 'DICTAMEN_APROBADO'),

-- Ángel Alberto Gónzalez Flores (ID: 25)
('Aplicación Web para la Gestión y Reserva de Espacios Académicos', 25, 1, 10, 'EN_PROGRESO'),

-- Erik Damian Guardado Rodríguez (ID: 26)
('Plataforma de Asistencia Médica Remota y Telemedicina', 26, 2, 35, 'CON_OBSERVACIONES'),

-- Gustavo Gutiérrez Llamas (ID: 27)
('Sistema de Análisis de Sentimiento en Redes Sociales para Marcas', 27, 4, 100, 'FINALIZADO'),

-- Armando Rodrigo Hernández Barba (ID: 28)
('Desarrollo de un Chatbot Inteligente para Atención al Cliente Universitario', 28, 2, 55, 'EN_PROGRESO'),

-- Christopher Jovanny Herrera Rentería (ID: 29)
('Sistema Inteligente de Gestión de Energía para Hogares (Smart Home)', 29, 3, 75, 'EN_PROGRESO'),

-- Miguel Ángel Lobo Nicolás (ID: 30)
('Plataforma Blockchain para la Verificación de Títulos Universitarios', 30, 1, 25, 'EN_PROGRESO'),

-- Alberto López Sánchez (ID: 31)
('Sistema de Recomendación de Contenido Académico Basado en ML', 31, 2, 40, 'CON_OBSERVACIONES'),

-- César Medina Hernández (ID: 32)
('Aplicación de Realidad Aumentada para la Enseñanza de Anatomía', 32, 3, 90, 'DICTAMEN_APROBADO'),

-- Daniel Alejandro Medina Mena (ID: 33)
('Plataforma Web de Microfinanzas y Préstamos Peer-to-Peer', 33, 1, 5, 'RECHAZADO'),

-- Manuel Osvaldo Montes Blancarte (ID: 34)
('Sistema de Detección de Fugas en Redes de Agua Potable mediante IoT', 34, 2, 65, 'EN_PROGRESO'),

-- Saul Emiliano Mora Famoso (ID: 35)
('Plataforma de Comercio Electrónico con Realidad Virtual', 35, 4, 100, 'FINALIZADO'),

-- Itzel Arleth Padilla Segura (ID: 36)
('Sistema de Gestión de Citas y Historial Clínico para Veterinarias', 36, 2, 45, 'EN_PROGRESO'),

-- Kevin Leonardo Pérez Beltrán (ID: 37)
('Aplicación Móvil para la Clasificación de Residuos Reciclables con Visión por Computadora', 37, 3, 70, 'EN_PROGRESO'),

-- Ramiro Preciado Martínez (ID: 38)
('Plataforma de Evaluación y Firma Digital de Documentos Oficiales', 38, 1, 30, 'EN_PROGRESO'),

-- Gael Iosef Ramírez Marmolejo (ID: 39)
('Sistema de Predicción de Tráfico Vehicular mediante Algoritmos Genéticos', 39, 2, 50, 'CON_OBSERVACIONES'),

-- Marcos Karim Ramírez Medrano (ID: 40)
('Plataforma Web para la Gestión de Voluntariado y Donaciones', 40, 3, 80, 'DICTAMEN_APROBADO'),

-- Eric Yael Reyes Romero (ID: 41)
('Sistema de Clasificación Automática de Correos Spamm y Phishing', 41, 1, 10, 'EN_PROGRESO'),

-- Fernando Daniel Serrano Islas (ID: 42)
('Aplicación Móvil para Guiado en Interiores mediante Beacons Bluetooth', 42, 2, 60, 'EN_PROGRESO'),

-- Edgar Adrián Uribe Presas (ID: 43)
('Sistema de Control de Calidad de Software Mediante Pruebas Automatizadas CI/CD', 43, 4, 100, 'FINALIZADO'),

-- Paulina Lizette Villalpando Guizar (ID: 44)
('Plataforma Web para el Rastreos y Adopción Responsable de Mascotas', 44, 2, 55, 'EN_PROGRESO');

-- ------------------------------------------------------------
-- 4. ASIGNAR ASESORES Y SINODALES A LOS PROYECTOS
-- IDs Proyectos: 1 al 28 | IDs Docentes: 2 al 16
-- ------------------------------------------------------------

INSERT INTO proyecto_docentes (proyecto_id, docente_id, tipo_rol) VALUES

-- Proyecto 1 (Marisol - TesisTrack)
(1, 2, 'ASESOR'),   -- Mtra. María Daniela
(1, 3, 'SINODAL'),  -- Mtro. Jeronimo

-- Proyecto 2 (Laura Paola - Inventario)
(2, 3, 'ASESOR'),   -- Mtro. Jeronimo
(2, 4, 'SINODAL'),  -- Mtra. Rocío Athziri

-- Proyecto 3 (Isaí - Salud/Signos Vitales)
(3, 4, 'ASESOR'),   -- Mtra. Rocío Athziri
(3, 5, 'SINODAL'),  -- Mtra. Dayann

-- Proyecto 4 (Héctor Jovany - Transporte IA)
(4, 5, 'ASESOR'),   -- Mtra. Dayann
(4, 6, 'SINODAL'),  -- Mtro. Kalim Essau

-- Proyecto 5 (Gaizka - E-learning)
(5, 6, 'ASESOR'),   -- Mtro. Kalim Essau
(5, 7, 'SINODAL'),  -- Mtra. Deborah Leticia

-- Proyecto 6 (Jahir - IoT Agrícola)
(6, 7, 'ASESOR'),   -- Mtra. Deborah Leticia
(6, 8, 'SINODAL'),  -- Mtro. Rúben Ulises

-- Proyecto 7 (Orlando - Red Neural Plagas)
(7, 8, 'ASESOR'),   -- Mtro. Rúben Ulises
(7, 9, 'SINODAL'),  -- Mtro. Noé

-- Proyecto 8 (Benito - Reconocimiento Facial)
(8, 9, 'ASESOR'),   -- Mtro. Noé
(8, 10, 'SINODAL'), -- Mtro. Vicente

-- Proyecto 9 (Ángel - Reserva Espacios)
(9, 10, 'ASESOR'),  -- Mtro. Vicente
(9, 11, 'SINODAL'), -- Mtro. Carlos Alexis

-- Proyecto 10 (Erik - Telemedicina)
(10, 11, 'ASESOR'), -- Mtro. Carlos Alexis
(10, 12, 'SINODAL'),-- Mtro. Gerardo

-- Proyecto 11 (Gustavo - Análisis Sentimiento)
(11, 12, 'ASESOR'), -- Mtro. Gerardo
(11, 13, 'SINODAL'),-- Mtro. Jorge Alberto

-- Proyecto 12 (Armando - Chatbot)
(12, 13, 'ASESOR'), -- Mtro. Jorge Alberto
(12, 14, 'SINODAL'),-- Mtro. Alfredo

-- Proyecto 13 (Christopher - Smart Home)
(13, 14, 'ASESOR'), -- Mtro. Alfredo
(13, 15, 'SINODAL'),-- Mtro. Móises

-- Proyecto 14 (Miguel - Blockchain Títulos)
(14, 15, 'ASESOR'), -- Mtro. Móises
(14, 16, 'SINODAL'),-- Mtro. Héctor Alejandro

-- Proyecto 15 (Alberto - Recomendación ML)
(15, 16, 'ASESOR'), -- Mtro. Héctor Alejandro
(15, 2, 'SINODAL'), -- Mtra. María Daniela

-- Proyecto 16 (César - Realidad Aumentada)
(16, 2, 'ASESOR'),  -- Mtra. María Daniela
(16, 4, 'SINODAL'), -- Mtra. Rocío Athziri

-- Proyecto 17 (Daniel - Microfinanzas)
(17, 3, 'ASESOR'),  -- Mtro. Jeronimo
(17, 5, 'SINODAL'), -- Mtra. Dayann

-- Proyecto 18 (Manuel - Fugas Agua IoT)
(18, 4, 'ASESOR'),  -- Mtra. Rocío Athziri
(18, 6, 'SINODAL'), -- Mtro. Kalim Essau

-- Proyecto 19 (Saul - E-commerce VR)
(19, 5, 'ASESOR'),  -- Mtra. Dayann
(19, 7, 'SINODAL'), -- Mtra. Deborah Leticia

-- Proyecto 20 (Itzel - Veterinaria)
(20, 6, 'ASESOR'),  -- Mtro. Kalim Essau
(20, 8, 'SINODAL'), -- Mtro. Rúben Ulises

-- Proyecto 21 (Kevin - Reciclaje Visión)
(21, 7, 'ASESOR'),  -- Mtra. Deborah Leticia
(21, 9, 'SINODAL'), -- Mtro. Noé

-- Proyecto 22 (Ramiro - Firma Digital)
(22, 8, 'ASESOR'),  -- Mtro. Rúben Ulises
(22, 10, 'SINODAL'),-- Mtro. Vicente

-- Proyecto 23 (Gael - Tráfico Vehicular)
(23, 9, 'ASESOR'),  -- Mtro. Noé
(23, 11, 'SINODAL'),-- Mtro. Carlos Alexis

-- Proyecto 24 (Marcos - Voluntariado)
(24, 10, 'ASESOR'), -- Mtro. Vicente
(24, 12, 'SINODAL'),-- Mtro. Gerardo

-- Proyecto 25 (Eric - Spam/Phishing)
(25, 11, 'ASESOR'), -- Mtro. Carlos Alexis
(25, 13, 'SINODAL'),-- Mtro. Jorge Alberto

-- Proyecto 26 (Fernando - Beacons Bluetooth)
(26, 12, 'ASESOR'), -- Mtro. Gerardo
(26, 14, 'SINODAL'),-- Mtro. Alfredo

-- Proyecto 27 (Edgar - CI/CD Automatización)
(27, 13, 'ASESOR'), -- Mtro. Jorge Alberto
(27, 15, 'SINODAL'),-- Mtro. Móises

-- Proyecto 28 (Paulina - Adopción Mascotas)
(28, 14, 'ASESOR'), -- Mtro. Alfredo
(28, 16, 'SINODAL');-- Mtro. Héctor Alejandro

-- ------------------------------------------------------------
-- 5. INSERTAR ENTREGAS (Historial de documentos PDF subidos)
-- IDs Proyectos: 1 al 28 | Fases: 1 (Anteproyecto), 2 (Desarrollo), 3 (Dictamen), 4 (Examen)
-- ------------------------------------------------------------

-- (Las entregas se registran con hito_id para que la línea de tiempo y el avance por fase funcionen)
-- ------------------------------------------------------------

INSERT INTO entregas (proyecto_id, fase_id, hito_id, codigo, numero_version, archivo_url, nombre_original, tamano, estado, fecha_limite, fecha_entrega) VALUES

-- Proyecto 1 (Marisol - TesisTrack - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(1, 1, 1, '1.1', 'v1.0', '/uploads/docs/p01_ante proyecto_v1.pdf', 'Planteamiento_Problema.pdf', '2.4 MB', 'APROBADO', '2026-09-05', '2026-09-03 10:30:00'),
(1, 1, 2, '1.2', 'v1.0', '/uploads/docs/p01_protocolo.pdf', 'Protocolo_Justificacion.pdf', '3.1 MB', 'APROBADO', '2026-09-19', '2026-09-17 14:20:00'),
(1, 2, 3, '2.1', 'v1.1', '/uploads/docs/p01_marco_teorico.pdf', 'Marco_Teorico_APA7.pdf', '4.1 MB', 'CON_OBSERVACIONES', '2026-10-15', '2026-10-14 16:45:00'),

-- Proyecto 2 (Laura Paola - Inventario - Fase 1) -> Entregó 1.1 APROBADO
(2, 1, 1, '1.1', 'v1.0', '/uploads/docs/p02_ante proyecto.pdf', 'Planteamiento_Problema.pdf', '1.8 MB', 'APROBADO', '2026-09-05', '2026-09-03 09:20:00'),

-- Proyecto 3 (Isaí - Salud/Signos Vitales - Fase 3) -> Entregó 1.1, 1.2, 2.1, 2.2, 2.3 y 3.1
(3, 1, 1, '1.1', 'v1.0', '/uploads/docs/p03_1.1.pdf', 'Planteamiento_Problema.pdf', '2.1 MB', 'APROBADO', '2026-09-05', '2026-09-02 14:00:00'),
(3, 1, 2, '1.2', 'v1.0', '/uploads/docs/p03_1.2.pdf', 'Protocolo_Justificacion.pdf', '2.8 MB', 'APROBADO', '2026-09-19', '2026-09-16 11:30:00'),
(3, 2, 3, '2.1', 'v2.0', '/uploads/docs/p03_2.1.pdf', 'Marco_Teorico_APA7.pdf', '5.6 MB', 'APROBADO', '2026-10-15', '2026-10-10 11:30:00'),
(3, 2, 4, '2.2', 'v2.0', '/uploads/docs/p03_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '6.1 MB', 'APROBADO', '2026-10-29', '2026-10-26 15:00:00'),
(3, 2, 5, '2.3', 'v2.0', '/uploads/docs/p03_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '6.9 MB', 'APROBADO', '2026-11-12', '2026-11-08 10:20:00'),
(3, 3, 6, '3.1', 'v3.0', '/uploads/docs/p03_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '7.2 MB', 'APROBADO', '2026-11-26', '2026-11-20 16:10:00'),

-- Proyecto 4 (Héctor Jovany - Transporte IA - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(4, 1, 1, '1.1', 'v1.0', '/uploads/docs/p04_1.1.pdf', 'Planteamiento_Problema.pdf', '3.0 MB', 'APROBADO', '2026-09-05', '2026-09-01 15:45:00'),
(4, 1, 2, '1.2', 'v1.0', '/uploads/docs/p04_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.5 MB', 'APROBADO', '2026-09-19', '2026-09-15 10:00:00'),
(4, 2, 3, '2.1', 'v1.1', '/uploads/docs/p04_2.1.pdf', 'Marco_Teorico_APA7.pdf', '4.5 MB', 'CON_OBSERVACIONES', '2026-10-15', '2026-10-12 18:00:00'),

-- Proyecto 5 (Gaizka - E-learning - Fase 1) -> Entregó 1.1
(5, 1, 1, '1.1', 'v1.0', '/uploads/docs/p05_1.1.pdf', 'Planteamiento_Problema.pdf', '2.0 MB', 'EN_REVISION', '2026-09-05', '2026-09-04 10:00:00'),

-- Proyecto 6 (Jahir - IoT Agrícola - Fase 4 - Finalizado) -> Entregó todos del 1.1 al 4.2 (Hitos 1 al 9)
(6, 1, 1, '1.1', 'v1.0', '/uploads/docs/p06_1.1.pdf', 'Planteamiento_Problema.pdf', '2.9 MB', 'APROBADO', '2026-09-05', '2026-09-01 12:00:00'),
(6, 1, 2, '1.2', 'v1.0', '/uploads/docs/p06_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.4 MB', 'APROBADO', '2026-09-19', '2026-09-14 11:00:00'),
(6, 2, 3, '2.1', 'v2.0', '/uploads/docs/p06_2.1.pdf', 'Marco_Teorico_APA7.pdf', '6.1 MB', 'APROBADO', '2026-10-15', '2026-10-10 17:30:00'),
(6, 2, 4, '2.2', 'v2.0', '/uploads/docs/p06_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '7.0 MB', 'APROBADO', '2026-10-29', '2026-10-25 09:15:00'),
(6, 2, 5, '2.3', 'v2.0', '/uploads/docs/p06_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.8 MB', 'APROBADO', '2026-11-12', '2026-11-05 14:00:00'),
(6, 3, 6, '3.1', 'v3.0', '/uploads/docs/p06_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '8.2 MB', 'APROBADO', '2026-11-26', '2026-11-18 10:30:00'),
(6, 3, 7, '3.2', 'v3.0', '/uploads/docs/p06_3.2.pdf', 'Evaluacion_Veredicto_Comite.pdf', '8.9 MB', 'APROBADO', '2026-12-03', '2026-11-28 13:15:00'),
(6, 4, 8, '4.1', 'v4.0', '/uploads/docs/p06_4.1.pdf', 'Postulacion_Programacion_Examen.pdf', '9.1 MB', 'APROBADO', '2026-12-10', '2026-12-05 16:00:00'),
(6, 4, 9, '4.2', 'v4.0', '/uploads/docs/p06_4.2.pdf', 'Defensa_Publica_Tesis.pdf', '9.4 MB', 'APROBADO', '2026-12-18', '2026-12-15 09:00:00'),

-- Proyecto 7 (Orlando - Red Neural Plagas - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(7, 1, 1, '1.1', 'v1.0', '/uploads/docs/p07_1.1.pdf', 'Planteamiento_Problema.pdf', '2.7 MB', 'APROBADO', '2026-09-05', '2026-09-03 11:40:00'),
(7, 1, 2, '1.2', 'v1.0', '/uploads/docs/p07_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.2 MB', 'APROBADO', '2026-09-19', '2026-09-16 15:00:00'),
(7, 2, 3, '2.1', 'v1.0', '/uploads/docs/p07_2.1.pdf', 'Marco_Teorico_APA7.pdf', '5.1 MB', 'EN_REVISION', '2026-10-15', '2026-10-11 16:20:00'),

-- Proyecto 8 (Benito - Reconocimiento Facial - Fase 3) -> Entregó 1.1 al 3.1 (Hitos 1 a 6)
(8, 1, 1, '1.1', 'v1.0', '/uploads/docs/p08_1.1.pdf', 'Planteamiento_Problema.pdf', '3.2 MB', 'APROBADO', '2026-09-05', '2026-09-02 14:15:00'),
(8, 1, 2, '1.2', 'v1.0', '/uploads/docs/p08_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.9 MB', 'APROBADO', '2026-09-19', '2026-09-15 09:30:00'),
(8, 2, 3, '2.1', 'v2.0', '/uploads/docs/p08_2.1.pdf', 'Marco_Teorico_APA7.pdf', '6.8 MB', 'APROBADO', '2026-10-15', '2026-10-09 10:50:00'),
(8, 2, 4, '2.2', 'v2.0', '/uploads/docs/p08_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '7.4 MB', 'APROBADO', '2026-10-29', '2026-10-22 14:00:00'),
(8, 2, 5, '2.3', 'v2.0', '/uploads/docs/p08_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.9 MB', 'APROBADO', '2026-11-12', '2026-11-05 11:20:00'),
(8, 3, 6, '3.1', 'v3.0', '/uploads/docs/p08_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '8.1 MB', 'APROBADO', '2026-11-26', '2026-11-18 15:00:00'),

-- Proyecto 9 (Ángel - Reserva Espacios - Fase 1) -> Entregó 1.1
(9, 1, 1, '1.1', 'v1.0', '/uploads/docs/p09_1.1.pdf', 'Planteamiento_Problema.pdf', '1.6 MB', 'EN_REVISION', '2026-09-05', '2026-09-05 11:10:00'),

-- Proyecto 10 (Erik - Telemedicina - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(10, 1, 1, '1.1', 'v1.0', '/uploads/docs/p10_1.1.pdf', 'Planteamiento_Problema.pdf', '2.5 MB', 'APROBADO', '2026-09-05', '2026-09-02 09:30:00'),
(10, 1, 2, '1.2', 'v1.0', '/uploads/docs/p10_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.1 MB', 'APROBADO', '2026-09-19', '2026-09-17 12:00:00'),
(10, 2, 3, '2.1', 'v1.1', '/uploads/docs/p10_2.1.pdf', 'Marco_Teorico_APA7.pdf', '4.0 MB', 'CON_OBSERVACIONES', '2026-10-15', '2026-10-13 17:00:00'),

-- Proyecto 11 (Gustavo - Análisis Sentimiento - Fase 4 - Finalizado) -> Entregó Hitos 1 a 9
(11, 1, 1, '1.1', 'v1.0', '/uploads/docs/p11_1.1.pdf', 'Planteamiento_Problema.pdf', '2.3 MB', 'APROBADO', '2026-09-05', '2026-09-01 16:00:00'),
(11, 1, 2, '1.2', 'v1.0', '/uploads/docs/p11_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.0 MB', 'APROBADO', '2026-09-19', '2026-09-14 10:15:00'),
(11, 2, 3, '2.1', 'v2.0', '/uploads/docs/p11_2.1.pdf', 'Marco_Teorico_APA7.pdf', '5.9 MB', 'APROBADO', '2026-10-15', '2026-10-08 12:45:00'),
(11, 2, 4, '2.2', 'v2.0', '/uploads/docs/p11_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '6.8 MB', 'APROBADO', '2026-10-29', '2026-10-24 11:00:00'),
(11, 2, 5, '2.3', 'v2.0', '/uploads/docs/p11_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.4 MB', 'APROBADO', '2026-11-12', '2026-11-06 16:30:00'),
(11, 3, 6, '3.1', 'v3.0', '/uploads/docs/p11_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '7.7 MB', 'APROBADO', '2026-11-26', '2026-11-19 11:20:00'),
(11, 3, 7, '3.2', 'v3.0', '/uploads/docs/p11_3.2.pdf', 'Evaluacion_Veredicto_Comite.pdf', '8.2 MB', 'APROBADO', '2026-12-03', '2026-11-29 14:00:00'),
(11, 4, 8, '4.1', 'v4.0', '/uploads/docs/p11_4.1.pdf', 'Postulacion_Programacion_Examen.pdf', '8.5 MB', 'APROBADO', '2026-12-10', '2026-12-04 15:30:00'),
(11, 4, 9, '4.2', 'v4.0', '/uploads/docs/p11_4.2.pdf', 'Defensa_Publica_Tesis.pdf', '8.8 MB', 'APROBADO', '2026-12-18', '2026-12-14 10:00:00'),

-- Proyecto 12 (Armando - Chatbot - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(12, 1, 1, '1.1', 'v1.0', '/uploads/docs/p12_1.1.pdf', 'Planteamiento_Problema.pdf', '2.2 MB', 'APROBADO', '2026-09-05', '2026-09-03 13:20:00'),
(12, 1, 2, '1.2', 'v1.0', '/uploads/docs/p12_1.2.pdf', 'Protocolo_Justificacion.pdf', '2.9 MB', 'APROBADO', '2026-09-19', '2026-09-16 11:10:00'),
(12, 2, 3, '2.1', 'v1.0', '/uploads/docs/p12_2.1.pdf', 'Marco_Teorico_APA7.pdf', '3.8 MB', 'EN_REVISION', '2026-10-15', '2026-10-14 15:40:00'),

-- Proyecto 13 (Christopher - Smart Home - Fase 3) -> Entregó Hitos 1 a 6
(13, 1, 1, '1.1', 'v1.0', '/uploads/docs/p13_1.1.pdf', 'Planteamiento_Problema.pdf', '2.8 MB', 'APROBADO', '2026-09-05', '2026-09-02 10:15:00'),
(13, 1, 2, '1.2', 'v1.0', '/uploads/docs/p13_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.6 MB', 'APROBADO', '2026-09-19', '2026-09-15 14:00:00'),
(13, 2, 3, '2.1', 'v2.0', '/uploads/docs/p13_2.1.pdf', 'Marco_Teorico_APA7.pdf', '6.4 MB', 'APROBADO', '2026-10-15', '2026-10-10 14:30:00'),
(13, 2, 4, '2.2', 'v2.0', '/uploads/docs/p13_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '7.1 MB', 'APROBADO', '2026-10-29', '2026-10-24 16:20:00'),
(13, 2, 5, '2.3', 'v2.0', '/uploads/docs/p13_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.6 MB', 'APROBADO', '2026-11-12', '2026-11-08 10:00:00'),
(13, 3, 6, '3.1', 'v3.0', '/uploads/docs/p13_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '7.9 MB', 'EN_REVISION', '2026-11-26', '2026-11-20 18:00:00'),

-- Proyecto 14 (Miguel - Blockchain Títulos - Fase 1) -> Entregó 1.1
(14, 1, 1, '1.1', 'v1.0', '/uploads/docs/p14_1.1.pdf', 'Planteamiento_Problema.pdf', '1.9 MB', 'EN_REVISION', '2026-09-05', '2026-09-04 12:00:00'),

-- Proyecto 15 (Alberto - Recomendación ML - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(15, 1, 1, '1.1', 'v1.0', '/uploads/docs/p15_1.1.pdf', 'Planteamiento_Problema.pdf', '2.6 MB', 'APROBADO', '2026-09-05', '2026-09-02 16:10:00'),
(15, 1, 2, '1.2', 'v1.0', '/uploads/docs/p15_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.3 MB', 'APROBADO', '2026-09-19', '2026-09-17 09:40:00'),
(15, 2, 3, '2.1', 'v1.1', '/uploads/docs/p15_2.1.pdf', 'Marco_Teorico_APA7.pdf', '4.2 MB', 'CON_OBSERVACIONES', '2026-10-15', '2026-10-12 11:00:00'),

-- Proyecto 16 (César - Realidad Aumentada - Fase 3) -> Entregó Hitos 1 a 6
(16, 1, 1, '1.1', 'v1.0', '/uploads/docs/p16_1.1.pdf', 'Planteamiento_Problema.pdf', '3.1 MB', 'APROBADO', '2026-09-05', '2026-09-01 09:40:00'),
(16, 1, 2, '1.2', 'v1.0', '/uploads/docs/p16_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.8 MB', 'APROBADO', '2026-09-19', '2026-09-14 16:30:00'),
(16, 2, 3, '2.1', 'v2.0', '/uploads/docs/p16_2.1.pdf', 'Marco_Teorico_APA7.pdf', '7.0 MB', 'APROBADO', '2026-10-15', '2026-10-09 15:20:00'),
(16, 2, 4, '2.2', 'v2.0', '/uploads/docs/p16_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '7.8 MB', 'APROBADO', '2026-10-29', '2026-10-25 11:00:00'),
(16, 2, 5, '2.3', 'v2.0', '/uploads/docs/p16_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '8.1 MB', 'APROBADO', '2026-11-12', '2026-11-07 14:15:00'),
(16, 3, 6, '3.1', 'v3.0', '/uploads/docs/p16_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '8.4 MB', 'APROBADO', '2026-11-26', '2026-11-19 13:00:00'),

-- Proyecto 17 (Daniel - Microfinanzas - Fase 1) -> Entregó 1.1
(17, 1, 1, '1.1', 'v1.0', '/uploads/docs/p17_1.1.pdf', 'Planteamiento_Problema.pdf', '1.5 MB', 'CON_OBSERVACIONES', '2026-09-05', '2026-09-04 10:20:00'),

-- Proyecto 18 (Manuel - Fugas Agua IoT - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(18, 1, 1, '1.1', 'v1.0', '/uploads/docs/p18_1.1.pdf', 'Planteamiento_Problema.pdf', '2.4 MB', 'APROBADO', '2026-09-05', '2026-09-02 14:00:00'),
(18, 1, 2, '1.2', 'v1.0', '/uploads/docs/p18_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.1 MB', 'APROBADO', '2026-09-19', '2026-09-16 10:15:00'),
(18, 2, 3, '2.1', 'v1.0', '/uploads/docs/p18_2.1.pdf', 'Marco_Teorico_APA7.pdf', '4.7 MB', 'EN_REVISION', '2026-10-15', '2026-10-13 11:30:00'),

-- Proyecto 19 (Saul - E-commerce VR - Fase 4 - Finalizado) -> Entregó Hitos 1 a 9
(19, 1, 1, '1.1', 'v1.0', '/uploads/docs/p19_1.1.pdf', 'Planteamiento_Problema.pdf', '2.8 MB', 'APROBADO', '2026-09-05', '2026-09-01 11:00:00'),
(19, 1, 2, '1.2', 'v1.0', '/uploads/docs/p19_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.5 MB', 'APROBADO', '2026-09-19', '2026-09-15 15:20:00'),
(19, 2, 3, '2.1', 'v2.0', '/uploads/docs/p19_2.1.pdf', 'Marco_Teorico_APA7.pdf', '6.5 MB', 'APROBADO', '2026-10-15', '2026-10-07 16:30:00'),
(19, 2, 4, '2.2', 'v2.0', '/uploads/docs/p19_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '7.2 MB', 'APROBADO', '2026-10-29', '2026-10-23 12:00:00'),
(19, 2, 5, '2.3', 'v2.0', '/uploads/docs/p19_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.9 MB', 'APROBADO', '2026-11-12', '2026-11-04 17:10:00'),
(19, 3, 6, '3.1', 'v3.0', '/uploads/docs/p19_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '8.3 MB', 'APROBADO', '2026-11-26', '2026-11-18 14:15:00'),
(19, 3, 7, '3.2', 'v3.0', '/uploads/docs/p19_3.2.pdf', 'Evaluacion_Veredicto_Comite.pdf', '8.6 MB', 'APROBADO', '2026-12-03', '2026-11-27 10:00:00'),
(19, 4, 8, '4.1', 'v4.0', '/uploads/docs/p19_4.1.pdf', 'Postulacion_Programacion_Examen.pdf', '8.9 MB', 'APROBADO', '2026-12-10', '2026-12-03 11:30:00'),
(19, 4, 9, '4.2', 'v4.0', '/uploads/docs/p19_4.2.pdf', 'Defensa_Publica_Tesis.pdf', '9.1 MB', 'APROBADO', '2026-12-18', '2026-12-13 09:45:00'),

-- Proyecto 20 (Itzel - Veterinaria - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(20, 1, 1, '1.1', 'v1.0', '/uploads/docs/p20_1.1.pdf', 'Planteamiento_Problema.pdf', '2.1 MB', 'APROBADO', '2026-09-05', '2026-09-03 10:15:00'),
(20, 1, 2, '1.2', 'v1.0', '/uploads/docs/p20_1.2.pdf', 'Protocolo_Justificacion.pdf', '2.8 MB', 'APROBADO', '2026-09-19', '2026-09-16 14:00:00'),
(20, 2, 3, '2.1', 'v1.0', '/uploads/docs/p20_2.1.pdf', 'Marco_Teorico_APA7.pdf', '3.9 MB', 'EN_REVISION', '2026-10-15', '2026-10-14 17:10:00'),

-- Proyecto 21 (Kevin - Reciclaje Visión - Fase 3) -> Entregó Hitos 1 a 6
(21, 1, 1, '1.1', 'v1.0', '/uploads/docs/p21_1.1.pdf', 'Planteamiento_Problema.pdf', '2.9 MB', 'APROBADO', '2026-09-05', '2026-09-02 15:30:00'),
(21, 1, 2, '1.2', 'v1.0', '/uploads/docs/p21_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.6 MB', 'APROBADO', '2026-09-19', '2026-09-15 11:20:00'),
(21, 2, 3, '2.1', 'v2.0', '/uploads/docs/p21_2.1.pdf', 'Marco_Teorico_APA7.pdf', '5.8 MB', 'APROBADO', '2026-10-15', '2026-10-09 12:00:00'),
(21, 2, 4, '2.2', 'v2.0', '/uploads/docs/p21_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '6.4 MB', 'APROBADO', '2026-10-29', '2026-10-24 10:00:00'),
(21, 2, 5, '2.3', 'v2.0', '/uploads/docs/p21_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.1 MB', 'APROBADO', '2026-11-12', '2026-11-06 15:30:00'),
(21, 3, 6, '3.1', 'v3.0', '/uploads/docs/p21_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '7.6 MB', 'EN_REVISION', '2026-11-26', '2026-11-21 10:00:00'),

-- Proyecto 22 (Ramiro - Firma Digital - Fase 1) -> Entregó 1.1
(22, 1, 1, '1.1', 'v1.0', '/uploads/docs/p22_1.1.pdf', 'Planteamiento_Problema.pdf', '1.7 MB', 'EN_REVISION', '2026-09-05', '2026-09-04 13:50:00'),

-- Proyecto 23 (Gael - Tráfico Vehicular - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(23, 1, 1, '1.1', 'v1.0', '/uploads/docs/p23_1.1.pdf', 'Planteamiento_Problema.pdf', '2.6 MB', 'APROBADO', '2026-09-05', '2026-09-03 11:25:00'),
(23, 1, 2, '1.2', 'v1.0', '/uploads/docs/p23_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.3 MB', 'APROBADO', '2026-09-19', '2026-09-17 16:00:00'),
(23, 2, 3, '2.1', 'v1.1', '/uploads/docs/p23_2.1.pdf', 'Marco_Teorico_APA7.pdf', '4.4 MB', 'CON_OBSERVACIONES', '2026-10-15', '2026-10-13 16:40:00'),

-- Proyecto 24 (Marcos - Voluntariado - Fase 3) -> Entregó Hitos 1 a 6
(24, 1, 1, '1.1', 'v1.0', '/uploads/docs/p24_1.1.pdf', 'Planteamiento_Problema.pdf', '2.0 MB', 'APROBADO', '2026-09-05', '2026-09-01 09:00:00'),
(24, 1, 2, '1.2', 'v1.0', '/uploads/docs/p24_1.2.pdf', 'Protocolo_Justificacion.pdf', '2.7 MB', 'APROBADO', '2026-09-19', '2026-09-15 14:30:00'),
(24, 2, 3, '2.1', 'v2.0', '/uploads/docs/p24_2.1.pdf', 'Marco_Teorico_APA7.pdf', '5.2 MB', 'APROBADO', '2026-10-15', '2026-10-08 14:10:00'),
(24, 2, 4, '2.2', 'v2.0', '/uploads/docs/p24_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '6.0 MB', 'APROBADO', '2026-10-29', '2026-10-22 10:00:00'),
(24, 2, 5, '2.3', 'v2.0', '/uploads/docs/p24_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '6.7 MB', 'APROBADO', '2026-11-12', '2026-11-05 16:00:00'),
(24, 3, 6, '3.1', 'v3.0', '/uploads/docs/p24_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '7.1 MB', 'APROBADO', '2026-11-26', '2026-11-19 11:30:00'),

-- Proyecto 25 (Eric - Spam/Phishing - Fase 1) -> Entregó 1.1
(25, 1, 1, '1.1', 'v1.0', '/uploads/docs/p25_1.1.pdf', 'Planteamiento_Problema.pdf', '1.8 MB', 'EN_REVISION', '2026-09-05', '2026-09-05 15:00:00'),

-- Proyecto 26 (Fernando - Beacons Bluetooth - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(26, 1, 1, '1.1', 'v1.0', '/uploads/docs/p26_1.1.pdf', 'Planteamiento_Problema.pdf', '2.3 MB', 'APROBADO', '2026-09-05', '2026-09-02 10:45:00'),
(26, 1, 2, '1.2', 'v1.0', '/uploads/docs/p26_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.0 MB', 'APROBADO', '2026-09-19', '2026-09-16 12:30:00'),
(26, 2, 3, '2.1', 'v1.0', '/uploads/docs/p26_2.1.pdf', 'Marco_Teorico_APA7.pdf', '4.1 MB', 'EN_REVISION', '2026-10-15', '2026-10-14 12:15:00'),

-- Proyecto 27 (Edgar - CI/CD Automatización - Fase 4 - Finalizado) -> Entregó Hitos 1 a 9
(27, 1, 1, '1.1', 'v1.0', '/uploads/docs/p27_1.1.pdf', 'Planteamiento_Problema.pdf', '2.7 MB', 'APROBADO', '2026-09-05', '2026-09-01 15:10:00'),
(27, 1, 2, '1.2', 'v1.0', '/uploads/docs/p27_1.2.pdf', 'Protocolo_Justificacion.pdf', '3.4 MB', 'APROBADO', '2026-09-19', '2026-09-14 09:00:00'),
(27, 2, 3, '2.1', 'v2.0', '/uploads/docs/p27_2.1.pdf', 'Marco_Teorico_APA7.pdf', '6.0 MB', 'APROBADO', '2026-10-15', '2026-10-07 11:30:00'),
(27, 2, 4, '2.2', 'v2.0', '/uploads/docs/p27_2.2.pdf', 'Avance_Arquitectura_MVP.pdf', '6.9 MB', 'APROBADO', '2026-10-29', '2026-10-23 16:00:00'),
(27, 2, 5, '2.3', 'v2.0', '/uploads/docs/p27_2.3.pdf', 'Pruebas_Evaluacion_Final.pdf', '7.5 MB', 'APROBADO', '2026-11-12', '2026-11-04 12:10:00'),
(27, 3, 6, '3.1', 'v3.0', '/uploads/docs/p27_3.1.pdf', 'Asignacion_Revisores_Dictamen.pdf', '8.0 MB', 'APROBADO', '2026-11-26', '2026-11-17 16:20:00'),
(27, 3, 7, '3.2', 'v3.0', '/uploads/docs/p27_3.2.pdf', 'Evaluacion_Veredicto_Comite.pdf', '8.4 MB', 'APROBADO', '2026-12-03', '2026-11-28 11:00:00'),
(27, 4, 8, '4.1', 'v4.0', '/uploads/docs/p27_4.1.pdf', 'Postulacion_Programacion_Examen.pdf', '8.8 MB', 'APROBADO', '2026-12-10', '2026-12-03 14:00:00'),
(27, 4, 9, '4.2', 'v4.0', '/uploads/docs/p27_4.2.pdf', 'Defensa_Publica_Tesis.pdf', '9.0 MB', 'APROBADO', '2026-12-18', '2026-12-12 10:30:00'),

-- Proyecto 28 (Paulina - Adopción Mascotas - Fase 2) -> Entregó 1.1, 1.2 y 2.1
(28, 1, 1, '1.1', 'v1.0', '/uploads/docs/p28_1.1.pdf', 'Planteamiento_Problema.pdf', '2.2 MB', 'APROBADO', '2026-09-05', '2026-09-03 12:00:00'),
(28, 1, 2, '1.2', 'v1.0', '/uploads/docs/p28_1.2.pdf', 'Protocolo_Justificacion.pdf', '2.9 MB', 'APROBADO', '2026-09-19', '2026-09-16 15:30:00'),
(28, 2, 3, '2.1', 'v1.0', '/uploads/docs/p28_2.1.pdf', 'Marco_Teorico_APA7.pdf', '3.9 MB', 'EN_REVISION', '2026-10-15', '2026-10-13 14:50:00');

-- ------------------------------------------------------------
-- 7. INSERTAR NOTIFICACIONES DE PRUEBA (Todos los Usuarios: 1 al 44)
-- Coordinación: ID 1 | Docentes: IDs 2 al 16 | Estudiantes: IDs 17 al 44
-- ------------------------------------------------------------

INSERT INTO notificaciones (usuario_id, tipo, mensaje, leido, fecha_creacion) VALUES

-- ============================================================
-- COORDINACIÓN Y DOCENTES (IDs 1 al 16)
-- ============================================================
-- 1. Coordinación (ID 1)
(1, 'EXAMEN', 'El estudiante Jahir Israel Berumen ha solicitado fecha para su examen de titulación.', TRUE, '2026-04-02 09:15:00'),
(1, 'GENERAL', 'Se han registrado 4 nuevos dictámenes aprobados en esta semana.', FALSE, '2026-04-05 08:00:00'),

-- 2. Mtra. María Daniela Rosas García (Docente ID 2)
(2, 'ENTREGA', 'La alumna Marisol Huerta ha subido la nueva versión ENT-03 para su revisión.', FALSE, '2026-04-05 11:16:00'),
(2, 'DICTAMEN', 'Has emitido con éxito el dictamen con observaciones para la entrega ENT-02.', TRUE, '2026-03-22 14:30:00'),

-- 3. Mtro. Jeronimo Duran Curiel (Docente ID 3)
(3, 'ENTREGA', 'La alumna Laura Paola García ha asignado su anteproyecto para tu revisión.', FALSE, '2026-04-12 09:22:00'),
(3, 'GENERAL', 'Recordatorio: Tienes 1 dictamen pendiente de revisión para la alumna Daniel Medina.', FALSE, '2026-04-03 10:00:00'),

-- 4. Mtra. Rocío Athziri Padilla Medina (Docente ID 4)
(4, 'ENTREGA', 'El alumno Isaí Plascencia ha subido el documento de dictamen para su revisión.', TRUE, '2026-03-28 16:15:00'),

-- 5. Mtra. Dayann Álvarez Ramos (Docente ID 5)
(5, 'ENTREGA', 'El alumno Héctor Jovany Padilla ha subido la entrega corregida de su avance.', FALSE, '2026-03-24 18:05:00'),

-- 6. Mtro. Kalim Essau Brambila Cardenas (Docente ID 6)
(6, 'GENERAL', 'Has sido asignado como Sinodal en el proyecto del alumno Héctor Jovany Padilla.', TRUE, '2026-02-15 10:00:00'),

-- 7. Mtra. Deborah Leticia Villaseñor Basulto (Docente ID 7)
(7, 'ENTREGA', 'El alumno Jahir Israel Berumen ha subido la versión final de su tesis para dictamen.', TRUE, '2026-03-28 14:25:00'),

-- 8. Mtro. Rúben Ulises Orozco Magallanes (Docente ID 8)
(8, 'ENTREGA', 'El alumno Orlando Fabián Fierros ha subido un nuevo avance de su modelo CNN.', FALSE, '2026-04-09 16:22:00'),

-- 9. Mtro. Noé Zermeño Mejía (Docente ID 9)
(9, 'ENTREGA', 'El alumno Benito Daniel Flores ha completado la entrega de su módulo facial.', TRUE, '2026-03-01 10:55:00'),

-- 10. Mtro. Vicente Meza Gutiérrez (Docente ID 10)
(10, 'DICTAMEN', 'Se ha registrado formalmente tu dictamen APROBADO para el alumno Benito Daniel Flores.', TRUE, '2026-03-26 17:02:00'),

-- 11. Mtro. Carlos Alexis Hernández Flores (Docente ID 11)
(11, 'ENTREGA', 'El alumno Erik Damian Guardado subió el avance de Telemedicina para revisión.', FALSE, '2026-03-30 17:05:00'),

-- 12. Mtro. Gerardo Martínez Teran (Docente ID 12)
(12, 'DICTAMEN', 'Has otorgado el Dictamen Aprobado a la entrega de Gustavo Gutiérrez Llamas.', TRUE, '2026-03-14 10:32:00'),

-- 13. Mtro. Jorge Alberto Ramírez Ortega (Docente ID 13)
(13, 'ENTREGA', 'El alumno Armando Rodrigo Hernández ha subido el archivo de flujos del chatbot.', FALSE, '2026-04-06 15:42:00'),

-- 14. Mtro. Alfredo Netzahualcóyotl Torres López (Docente ID 14)
(14, 'ENTREGA', 'El alumno Christopher Jovanny Herrera subió la integración de hardware de Smart Home.', TRUE, '2026-04-10 18:02:00'),

-- 15. Mtro. Móises Carrera Núñez (Docente ID 15)
(15, 'GENERAL', 'Has sido asignado como Asesor principal del proyecto de Blockchain para Títulos.', TRUE, '2026-03-01 09:00:00'),

-- 16. Mtro. Héctor Alejandro Gálvez López (Docente ID 16)
(16, 'ENTREGA', 'El alumno Alberto López Sánchez subió la entrega con las observaciones atendidas.', FALSE, '2026-03-26 11:05:00'),

-- ============================================================
-- ESTUDIANTES (IDs 17 al 44)
-- ============================================================
-- 17. Marisol Huerta Catarino (ID 17)
(17, 'ENTREGA', 'La Mtra. María Daniela Rosas ha agregado observaciones a tu entrega ENT-02.', FALSE, '2026-03-22 14:31:00'),
(17, 'GENERAL', 'Recuerda que la fecha límite para subir el borrador de la Fase 2 es el 10 de Abril.', FALSE, '2026-04-01 08:00:00'),

-- 18. Laura Paola García Casillas (ID 18)
(18, 'GENERAL', 'Tu anteproyecto se encuentra actualmente en revisión por tu asesor el Mtro. Jeronimo Duran.', FALSE, '2026-04-12 09:25:00'),

-- 19. Isaí Plascencia Tapia (ID 19)
(19, 'DICTAMEN', 'Tu borrador de tesis ha recibido Dictamen Aprobado por parte del Mtro. Dayann Álvarez.', TRUE, '2026-03-30 11:20:00'),

-- 20. Héctor Jovany Padilla López (ID 20)
(20, 'ENTREGA', 'Se han registrado observaciones en tu avance del algoritmo de rutas.', FALSE, '2026-03-26 15:50:00'),

-- 21. Gaizka Alejandro Camacho Torres (ID 21)
(21, 'GENERAL', 'Bienvenido a TesisTrack. Recuerda subir tu anteproyecto antes de la fecha límite.', TRUE, '2026-04-02 10:00:00'),

-- 22. Jahir Israel Berumen García (ID 22)
(22, 'DICTAMEN', '¡Felicidades! Tu tesis definitiva ha sido aprobada. Puedes proceder a solicitar tu fecha de examen.', TRUE, '2026-04-03 10:35:00'),

-- 23. Orlando Fabián Fierros Garrido (ID 23)
(23, 'ENTREGA', 'Tu entrega del avance del modelo CNN ha sido recibida y está en revisión.', FALSE, '2026-04-09 16:25:00'),

-- 24. Benito Daniel Flores Rodríguez (ID 24)
(24, 'DICTAMEN', 'El Mtro. Vicente Meza ha emitido Dictamen Aprobado para tu proyecto de reconocimiento facial.', TRUE, '2026-03-26 17:05:00'),

-- 25. Ángel Alberto Gónzalez Flores (ID 25)
(25, 'GENERAL', 'Recuerda subir la documentación del anteproyecto para su asignación de revisión.', FALSE, '2026-04-10 14:00:00'),

-- 26. Erik Damian Guardado Rodríguez (ID 26)
(26, 'ENTREGA', 'Se requiere incluir la normativa de protección de datos médicos en tu entrega actual.', FALSE, '2026-04-01 11:25:00'),

-- 27. Gustavo Gutiérrez Llamas (ID 27)
(27, 'DICTAMEN', 'Tu tesis final sobre Análisis de Sentimientos ha sido aprobada exitosamente.', TRUE, '2026-03-28 09:20:00'),

-- 28. Armando Rodrigo Hernández Barba (ID 28)
(28, 'ENTREGA', 'Tu documento Flujos_Chatbot_v1.pdf se encuentra en revisión por el Mtro. Jorge Alberto.', FALSE, '2026-04-06 15:45:00'),

-- 29. Christopher Jovanny Herrera Rentería (ID 29)
(29, 'ENTREGA', 'Tu entrega del Borrador de Tesis ha sido registrada correctamente.', FALSE, '2026-04-10 18:05:00'),

-- 30. Miguel Ángel Lobo Nicolás (ID 30)
(30, 'GENERAL', 'Tu propuesta de anteproyecto Blockchain está asignada al Mtro. Móises Carrera.', TRUE, '2026-04-05 12:00:00'),

-- 31. Alberto López Sánchez (ID 31)
(31, 'ENTREGA', 'Tu asesor ha solicitado incluir la métrica F1-Score en los resultados de tu modelo.', FALSE, '2026-03-27 14:35:00'),

-- 32. César Medina Hernández (ID 32)
(32, 'DICTAMEN', 'Dictamen Aprobado emitido para tu proyecto de Realidad Aumentada.', TRUE, '2026-03-25 16:25:00'),

-- 33. Daniel Alejandro Medina Mena (ID 33)
(33, 'DICTAMEN', 'Tu anteproyecto ha sido rechazado debido a falta de viabilidad legal. Revisa el comentario del docente.', FALSE, '2026-04-03 09:05:00'),

-- 34. Manuel Osvaldo Montes Blancarte (ID 34)
(34, 'ENTREGA', 'Tu entrega Avance_SensoresPresion.pdf está en proceso de revisión.', FALSE, '2026-04-04 11:35:00'),

-- 35. Saul Emiliano Mora Famoso (ID 35)
(35, 'DICTAMEN', 'Tu documento final de tesis ha sido aprobado. Consulta con Coordinación el siguiente paso.', TRUE, '2026-03-23 15:35:00'),

-- 36. Itzel Arleth Padilla Segura (ID 36)
(36, 'GENERAL', 'Recuerda subir los avances correspondientes al módulo de expediente clínico.', FALSE, '2026-04-08 17:15:00'),

-- 37. Kevin Leonardo Pérez Beltrán (ID 37)
(37, 'ENTREGA', 'Tu entrega de Dictamen de Reciclaje con Visión por Computadora se encuentra en revisión.', FALSE, '2026-04-11 10:05:00'),

-- 38. Ramiro Preciado Martínez (ID 38)
(38, 'GENERAL', 'Tu documento de anteproyecto sobre Firma Digital está en cola de evaluación.', TRUE, '2026-04-07 09:00:00'),

-- 39. Gael Iosef Ramírez Marmolejo (ID 39)
(39, 'ENTREGA', 'El docente ha solicitado ajustar los parámetros de la mutación genética en tu implementación.', FALSE, '2026-04-03 16:20:00'),

-- 40. Marcos Karim Ramírez Medrano (ID 40)
(40, 'DICTAMEN', 'Dictamen Aprobado registrado para tu plataforma de voluntariado.', TRUE, '2026-03-22 10:50:00'),

-- 41. Eric Yael Reyes Romero (ID 41)
(41, 'GENERAL', 'Tu anteproyecto de AntiSpam fue recibido y asignado a evaluación.', TRUE, '2026-04-08 15:00:00'),

-- 42. Fernando Daniel Serrano Islas (ID 42)
(42, 'ENTREGA', 'Tu avance de Algoritmo de Triangulación con Beacons está en revisión.', FALSE, '2026-04-07 12:20:00'),

-- 43. Edgar Adrián Uribe Presas (ID 43)
(43, 'DICTAMEN', 'Tu tesis de automatización CI/CD ha sido aprobada formalmente.', TRUE, '2026-03-18 11:50:00'),

-- 44. Paulina Lizette Villalpando Guizar (ID 44)
(44, 'ENTREGA', 'Tu entrega del módulo de adopción responsable se encuentra en revisión por tu asesor.', FALSE, '2026-04-05 14:55:00');

-- ------------------------------------------------------------
-- 8. INSERTAR DISPONIBILIDAD DE HORARIOS DE DOCENTES
-- IDs Docentes: 2 al 16
-- ------------------------------------------------------------

INSERT INTO disponibilidad_docentes (docente_id, fecha_disponible, hora_inicio, hora_fin, modalidad, ubicacion, disponible) VALUES

-- Mtra. María Daniela Rosas García (ID 2)
(2, '2026-11-20', '10:00:00', '12:00:00', 'Presencial', 'Auditorio A - Edificio B', TRUE),
(2, '2026-11-22', '16:00:00', '18:00:00', 'Presencial', 'Sala de Grados - Edificio A', TRUE),

-- Mtro. Jeronimo Duran Curiel (ID 3)
(3, '2026-11-21', '09:00:00', '11:00:00', 'Presencial', 'Sala de Juntas 2', TRUE),
(3, '2026-11-25', '14:00:00', '16:00:00', 'Presencial', 'Laboratorio de Cómputo 3', TRUE),

-- Mtra. Rocío Athziri Padilla Medina (ID 4)
(4, '2026-11-20', '12:00:00', '14:00:00', 'Presencial', 'Laboratorio de Cómputo 1', TRUE),
(4, '2026-11-24', '10:00:00', '12:00:00', 'Presencial', 'Aula Magna - Edificio C', TRUE),

-- Mtra. Dayann Álvarez Ramos (ID 5)
(5, '2026-11-23', '08:00:00', '10:00:00', 'Presencial', 'Aula Magna - Edificio C', TRUE),
(5, '2026-11-26', '15:00:00', '17:00:00', 'Presencial', 'Sala de Exámenes 1', TRUE),

-- Mtro. Kalim Essau Brambila Cardenas (ID 6)
(6, '2026-11-21', '11:00:00', '13:00:00', 'Presencial', 'Sala de Maestros - Planta Alta', TRUE),

-- Mtra. Deborah Leticia Villaseñor Basulto (ID 7)
(7, '2026-11-24', '09:00:00', '11:00:00', 'Presencial', 'Auditorio B', TRUE),
(7, '2026-11-27', '11:00:00', '13:00:00', 'Presencial', 'Sala de Juntas 1', TRUE),

-- Mtro. Rúben Ulises Orozco Magallanes (ID 8)
(8, '2026-11-20', '16:00:00', '18:00:00', 'Presencial', 'Sala de Exámenes 1', TRUE),

-- Mtro. Noé Zermeño Mejía (ID 9)
(9, '2026-11-23', '10:00:00', '12:00:00', 'Presencial', 'Sala de Juntas 1', TRUE),
(9, '2026-11-25', '16:00:00', '18:00:00', 'Presencial', 'Auditorio Principal', TRUE),

-- Mtro. Vicente Meza Gutiérrez (ID 10)
(10, '2026-11-22', '09:00:00', '11:00:00', 'Presencial', 'Auditorio A - Edificio B', TRUE),

-- Mtro. Carlos Alexis Hernández Flores (ID 11)
(11, '2026-11-24', '14:00:00', '16:00:00', 'Presencial', 'Laboratorio de Innovación 2', TRUE),

-- Mtro. Gerardo Martínez Teran (ID 12)
(12, '2026-11-25', '11:00:00', '13:00:00', 'Presencial', 'Sala de Exámenes 2', TRUE),

-- Mtro. Jorge Alberto Ramírez Ortega (ID 13)
(13, '2026-11-26', '09:00:00', '11:00:00', 'Presencial', 'Aula 102 - Edificio D', TRUE),
(13, '2026-11-27', '17:00:00', '19:00:00', 'Presencial', 'Sala de Grados - Edificio A', TRUE),

-- Mtro. Alfredo Netzahualcóyotl Torres López (ID 14)
(14, '2026-11-23', '12:00:00', '14:00:00', 'Presencial', 'Sala de Juntas 2', TRUE),

-- Mtro. Móises Carrera Núñez (ID 15)
(15, '2026-11-26', '10:00:00', '12:00:00', 'Presencial', 'Aula 104 - Edificio D', TRUE),

-- Mtro. Héctor Alejandro Gálvez López (ID 16)
(16, '2026-11-27', '08:00:00', '10:00:00', 'Presencial', 'Auditorio Principal', TRUE);

-- ------------------------------------------------------------
-- 9. INSERTAR SOLICITUDES / AGENDADO DE EXAMEN
-- Únicamente para proyectos en Fase 3 (Dictamen) y Fase 4 (Examen/Finalizado)
-- ------------------------------------------------------------

INSERT INTO solicitudes_examen (proyecto_id, disponibilidad_id, opciones_horario, fecha_propuesta, hora_inicio, hora_fin, modalidad, ubicacion, estado) VALUES

-- Proyecto 3 (Isaí Plascencia - Fase 3)
(3, 5, 1, '2026-11-20', '12:00:00', '14:00:00', 'Presencial', 'Laboratorio de Cómputo 1', 'CONFIRMADO'),

-- Proyecto 6 (Jahir Israel Berumen - Fase 4)
(6, 10, 1, '2026-11-24', '09:00:00', '11:00:00', 'Presencial', 'Auditorio B', 'CONFIRMADO'),

-- Proyecto 8 (Benito Daniel Flores - Fase 3)
(8, 12, 1, '2026-11-23', '10:00:00', '12:00:00', 'Presencial', 'Sala de Juntas 1', 'CONFIRMADO'),

-- Proyecto 11 (Gustavo Gutiérrez Llamas - Fase 4)
(11, 16, 1, '2026-11-25', '11:00:00', '13:00:00', 'Presencial', 'Sala de Exámenes 2', 'CONFIRMADO'),

-- Proyecto 13 (Christopher Jovanny Herrera - Fase 3)
(13, 19, 1, '2026-11-23', '12:00:00', '14:00:00', 'Presencial', 'Sala de Juntas 2', 'PENDIENTE'),

-- Proyecto 16 (César Medina Hernández - Fase 3)
(16, 2, 1, '2026-11-22', '16:00:00', '18:00:00', 'Presencial', 'Sala de Grados - Edificio A', 'CONFIRMADO'),

-- Proyecto 19 (Saul Emiliano Mora - Fase 4)
(19, 7, 1, '2026-11-23', '08:00:00', '10:00:00', 'Presencial', 'Aula Magna - Edificio C', 'CONFIRMADO'),

-- Proyecto 21 (Kevin Leonardo Pérez - Fase 3)
(21, 11, 1, '2026-11-27', '11:00:00', '13:00:00', 'Presencial', 'Sala de Juntas 1', 'PENDIENTE'),

-- Proyecto 24 (Marcos Karim Ramírez - Fase 3)
(24, 14, 1, '2026-11-22', '09:00:00', '11:00:00', 'Presencial', 'Auditorio A - Edificio B', 'CONFIRMADO'),

-- Proyecto 27 (Edgar Adrián Uribe - Fase 4)
(27, 17, 1, '2026-11-26', '09:00:00', '11:00:00', 'Presencial', 'Aula 102 - Edificio D', 'CONFIRMADO');

-- ------------------------------------------------------------
-- 10. INSERTAR ACTAS OFICIALES (Únicamente para proyectos FINALIZADOS)
-- Proyectos con estado 'FINALIZADO': IDs 6, 11, 19 y 27
-- ------------------------------------------------------------

INSERT INTO actas (proyecto_id, folio, codigo_qr_hash, archivo_acta_url, fecha_expedicion) VALUES

-- 1. Jahir Israel Berumen García (Proyecto 6)
(6, 'ACTA-2026-0089', 'hash_qr_verificacion_oficial_udg_9921', '/uploads/actas/acta_titulacion_jahir_berumen.pdf', '2026-10-15 12:00:00'),

-- 2. Gustavo Gutiérrez Llamas (Proyecto 11)
(11, 'ACTA-2026-0090', 'hash_qr_verificacion_oficial_udg_9922', '/uploads/actas/acta_titulacion_gustavo_gutierrez.pdf', '2026-10-16 10:30:00'),

-- 3. Saul Emiliano Mora Famoso (Proyecto 19)
(19, 'ACTA-2026-0091', 'hash_qr_verificacion_oficial_udg_9923', '/uploads/actas/acta_titulacion_saul_mora.pdf', '2026-10-17 11:15:00'),

-- 4. Edgar Adrián Uribe Presas (Proyecto 27)
(27, 'ACTA-2026-0092', 'hash_qr_verificacion_oficial_udg_9924', '/uploads/actas/acta_titulacion_edgar_uribe.pdf', '2026-10-18 14:00:00');

-- Reactivar la revisión de llaves foráneas
SET FOREIGN_KEY_CHECKS = 1;