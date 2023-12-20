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
        let AuthHeader = req.headers.authorization;
        if (!AuthHeader) {
            throw new Error('Authorization header is missing');
        }

        let token = AuthHeader.split(' ')[1];
        if (!token) {
            throw new Error('Authentication token is missing');
        }
        let payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            throw new Error('Authentication failed');
        }
        let [checkresult] = await connection.query('SELECT * FROM auth WHERE email = ?', [payload.email]);
        if (!checkresult.length) {
            throw new Error('User not found');
        }

        console.log(payload);
        const query = 'SELECT * FROM auth';
        const [results] = await connection.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving data from the table:', error);
        res.status(500).send(error.message);
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
        const userPayload = {
            id: user.id,
            email: user.email
        };
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Login successful' ,token});
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
