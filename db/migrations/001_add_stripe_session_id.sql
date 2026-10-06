-- Add stripe_session_id column to carts table for Stripe Checkout Session tracking.
ALTER TABLE carts
  ADD COLUMN stripe_session_id VARCHAR(255) NULL AFTER photos_folder,
  ADD INDEX idx_stripe_session (stripe_session_id);