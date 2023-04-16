const CryptoJS = require("crypto-js");
const { generateAccessToken } = require('../middlewares/generateAccessToken');
const { Users } = require('../models');

async function register(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password fields are required.' });
        return;
    }

    try {
        const emailExists = await Users.findOne({
            where: {
              email
            }
        })
    
        if(emailExists) {
            return res.status(409).json({ message: 'Email already exists.' });  
        }

        const hashed_password = CryptoJS.SHA256(password).toString();

        await Users.create({
            email,
            password: hashed_password
        })
        res.status(201).json({ message: 'User created' });
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    } 
}

function login(req, res) {
   
}

module.exports = {
    register,
    login
}