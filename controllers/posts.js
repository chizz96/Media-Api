const postModel = require("../models/post")

const cloudinary = require('../config/cloudinary')

const fs = require('fs')

exports.createPost = async(req, res)=>{
    try{
        const { userId } = req.params;
        const { content } = req.body;

        const files = req.files

        const media = []

        if(files.length > 0 ){
            const invalidFiles = files.map((file)=>{
                file.mimetype.startsWith('application/pdf')

            })

            if(invalidFiles.includes(true)){
                files.forEach(element => {
                    if(fs.exitsSync(element.path)){
                        fs.unlinkSync(element.path)
                    }  
                });
                return res.status(400).json({
                    message:'PDF is not allowed'
                })
            }

        }

        const user = await userModel.findById(userId)

        if (!user){
            return res.status(400).json({
                message: "post not found"
            })
        }

        for(const file of files){
            const result = await cloudinary.Uploader.upload(file.path, (error, data)=>{
                if(error){
                    res.status(500).json({
                        message:"Failed to upload file " + error.message
                    })

                }else{
                    return data
                }
            })

            const mediaObject = {
                imageUrl: result.secure_url,
                imageId: result.public_id
            }

             media.push(mediaObject)
             fs.unlinkSync(file.path)

        }

    

        const data = {
            
            content,
            userId,
            media
        }



        const newPost = new postModel(data)

        user.posts.push(newPost._id);
        await newPost.save();
        await user.save()

        res.status(201).json({
            message:"post created successfully create",data:newPost
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


