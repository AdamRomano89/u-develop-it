const express = require('express');
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

const router = express.Router();

//Get all candidates
router.get('/candidates', (req, res) => {

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

router.get('/candidate/:id', (req, res) => {
  
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
router.delete('/candidate/:id',(req, res) => {
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
router.post('/candidate', (req, res) => {
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



//update a candidte party_id
router.put('/candidate/:id', (req, res) => {

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

module.exports = router;
