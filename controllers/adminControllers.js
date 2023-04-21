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

async function createCategory(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (!isAdmin) {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }

    const { name } = req.body;
    
    if (name) {
        const category = await Categories.findOne({ where: { name } });
        console.log('category', category)
        if (category) {
            return res.status(409).json({ message: 'Category already exists.' });
        }

        Categories.create({ name })
        .then((data) => res.status(201).json({ message: 'Category created', data }))
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        })
    }
}

async function updateCategory(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;
        const { name } = req.body;

        await Categories.update({ name }, { where: { id },  returning: ['name'] });

        const data = await Categories.findByPk(id);

        res.status(200).json({ message: 'Category updated successfully', data });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function deleteCategory(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;

        await Categories.destroy({ where: {id}});
        res.status(204).end(); //  OR res.status(200).json({ message: 'Category successfully deleted' });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function createProduct(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { name, price, quantity, description, img, categoryId } = req.body;

        const data = await Products.create({ name, price, quantity, description, img, categoryId });
        res.status(201).json({ message: 'Product created', data })
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function updateProdut(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { name, price, quantity, description, img, categoryId, id } = req.body;
        await Products.update({ name, price, quantity, description, img, categoryId }, { where: { id } });
        res.status(200).json({ message: 'Product updated successfully' });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function deleteProduct(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;
        
        await Products.destroy({ where: {id}});
        res.status(200).json({ message: 'Product successfully deleted' });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

module.exports = {
    getAllUsers,
    getAllCategories,
    getAllProducts,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProdut,
    deleteProduct
}