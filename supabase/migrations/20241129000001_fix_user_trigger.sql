-- Fix the handle_new_user trigger to handle edge cases
-- This fixes "Database error saving new user" issues

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Replace the function with a more robust version
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
BEGIN
    -- Get email from multiple possible sources
    user_email := COALESCE(
        NEW.email,
        NEW.raw_user_meta_data->>'email',
        NEW.raw_app_meta_data->>'email'
    );
    
    -- Get full name from metadata (OAuth providers like Google put it here)
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'user_name',
        NULL
    );
    
    -- Only insert if we have an email
    IF user_email IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (NEW.id, user_email, user_full_name)
        ON CONFLICT (id) DO UPDATE SET
            email = COALESCE(EXCLUDED.email, profiles.email),
            full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle case where email already exists (user might be linking accounts)
        -- Update the existing profile instead
        UPDATE public.profiles
        SET 
            full_name = COALESCE(user_full_name, full_name),
            updated_at = NOW()
        WHERE email = user_email OR id = NEW.id;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
