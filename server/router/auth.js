const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


router.get("/", (req, res) => {
  res.send(`Hello world from the server rotuer js`);
});

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword, phone } = req.body;
  if (!name || !email || !password || !cpassword || !phone) {
    return res.status(422).json({ message: "fill all field properly" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "email already exist" });
    else if (password !== cpassword) {
      return res.status(422).json({ message: "password mismatch" });
    } else {
      const newUser = new User({ name, email, password, cpassword, phone });
      await newUser.save();
      res.json("user created succesfuly");
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req,res)=>{
  try{
    let token;
    const { email,password } = req.body

    if(!email || !password) {
      return res.status(400).json({mesage:"fill all fieled properly"})
    }
    const userLogin = await User.findOne({email:email})

    if(userLogin) {
      const isMatch = await bcrypt.compare(password,userLogin.password)

      token = await userLogin.generateAuthToken()
      console.log(token)
//      res.cookie("jwtoken",token,{
  //      expires: new Date(Date.now() + 5537468532465),
    //    httpOnly: true
     // });

      res.json(token)
      if(!isMatch){
        res.status(400).json({message:"invalid credentials"})
      }else{
        res.json({message:"sign in succesfully"})
        
      }
    }else{
      res.status(400).json({message:"invalid credentials"})
    }

  }catch(err){
console.log(err)
  }
})
module.exports = router;
