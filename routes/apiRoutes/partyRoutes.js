const express = require('express');

const db = require('../../db/connection');

const inputCheck = require('../../utils/inputCheck');

const router = express.Router();

//get
router.get('/parties', (req, res) => {
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

//Get
router.get('/party/:id', (req, res) => {
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

//delete
router.delete('/party/:id', (req, res) => {
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


module.exports = router;
