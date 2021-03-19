const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/',(req,res)=>{
    db.User.findAll().then(dbUsers=>{
        res.json(dbUsers);
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
})

router.post('/',(req,res)=>{
    db.User.create({
        email:req.body.email,
        name:req.body.name,
        password:req.body.password
    }).then(newUser=>{
        res.json(newUser);
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
})

router.post('/login',(req,res)=>{
    db.User.findOne({
        where:{
            email:req.body.email,
        }
    }).then(foundUser=>{
        if(!foundUser){
            return res.status(404).send("USER NOT FOUND")
        }
        if(bcrypt.compareSync(req.body.password, foundUser.password)) {
            const userTokenInfo = {
                email:foundUser.email,
                id:foundUser.id,
                name:foundUser.name
            }
            const token = jwt.sign(userTokenInfo,"secretString",{expiresIn:"2h"});
            return res.status(200).json({token:token})
        } else {
            return res.status(403).send('Login Failed')
        }
    })
})

router.get('/secrets',(req,res)=>{
    if(!req.headers.authorization) {
        return res.status(401).send('no auth header')
    }
    // console.log(req.headers.authorization);
    token = req.headers.authorization.split(' ')[1]
    console.log(token)
    const loggedInUser = jwt.verify(token, 'secretString', (err,data) =>{
        if(err) {
            return false
        }
        else {
            return data
        }
    });
    console.log(loggedInUser)
    res.json(loggedInUser)
})

module.exports = router