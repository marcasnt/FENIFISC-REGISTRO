-- Eliminar la columna status de la tabla competitions
ALTER TABLE competitions DROP COLUMN IF EXISTS status;

-- Actualizar la tabla para que sea más simple
-- Las competencias ahora son simplemente anuncios generales
-- Los atletas pueden inscribirse basándose en las fechas límite
