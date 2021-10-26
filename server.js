const express = require('express')
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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

// ******************************************************
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
//****************************************************** */


app.get('/api/candidates', (req, res) => {

  // Get The Data 
  const sql = `SELECT candidates.*, parties.name AS party_name
  FROM candidates LEFT JOIN parties
  ON
  candidates.party_id = parties.id`;
  
  // Perform The Query
  db.query(sql, (err, rows) => {

    if(err) {
      return res.status(500).json({
        err: err.message
      })
    }
    res.json({
      message:'Data returned sucessfully',
      data: rows
    })
  })

})

app.get('/api/candidate/:id', (req, res) => {
  
// Get the candidate by it id 
  const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`;
  const param = req.params.id;
  db.query(sql, param, (err, data) => {

    if(err){
      return res.status(400).json({
        error:err.message
      })
    }
    //strict equality
    if(data.length === 0) {
      return res.json({
        message:'No results found!'
      })
    }

    res.json({
      message: 'success',
      data
    })
  })
})


//Delete a candidate
app.delete('/api/candidate/:id',(req, res) => {
  const sql = `DELETE FROM candidates WHERE id=?`;
  const params = [req.params.id]

  db.query(sql, params, (err, data) => {
    if(err){
      return res.status(400).json(err.message)
    } 
    if(!data.affectedRows){
      return res.json({
        message:'Canadidate was not found!'
      })
    }
    res.json({
      message:`You have deleted ${data.affectedRows} candidate!`,
      changes: data.affectedRows,
      id: req.params.id
    })
  })
})


// Create a candidate
app.post('/api/candidate', (req, res) => {
  const errors = inputCheck(req.body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates(
    first_name, last_name, industry_connected) VALUES
    (?,?,?)`

  const params = [req.body.first_name, req.body.last_name, req.body.industry_connected]
    
  db.query(sql, params, (err, data) => {
    if(err) {
      return res.json({
        error: err.message
      })
    }
    
    res.status(201).json({
      message:`Candidate was created sucessfully!`,
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        industry_connected: req.body.industry_connected
      }
    })
  })
});

app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }
    res.json({
      message:`sucess`,
      data
    })
  })
})

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


//update a candidte party_id
app.put('/api/candidate/:id', (req, res) => {

  const {party_id} = req.body;
  const {id} = req.params;

  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`

  db.query(sql, [party_id, id], (err, data) => {
    if(err) return res.status(400).json({error: err.message});
    if(!data.affectedRows) return res.status(404).json({error: "candidate was not found"})
    res.json({
      message: `You have updates ${data.affectedRows} candidate`,
      data
    })
  })
})

// Register Error Routes: 404
app.use((req,res) =>{
  res.status(404).end();
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
