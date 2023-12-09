import mongoose ,{ Schema } from "mongoose";

const ProductSchema = new Schema ({
    title: {type:String, require:true, maxlength: 250},
    slug: {type:String, require:true, maxlength: 1000},
    sku: {type:String, require:true},
    categorie: {type:Schema.ObjectId, ref: 'categorie', require:true},
    price_soles: {type:Number, require:true},
    price_usd: {type:Number, require:true},
    portada: {type:String, require:true},
    galerias: [{type:Object, require:false}],
    state: {type:Number, default:1}, // 1 es en prueba o desarrollo, 2 será publico y 3 será anulado
    stock: {type:Number, default:0},
    description: {type:String, require:true},
    resumen: {type:String, require:true},
    tags: {type:String, required:true},
    type_inventario: {type: Number, default:1}
},{
    timestamps:true,
});

const Product =  mongoose.model('Product', ProductSchema);
export default Product;