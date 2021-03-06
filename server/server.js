require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Configuracion global de rutas
app.use(require("./routes/index"));
//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((db) => console.log("Base de datos ONLINE"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto:", process.env.PORT);
});
