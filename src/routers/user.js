const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/accounts')
//  TODO -- To separte and use it as a mini app 
const router = new express.Router()


//TODO --------- To Post new data and Signup -----------

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }

    //! --- Code using without using async  
    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

})


// TODO ---For Login-----

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })


    } catch (e) {
        res.status(404).send(e)
    }

})


// TODO    -------- logout-------

router.post('/users/logout', auth, async (req, res) => {

    // ? --- filter method will look for the token that matches the token send by auth
    // ? --- it will remove that token and save the file
    try {
        req.user.tokens = req.user.tokens.filter((token) => {

            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

})

// TODO ---LogOut All ----

router.post('/users/logoutAll', auth, async (req, res) => {

    // ? --- put empty array instead of all tokens so that no active token will be there
    try {

        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

})


//TODO to get the detail of user loged in

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)





    // try {
    //     const users = await User.find({})
    //     res.send(users)

    // } catch (e) {
    //     res.status(500).send
    // }

    //!  ----Code using without using async
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

//TODO -------- To get single collection by id  -------  not required now----

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)

//     } catch (e) {
//         res.status(500).send()
//     }

//     //! --- Code using without using async
// User.findById(_id).then((user) => {
//     if (!user) {
//         return res.status(404).send()
//     }

//     res.send(user)
// }).catch((e) => {
//     res.status(500).send()
//   })
// })

//TODO --------- To update a value in collection ----------

router.patch('/users/me', auth, async (req, res) => {


    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }





    try {

        // const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        // It skips middleware and mongosoe--  using  .save
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//TODO ----------- To delete a colection user ----------

router.delete('/users/me', auth, async (req, res) => {
    try {

        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        

        
        // this will remove the user coming from auth
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


// TODO to upload a profile pic or image
const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be a image type'))
        }

        cb(undefined, true)
        // cb(undefined,false)
    }
})

// TODO: -------uploading a image or file
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width:250 ,height:250 }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


// TODO -----to delete a image 
router.delete('/users/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


// TODO TO GET the image by ID 
router.get("/users/:id/avatar", async (req, res) => {

    try {

        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }

})

module.exports = router