-- Migrate existing approved_packages JSON data to user_packages table
INSERT INTO user_packages (user_id, package_id, approved_at)
SELECT
  u.id as user_id,
  JSON_UNQUOTE(JSON_EXTRACT(ap.value, '$')) as package_id,
  u.created_at as approved_at
FROM users u
CROSS JOIN JSON_TABLE(u.approved_packages, '$[*]' COLUMNS (value JSON PATH '$')) ap
WHERE u.approved_packages IS NOT NULL
  AND u.approved_packages != '[]'
  AND JSON_VALID(u.approved_packages)
ON DUPLICATE KEY UPDATE approved_at = VALUES(approved_at);

-- Optional: Remove approved_packages column after migration
-- ALTER TABLE users DROP COLUMN approved_packages;
