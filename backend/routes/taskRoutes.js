const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// /api/tasks
router.route('/')
  .get(getAllTasks)
  .post(createTask);

// /api/tasks/:id
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
