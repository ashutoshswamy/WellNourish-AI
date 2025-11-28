-- Add goal column to generated_plans table
-- This ensures each plan stores the goal it was generated for

ALTER TABLE generated_plans
ADD COLUMN goal goal_type;

-- Add an index for querying plans by goal
CREATE INDEX idx_generated_plans_goal ON generated_plans(goal);

-- Add a comment explaining the column
COMMENT ON COLUMN generated_plans.goal IS 'The fitness/health goal this plan was generated for';
