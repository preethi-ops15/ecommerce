const express = require('express');
const router = express.Router();
const { 
  createQuery, 
  getAllQueries, 
  getQueryById, 
  updateQueryStatus, 
  replyToQuery,
  deleteQuery, 
  getQueryStats 
} = require('../controllers/Query');
const { verifyToken } = require('../middleware/VerifyToken');

// Public route - Create a new query
router.post('/', createQuery);

// Protected routes - Admin only
router.get('/', verifyToken, getAllQueries);
router.get('/stats', verifyToken, getQueryStats);
router.get('/:id', verifyToken, getQueryById);
router.put('/:id/status', verifyToken, updateQueryStatus);
router.put('/:id/reply', verifyToken, replyToQuery);
router.delete('/:id', verifyToken, deleteQuery);

module.exports = router; 