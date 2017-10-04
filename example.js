const express = require('express')
const app = express()

app.get('/', function(req, res) {
    res.render('home.ejs');
})

app.get('/item/:name', function(req, res) {
    var items = {
        book: 'a book',
        table: 'a table',
        door: 'a door'
    };
    var item = req.params.name;

    //checkin json objects. temporary until a better solution is found.
    if (items[item] == undefined) {
        tag = 'no matchings found';
    } else {
        var tag = items[item];
    }
    
    //passing item as tag for home.ejs
    res.render("home.ejs", { tag: item })
    res.send(tag);
});

app.get('/:word/:loop', function(req, res) {
    var word = req.params.word;
    var loop = parseInt(req.params.loop);
    var ouput = "";
    for (var i = 0; i < loop; i++) {
        output = word + " ";
    };
    res.send(output);
});

app.get('*', function(req, res) {
    res.send('the page you are looking for is not found.');
})

app.listen(8000, function() {
    console.log('App has started');
});