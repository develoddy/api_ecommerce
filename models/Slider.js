import moongose, {Schema} from "mongoose";

const SliderSchema = new Schema({
    title:{type: String, maxlength:250, required:true},
    link:{type: String, maxlength:250, required:true},
    imagen:{type: String, maxlength:250, required:true},
    state:{type: Number, maxlength:2, default:1},
},{
    timestamps: true
});

const Slider = moongose.model("sliders", SliderSchema);
export default Slider;