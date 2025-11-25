/**
 * Migration script to add 'title' column to packages_content table
 */

module.exports = {
  up: async (db) => {
    await db.query("ALTER TABLE packages_content ADD COLUMN title VARCHAR(255) NULL");
  },

  down: async (db) => {
    await db.query("ALTER TABLE packages_content DROP COLUMN title");
  }
};
