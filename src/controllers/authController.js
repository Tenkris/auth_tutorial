const { getConnection } = require('../utils/initmysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {email , password} = req.body; 
    const connection = await getConnection(); 
    try{
        const [rows] = await connection.query('SELECT * FROM auth WHERE email = ?', [email]);
        if (rows.length) {
            return res.status(400).send({ message: 'Email is already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            email,
            password: hashedPassword
        };
        const [result] = await connection.query('INSERT INTO auth SET ?', userData);
        res.status(201).send({ message: 'User registered successfully' });
    }
    catch(error){
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
}
const getAuth = async (req, res) => {
    try {
        const connection = await getConnection();
        let token = req.cookies.token; 
        if(!token){
            throw new Error('No token found');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            throw new Error('Invalid token');
        }
        console.log(decoded.email)
        const email = decoded.email;
        let query = 'SELECT * FROM auth WHERE email = ?';
        let [results] = await connection.query(query, [email]);
        if (results.length === 0) {
            return res.status(404).send({ message: 'Email does not exist' });
        }
        query = 'SELECT * FROM auth';
        [results] = await connection.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving data from the table:', error);
        res.status(500).send('Internal Server Error');
    }
};

const loginUser = async (req, res) => {
    const {email, password} = req.body; 
    const connection = await getConnection(); 
    try{
        const [rows] = await connection.query('SELECT * FROM auth WHERE email = ?', [email]);
        if (!rows.length) {
            return res.status(400).send({ message: 'Email is not registered' });
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user.id , email:user.email}, process.env.JWT_SECRET);
        // cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'none'
        });
        res.status(200).send({ message: 'Login successful' });
    }
    catch(error){
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    getAuth,
    registerUser,
    loginUser
};
