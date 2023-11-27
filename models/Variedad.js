import mongoose, { Schema } from "mongoose";

const VariedadSchema = new Schema({
    product: {type: Schema.ObjectId, ref: 'product', require:true},
    valor: {type: String, require:true},
    stock: {type: Number, require:true},
}, {
    timestamps:true,

});

const Variedad = mongoose.model('variedad', VariedadSchema);
export default Variedad;