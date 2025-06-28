-- Insertar datos iniciales para el sistema FENIFISC

-- Insertar categorías
INSERT INTO categories (name, description, gender) VALUES
('Men''s Physique', 'Categoría masculina enfocada en físico atlético y proporcionado', 'male'),
('Classic Physique', 'Categoría masculina que combina masa muscular con estética clásica', 'male'),
('Bodybuilding', 'Categoría masculina de culturismo tradicional', 'male'),
('Women''s Physique', 'Categoría femenina de físico atlético', 'female'),
('Bikini', 'Categoría femenina enfocada en forma física y presentación', 'female'),
('Wellness', 'Categoría femenina que combina físico atlético con feminidad', 'female'),
('Figure', 'Categoría femenina de desarrollo muscular moderado', 'female');

-- Insertar competencias de ejemplo
INSERT INTO competitions (name, description, date, location, registration_deadline, max_registrations) VALUES
('Campeonato Nacional FENIFISC 2024', 'El evento más importante del año para el físico culturismo nicaragüense', '2024-08-15', 'Managua, Nicaragua', '2024-07-15', 50),
('Copa Centroamericana', 'Competencia internacional que reúne a los mejores atletas de Centroamérica', '2024-09-20', 'San José, Costa Rica', '2024-08-20', 40),
('Torneo Regional Norte', 'Competencia regional para atletas del norte del país', '2024-07-10', 'Estelí, Nicaragua', '2024-06-25', 30);

-- Obtener IDs de categorías para las relaciones
WITH category_ids AS (
    SELECT id, name FROM categories
),
competition_ids AS (
    SELECT id, name FROM competitions
)

-- Asociar categorías con competencias
INSERT INTO competition_categories (competition_id, category_id)
SELECT c.id, cat.id
FROM competition_ids c, category_ids cat
WHERE (c.name = 'Campeonato Nacional FENIFISC 2024' AND cat.name IN ('Men''s Physique', 'Classic Physique', 'Bodybuilding', 'Women''s Physique'))
   OR (c.name = 'Copa Centroamericana' AND cat.name IN ('Bikini', 'Wellness', 'Figure', 'Men''s Physique'))
   OR (c.name = 'Torneo Regional Norte' AND cat.name IN ('Classic Physique', 'Bodybuilding', 'Bikini'));

-- Insertar atletas de ejemplo
INSERT INTO athletes (first_name, last_name, email, phone, cedula, address, status) VALUES
('Carlos', 'Mendoza', 'carlos.mendoza@email.com', '+505 8888-1111', '001-010190-0001A', 'Managua, Nicaragua', 'approved'),
('María', 'González', 'maria.gonzalez@email.com', '+505 8888-2222', '001-020291-0002B', 'León, Nicaragua', 'pending'),
('José', 'Rodríguez', 'jose.rodriguez@email.com', '+505 8888-3333', '001-030392-0003C', 'Granada, Nicaragua', 'approved'),
('Ana', 'López', 'ana.lopez@email.com', '+505 8888-4444', '001-040493-0004D', 'Masaya, Nicaragua', 'approved'),
('Roberto', 'Martínez', 'roberto.martinez@email.com', '+505 8888-5555', '001-050594-0005E', 'Estelí, Nicaragua', 'pending');

-- Asociar atletas con categorías (usando los IDs generados)
WITH athlete_data AS (
    SELECT id, first_name, last_name FROM athletes
),
category_data AS (
    SELECT id, name FROM categories
)
INSERT INTO athlete_categories (athlete_id, category_id)
SELECT a.id, c.id
FROM athlete_data a, category_data c
WHERE (a.first_name = 'Carlos' AND a.last_name = 'Mendoza' AND c.name IN ('Men''s Physique', 'Classic Physique'))
   OR (a.first_name = 'María' AND a.last_name = 'González' AND c.name IN ('Bikini', 'Wellness'))
   OR (a.first_name = 'José' AND a.last_name = 'Rodríguez' AND c.name IN ('Bodybuilding'))
   OR (a.first_name = 'Ana' AND a.last_name = 'López' AND c.name IN ('Figure', 'Women''s Physique'))
   OR (a.first_name = 'Roberto' AND a.last_name = 'Martínez' AND c.name IN ('Classic Physique'));

-- Crear algunas inscripciones de ejemplo
WITH athlete_comp_data AS (
    SELECT 
        a.id as athlete_id,
        c.id as competition_id,
        a.first_name,
        a.last_name,
        c.name as comp_name
    FROM athletes a, competitions c
)
INSERT INTO registrations (athlete_id, competition_id, status)
SELECT athlete_id, competition_id, 'confirmed'
FROM athlete_comp_data
WHERE (first_name = 'Carlos' AND last_name = 'Mendoza' AND comp_name = 'Campeonato Nacional FENIFISC 2024')
   OR (first_name = 'María' AND last_name = 'González' AND comp_name = 'Copa Centroamericana')
   OR (first_name = 'José' AND last_name = 'Rodríguez' AND comp_name = 'Campeonato Nacional FENIFISC 2024')
   OR (first_name = 'Ana' AND last_name = 'López' AND comp_name = 'Copa Centroamericana')
   OR (first_name = 'Roberto' AND last_name = 'Martínez' AND comp_name = 'Torneo Regional Norte');
