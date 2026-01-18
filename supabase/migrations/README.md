# Database Migrations

This directory contains the database migrations for the WellNourish AI project.

## Workflow

1.  **Schema Definition**: The initial schema is defined in `20260118124831_init.sql`.
2.  **Adding Changes**: To modify the database schema:
    *   Create a new `.sql` file in this directory.
    *   Name the file with a timestamp prefix, e.g., `YYYYMMDDHHMMSS_description.sql`.
    *   Write your SQL commands (CREATE, ALTER, DROP, etc.) in the file.
3.  **Deploying**: Apply these migrations to your Supabase project using the Supabase CLI or dashboard SQL editor.

## Current Schema

- `profiles`: Stores user health data and preferences.
- `generated_plans`: Stores AI-generated diet and workout plans.
