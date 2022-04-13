const express = require('express');
const db = require("./sql/db");
const s3 = require("./s3");
const app = express();
//requireing the three things below to process my file data on the server side
const multer = require("multer"); // for handling 
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "/uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploder = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static('./public'));

app.use(express.json());

app.get("/getImages", (req, res) => {

    db.getAllImages()
        .then(({ rows }) => {

            res.json(rows);
        }).catch((err) => {
            console.log('err with getting images', err)
        })

});

app.get("/getImageFromId/:id", (req, res) => {

    db.getImageFromId(req.params.id)
        .then(({ rows }) => {

            res.json(rows);
        })
        .catch((err) => {
            console.log('err with getting imageFromId', err)

        })

});


app.get("/getComments/:imageId", (req, res) => {


    db.getCommentsFromImgId(req.params.imageId)
        .then(({ rows }) => {

            res.json(rows);
        }).catch((err) => {
            console.log('err with getting CommentsFromImgId', err)
        })

});

app.get("/getMoreImages/:lowestId", (req, res) => {

    db.getMoreImages(req.params.lowestId)
        .then(({ rows }) => {

            res.json(rows);
        }).catch((err) => {
            console.log('err with getting images', err)
        })


})

app.post("/upload", uploder.single("file"), s3.upload, (req, res) => {

    const { title, description, username } = req.body;
    let url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`




    db.uploadImage(url, username, title, description)
        .then(({ rows }) => {

            res.json(rows[0]);
        }).catch((err) => {
            console.log(err)
        })


});

app.post("/postComment", (req, res) => {

    const { comment, username, img_id } = req.body;
    db.uploadComment(comment, username, img_id)
        .then(({ rows }) => {

            res.json(rows[0]);
        })
        .catch((err) => {
            console.log(err)
        })

})


app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));