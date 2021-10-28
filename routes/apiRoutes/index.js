const express = require('express');

const router = express.Router();

// Registering Candidates Routes
router.use(require('./candidateRoutes'));

// Registering Parties Routes
router.use(require('./partyRoutes'));

// Registering Voters Routes
router.use(require('./voterRoutes'));

// Registering Voters Routes
router.use(require('./voteRoutes'));

module.exports = router;