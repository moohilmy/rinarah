import {Document , model, models, Schema} from "mongoose";
import Joi from "joi"
import { TAdmin } from "@/types";
import PasswordComplexity from 'joi-password-complexity';
import jwt from 'jsonwebtoken';
interface IAdminDocument extends TAdmin, Document { }


const complexityOptions = {
    min: 8,             // Minimum length
    max: 64,            // Maximum length
    lowerCase: 1,       // At least 1 lowercase letter
    upperCase: 1,       // At least 1 uppercase letter
    symbol: 1,          // At least 1 special character
};

const AdminSchema : Schema = new Schema({
    userName: {type: String, unique: true, require: true},
    password: {type: String, required: true},
    LastDateLogIn: {type: String, default: Date.now()},
})

const Admin = models.Admins || model<IAdminDocument>("Admins", AdminSchema);

export const CreateToken = (id: string): string =>{
    const token = jwt.sign({_id: id }, process.env.JWT_SECRET as string,{ expiresIn: '2h'})
    return token
}

const validateLoginUser = (obj: TAdmin) =>{
    const schema = Joi.object({
        userName: Joi.string().min(5).max(255).required().trim(),
        password: PasswordComplexity(complexityOptions).required().trim(),
    })
    return schema.validate(obj)
}

const validateRegisterAdmin = (obj: TAdmin) => {
  const schema = Joi.object({
    userName: Joi.string().min(5).max(255).required().trim(),
    password: PasswordComplexity(complexityOptions).required().trim(),
  });

  return schema.validate(obj);
};

export {Admin, type IAdminDocument,validateLoginUser,validateRegisterAdmin}