import mongoose from "mongoose";

// Mongoose schema definition for the Traction model, representing user transactions with details such as plan, amount, credits, and payment status

const tractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      planId :{type:String, required:true},
      amount:{type:Number, required:true},
      credits:{type:Number, required:true},
      isPaid:{type:Boolean, default:false},
      
    },{timeStamp:true});

    const Traction = mongoose.model("Traction", tractionSchema);

export default Traction;