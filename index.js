

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
    //  je get l'id de l'url params
    const id = parseInt(req.params.id);
    // trouver l'article dans la data
    const item = data.find(article => article.id === id);
    // si l'article est trouvé
    if(item){
        // envoie l'article
        res.json(item).status(200);
    } else {
        //  sinon envoie status 404
        res.json({message: 'Article not found'}).status(404);
    }
});

// create article
app.post('/api/articles', (req, res) => {
    // initialise un nouvel article
    const newArticle = {
        // obtenir l'id  + 1 pour obtenir l'identifiant suivant
        id : data.length + 1,
        // obtenir le title (données envoyées par le client)
        title : req.body.title
    }
    // envoyer le nouvel article dans la data
    data.push(newArticle);
    // envoyer le nouvel article au client
    res.json(newArticle).status(201);
});

// modifier l'article
app.patch('/api/articles/:id', (req, res) => {
    // get the id from the url params
    const id = parseInt(req.params.id);
    //  trouver l'article dans la data
    const item = data.find(article => article.id === id);

    // si l' article est trouvé
    if(item){
        // update the article title
        item.title = req.body.title;
        // send the updated article to the client
        res.json({ data : item, message : "Article has been modified !"}).status(200);
    } else {
        //  sinon envoie status 404
        res.json({message: 'Article not found'}).status(404);
    }
});

// effacer l'article par Id
app.delete('/api/articles/:id', (req, res) => {
    // obtenir l'identifiant des paramètres d'url
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
        //  sinon envoie status 404
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