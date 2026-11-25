const userModel = require('../models/user')
const bcrypt = require("bcrypt")
const sendEmail = require('../utils/email')
const otp_generate = require('otp-generator')
const jwt = require('jwt')


exports.signup = async(req,res)=>{
    try{
        const{ fullName, email, gender, password, age } = req.body;

        const user = await userModel.findOne({email:email.toLowerCase()})

        if(user){
            return res.status(400).json({message:`User with Email: ${email} already exist`})
        }

        const saltRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const otp = otp_generate(6, {lowerCaseAlphabet: false, upperCaseAlphabet:false, specialChars:false})

        const data = {
            fullName,
            email:email.toLowerCase(),
            gender,
            password:hashedPassword,
            age,
            otp
        }

        

        const newUser = await userModel.create(data)

        const emailContent = {
            name:newUser.fullname,
            email:newUser.email,
            subject:"Welcome to Zanzibar",
            htmlContent:`<html><head></head><body><p>Hello,${newUser.fullName}</p><p>we are thrilled to have you onboard please use the otp below to verify your account, <br> ${otp} </p></body></html>`

        }

        await sendEmail(emailContent)


        res.status(201).json({
            message:"User created successfully", data:newUser
        })
    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}



exports.getAllUsers = async(req, res)=>{
    try{
        const users = await userModel.find()

        res.status(200).json({
            message:`ALL users found and the Total is: ${users.length}`,data:users
        })
    
    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}


exports.getOneUsers = async(req, res)=>{
    try{
        const{ id } = req.params
        const users = await userModel.findById(id)

        if (!users){
            return res.status(404).json({message:"User not found"})
        }

        res.status(200).json({
            message:`User found`,data:users
        })
    
    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}


exports.updateUser = async(req, res) => {
    try{
        const{ id } = req.params
        const { fullName, email, gender, password, age } = req.body

        const users = await userModel.findById(id)

        if(!users){
            return res.status(404).json({message:"User not found"})
        }

        const data = {
            fullName,
            email:email.toLowerCase(),
            gender,
            password,
            age
        }

        if (email && email !== user.email){
            const emailExist = await userModel.findOne({email:email.toLowerCase()})
            if(emailExist){
                return res.status(404).json({
                    message:"Email already in use"
                })
            }

        }
        const updateUser = await userModel.findByIdAndUpdate(id, data,{new:true})

        res.status(200).json({message:"User successfull updated", data:updateUser})


    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}



exports.login = async(req, res)=>{
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({email: email.toLowerCase() })

        if(!user){
            return res.status(404).json({
                message:'User not found'
            })
        }

        const isPassword = await bcrypt.compare(password, user.password)
        if (isPassword == false){
            return res.status(400).json({
                message:'invalid password'
            })
        }

        if(user.isVerified == false){
            return res.status(400).json({
                message:'User not verified', data: user
            })

        }

        const token = await jwt.sign({id:user._id, email:email}, process.env.JWT_SECRET,{expiresIn: "30 minutes"})
        res.status(200).json({
            message:'logan successful', data: user, token 
        })


    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}

exports.verifyEmail = async (req, res) =>{
    try{
        const { email, otp } = req.body
        const user = await userModel.findOne({email:email.toLowerCase()})

        if(!user){
            return res.status(404).json({message:`User not found`})
        }

        if (user.otp != otp){
            return res.status(400).json({message:`invalid Otp`})
        }

        user.isVerified = true
        user.status = "Active"
        user.otp = null

        await user.save()

        return res.status(200).json({message:`Account verified successfull`})


    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}


exports.forgotPassword = async (req, res) =>{
    try{

        const { email } = req.body
        const user = await userModel.findOne({email:email.toLowerCase()})

        if(!user){
            return res.status(404).json({message:`User not found`})
        }

         const otp = otp_generate(6, {lowerCaseAlphabet: false, upperCaseAlphabet:false, specialChars:false})

         const emailContent={
            subject: 'Password Reset',
            email,
            name:user.fullName,
            htmlContent:`<html><head></head><body><p>Hello,${newUser.fullName}</p><p>we are thrilled to have you onboard please use the otp below to verify your account, <br> ${otp} </p></body></html>`

         }

         user.otp = otp 
         await sendEmail(emailContent)
         await user.save()


    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }
}

exports.resetPassword = async (req, res) => {
    try{
        const { email, otp, newPassword, confirmPassword } = req.body

        const user = await userModel.findOne({email:email.toLowerCase()})

        if(!user){
            return res.status(404).json({message:`User not found`})
        }

        if (user.otp != otp){
            return res.status(400).json({message:`invalid Otp`})
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message:"confirm password does not match"
            })
        }

        
    const saltRounds = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    user.password = hashedPassword
    user.otp = null

    await user.save()

    }catch(error){
        return res.status(500).json({
            error:error.message
          })
    }

}



