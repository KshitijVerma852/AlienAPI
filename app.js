const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const { Router } = require("express");

const app = express();

mongoose.connect("mongodb://localhost:27017/alienDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const alienSchema = new mongoose.Schema({
    name: String,
    tech: String,
    sub: {
        type: Boolean,
        default: false,
    },
});

const Alien = mongoose.model("Alien", alienSchema);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.static("public"));

app.use(
    bodyParser.urlencoded({
        extended: true,
        useUnifiedTopology: true,
    })
);

app.route("/aliens")
    .get((req, res) => {
        Alien.find((err, alien) => {
            if (!err) {
                res.render("home", { alien: alien });
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        if (req.body.sub !== true) {
            req.body.sub = false;
        }
        const newAlienData = {
            name: req.body.name,
            tech: req.body.tech,
            sub: req.body.sub,
        };
        Alien.insertMany(newAlienData, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Success");
            }
        });
    });

app.route("/alien/:name")
    .put((req, res) => {
        const findData = {
            name: req.params.name,
        };
        const updateData = {
            name: req.body.name,
            tech: req.body.tech,
            sub: req.body.sub,
        };
        Alien.findOneAndUpdate(
            findData,
            updateData,
            { useFindAndModify: false },
            (err, result) => {
                if (!err) {
                    res.send(result);
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch((req, res) => {
        Alien.updateOne(
            { name: req.params.name },
            {
                $set: req.body,
            },
            (err) => {
                if (!err) {
                    res.send("Success");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, () => {
    console.log("http://localhost:3000/aliens");
});
