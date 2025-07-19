import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    scholarId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email : {
        type : String,
        require : true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
},{timestamps: true});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    // console.log("🔐 Hashing password...");
    this.password = await bcrypt.hash(this.password, 10);
    // console.log("✅ Password hashed:", this.password);
    next();
});

userSchema.methods.isPasswordMatched = async function(password){
    const match = await bcrypt.compare(password, this.password);
    // console.log("🧪 Comparing passwords:", password, this.password, "=> Match:", match);
    return match;
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
      {
        _id : this._id,
        email : this.email,
        scholarId: this.scholarId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        _id : this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
);
}

export const User = mongoose.model("User",userSchema);