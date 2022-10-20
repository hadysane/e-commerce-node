const fs = require('fs')
const mongoose = require('mongoose')
const Product = require('../models/productModel')

// DOTENV Config
const dotenv = require('dotenv')
dotenv.config(); 

//CONNECT TO MONGODB
const MONGODB = process.env.MONGODB_DATABASE.replace('<PASSWORD>', process.env.MONGODB_PASSWORD)


// mongoose.connect : (url de la base de données,{options}).then(function)
mongoose.connect(MONGODB).then(() => console.log('DB connection successfully ✅.'))

//Read JSON FILE (PRODUCT.JSON)
const product = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'))


// IMPORT DATA TO MONGODB
const importData = async () => {
    try {
        await Product.create(product)
        console.log('Data successfully loaded')
    } catch (error) {
        console.log(error)
    }

    //close the server
    process.exit();
}

// DELETE ALL DATA FROM MONGODB

const deleteAll = async () => {
    try {
        await Product.deleteMany();
        console.log('Data successfully deleted')
    } catch (error) {
        console.log(error)
    }

    //close the server
    process.exit();
}
//RETURN AN ARRAY OF INSTRUCTION USING IN THE TERMINAL

//récupérer  des arguments 
// console.log(process.argv[2])


// console.log(process.argv)
/**
 * exemple 
 * [
  '/home/hady/.nvm/versions/node/v14.16.1/bin/node',
  '/var/www/html/cloud_campus/node/e-commerce/dev-data/import-dev-data.js',
  '--delete'
]*/

if (process.argv[2] === '--import') importData(); 
else if (process.argv[2] === '--delete') deleteAll();
