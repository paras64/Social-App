import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

export const register = async (req,res) => {
    try{
        const {
            firstname,
            lastname,
            email,
            password,
            picturepath,
            friends, 
            location,
            occupation,
        } = req.body;

        const salt = bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            picturepath,
            friends,
            location,
            occupation,
            viewedprofile: Math.floor(Math.random() *1000),
            impressions: Math.floor(Math.random() *1000),

        });

        const savedUser = await newUser.save();
        res.statue(201).json(savedUser);


    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

/* LOGGING IN */
export const login = async(req,res) => {
    try {
        const { eamil,password} = req.body;
        const user = await User.findOne({email: eamil});
        if(!user) return res.status(400).json({msg : "User does not found"});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg : "Invalid Credentials"});

        const token = jwt.sign({id: user._id},process.env,JWT_SECRET);
        delete user.password;
        res.status(200).json({token,user});
        
    } catch (error) {
        res.status(500).json({error: err.message});
    }
}