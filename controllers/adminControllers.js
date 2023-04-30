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

    Products.findAll({
        include: {
          model: Categories,
          attributes: ['name'],
        },
        attributes: ['id', 'name', 'price', 'quantity', 'description', 'img', 'categoryId', 'name']
      }).then((data) => {
        const products = data.map((item) => {
            const imgUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${item.img}`;
            item.img = imgUrl;
            return item;
        })
        res.status(200).json(products);
      }).catch((error) => {
        console.error(error);
        res.status(500).send('Server Error');
      });
}

async function createCategory(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (!isAdmin) {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }

    const { name } = req.body;
    
    if (name) {
        const category = await Categories.findOne({ where: { name } });
        
        if (category) {
            return res.status(409).json({ message: 'Category already exists.' });
        }

        Categories.create({ name })
        .then((data) => res.status(201).json({ message: 'Category created', data }))
        .catch((error) => {
            return res.status(500).json({ message: 'Internal Server Error' });
        })
    } else {
        return res.status(400).json({ message: 'Category name is required.' });
    }
}

async function updateCategory(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const category = await Categories.findOne({ where: { name } });

        if (category) {
            return res.status(409).json({ message: 'Category already exists.' });
        }

        await Categories.update({ name }, { where: { id },  returning: ['name'] });

        const data = await Categories.findByPk(id);
        
        return res.status(200).json({ message: 'Category updated successfully', data });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function deleteCategory(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;

        await Products.destroy({ where: {categoryId: id}});
        await Categories.destroy({ where: {id}});
        
        res.status(204).end(); //  OR res.status(200).json({ message: 'Category successfully deleted' });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function createProduct(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { name, price, quantity, description, categoryId } = req.body;
        const img = req.file.filename;
       
        if (!(name && price && quantity && description && img && categoryId)) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const data = await Products.create({ name, price, quantity, description, img, categoryId });
        const imgUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${data.img}`;
        data.img = imgUrl;
        return res.status(201).json({ message: 'Product created', data });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function updateProdut(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;
        const { name, price, quantity, description, categoryId } = req.body;
        const img = req.file.filename;
        
        if (!(name && price && quantity && description && img && categoryId)) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
       
        await Products.update({ name, price, quantity, description, img, categoryId }, { where: { id } });

        Products.findOne({
            where: { id },
            attributes: ['id', 'name', 'price', 'quantity', 'description', 'img', 'categoryId', 'name'],
            include: {
              model: Categories,
              attributes: ['name'],
            },
        })
        .then(product => {
            const imgUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${product.img}`;
            product.img = imgUrl;
            return res.status(200).json({ message: 'Product updated successfully', product });
        })
        .catch(error => {
            console.log(error)
        })
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function deleteProduct(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;
        
        await Products.destroy({ where: {id}});
        return res.status(200).json({ message: 'Product successfully deleted' });
    } else {
        return res.send(JSON.stringify({ status: "Denied Access" }));
    }
}

async function deleteUser(req, res) {
    const isAdmin = checkAdmin(req, res);

    if (isAdmin) {
        const { id } = req.query;
        
        await Users.destroy({ where: {id}});
        return res.status(200).json({ message: 'Product successfully deleted' });
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
    deleteProduct,
    deleteUser
}