const { sql, getPool } = require('../config/db');

// @desc    Get all tasks
// @route   GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id, title, description, status, priority, created_at 
      FROM tasks 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (err) {
    console.error('Error in getAllTasks:', err.message);
    res.status(500).json({ success: false, error: err.message });
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
    const pool = await getPool();
    const result = await pool.request()
      .input('title', sql.NVarChar(255), title.trim())
      .input('description', sql.NVarChar(sql.MAX), description.trim())
      .input('priority', sql.NVarChar(50), priority)
      .input('status', sql.NVarChar(50), status)
      .query(`
        INSERT INTO tasks (title, description, priority, status)
        OUTPUT inserted.id, inserted.title, inserted.description, inserted.status, inserted.priority, inserted.created_at
        VALUES (@title, @description, @priority, @status);
      `);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: result.recordset[0],
    });
  } catch (err) {
    console.error('Error in createTask:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  try {
    const pool = await getPool();

    // Check if task exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tasks WHERE id = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const current = checkResult.recordset[0];
    const updatedTitle = title !== undefined ? title : current.title;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedStatus = status !== undefined ? status : current.status;
    const updatedPriority = priority !== undefined ? priority : current.priority;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar(255), updatedTitle)
      .input('description', sql.NVarChar(sql.MAX), updatedDesc)
      .input('status', sql.NVarChar(50), updatedStatus)
      .input('priority', sql.NVarChar(50), updatedPriority)
      .query(`
        UPDATE tasks 
        SET title = @title, description = @description, status = @status, priority = @priority
        OUTPUT inserted.id, inserted.title, inserted.description, inserted.status, inserted.priority, inserted.created_at
        WHERE id = @id;
      `);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: result.recordset[0],
    });
  } catch (err) {
    console.error('Error in updateTask:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM tasks WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully', id: parseInt(id, 10) });
  } catch (err) {
    console.error('Error in deleteTask:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
