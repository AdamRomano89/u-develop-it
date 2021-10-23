const express = require('express')
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    //Your MySql username,
    user: 'root',
    //You MySQL password,
    password: '55125516',
    database: 'election'
  },
  console.log('Connected to the election database.')
);

// Register Routes
db.query(`SELECT * FROM candidates`, (err, rows)=> {
  console.log(rows);
})


// Register Error Routes: 404
app.use((req,res) =>{
  res.status(404).end();
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
