const { Products, Categories } = require('../models');

async function getAllProducts(req, res) {
    try {
        const products = await Products.findAll();
        res.status(200).json(products);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAllProducts
}