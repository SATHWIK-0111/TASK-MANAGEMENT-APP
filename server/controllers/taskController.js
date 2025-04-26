const Task = require('../models/task');
const asyncHandler = require('../middleware/async');

exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to update this task'
    });
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to delete this task'
    });
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});