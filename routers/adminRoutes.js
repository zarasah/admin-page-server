const express = require('express');
const adminRt = express.Router();
const { adminCtrl } = require('../controllers');
const { authenticateToken } = require('../middlewares/authenticateToken');

adminRt.get('/users', authenticateToken, adminCtrl.getAllUsers);
adminRt.get('/categories', authenticateToken, adminCtrl.getAllCategories);
adminRt.get('/products', authenticateToken, adminCtrl.getAllProducts);

adminRt.post('/createproduct', authenticateToken, adminCtrl.createProduct);
adminRt.put('/updateproduct', authenticateToken, adminCtrl.updateProdut);
adminRt.delete('/deleteproduct', authenticateToken, adminCtrl.deleteProduct);

adminRt.post('/createcategory', authenticateToken, adminCtrl.createCategory);
adminRt.put('/updatecategory', authenticateToken, adminCtrl.updateCategory);
adminRt.delete('/deletecategory', authenticateToken, adminCtrl.deleteCategory);

adminRt.delete('/deleteuser', authenticateToken, adminCtrl.deleteUser);

module.exports = adminRt;