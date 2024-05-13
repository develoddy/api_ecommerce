import mongoose, {Schema} from "mongoose";

const SaleSchema = new Schema({
    user: {type: Schema.ObjectId, ref:'user', required:true},
    currency_payment: {type:String, default: 'USD'},
    method_payment: {type:String, maxlength: 50, required:true},
    n_transaction: {type:String, maxlength:200, required:true},
    total: {type:Number, required:true},
    //
    curreny_total: {type:String, maxlength:50, default:'USD'}, // Tipo de moneda del total de la orden
    price_dolar: {type:Number, default:0}, // Por si deseo hacer la tranformacion de soles a Dolar y pagarlo en paypal
    //price_euro: {type:Number, default:0}, // Por si deseo hacer la tranformacion de soles a Euro y pagarlo en paypal

},{
    timestamps: true
});

const Sale = mongoose.model("sale", SaleSchema);
export default Sale;