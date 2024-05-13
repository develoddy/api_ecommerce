import mongoose, {Schema} from "mongoose";

const CartSchema = new Schema({

    user: {type: Schema.ObjectId, ref: 'user', required:true},
    product: {type: Schema.ObjectId, ref: 'product', required:true},
    type_discount: {type: Number, required:false, default: 1}, // Por porcentaje 1 o por moneda 2
    discount: {type: Number, default: 0},
    cantidad: {type: Number, required: true},
    variedad: {type: Schema.ObjectId, ref: 'variedad', required:false},
    code_cupon: {type:String, required:false},
    code_discount: {type:String, required:false},
    price_unitario: {type:String, required:true},
    subtotal: {type:String, required:true},
    total: {type:String, required:true},
},{
    timestamps: true
});

const Cart = mongoose.model("cart", CartSchema);
export default Cart;