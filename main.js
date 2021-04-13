var express = require("express");
var cors = require('cors');
var jwt = require('jsonwebtoken');
var app = express();

var mysql = require("mysql");
const { response } = require("express");
var connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "123456789",
    database: "tecbikeweb"
});

app.use(cors());
app.use(express.json());

app.post('/auth', (req, resp) => {
    var user = req.body;

    connection.query("SELECT * FROM usuario WHERE nome = ? and senha = ?", [user.nome, user.senha], (err, result) => {
        if (result.length == 0) {
            resp.status(401);
            resp.send({token: null, usuario: null, success: false});
        } else {
            var usuario = result[0];
            let token = jwt.sign({id: usuario.nome}, 'tecbikeweb', {expiresIn: 6000});
            resp.status(200);
            resp.send({token: token, usuario: usuario, success: true});
        }
    });
});

verifica_token = (req, resp, next) => {
    var token = req.headers['x-access-token'];

    if (!token) {
        return resp.status(401).end();
    }

    jwt.verify(token, 'tecbikeweb', (err, decoded) => {
        if (err)
            return resp.status(401).end();

        req.usuario = decoded.id;
        next();
    });
}

app.get("/bike", verifica_token, (req, resp) => {
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

app.post("/bike", verifica_token, (req, resp) => {
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

app.get("/bike/:bikeId", verifica_token, (req, resp) => {
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

app.put("/bike/:bikeId", verifica_token, (req, resp) => {
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

app.delete("/bike/:bikeId", verifica_token, (req, resp) => {
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