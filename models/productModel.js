const mongoose = require('mongoose')



// new instance qu'on utilise car schema est une class

const productSchema = new mongoose.Schema({

    // proprieter en objet avec le type et required // ou string indiquer le type
    name: {
        type: String,
        required: [true, 'A product name must a name'] // objet [bool, 'message erreur']
    },
    brand: String,
    product_id: {
        type: Number,
        require :[true, 'A product must have a product id']
        // min: [1, 'A product id must have 6 numbers'],
        // max: [6, 'A product id must have 6 numbers'],
    }, 
    quantity: {
        type: Number, 
        default: 5, 
    }, 
    price: {
        type: Number, 
        required : [true, 'A product must have a price']
    }, 
    description: {
        type: String, 
        trim: true
    }, 
    weight: Number,
    picture_1: {
        type: String,
        required: [true, 'A product must have a picture']
    },
    picture_2: String,
    picture_3: String,
    madein: String, 
    material: String,
    category: String, 
    sub_category: String, 
    season: {
        type: String,
        enum: {
            values: ['Spring/Summer', 'All Year'], 
            message: 'Season must be Spring/Summer or All Year', 
        }
    },
    color: String,
    bicolors: String,
    genre: {
        type: String, required: true,
        // validation de valeurs | des options à respecter ne pas donner à n'importe quelle valeur 
        enum: {
            values: ['Women', 'Men'],
            message: 'Genre must be women or Men'
        }
    }
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product
