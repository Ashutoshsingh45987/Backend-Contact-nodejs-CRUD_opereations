
const expressAsyncHandler = require("express-async-handler");
const User= require("../models/userModel");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

//@desc  registers users
// @route Put /api/users/register
//@access public
const registerUser =expressAsyncHandler( async (req, res)=>{
    const {username,email,password}=req.body;
    if(!username|| !email||!password){
        res.status(400);
        throw new Error("All feilds are mandatory");
    }   

    const userAvailable= await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    // hash password
    const hashedpassword= await bcrypt.hash(password,10);
    console.log("Hashed password"+hashedpassword);

    const user= await User.create({
        username,
        email,
        password:hashedpassword,
    });
    console.log(`user created ${user}`);
    if(user){
        res.status(201).json({_id:user.id, email: user.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }

    res.json({message:"Register the user"});   
});

// @desc login users
// @route  put  /api/users/login
// @access public
const loginUser= expressAsyncHandler(async  (req, res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        res.status(400);
        throw new Error("All feilds are madatory");

    }
    const user= await User.findOne({email});

    // compare password with hashedpassword
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken= jwt.sign({
            user:{
                username:user.username,
                email: user.email,
                id: user.id,

            },
        },
        process.env.ACCESS_TOKENSECRET,
        {expiresIn:"15m"}
        );
        res.status(200).json({"accessToken": accessToken});
    }
    else{
        res.status(401);
        throw new Error("Email or password is not valid");
    }   
});

// @desc currerrent user info
// @ routte get /api/users/current
// @access public
const currentUser= expressAsyncHandler(async  (req, res)=>{
    res.json(req.user);   
});

module.exports= {registerUser,loginUser,currentUser};
