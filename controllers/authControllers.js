const CryptoJS = require("crypto-js");
const { generateAccessToken } = require('../functions/generateAccessToken');
const { Users } = require('../models');

async function register(req, res) {
    const { name, email, password } = req.body;
    
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
            name,
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
    const { email, password } = req.body;

    Users.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const hashed_password = CryptoJS.SHA256(password).toString();

      if (user.password !== hashed_password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateAccessToken(user.email, user.role);
      res.json({ message: 'Login successful', jwt: token, role: user.role, name: user.name });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
}

module.exports = {
    register,
    login
}