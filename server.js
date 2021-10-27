const express = require('express')
const inputCheck = require('./utils/inputCheck');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Registering the API Routes
app.use('/api', apiRoutes);

// Register Error Routes: 404
app.use((req,res) =>{
  res.status(404).end();
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
