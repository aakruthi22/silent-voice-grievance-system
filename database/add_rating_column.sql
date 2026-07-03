-- Migration script to add rating column to existing grievance table
-- Run this if you already have the database set up

USE grievance_system;

ALTER TABLE grievance 
ADD COLUMN rating INT CHECK (rating >= 1 AND rating <= 5) AFTER admin_id;

