const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


//TODO: ----- Task Section -------

//  we are adding user id to task it will be associated
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id

    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }

})

// TODO ---To get all task associated with user----
// GET /task?completed=true --- //filtering using populate
// GET /task?limit=10&skip=0 ---//for paggination
// GET /tasks?sortBy=createAt:dec  //sortby when created in desending order
router.get('/tasks', auth, async (req, res) => {
    const match ={}
   const sort ={}
    if(req.query.completed){
        match.completed =  req.query.completed ==='true'
    }
    if(req.query.sortBy) {

        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1  // this wil save -1 if desc is given and 1 if not desc                                       
    }

    try {

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send
    }
})

// TODO --Get task by ID-----

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {

        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(500).send()
    }
})

//TODO ---- To update a value in collection ----

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})


//TODO -----To delete a colection-----

router.delete('/tasks/:id', auth, async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }


        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(req.body)
    }
})

module.exports = router