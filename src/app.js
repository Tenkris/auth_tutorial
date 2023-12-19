const express = require('express');
const app = express();
const {initMySQL,getConnection} = require('./utils/initmysql');
const authRouter = require('./routes/routes');
app.use(express.json());
// require .dotenv 
require('dotenv').config(); 
const port = process.env.PORT ;
// Your other code...

try {
    initMySQL();
    console.log('MySQL connection initialized.');
    
}
catch (error) {
    console.error('Error initializing MySQL:', error);
}

app.use('/api',authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
