const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    }
},{
    timestamps:true,
});

userSchema.pre("save", async function (next){
    const user = this;

    if(!user.isModified("password")){
        next();
    }

    try {
        const saltRound = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(user.password,saltRound);

        this.password = hashPassword;
    } catch (error) {
        res.status(400).json({msg:'Unable to hash password'});        
    }
})

const User = new mongoose.model("User",userSchema);
module.exports = User;
