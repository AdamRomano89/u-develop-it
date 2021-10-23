const { query } = require('express');
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

// db.query(`SELECT * FROM candidates`, (err, rows)=> {
//   console.log(rows);
// })

//Select a candidate
// db.query(`SELECT * FROM candidates WHERE id = 15`, (err, row) => {
//   if(err){
//     console.log(err);
//   }
//   console.log(row);
// });


//Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

//Create a candidate
// const sql = `
// INSERT INTO candidates (id, first_name, last_name, industry_connected)
// VALUES (?,?,?,?)
// `;
// const params = [1, 'Ronald', 'Firbank', 1]
// db.query(sql, params, (err, res) => {
//   if(err){
//     console.log(err);
//   }
//   console.log(res);
// })



// Register Error Routes: 404
app.use((req,res) =>{
  res.status(404).end();
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
