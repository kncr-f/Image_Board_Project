// write some query
const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL ||
    `postgres:postgres:pstgres@localhost:5432/imageboard`);

module.exports.getAllImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC`);
}