// write some query
const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL ||
    `postgres:postgres:pstgres@localhost:5432/imageboard`);

module.exports.getAllImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC`);
}

module.exports.uploadImage = (url, username, title, description) => {
    return db.query(`
    INSERT INTO images (url,username,title,description)
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
        [url, username, title, description]
    )
}

module.exports.getImageFromId = (id) => {
    return db.query(`SELECT 
                    images.id, 
                    images.url, 
                    images.username, 
                    images.title, 
                    images.description 
                    FROM images 
                    WHERE images.id = $1`,
        [id]);
}


module.exports.getCommentsFromImgId = (id) => {
    return db.query(`SELECT 
                    comments.comment_id, 
                    comments.comment_text, 
                    comments.comment_username, 
                    comments.img_id
                    FROM comments 
                    WHERE img_id = $1`,
        [id]);
}

module.exports.uploadComment = (comment, username, img_id) => {
    return db.query(`
    INSERT INTO comments (comment_text, comment_username, img_id)
    VALUES ($1,$2,$3)
    RETURNING *`,
        [comment, username, img_id]
    )
}