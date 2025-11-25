/**
 * Migration script to add 'image' column to packages_content table
 */

module.exports = {
  up: async (db) => {
    await db.query("ALTER TABLE packages_content ADD COLUMN image VARCHAR(255) NULL");
  },

  down: async (db) => {
    await db.query("ALTER TABLE packages_content DROP COLUMN image");
  }
};
