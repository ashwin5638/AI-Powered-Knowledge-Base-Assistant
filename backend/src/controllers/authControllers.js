const User = require('../models/User')
const { generateToken } = require('../utils/jwt')



const register = async(req, res) => {
    try {
        const {name, email, password} = req.body
        
        if (!name || !email || !password) {
            return res.status(400).json({
                message : "All fields are required"
            })
        }

        const UserExist = await User.findOne({email})

        if(UserExist){
            return res.status(400).json({
                message : "Email already exists"
            })
        }

        
        const user = await User.create({
            name,
            email,
            password
        })


        res.status(201).json({
            message : "User Register Sucessfully",

            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            },
            token : generateToken(user._id)
        })


    } catch (error) {
        console.error('Register error:', error)
        return res.status(500).json({
            message : error.message || "Internal server error"
        })
    }
}


const login = async(req, res) => {
    try{
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({
                message : 'All fields are required'
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                message : "invalid Email"
            })
        }
        
      const isPassword = await user.comparePassword(password)

        if(!isPassword){
            return res.status(400).json({
                message : 'Invalid Password'
            })
        }

        const token = generateToken(user._id)

        res.status(200).json({
            success : true,
            message : "Login Sucessfull",

            user : {
                id : user._id,
                email : user.email,
                role : user.role 
            },
            token,
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({
                message : "User not found"
            })
        }
        res.status(200).json({
            success : true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}


module.exports = {
    register,
    login,
    getProfile
}