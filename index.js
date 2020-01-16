// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {

    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({success:false, errorMessage: "There user information could not be retrieved"})
        });
});

server.get('/api/users/:id', (req, res) => {

    const {id} = req.params;

    db.findById(id)
        .then(user => {
            if(user){
                res.status(200).json(user);
            }
            else{
                res.status(404).json({errorMessage: "The user with the specified ID does not exist"});
            }
        })
        .catch(err => {
            res.status(500).json({success:false, errorMessage: "The user information could not be retrieved"});
        });
});



server.post('/api/users', (req, res) => {

    const userInfo = req.body;

    if (!userInfo.hasOwnProperty('bio') || !userInfo.hasOwnProperty('name')){

        res.status(400).json({errorMessage: "Please Provide name and bio for user"});
    }

    db.insert(userInfo)
        .then(user => {
            res.status(201).json({success: true, user});
        })
        .catch(err => {
            res.status(500).json({success:false, errorMessage: " there was an error while saving to the database"})
        });
});

server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(204).end();
            }
            else{
                res.status(404).json({success: false, message:"id not found"});
            }
        })
        .catch( err => {
            res.status(500).json({success: false, err});
        });
});

server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    if (!changes.hasOwnProperty('bio') || !changes.hasOwnProperty('name')){

        res.status(400).json({errorMessage: "Please Provide name and bio for user"});
    }

    db.update(id, changes)
        .then(updated => {
            if(updated) {
                res.status(200).json({succes: true, updated});
            }
            else{
                res.status(404).json({success: false, message:"id not found"});
            }
        })
        .catch( err => {
            res.status(500).json({success: false, err});
        });
})

server.listen(5000, () => {

    console.log(`Server running on http://localhost:5000`);
});