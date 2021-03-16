var express = require('express');
// Sets up express app
// =====================================================================
var app = express();
var PORT = process.env.PORT || 8080;
var allRoutes = require('./controllers');

// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use('/', allRoutes);
app.get('/',(req,res)=>{
    res.send('Welcome to my fishes!')
})
db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function(){
        console.log(`App listenting on PORT ${PORT}`);
    });
});