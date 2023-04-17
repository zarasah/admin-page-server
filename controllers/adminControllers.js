const { Users, Products, Categories } = require('../models');
const { checkAdmin } = require('../functions/checkAdmin');

async function getAllUsers(req, res) {
    const isAdmin = checkAdmin(req, res);
    
    if (!isAdmin) {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }

    try {
        const users = await Users.findAll({
            attributes: { exclude: ['password'] } 
        }); 
        res.status(200).json(users);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}

async function getAllCategories(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (!isAdmin) {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }

    try {
        const categories = await Categories.findAll(); 
        res.status(200).json(categories);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}

async function getAllProducts(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (!isAdmin) {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }

    try {
        const products = await Products.findAll(); 
        res.status(200).json(products);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}

module.exports = {
    getAllUsers,
    getAllCategories,
    getAllProducts
}