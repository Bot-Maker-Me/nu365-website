# Update Site Settings in Database

The old email "support@thenu365.com" and address "123 Research Way, Toronto, ON, Canada" are stored in your Supabase database. To fix this, you need to update the database.

## Steps to Update:

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste this SQL:
   ```sql
   UPDATE site_settings 
   SET 
     email = 'hnayel@yahoo.com',
     address = 'Cambridge, MA',
     updated_at = now()
   WHERE id = 1;
   ```
5. Click **Run** to execute

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:
```bash
supabase db execute --file scripts/update-site-settings.sql
```

### Option 3: Using psql command line

```bash
psql -h your-project.supabase.co -U postgres -d postgres -f scripts/update-site-settings.sql
```

## Verify the Update

After running the update, you can verify it worked by running:
```sql
SELECT * FROM site_settings WHERE id = 1;
```

You should see:
- email: `hnayel@yahoo.com`
- address: `Cambridge, MA`

## Clear Cache

After updating the database, the website should automatically pick up the new settings. If you still see the old values, try:
1. Hard refresh the website (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. The settings are cached in the browser, so it may take a few minutes to update
