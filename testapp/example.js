const express = require('express')
const app = express()

app.get('/', function(req, res) {
    res.render('home.ejs');
})

app.get('/animal/:name', function(req, res) {
    var animals = {
        dog: 'Bruno',
        cat: 'Elen',
    };
    var name = req.params.name;
    var tag = "";

    console.log(name);
    console.log(animals);

    //checking json objects. temporary until a better solution is found.
    if (animals[name] == undefined) {
        name = 'no matchings found';
    } else {
        name = animals[name];
    }
    console.log(name);
    console.log(animals[name]);
    //passing name from the route as name for animal.ejs
    res.render("animal.ejs", {
        name: name
    })
});

app.get('/:word/:loop', function(req, res) {
    var word = req.params.word;
    var loop = parseInt(req.params.loop);
    var output = "";
    for (var i = 0; i < loop; i++) {
        output += word + " ";
    };
    res.send(output);
});

app.get('*', function(req, res) {
    res.send('the page you are looking for is not found.');
})

app.listen(8000, function() {
    console.log('App has started');
});