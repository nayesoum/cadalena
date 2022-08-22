

const express = require('express');

const axios = require('axios')

const cors = require('cors')

const port = 8002;

const app = express();

// const data = require('./data.json');

app.use(cors('*'));

app.use(express.urlencoded({
    extended: true,
}));


app.get('/', (req, res) => {
    res.send('hello world').status(200);
});

// read all || get all
app.get('/api/articles', (req, res) => {
    res.json(data).status(200);
});

// read one || get one by Id
// :id is a placeholder for the id of the article
app.get('/api/articles/:id', (req, res) => {
    // get the id from the url params
    const id = parseInt(req.params.id);
    // find the article in the data array
    const item = data.find(article => article.id === id);
    // if the article is found
    if(item){
        // send the article
        res.json(item).status(200);
    } else {
        // else send a 404 error
        res.json({message: 'Article not found'}).status(404);
    }
});

// create article
app.post('/api/articles', (req, res) => {
    // initialize a new article
    const newArticle = {
        // get the id from the data array + 1 to get the next id
        id : data.length + 1,
        // get the title from the body request (data send by the client)
        title : req.body.title
    }
    // push the new article to the data array
    data.push(newArticle);
    // send the new article to the client
    res.json(newArticle).status(201);
});

// update / edit article title
app.patch('/api/articles/:id', (req, res) => {
    // get the id from the url params
    const id = parseInt(req.params.id);
    // find the article in the data array
    const item = data.find(article => article.id === id);

    // if the article is found
    if(item){
        // update the article title
        item.title = req.body.title;
        // send the updated article to the client
        res.json({ data : item, message : "Article has been modified !"}).status(200);
    } else {
        // else send a 404 error
        res.json({message: 'Article not found'}).status(404);
    }
});

// delete article by Id
app.delete('/api/articles/:id', (req, res) => {
    // get the id from the url params
    const id = parseInt(req.params.id);
    // find the article in the data array
    const item = data.find(article => article.id === id);

    // if the article is found
    if(item){
        // remove the article from the data array
        data.splice(data.indexOf(item), 1);
        // send a message to the client
        res.json({ message : "Article have been deleted !"}).status(200);
    } else {
        // else send a 404 error
        res.json({message: 'Article not found'}).status(404);
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/trending/movie/week?api_key=810d20cd28033dcbd7415fa0fa42c3de');
        res.send(response.data).status(200);
    } catch (error) {
        console.log(error)
    }
});

app.get('/api/posts/:id', async (req, res) => {
    const id = req.params.id
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/'+ id + '?api_key=810d20cd28033dcbd7415fa0fa42c3de');
        res.send(response.data).status(200);

    } catch (error) {
        console.log(error)
    }

});

// log server start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});