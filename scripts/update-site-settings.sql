-- Update site settings to use correct email and address
UPDATE site_settings 
SET 
  email = 'hnayel@yahoo.com',
  address = 'Cambridge, MA',
  updated_at = now()
WHERE id = 1;
