const mongoose =require('mongoose')
const validator = require('validator')
const sharp = require('sharp')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type : String,
        unique:true ,
        required:true,
        trim:true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email invalid")
                
            }

        }

    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error("Age must be Positive")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength:7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Password wrong')
            }
        }
    },

    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer

    }
}, {

    timestamps: true

}) 


userSchema.virtual('tasks', {
    ref: 'Task',
    localField:'_id',
    foreignField:'owner'
})

// TO get only necessary data hiding rest by saving it in a userObject and deleting and sending userObject back
// or use .toJSON it will be called every time res.send send some JSON data every time pass and token will be deleted

userSchema.methods.toJSON = function()  {
     const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar


    return userObject


}


// TO generte auth token 
userSchema.methods.generateAuthToken = async function () {
    const user =  this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token

}

// check if user is already present 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
   
    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch  = await bcrypt.compare(password, user.password)

    
    if(!isMatch){
        throw new Error('Unable to login')
    }

    
    return user
}

// TODO ---Using middleware -----
// TODO --Hash password before saving-
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified("password")){
            user.password = await bcrypt.hash(user.password, 8)
    }


    next()
})



// TODO  Delete user task when user is deleted
userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


// TODO  Create a new collection  with the name user and descibe its value properties 
const User = mongoose.model('User', userSchema )



// Export user so that index.js can use it to create a new user
module.exports = User