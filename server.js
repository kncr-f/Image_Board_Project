const express = require('express');
const db = require("./sql/db")
const app = express();


// const sweets = [
//     {
//         id: 1,
//         name: "cupcake",
//         emoji: "🧁"
//     },
//     {
//         id: 2,
//         name: "custard",
//         emoji: "🍮"
//     },
//     {
//         id: 3,
//         name: "mooncake",
//         emoji: "🥮"
//     }
// ]

app.use(express.static('./public'));

app.use(express.json());    //this middleware helps us properly access 
//incoming requests of contetn type application/json


app.get("/getImages", (req, res) => {

    db.getAllImages()
        .then(({ rows }) => {
            console.log('rows', rows);
            res.json(rows);
        }).catch((err) => {
            console.log('err with getting images', err)
        })
    // console.log('GET/sweets.json');
    // res.json(sweets); // instead of res.render we now use res.json to send over data to the clientside in json format
});



// this route should come below any route that hte server has to serve data to hte client side
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));