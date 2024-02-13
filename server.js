//jshint esversion:6
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

url = process.env.MONGODB_CONNECT_URL;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true} )
	.then(() => console.log("Connected to MongoDB"))
	.catch(console.error);

const TodoSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	complete: {
		type: Boolean,
		default: false
	},
	timestamp: {
		type: String,
		default: Date.now()
	}
});

const Todo = mongoose.model("Todo", TodoSchema);

app.get('/todo', async (req, res) => {
	const todos = await Todo.find();
	res.json(todos);
});

app.post('/todo/new', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	})
	todo.save();
	res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);
	res.json({result});
});

app.get('/todo/complete/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
})

app.put('/todo/update/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
});

app.listen(3001, function () {
	port = process.env.PORT
	console.log("Server started on port "+port);
});