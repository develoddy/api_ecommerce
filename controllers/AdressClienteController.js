import models from "../models";
//import resources from "../resources";

export default {
    register: async(req, res) => {
        try {
            const addreesClient = await models.AdressClient.create(req.body);
            res.status(200).json({
                message: "LA DIRECCION DEL CLIENTE SE REGISTRO CORRECTAMENTE",
                address_client: addreesClient,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: AddressClienteController register OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req, res) => {
        try {
            let data = req.body;
            await models.AdressClient.findOneAndUpdate({_id:req.body._id}, data);
            let AdressClient = await models.AdressClient.findById({_id:req.body._id});

            res.status(200).json({
                message: "LA DIRECCION DEL CLIENTE SE HA MODIFICADO CORRECTAMENTE",
                address_client: AdressClient,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: AddressClienteController update OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    list: async(req, res) => {
        try {
            let AdressClient = await models.AdressClient.find({user: req.query.user_id}).sort({'createdAt': -1});

            console.log(AdressClient);

            res.status(200).json({
                address_client: AdressClient,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: AddressClienteController list OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    delete: async(req, res) => {
        try {
            await models.AdressClient.findByIdAndDelete({_id: req.params.id});
            res.status(200).json({
                message: "LA DIRECCION DEL CLIENTE SE ELIMINÓ CORRECTAMENTE"
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: AddressClienteController delete OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },  
}