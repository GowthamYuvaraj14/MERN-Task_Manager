const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//database connection 
mongoose.connect('mongodb://localhost:27017/tasks')
mongoose.connection.on('connected', () =>{
    console.log('MonogoDB Connected')
})

//data model schema
const TaskSchema = new mongoose.Schema({
    text: String,
    complete: Boolean
})
const Task = mongoose.model('Task', TaskSchema); //model for task collection

//health route
app.get('/', (req, res) =>{
    res.send('API is running...');
});

//GET all tasks
app.get('/tasks', async (req,res)=>{
    const tasks = await Task.find();
    res.json(tasks);  //it will send all tasks in json format
});

// ADD a new task in the database
app.post('/tasks', async (req, res) =>{
   try {
    if(!req.body.text || !req.body.text.trim()){
        return res.status(400).send('Task text cannot be empty.')
    }
    const newTask = new Task(req.body); // it makes a new task from request
    await newTask.save();// save it in database
    res.status(201).json(newTask); //responf with saved task
   } catch (error) {
    res.status(500).send('Error creating task');   
   }
})

// Mark a task comlete (PATCH reuest)
app.patch('/tasks/:id', async (req, res) =>{
    try {
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            { complete: req.body.complete}, //use what frontend sends!
            {new: true}
        );
        res.json(updateTask);
    } catch (error) {
        res.status(500).send('Error updating task');        
    }
})
//DELETE a task by OD
app.delete('/tasks/:id', async (req, res)=>{
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting task');        
    }
});

//start the server
app.listen(5000, () =>{
    console.log('Server running on 5000');
});