const express = require('express');

const db = require('../../db/connection');

const inputCheck = require('../../utils/inputCheck');

const router = express.Router();

router.get('/voters', (req, res) => {
  
  const sql = `SELECT * FROM voters ORDER BY last_name`
  
  db.query(sql, (err, data) => {
    if(err){
      return res.status(500).json({
        error: err.message
      })
    }
    res.json({
      message: `Success`,
      data
    })
  })
})

router.get('/voter/:id', (req, res) => {
  const sql = `SELECT * FROM voters WHERE id= ?`;
  const {id} = req.params;
  
  db.query(sql, [id], (err, data) => {
    if(err){
      return res.status(400).json({error:err.message})
    }
    if (data.length === 0){
      return res.status(404).json("Voter was not found")
    }
    res.json({
      message: `Success`,
      data
    })
  })
})

router.post('/voter', (req, res) => {
  const {first_name, last_name, email} = req.body;
  const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`
  const params = [first_name, last_name, email];

  const errors = inputCheck(req.body, 'first_name', 'last_name', 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  db.query(sql, params, (err, data) => {
    if(err){
      return res.status(400).json({error: err.message})
    }
    res.json({
      message:`Success`,
      data: {
        first_name,
        last_name,
        email,
        id: data.insertId
      }
    })
  })
})



//Update voter email
router.put('/voter/:id', (req, res) => {
  const {email} = req.body;
  const {id} = req.params;
  const sql = `UPDATE voters SET email= ? WHERE id = ?`;

  //Input check
  const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }


})


router.delete('/voter/:id', (req, res) => {
  const {id} = req.params;
  const sql = `DELETE FROM voters WHERE id = ?`
  db.query(sql, [id], (err, data) => {
    if (err){
      return res.status(400).json({error: err.message})
    }
    if (!data.affectedRows){
      return res.status(404).json(`Voter was not found`)
    }
    res.json({
      message: `Success Deleting ${data.affectedRows} Voter`
    })
  })
})


module.exports = router;
