const app = require('./app');
const db = require('./config/db');
require('dotenv').config();

const PORT = 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});