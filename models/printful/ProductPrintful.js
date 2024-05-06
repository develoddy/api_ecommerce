// import mongoose from 'mongoose';

// // Define el esquema del producto de Printful
// const PrintfulProductSchema = new mongoose.Schema({
//     code: { type: Number, required: true },
//     id: { type: Number, required: true },
//     main_category_id: { type: Number },
//     type: { type: String },
//     description: { type: String },
//     type_name: { type: String },
//     title: { type: String },
//     brand: { type: String },
//     model: { type: String },
//     image: { type: String },
//     variant_count: { type: Number },
//     currency: { type: String },
//     options: [{ 
//         id: { type: String },
//         title: { type: String },
//         type: { type: String },
//         values: { type: Object },
//         additional_price: { type: Number },
//         additional_price_breakdown: { type: Array }
//     }],
//     dimensions: { type: Object },
//     is_discontinued: { type: Boolean },
//     avg_fulfillment_time: { type: Number },
//     techniques: [{
//         key: { type: String },
//         display_name: { type: String },
//         is_default: { type: Boolean }
//     }],
//     files: [{ 
//         id: { type: String },
//         type: { type: String },
//         title: { type: String },
//         additional_price: { type: Number },
//         options: { type: Array }
//     }],
//     origin_country: { type: String },

    
// }, { timestamps: true });

// // Crear el modelo de producto de Printful
// const PrintfulProduct = mongoose.model('PrintfulProduct', PrintfulProductSchema);

// export default PrintfulProduct;



// ----------

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PrintfulProductSchema = new mongoose.Schema({
    // result: [{
    //     id: Number,
    //     main_category_id: Number,
    //     type: String,
    //     description: String,
    //     type_name: String,
    //     title: String,
    //     brand: String,
    //     model: String,
    //     image: String,
    //     variant_count: Number,
    //     currency: String,
    //     options: [{
    //         id: String,
    //         title: String,
    //         type: String,
    //         values: Object,
    //         additional_price: Number,
    //         additional_price_breakdown: Array
    //     }],
    //     dimensions: Object,
    //     is_discontinued: Boolean,
    //     avg_fulfillment_time: Number,
    //     techniques: [{
    //         key: String,
    //         display_name: String,
    //         is_default: Boolean
    //     }],
    //     files: [{
    //         id: String,
    //         type: String,
    //         title: String,
    //         additional_price: Number,
    //         options: Array
    //     }],
    //     origin_country: String
    // }],

    _id: { type: Number},
    result: [{
        id: { type: Number, required: true },
        main_category_id: { type: Number, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        type_name: { type: String, required: true },
        title: { type: String, required: true },
        brand: { type: String, required: true },
        model: { type: String, required: true },
        image: { type: String, required: true },
        variant_count: { type: Number, required: true },
        currency: { type: String, required: true },
        options: [{
            id: { type: String, required: true },
            title: { type: String, required: true },
            type: { type: String, required: true },
            values: { type: Object },
            additional_price: { type: Number },
            additional_price_breakdown: { type: Array }
        }],
        dimensions: { type: Object },
        is_discontinued: { type: Boolean, required: true },
        avg_fulfillment_time: { type: Number },
        techniques: [{
            key: { type: String, required: true },
            display_name: { type: String, required: true },
            is_default: { type: Boolean, required: true }
        }],
        files: [{
            id: { type: String, required: true },
            type: { type: String, required: true },
            title: { type: String, required: true },
            additional_price: { type: Number },
            options: { type: Array }
        }],
        origin_country: { type: String, required: true }
    }]
});

const PrintfulProduct = mongoose.model('PrintfulProduct', PrintfulProductSchema);

module.exports = PrintfulProduct;
