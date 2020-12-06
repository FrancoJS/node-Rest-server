//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Base de datos
let urlDB;

//Vencimiento del token
process.env.CADUCIDAD_TOKEN = "48h";

//SEED de autenticacion
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

if (process.env.NODE_ENV === "dev") urlDB = "mongodb://localhost:27017/cafe";
else urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;

//Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "547498850869-uhnnv0d83b4r5au48j8gjfu7k31jhbbb.apps.googleusercontent.com";
