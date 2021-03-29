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
    db.Fish.findAll().then(fishs=>{
        res.json(fishs);
    }).catch(err=>{
        console.log(err)
        res.status(500).send('something went wrong')
    })
})

router.get('/:id',(req,res)=>{
    db.Fish.findOne({
        where:{
            id:req.params.id
        }
    }).then(dbFish=>{
        res.json(dbFish);
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
    db.Tank.findOne({
        where:{
            id:req.body.tankId
        }
    }).then(tankData=>{
        if(tankData.UserId===loggedInUser.id){
            db.Fish.create({
                name:req.body.name,
                color:req.body.color,
                width:req.body.width,
                UserId:loggedInUser.id,
                TankId:req.body.tankId
            }).then(newFish=>{
                return res.json(newFish)
            }).catch(err=>{
                console.log(err)
                return res.status(500).send('something went wrong')
            })
        }else{
           return res.status(401).send('not your tank') 
        }
    })
    
})

router.put("/:id",(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    db.Fish.findOne({
        where:{
            id:req.params.id
        }
    }).then(fish=>{
        if(loggedInUser.id===fish.UserId){
            db.Fish.update({
                name:req.body.name,
                color:req.body.color,
                width:req.body.width,
                TankId:req.body.tankId
            },{
                where:{
                    id:fish.id
                }
            }).then(editFish =>{
                res.json(editFish)
            }).catch(err=>{
                console.log(err)
                res.status(500).send('something went wrong')
            })
        } else {
            return res.status(401).send("not your fish!")
        }
    })
})

router.delete("/:id",(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    db.Fish.findOne({
        where:{
            id:req.params.id
        }
    }).then(fish=>{
        if(loggedInUser.id===fish.UserId){
            db.Fish.destroy({
                where:{
                    id:fish.id
                }
            }).then(delFish =>{
                res.json(delFish)
            }).catch(err=>{
                console.log(err)
                res.status(500).send('something went wrong')
            })
        } else {
            return res.status(401).send("not your fish!")
        }
    })
})


module.exports = router