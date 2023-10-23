import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import router from "./router";

// CONEXION A LA BASE DE DATOS.
mongoose.Promise = global.Promise;
const dburl = "mongodb://localhost:27017/ecommerce_udemy";
mongoose.connect (
    dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(mongoose => console.log("CONECTADO A LA DB EN EL PUERTO 27017"))
.catch(err => console.log(err));

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extend: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/api/', router);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('EL SERVIDOR SE EJECUTO PERFECTAMENTE EN EL PUERTO 3000');
})