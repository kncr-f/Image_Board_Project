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

app.use(express.json());    //this middleware helps us properly access 
//incoming requests of contetn type application/json


app.get("/getImages", (req, res) => {

    db.getAllImages()
        .then(({ rows }) => {
            //console.log('rows', rows);
            res.json(rows);
        }).catch((err) => {
            console.log('err with getting images', err)
        })

});

app.post("/upload", uploder.single("file"), s3.upload, (req, res) => {
    const { title, description, username } = req.body;
    let url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`
    console.log("req.file...", req.file);
    // console.log('req.file', req.file);
    // console.log('req.body', req.body);

    db.uploadImage(url, title, description, username)
        .then(({ rows }) => {
            console.log("uploadImage in server...", rows);
            res.json(rows);
        }).catch((err) => {
            console.log(err)
        })


});

// this route should come below any route that hte server has to serve data to hte client side
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));