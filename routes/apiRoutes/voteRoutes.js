const express = require('express');
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck')

const router = express.Router();

router.post('/votes', (req, res) => {

  const sql = `INSERT INTO votes (voter_id, candidate_id) Values (?, ?)` 
  
  const {voter_id, candidate_id} = req.body
  
  const errors = inputCheck(req.body, "voter_id", 'candidate_id')
  if (errors) {
    return res.status(400).json({errors})
  }

  db.query(sql, [voter_id, candidate_id], (err, data) => {

    if(err){
      return res.status(500).json({error:err.message})
    }
    res.json({
      message: `Success`,
      data
    })
  })
})

module.exports = router;

