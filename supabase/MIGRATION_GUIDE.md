# Supabase Migration Guide

## Overview
This guide provides instructions for running the database migrations for the WellNourish AI application.

## Prerequisites

1. **Supabase CLI installed**
   ```bash
   npm install -g supabase
   ```

2. **Supabase project created**
   - Create a project at [supabase.com](https://supabase.com)
   - Note your project reference ID and database password

3. **Environment variables configured**
   - Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Migration Steps

### Option 1: Using Supabase CLI (Recommended)

#### 1. Initialize Supabase in your project
```bash
supabase init
```

#### 2. Link to your remote project
```bash
supabase link --project-ref your-project-ref
```

#### 3. Push migrations to remote database
```bash
supabase db push
```

This will execute all migration files in the `supabase/migrations` directory.

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/20231128000001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 3: Using Supabase Client

If you prefer programmatic execution:

```typescript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sql = fs.readFileSync(
  './supabase/migrations/20231128000001_initial_schema.sql',
  'utf8'
);

const { error } = await supabase.rpc('exec', { sql });
if (error) console.error('Migration failed:', error);
```

## Verification Steps

After running migrations, verify the setup:

### 1. Check Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `profiles`
- `user_preferences`
- `generated_plans`

### 2. Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 3. Check Indexes
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 4. Test Profile Creation
```typescript
// Test creating a user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .single();

console.log('Profile test:', { data, error });
```

## Smart Migration Strategy

### Development Environment
1. Use Supabase local development:
   ```bash
   supabase start
   supabase db reset  # Reset local DB when needed
   ```

2. Make schema changes in migration files
3. Test locally before pushing to production

### Staging/Production Environment
1. **Always backup before migrations:**
   ```bash
   # Create a backup
   supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test migrations on staging first:**
   ```bash
   supabase link --project-ref staging-project-ref
   supabase db push
   ```

3. **Run migrations during low-traffic periods**

4. **Monitor after deployment:**
   - Check logs in Supabase dashboard
   - Verify RLS policies are working
   - Test authentication flow

## Rolling Back Migrations

If you need to rollback:

### Option 1: Manual Rollback
Create a rollback migration file:

```sql
-- supabase/migrations/20231128000002_rollback_initial_schema.sql

-- Drop tables in reverse order
DROP TABLE IF EXISTS generated_plans CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS activity_level CASCADE;
DROP TYPE IF EXISTS dietary_preference CASCADE;
DROP TYPE IF EXISTS goal_type CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS calculate_bmi(NUMERIC, NUMERIC) CASCADE;
DROP FUNCTION IF EXISTS calculate_age(DATE) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### Option 2: Restore from Backup
```bash
psql -h db.your-project.supabase.co -U postgres -d postgres -f backup_file.sql
```

## Adding Future Migrations

When adding new migrations:

1. **Name with timestamp:**
   ```
   supabase/migrations/YYYYMMDDHHMMSS_description.sql
   ```

2. **Always include up and down migrations**

3. **Test thoroughly in development**

4. **Document breaking changes**

Example new migration:
```sql
-- supabase/migrations/20231129000001_add_user_achievements.sql

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);
```

## Troubleshooting

### Common Issues

1. **"relation already exists" error**
   - Tables already exist. Either drop them or use `CREATE TABLE IF NOT EXISTS`

2. **RLS policies preventing queries**
   - Verify you're authenticated: `const { data: { user } } = await supabase.auth.getUser()`
   - Check policy conditions match your use case

3. **Foreign key constraint violations**
   - Ensure parent records exist before creating child records
   - Check cascade delete settings

4. **Permission denied errors**
   - Use service role key for admin operations
   - Regular anon key for client-side operations

### Getting Help

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **GitHub Issues:** Check for similar issues in Supabase repo

## Best Practices

1. ✅ Always use migrations for schema changes
2. ✅ Version control your migration files
3. ✅ Test migrations locally first
4. ✅ Create backups before production migrations
5. ✅ Use meaningful migration names
6. ✅ Document complex changes
7. ✅ Keep migrations idempotent when possible
8. ✅ Monitor database performance after migrations

## Next Steps

After successful migration:

1. **Set up Supabase client in your app:**
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';
   import { Database } from '@/types/database.types';

   export const supabase = createClient<Database>(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```

2. **Test authentication flow**

3. **Implement data fetching hooks**

4. **Set up real-time subscriptions (optional)**

5. **Configure storage buckets for user avatars (optional)**
