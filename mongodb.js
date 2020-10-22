// CRUD Operations

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const objectID = mongodb.ObjectID

// Destructure the above code
const { MongoClient, ObjectID } = require('mongodb')
// Above will dirctly give the values from mongodb

const connectionURL ='mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id)

MongoClient.connect(connectionURL, { useNewUrlParser: true , useUnifiedTopology: true}, (error , client)=>{
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    db.collection('users').updateOne({
        _id: new ObjectID("5f86aeea96517526c4f91ac4")
    },{
        $set: {
            name: 'Rohit'
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


})


// Read
    // db.collection('users').findOne({ _id: new ObjectID("5f86b534aedaf227e039c7e7")}, (error, user) => 
    // {
    //     if(error){
    //         console.log('error')
    //     }

    //     console.log(user)

    // })


// Create
    // db.collection('users').insertOne({
    //     name:'Naveen',
    //     age:23
    // }, (error, result) => {
    //     if (error){
    //         console.log('Unable to insert User')
    //     }

    //     console.log(result.ops)
      
    // })



    // db.collection('users').insertMany([
    //     {
    //         name:'Naveen',
    //         age:23
    //     },
    //     {
    //         name:'Neeraj',
    //         age:25
    //     }
    // ], (error, result) => {
    //         if (error){
    //             console.log('Unable to insert Documents! ')
    //         }
    
    //         console.log(result.ops)

    //     })

    



