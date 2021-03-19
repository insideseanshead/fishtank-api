const express = require('express');
const router = express.Router()

const userRoutes= require('./userController');
const tankRoutes= require('./tankController');

router.get('/',(req,res)=>{
    res.send('Welcome to my fishes!')
})

router.use('/api/users',userRoutes)
router.use('/api/tanks',tankRoutes)

module.exports = router