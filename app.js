const express = require("express");
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8088

app.get("/", (req, res) => {
    res.send("<h2>Привет Express!</h2>");
});

app.listen(port, () => {
    console.log(`Express web app listening http://localhost:${port}`)
});