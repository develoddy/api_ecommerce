// const mongoose = require('mongoose');

// // Define el esquema para sync_product
// const syncProductSchema = new mongoose.Schema({
//     id: Number,
//     external_id: String,
//     name: String,
//     variants: Number,
//     synced: Number,
//     thumbnail_url: String,
//     is_ignored: Boolean
// });

// // Define el esquema para sync_variants
// const syncVariantSchema = new mongoose.Schema({
//     id: Number,
//     external_id: String,
//     sync_product_id: Number,
//     name: String,
//     synced: Boolean,
//     variant_id: Number,
//     main_category_id: Number,
//     warehouse_product_id: Number,
//     warehouse_product_variant_id: Number,
//     retail_price: String,
//     sku: String,
//     currency: String,
//     product: {
//         variant_id: Number,
//         product_id: Number,
//         image: String,
//         name: String
//     },
//     files: [{
//         id: Number,
//         type: String,
//         hash: String,
//         url: String,
//         filename: String,
//         mime_type: String,
//         size: Number,
//         width: Number,
//         height: Number,
//         dpi: Number,
//         status: String,
//         created: Number,
//         thumbnail_url: String,
//         preview_url: String,
//         visible: Boolean,
//         is_temporary: Boolean,
//         message: String,
//         stitch_count_tier: String
//     }],
//     options: [{
//         id: String,
//         value: mongoose.Schema.Types.Mixed
//     }],
//     is_ignored: Boolean,
//     size: String,
//     color: String,
//     availability_status: String
// });

// // Define el esquema para el objeto completo del JSON
// const ProductStorePrintful = new mongoose.Schema({
//     code: Number,
//     result: {
//         sync_product: syncProductSchema,
//         sync_variants: [syncVariantSchema]
//     },
//     extra: [mongoose.Schema.Types.Mixed] // Siempre es una buena práctica tener un campo extra para almacenar datos adicionales que no estén definidos en el esquema
// });

// // Crea el modelo utilizando el esquema
// const ProductStorePrintfulModel = mongoose.model('ProductStorePrintfulModel', ProductStorePrintful);

// module.exports = ProductStorePrintfulModel;


// const mongoose = require('mongoose');

// // Define el esquema combinado
// const ProductStorePrintful = new mongoose.Schema({
//     code: Number,
//     result: {
//         sync_product: {
//             id: Number,
//             external_id: String,
//             name: String,
//             variants: Number,
//             synced: Number,
//             thumbnail_url: String,
//             is_ignored: Boolean
//         },
//         sync_variants: [{
//             id: Number,
//             external_id: String,
//             sync_product_id: Number,
//             name: String,
//             synced: Boolean,
//             variant_id: Number,
//             main_category_id: Number,
//             warehouse_product_id: Number,
//             warehouse_product_variant_id: Number,
//             retail_price: String,
//             sku: String,
//             currency: String,
//             product: {
//                 variant_id: Number,
//                 product_id: Number,
//                 image: String,
//                 name: String
//             },
//             files: [{
//                 id: Number,
//                 type: String,
//                 hash: String,
//                 url: String,
//                 filename: String,
//                 mime_type: String,
//                 size: Number,
//                 width: Number,
//                 height: Number,
//                 dpi: Number,
//                 status: String,
//                 created: Number,
//                 thumbnail_url: String,
//                 preview_url: String,
//                 visible: Boolean,
//                 is_temporary: Boolean,
//                 message: String,
//                 stitch_count_tier: String
//             }],
//             options: [{
//                 id: String,
//                 value: mongoose.Schema.Types.Mixed
//             }],
//             is_ignored: Boolean,
//             size: String,
//             color: String,
//             availability_status: String
//         }]
//     },
//     extra: [mongoose.Schema.Types.Mixed]
// });

// // Crea el modelo utilizando el esquema combinado
// const ProductStorePrintfulModel = mongoose.model('ProductStorePrintfulModel', ProductStorePrintful);

// module.exports = ProductStorePrintfulModel;



// import mongoose, {Schema} from "mongoose";

// const ProductStorePrintfulSchema = new Schema({
//     code: Number,
//     result: [{
//         id: Number,
//         external_id: String,
//         name: String,
//         variants: Number,
//         synced: Number,
//         thumbnail_url: String,
//         is_ignored: Boolean
//     }],
//     // extra: [mongoose.Schema.Types.Mixed],
//     extra:[{type:Object}],
//     paging: {
//         total: Number,
//         offset: Number,
//         limit: Number
//     }
// });

// const ProductStorePrintfulModel = mongoose.model("ProductStorePrintfulModel", ProductStorePrintfulSchema);
// export default ProductStorePrintfulModel;


import mongoose from 'mongoose';

const { Schema } = mongoose;

const combinedSchema = new Schema({
    code: { type: Number, required: true },
    result: [{
        id: { type: Number, required: true },
        external_id: { type: String, maxlength: 50, required: true },
        name: { type: String, required: true },
        variants: { type: Number, required: true },
        synced: { type: Number, required: true },
        thumbnail_url: { type: String, required: true },
        is_ignored: { type: Boolean, required: true }
    }],
    extra: [Schema.Types.Mixed],
    paging: {
        total: { type: Number, required: true },
        offset: { type: Number, required: true },
        limit: { type: Number, required: true }
    }
});

const CombinedModel = mongoose.model('CombinedModel', combinedSchema);

export default CombinedModel;