var express = require("express");
var cors = require('cors');
var app = express();

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "123456789",
    database: "tecbikeweb"
});

app.use(cors());
app.use(express.json());

app.get("/bike", (req, resp) => {
    console.log("GET - Bike");

    connection.query("SELECT * FROM bike", (err, result) => {

        if (err) {
            console.log(err);
            resp.status(500).end();
        } else {
            resp.status(200);
            resp.json(result);
        }
    })
});

app.post("/bike", (req, resp) => {
    var bike = req.body;
    console.log("POST - Bike");

    connection.query("INSERT INTO bike SET ?", [bike], (err, result) => {

        if (err) {
            console.log(err);
            resp.status(500).end();
        } else {
            resp.status(200);
            resp.json(result.insertedId);
        }
    });
});

app.get("/bike/:bikeId", (req, resp) => {
    var bikeId = req.params.bikeId
    console.log("GET - BikeId: " + bikeId);

    connection.query("SELECT * FROM bike WHERE id = ?", [bikeId], (err, result) => {

        if (err) {
            console.log(err);
            resp.status(500).end();
        } else {
            resp.status(200);
            resp.json(result);
        }
    });
});

app.put("/bike/:bikeId", (req, resp) => {
    var bikeId = req.params.bikeId;
    var bike = req.body;
    console.log("PUT - BikeId: " + bikeId);

    connection.query("UPDATE bike SET ? WHERE id = ?", [bike, bikeId], (err, result) => {

        if (err) {
            console.log(err);
            resp.status(500).end();
        } else {
            resp.status(200).end();            
        }
    });
});

app.delete("/bike/:bikeId", (req, resp) => {
    var bikeId = req.params.bikeId;
    console.log("DELETE - BikeId: " + bikeId);

    connection.query("DELETE FROM bike WHERE id = ?", [bikeId], (err, result) => {

        if (err) {
            console.log(err);
            resp.status(500).end();
        } else {
            resp.status(200).end();            
        }
    });
});

app.listen(3000, () => {
    console.log('TecBikeApp - Port 3000!');
});