const { getPool } = require('../config/db');

// @desc    Get all tasks
// @route   GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT id, title, description, status, priority, created_at 
      FROM tasks 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    const errorMsg = err.message || err.code || String(err);
    console.error('Error in getAllTasks:', errorMsg);
    res.status(500).json({ success: false, error: errorMsg });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  const { title, description = '', priority = 'medium', status = 'pending' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Task title is required' });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)`,
      [title.trim(), description.trim(), priority, status]
    );

    const [newRows] = await pool.query(`SELECT * FROM tasks WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newRows[0],
    });
  } catch (err) {
    const errorMsg = err.message || err.code || String(err);
    console.error('Error in createTask:', errorMsg);
    res.status(500).json({ success: false, error: errorMsg });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  try {
    const pool = getPool();

    const [checkRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const current = checkRows[0];
    const updatedTitle = title !== undefined ? title : current.title;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedStatus = status !== undefined ? status : current.status;
    const updatedPriority = priority !== undefined ? priority : current.priority;

    await pool.query(
      `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?`,
      [updatedTitle, updatedDesc, updatedStatus, updatedPriority, id]
    );

    const [updatedRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedRows[0],
    });
  } catch (err) {
    const errorMsg = err.message || err.code || String(err);
    console.error('Error in updateTask:', errorMsg);
    res.status(500).json({ success: false, error: errorMsg });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully', id: parseInt(id, 10) });
  } catch (err) {
    const errorMsg = err.message || err.code || String(err);
    console.error('Error in deleteTask:', errorMsg);
    res.status(500).json({ success: false, error: errorMsg });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
