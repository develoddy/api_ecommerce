import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import axios from "axios"; // Importa axios
import router from "./router";
import routerPrintful from "./router/printful";

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

//
//
// Api Printful
//
//

// Define la URL base de la API de Printful
const printfulApiUrl = 'https://api.printful.com'; 

app.use('/printful/', routerPrintful);

// Middleware para acceder a la API de Printful
// app.use('/printful', async (req, res, next) => {
//     try {
//         const token = 'CcbTqhupaIzBCtmkhmnYY59az1Tc8WxIrF9auaGH'; // Reemplaza con tu Bearer Token
//         const response = await axios.get(`${printfulApiUrl}${req.url}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error al acceder a la API de Printful:', error);
//         res.status(500).json({ error: 'Error al acceder a la API de Printful' });
//     }
// });

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('EL SERVIDOR SE EJECUTO PERFECTAMENTE EN EL PUERTO 3000');
})