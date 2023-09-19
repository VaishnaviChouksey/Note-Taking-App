const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const jwt_scrt='Make a jwt script'; 
// Create a user using: POST "/api/auth/createuser " . No login required

router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}), 
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{

    // If there are errors, return bad request
    let success =false;
    const errors=validationResult(req);    
    if(!errors.isEmpty()){ 
        return res.status(400).json({success,errors:errors.array()});
    }
    //check wheter user exits with same email already
    try{
    let user =await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success,error:"Try Again! a user with this email exists already."})
    }
    //create a new user
    const salt=await bcrypt.genSalt(10);
    const secpwd=await bcrypt.hash(req.body.password,salt);
    user=await User.create({ 
        name:req.body.name,
        password:secpwd, 
        email:req.body.email
    });
    const data={
        user:{
            id:user.id
        }
    }
    const authtoken=jwt.sign(data,jwt_scrt);
    success=true;
    res.json({success,authtoken});
}catch(error){
    console.error(error.message);
    res.status(500).send("An error has occured.")
}
})

// Authicate a user using: POST "/api/auth/login " . No login required

router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').exists()
],async (req,res)=>{
     // If there are errors, return bad request
     let success =false;
     const errors=validationResult(req);    
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
     }
    const {email,password}=req.body;

     try{
        let user=await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({error:"Please enter correct email id and password"});
        }

        const passCompare=await bcrypt.compare(password, user.password);
        if(!passCompare){
            success=false;
            return res.status(400).json({error:"Please enter correct email id and password"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,jwt_scrt);
        success=true;
        res.json({success,authtoken});
     }
     catch(error){
        console.error(error.message);
        res.status(500).send("An error has occured.")
    }   
    })

// Authicate a user using: POST "/api/auth/getuserdata " . Login required

router.post('/getuserdata',fetchuser,async (req,res)=>{   
    
    try{
       userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);
    }
    catch(error){
            console.error(error.message);
            res.status(500).send("An error has occured.");
    }

})

module.exports=router
