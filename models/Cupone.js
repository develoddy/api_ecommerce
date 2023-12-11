import moongose, {Schema} from "mongoose";

const CuponeSchema = new Schema({
    code:{type: String, maxlength:50, required:true},
    type_discount:{type: Number, maxlength:50, required:true, default: 1}, // Por porcentaje 1 o por moneda 2
    discount:{type: Number,  required:true}, // por moneca o por porcentaje
    type_count:{type: Number, required:true, default: 1}, // ilimitado 1 o limitado 2
    num_use: {type:Number, require:false},
    type_segment: {type: Number, require:false, default:1}, // 1 es cupon por producto y 2 seria por categoria
    products:[{type:Number}],
    categories:[{type:Number}],
},{
    timestamps: true
});

const Cupone = moongose.model("cupones", CuponeSchema);
export default Cupone;