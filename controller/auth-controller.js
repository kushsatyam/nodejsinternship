const User = require("../model/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../services/nodemailer");
require("dotenv").config();

const resHtml = `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">

  <!-- Main Container -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <h1 style="color: #4CAF50; font-size: 24px; margin: 0;">Email Verified Successfully!</h1>
            </td>
          </tr>
          
          <!-- Message Body --> 
          <tr>
            <td align="center" style="padding: 20px;">
              <p style="font-size: 16px; color: #555; margin: 0;">
                Congratulations! Your email has been successfully verified. You can now access all features of your account.
              </p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://via.placeholder.com/100/4CAF50/FFFFFF?text=%E2%9C%94" alt="Success" style="width: 100px; height: 100px; border-radius: 50%;">
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="https://yourwebsite.com/login" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 12px 24px; font-size: 18px; border-radius: 5px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 20px 0;">
              <hr style="border: 0; border-top: 1px solid #ddd;">
            </td>
          </tr>
          
          <!-- Support Info -->
          <tr>
            <td align="center" style="padding: 10px;">
              <p style="font-size: 14px; color: #777; margin: 0;">
                If you have any questions, feel free to <a href="mailto:support@yourwebsite.com" style="color: #4CAF50; text-decoration: none;">contact our support team</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>`;


const signup = async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        
        const userExist = await User.findOne({
            $or: [{email:email},{username:username}]
        });

        if(userExist){
            return res.status(400).json({msg:"User Already Exist"});
        }
    
        const userCreated = await User.create({username,email,password});

        const info = userCreated.toObject();
        
        const token = await jwt.sign({
            userId: info._id.toString(),
            email: info.email,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:"3h"
        });


        // sendMail(email,`<a href="http://192.168.97.106:5000/api/verify?token=${token}">Click Here To verify<a>`);
        sendMail(email,`<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <h1 style="margin: 0; color: #333;">Verify Your Email Address</h1>
            </td>
          </tr>
          <!-- Message body -->
          <tr>
            <td align="center" style="padding: 20px 40px;">
              <p style="margin: 0; font-size: 16px; color: #555;">
                Hi there,<br><br>
                Thank you for signing up! To complete your registration, please verify your email by clicking the button below.
              </p>
            </td>
          </tr>
          <!-- Verification Button -->
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="http://192.168.97.106:5000/api/verify?token=${token}" style="background-color: #4CAF50; color: white; padding: 12px 24px; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 5px;">
                Verify Email
              </a>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding: 20px 0;">
              <hr style="border: 0; border-top: 1px solid #ddd;">
            </td>
          </tr>
          <!-- Support Message -->
          <tr>
            <td align="center" style="padding: 10px 40px;">
              <p style="margin: 0; font-size: 14px; color: #777;">
                If you didn’t sign up for this account, you can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 14px; color: #777;">
                Need help? Contact us at <a href="mailto:support@yourdomain.com" style="color: #4CAF50; text-decoration: none;">support@yourdomain.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #aaa;">
                &copy; 2024 Your Company. All rights reserved.<br>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`);


        delete info.password;
        
        return res.status(201).json({msg:"Registration Success", user:info});

    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
}

const login = async(req,res)=>{
    try {
        let {email, password} = req.body;

    let userExist = await User.findOne({email:email});
    if(!userExist){
        return res.status(400).json({msg:"User not found"});
    }
    
    const validPassword = await bcrypt.compare(password,userExist.password);
    if(!validPassword){
        return res.status(400).json({msg:"Invalid Credential"});
    }

    const token = await jwt.sign({
        userId: userExist._id.toString(),
        email: userExist.email,
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn:"3h"
    });

    return res.status(200).json({msg:'Login Success',userId: userExist._id.toString(),token:token});
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
    }
}

const getProfile = async (req,res)=>{
    try {
        const {userId} = req.user;
        const user = await User.findOne({_id:userId});
        
        const userInfo = user.toObject();
        delete userInfo.password;

        console.log(userInfo);
        return res.status(200).json({profileInfo:userInfo});
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
    }
}

const verifyUser = async (req,res)=>{
    try {
        const {token} = req.query;
        const userInfo = await jwt.verify(token,process.env.JWT_SECRET_KEY);

        const user = await User.findOne({email:userInfo.email});
        
        // console.log(userInfo);
        if(!user){
           return res.status(404).send("user not found")
        }

        user.isVerified = true;

        await user.save();

        // console.log(check);
        res.status(200).send(resHtml);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something Went Wrong")
    }

}

module.exports = {signup,login,getProfile,verifyUser};