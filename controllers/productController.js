const fs = require('fs');
const Product = require('../models/productModel')
const APIFeatures = require('../utils/apiFeatures')

// const products = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/products-simple.json`, 'utf8')
// )

// middleware 
exports.checkbody = (req, res, next) => {
    if (!req.body.name || !req.body.price)
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })

    next()
}

//convention pour mettre qu'on utilise pas un paramettre (_, res, next, val)
// exports.checkId = (req, res, next, val) => {
//     console.log(`product id is ${val}`)
//     if (Number(val) > products.length) return res.status(
//         res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         })

//     )
//     next()
// }





// ------------controllers Product----------------

exports.getAllProducts = async (req, res) => {

    try {

        const features = new APIFeatures(Product.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const products = await features.query;

        //     (<) less than - $lt

        //     (>=) greater than equal to - $gte

        //     (<= ) less than equal to - $lte
        //  */


        res.status(200).json({
            status: 'success',
            result: products.length,
            data: { products }
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ status: 'error', message: err.message })
    }


}

exports.getProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({ status: 'success', data: { product } })
    } catch (err) {
        return res.status(400).json({ status: 'error', message: 'No product found with this id 😥 ' })
    }

    // const id = Number(req.params.id); //Number convertir en nombre
    // const product = products.find((product) => product._id === id);
    // res.status(200).json({ status: 'success', data: { product } })
}

exports.createProduct = async (req, res) => {
    // console.log("body ", req.body)
    // const newId = products[products.length - 1]._id + 1;

    // const newProduct = Object.assign({ _id: newId }, req.body)
    // console.log(newProduct)

    // //1) add new product in product in products array
    // products.push(newProduct)

    // //2) write old product and new product using products variable
    // fs.writeFile(
    //     `${__dirname}/../dev-data/products-simple.json`,
    //     JSON.stringify(products),
    //     (err) => {
    //         if (err) return res.status(400).send('Something went wrong 😠 ')
    //         res.status(201).json({ status: 'success', data: { products } })

    //     })

    // à ne pas le faire  :⚠
    // const product = new Product({ name: 'Product' })
    // product.save()

    try {
        const product = await Product.create(req.body)
        res.status(201).json({ status: 'success', data: { product } })
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message })
    }

}


exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // retourner la modification que l'original 
            runValidators: true
        })

        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message })
    }

    // const id = Number(req.params.id); //Number convertir en nombre
    // const product = products.find((product) => product._id === id);
    // res
    //     .status(200)
    //     .json({ status: 'success', data: { product: '<Update product>' } });
};

exports.deleteProduct = async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(404).json({ status: 'error', message: 'Not find ID ' })
    }


    // const id = Number(req.params.id); //Number convertir en nombre
    // const product = products.find((product) => product._id === id);
    // res
    //     .status(204)
    //     .json({ status: 'success', data: null });
};
