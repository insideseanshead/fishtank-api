const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
const db = require('../models');

const checkAuthStatus = request => {
    if(!request.headers.authorization) {
        return false
    }
    token = request.headers.authorization.split(' ')[1]
    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET, (err,data) =>{
        if(err) {
            return false
        }
        else {
            return data
        }
    });
    console.log(loggedInUser)
    return loggedInUser
}

router.get('/',(req,res)=>{
    db.Tank.findAll().then(tanks=>{
        res.json(tanks);
    }).catch(err=>{
        console.log(err)
        res.status(500).send('something went wrong')
    })
})

router.get('/:id',(req,res)=>{
    db.Tank.findOne({
        where:{
            id:req.params.id
        }
    }).then(dbTank=>{
        res.json(dbTank);
    }).catch(err=>{
        console.log(err)
        res.status(500).send('something went wrong')
    })
})

router.post('/',(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    console.log(loggedInUser)
    db.Tank.create({
        name:req.body.name,
        UserId:loggedInUser.id
    }).then(newTank=>{
        res.json(newTank)
    }).catch(err=>{
        console.log(err)
        res.status(500).send('something went wrong')
    })
})

router.put("/:id",(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    db.Tank.findOne({
        where:{
            id:req.params.id
        }
    }).then(tank=>{
        if(loggedInUser.id===tank.UserId){
            db.Tank.update({
                where:{
                    name:req.body.name
                }
            },{
                where:{
                    id:tank.id
                }
            }).then(editTank =>{
                res.json(editTank)
            }).catch(err=>{
                console.log(err)
                res.status(500).send('something went wrong')
            })
        } else {
            return res.status(401).send("not your tank!")
        }
    })
})

router.delete("/:id",(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    db.Tank.findOne({
        where:{
            id:req.params.id
        }
    }).then(tank=>{
        if(loggedInUser.id===tank.UserId){
            db.Tank.destroy({
                where:{
                    id:tank.id
                }
            }).then(delTank =>{
                res.json(delTank)
            }).catch(err=>{
                console.log(err)
                res.status(500).send('something went wrong')
            })
        } else {
            return res.status(401).send("not your tank!")
        }
    })
})


module.exports = router