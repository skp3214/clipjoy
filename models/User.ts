import mongoose, { Schema,model,models } from "mongoose";
import bcrypt from "bcryptjs";

export type IUser={
    _id?:mongoose.Types.ObjectId;
    email: string;
    password: string;
    createdAt?:Date;
    updatedAt?:Date;
}

const userSchema=new Schema<IUser>(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

const User=models?.User || model<IUser>("User",userSchema);  // models?.User is used to avoid redefining the model if it already exists.

export default User;