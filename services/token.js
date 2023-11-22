import jwt from "jsonwebtoken";
import models from '../models';

export default {
    encode: async(_id, rol, email) => {
        const token = jwt.sign({_id: _id, rol:rol, email:email}, 'ecommerce_udemy', {expiresIn: '1d'});
        return token;
    },
    decode: async(token) => {
        try {
            /**
             * OBTENER EL _id DEL PAYLOAD VERIFICADO.
             * LUEGO SE BUSCA ESA COLECCION EN EL MODELS USERS Y DESPUES DE VERIFICA 
             * QUE SI ESTÁ EN UN ESTADO ACTIVO.
             * 
             * Y SI EL USUARIO SI EXISTE, PUES SE RETORNA ESE USUARIO.
             * EN CASO DE QUE NO EXISTA, SE RETORMA FALSE.
             */
            const {_id} = await jwt.verify(token, 'ecommerce_udemy');
            const user = models.User.findOne({_id: _id, state: 1});
            if (user) {
                return user;
            }
            return false;
        } catch (error) {
            console.log("Debbug - token.js: ", error);
            return false;
        }
    },
}