const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/crudDb');

const recordSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Record = mongoose.model('Record', recordSchema);

//Routes

app.post("/add", async(req, res)=>{
    const record = new Record({
        name: req.body.name,
        age: req.body.age
    });
    await record.save();
    res.redirect("/");
})

app.get("/", async (req, res)=>{
    const records = await Record.find();
    res.render("index",{ records })
})

app.post('/edit/:id', async(req, res) => {
    const record = await Record.findById(req.params.id);
    record.name = req.body.name;
    record.age = req.body.age;
    await record.save();
    res.redirect("/");
})

app.post("/delete/:id", async(req, res)=>{
    await Record.findByIdAndDelete(req.params.id);
    res.redirect("/");
})

app.listen(3000, ()=>{
    console.log("server is up at 3000");
})