// Here tasks are handled
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();

const Task = require('../models/task')
const auth = require('../middlewares/authMiddleware')
// Fetch all tasks

router.get('/api/fetchtasks',auth, async (req, res) => {
    try {
        const tasks = await Task.find({userId:req.user.userId});
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Add a new task
router.post('/api/addtasks',auth,async (req, res) => {
    const { title,description,deadline } = req.body;
    console.log(req.user.userId);
    try {
        const newTask = new Task({ title:title,description:description,deadline:deadline,userId :req.user.userId});
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding task' });
    }
});

// Update an existing task
router.put('/api/updatetasks/:id',auth, async (req, res) => {
    const { id } = req.params;
    const { title, deadline } = req.body;
    console.log(id,title,deadline);
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, deadline },
            { new: true } 
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Delete a task
router.delete('/api/deletetasks/:id',auth, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports=router;