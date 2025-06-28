-- Actualizar categorías con las especificaciones oficiales de FENIFISC

-- Primero eliminar las categorías existentes
DELETE FROM athlete_categories;
DELETE FROM competition_categories;
DELETE FROM categories;

-- Insertar las nuevas categorías masculinas
INSERT INTO categories (id, name, description, gender, created_at) VALUES
-- Bodybuilding por peso
('bodybuilding-65', 'Bodybuilding hasta 65kg', 'Categoría masculina hasta 65kg', 'male', NOW()),
('bodybuilding-70', 'Bodybuilding hasta 70kg', 'Categoría masculina hasta 70kg', 'male', NOW()),
('bodybuilding-75', 'Bodybuilding hasta 75kg', 'Categoría masculina hasta 75kg', 'male', NOW()),
('bodybuilding-80', 'Bodybuilding hasta 80kg', 'Categoría masculina hasta 80kg', 'male', NOW()),
('bodybuilding-85', 'Bodybuilding hasta 85kg', 'Categoría masculina hasta 85kg', 'male', NOW()),
('bodybuilding-85plus', 'Bodybuilding más de 85kg', 'Categoría masculina más de 85kg', 'male', NOW()),

-- Men's Physique por altura
('mens-physique-174', 'Men''s Physique hasta 1.74m', 'Categoría masculina hasta 1.74m de altura', 'male', NOW()),
('mens-physique-174plus', 'Men''s Physique más de 1.74m', 'Categoría masculina más de 1.74m de altura', 'male', NOW()),

-- Físico Clásico por altura
('fisico-clasico-171', 'Físico Clásico hasta 1.71m', 'Categoría masculina hasta 1.71m de altura', 'male', NOW()),
('fisico-clasico-171plus', 'Físico Clásico más de 1.71m', 'Categoría masculina más de 1.71m de altura', 'male', NOW()),

-- Classic Physique por altura
('classic-physique-171', 'Classic Physique hasta 1.71m', 'Categoría masculina hasta 1.71m de altura', 'male', NOW()),
('classic-physique-171plus', 'Classic Physique más de 1.71m', 'Categoría masculina más de 1.71m de altura', 'male', NOW()),

-- Categorías femeninas
('womens-physique', 'Women''s Physique', 'Única categoría femenina', 'female', NOW()),
('bikini-alta', 'Bikini Categoría Alta', 'Categoría femenina bikini alta', 'female', NOW()),
('bikini-baja', 'Bikini Categoría Baja', 'Categoría femenina bikini baja', 'female', NOW()),
('body-fitness-alta', 'Body Fitness Categoría Alta', 'Categoría femenina body fitness alta', 'female', NOW()),
('body-fitness-baja', 'Body Fitness Categoría Baja', 'Categoría femenina body fitness baja', 'female', NOW()),
('wellness', 'Wellness', 'Categoría libre femenina', 'female', NOW());

-- Asociar todas las categorías con las competencias existentes
WITH category_ids AS (
    SELECT id, name FROM categories
),
competition_ids AS (
    SELECT id, name FROM competitions
)
INSERT INTO competition_categories (competition_id, category_id)
SELECT c.id, cat.id
FROM competition_ids c
CROSS JOIN category_ids cat
WHERE c.name IN ('Campeonato Nacional FENIFISC 2024', 'Copa Centroamericana', 'Torneo Regional Norte');

-- Actualizar atletas existentes con nuevas categorías (ejemplo)
-- Nota: Esto es solo un ejemplo, en producción se debería hacer manualmente
WITH athlete_data AS (
    SELECT id, first_name, last_name FROM athletes
),
category_data AS (
    SELECT id, name FROM categories
)
INSERT INTO athlete_categories (athlete_id, category_id)
SELECT a.id, c.id
FROM athlete_data a, category_data c
WHERE (a.first_name = 'Carlos' AND a.last_name = 'Mendoza' AND c.name IN ('Men''s Physique hasta 1.74m', 'Classic Physique hasta 1.71m'))
   OR (a.first_name = 'María' AND a.last_name = 'González' AND c.name IN ('Bikini Categoría Alta', 'Wellness'))
   OR (a.first_name = 'José' AND a.last_name = 'Rodríguez' AND c.name IN ('Bodybuilding hasta 80kg'))
   OR (a.first_name = 'Ana' AND a.last_name = 'López' AND c.name IN ('Body Fitness Categoría Alta', 'Women''s Physique'))
   OR (a.first_name = 'Roberto' AND a.last_name = 'Martínez' AND c.name IN ('Classic Physique hasta 1.71m'));

-- Verificar que las categorías se insertaron correctamente
SELECT * FROM categories ORDER BY gender, name;
