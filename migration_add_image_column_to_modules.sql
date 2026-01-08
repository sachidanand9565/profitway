-- Migration to add image column to modules table
ALTER TABLE modules ADD COLUMN image VARCHAR(500) AFTER description;