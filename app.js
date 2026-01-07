const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./data/database');
const routers = require('./routes/allRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, '.../assets')));

// 2. Rota Principal para servir o HTML
app.use('/', routers);

connectDB();

app.listen(PORT, () =>{
    
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
})

module.exports = app;
