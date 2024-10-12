const express = require('express');
const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fectchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'iznotebook$oy'

// Create a User using : POST "/api/auth/createuser". No Login Required

router.post('/createuser',[
   body('name', 'enter a valid name').isLength({min:3}),
   body('email', 'enter a valid email').isEmail(),
   body('password', 'enter a valid password').isLength({min:5}),
],
   async (req, res) => {
      // if there are errors return the bad request and the errors 
      const errors = validationResult(req);
      if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()});
      };
      //Check wheather the user with this email exits already
      try{

      let user = await User.findOne({email:req.body.email});
      if(user){
         return res.status(400).json({error:"Sorry a user with this email is already exsist"})
      };

      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password,salt);

      // Create a new user
      user = await User.create({
         name : req.body.name,
         email : req.body.email,
         password : secPass,
      });

      const data = {
         user : {
            id : user.id
         }
      }

      const authToken = jwt.sign(data, JWT_SECRET);

      

      res.json({authToken});
      } catch{
         console.error(error.message);
         res.status(500).send("Some error occured")
      } 

});


// Authenticate  a User using : POST "/api/auth/login". No Login Required
router.post('/login',[
   body('email', 'enter a valid email').isEmail(),
   body('password', 'Password can not be blank').exists(),
],
   async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()});
      };


      const {email , password} = req.body;
      try{
         let user = await User.findOne({email});
         if(!user){
            return res.status(400).json({error : "Try to login with correct credentials"});
         }

         const passwordCompare = bcrypt.compare(password , user.password);
         if(!passwordCompare){
            return res.status(400).json({error : "Try to login with correct credentials"});
         }

         const data = {
            user : {
               id : user.id
         }
         
      } 

      const authtoken = jwt.sign(data , JWT_SECRET);
      res.json({authtoken});
   
   }catch (error){
      console.error(error.message);
      res.status(500).send("Internal Server Error occured")

      }

   })


//Route 3 Get User Details using Post
router.post('/getuser', fectchuser ,async (req, res) => {
try{
   
   const userId = req.user.id;
   const user = await User.findById(userId).select("-password")
   res.send(user);
}catch(error){
   console.error(error.message);
   res.status(500).send("Internal Server Error occured")

}
   })
module.exports = router;