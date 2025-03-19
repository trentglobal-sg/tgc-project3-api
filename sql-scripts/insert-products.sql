-- Insert the product and get its auto-generated ID
INSERT INTO products (product, description, cost, created_date, product_image_url, product_thumbnail_url, fit_id, micron_id, blend_id, activity_id, gender_id, category_id, brand_id)
VALUES 
('Icebreaker Merino 200 Oasis Long Sleeve Crew', 
'Lightweight merino wool base layer, perfect for hiking, running, and cold-weather layering. Naturally breathable and odor-resistant.', 
990, '2025-03-19', 
'http://res.cloudinary.com/dg6ci8nip/image/upload/v1742372838/rtm75baij6vuj4skchlt.webp', 
'https://res.cloudinary.com/dg6ci8nip/image/upload/c_limit,h_60,w_90/v1742372838/rtm75baij6vuj4skchlt.jpg', 
2, 3, 2, 2, 2, 2, 2);

-- Get the new product's ID
SET @product_id = LAST_INSERT_ID();

-- Insert variants linked to the new product
INSERT INTO variants (variant_image_url, variant_thumbnail_url, color_code, color_name, product_id)
VALUES
('http://res.cloudinary.com/dg6ci8nip/image/upload/v1742372933/aaq6u8reg66z8fkmcyiq.jpg', 
 'https://res.cloudinary.com/dg6ci8nip/image/upload/c_limit,h_60,w_90/v1742372933/aaq6u8reg66z8fkmcyiq.jpg', 
 'RED', 'Red', @product_id),
 
('http://res.cloudinary.com/dg6ci8nip/image/upload/v1742372999/f7mec3smbumzx1fb2pv3.webp', 
 'https://res.cloudinary.com/dg6ci8nip/image/upload/c_limit,h_60,w_90/v1742372999/f7mec3smbumzx1fb2pv3.jpg', 
 'GREEN', 'Green', @product_id),

('http://res.cloudinary.com/dg6ci8nip/image/upload/v1742373277/nwapqigndktwoio9trkd.jpg', 
 'https://res.cloudinary.com/dg6ci8nip/image/upload/c_limit,h_60,w_90/v1742373277/nwapqigndktwoio9trkd.jpg', 
 'BLUE', 'Blue', @product_id);
