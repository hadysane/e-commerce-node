const app = require('./app')
const mongoose = require('mongoose')

const port = process.env.PORT || 3000

//CONNECT TO MONGODB
const MONGODB = process.env.MONGODB_DATABASE.replace('<PASSWORD>', process.env.MONGODB_PASSWORD) 


// mongoose.connect : (url de la base de données,{options}).then(function)
mongoose.connect(MONGODB).then(() => console.log('DB connection successfully .'))

// Server
app.listen(port, () => console.log('listerning on port 3000'));