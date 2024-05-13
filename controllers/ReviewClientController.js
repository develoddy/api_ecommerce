import models from "../models";

export default {
    register: async(req, res) => {
        try {
            let review = await models.Review.create(req.body);
            res.status(200).send({
                message: "La reseña ha sido registrado correctamente",
                review: review,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: ReviewController register OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },

    update: async(req, res) => {
        try {
            await models.Review.findByIdAndUpdate({_id: req.body._id},req.body);
            let reviewD = await models.Review.findById({_id: req.body._id});

            res.status(200).send({
                message: "La reseña ha sido modificado correctamente",
                review: reviewD,
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: ReviewController update OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    
}