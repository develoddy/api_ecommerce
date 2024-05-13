import models from "../models";
import bcrypt from 'bcryptjs';
import token from "../services/token";
import resources from "../resources";

export default {
    register_admin: async(req, res) => {
        try {
            const userV = await models.User.findOne({email: req.body.email});
            if (userV) {
                res.status(500).send({
                    message: "El usuario que intentas registrar ya exsite."
                });
            }

            req.body.rol = "admin";
            req.body.password = await bcrypt.hash(req.body.password, 10);
            let user = await models.User.create(req.body);
            res.status(200).json({
                user: resources.User.user_list(user)
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController register_admin - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    register: async(req, res) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user = await models.User.create(req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController register - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    login: async(req, res) => {
        try {
            const user = await models.User.findOne({email: req.body.email, state:1});
            if (user) {
                // SI ESTÁ REGISTRADO EN EL SISTEMA
                let compare = await bcrypt.compare(req.body.password, user.password);
                if (compare) {
                    let tokenT = await token.encode(user._id, user.rol, user.email);
                    const USER_FRONTED = {
                        token: tokenT,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar
                        }
                    }
                    res.status(200).json({
                        USER_FRONTED:USER_FRONTED
                    });
                } else {
                    res.status(500).send({
                        message: "El correo electrónico o la contraseña que has introducido es incorrecta."
                    });
                }
            } else {
                res.status(500).send({
                    message: "El correo electrónico o la contraseña que has introducido es incorrecta."
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController login - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    login_admin: async(req, res) => {
        try {
            const user = await models.User.findOne({email: req.body.email, state:1, rol:"admin"});
            if (user) {
                // SI ESTÁ REGISTRADO EN EL SISTEMA
                let compare = await bcrypt.compare(req.body.password, user.password);
                if (compare) {
                    let tokenT = await token.encode(user._id, user.rol, user.email);
                    const USER_FRONTED = {
                        token: tokenT,
                        user: {
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar,
                            rol: user.rol,
                        }
                    }
                    res.status(200).json({
                        USER_FRONTED:USER_FRONTED
                    });
                } else {
                    res.status(500).send({
                        message: "EL USUARIO NO EXISTE"
                    });
                }
            } else {
                res.status(500).send({
                    message: "EL USUARIO NO EXISTE"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController login - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },

    update: async(req, res) => {
        try {
            if (req.files) {
                var img_path = req.files.avatar.path;
                var name = img_path.split('\\');
                var avatar_name = name[2];
                console.log(avatar_name);
            }
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            await models.User.findByIdAndUpdate({_id:req.body._id}, req.body);
            let UserT = await models.User.findOne({_id:req.body._id});

            res.status(200).json({
                message: "EL USUARIO SE HA MODIFICADO CORRECTAMENTE",
                user: resources.User.user_list(UserT),
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController login - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    list: async(req, res) => {
        try {
            var search = req.query.search;
            let Users = await models.User.find({
                $or:[
                    {"name": RegExp(search, "i")},
                    {"surname": RegExp(search, "i")},
                    {"email": RegExp(search, "i")},
                ]
            }).sort({'createdAt': -1});

            Users = Users.map((user) => {
                return resources.User.user_list(user);
            });

            res.status(200).json({
                users: Users
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController login - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove: async(req, res) => {
        try {
            const User = await models.User.findByIdAndDelete({_id: req.query._id});
            res.status(200).json({
                message: "EL USUARIO SE ELIMINÓ CORRECTAMENTE"
            });
        } catch (error) {
            res.status(500).send({
                message: "debbug: UserController login - OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    }
}