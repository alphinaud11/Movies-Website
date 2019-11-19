const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views') );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

var sess;


//load info array from a file
let loadInfoArray = function(){
    try {
        let bufferedData = fs.readFileSync('info.json');
        let dataString = bufferedData.toString();
        let infoArray = JSON.parse(dataString);
        return infoArray;
    } catch (error) {
        return [];
    }
   
};


//add new user info to info array
let addNewUser = function(userN, passW){
    //load info array
    let infoArray = loadInfoArray();
    //create user object
    let user = {username: userN, password: passW , movies:[]};
    //push new new user info in array
    infoArray.push(user);
    //save array back in file
    fs.writeFileSync('info.json', JSON.stringify(infoArray));
};


//check if username exists in database
let usernameExist = function(userN){
    //load info array
    let infoArray = loadInfoArray();
    //loop on all users' username and check if username is taken
    for(let i = 0; i < infoArray.length; i++){
        if(infoArray[i].username === userN){
            return true;
        }
    }
    return false;
};


//check if user is registered
let loginValid = function(userN, passW) {
    //load info array
    let infoArray = loadInfoArray();
    //loop on users and check if user is registered
    for(let i = 0; i < infoArray.length; i++){
        if(infoArray[i].username === userN){
            if(infoArray[i].password === passW){
                return true;
            }
            else{
                return false;
            }
        }
    }
    return false;
};

let addMovie = function(userN , movie){
    let infoArray = loadInfoArray();
    for(let i = 0; i < infoArray.length; i++){
        if(infoArray[i].username === userN){
            if(!(infoArray[i].movies.includes(movie))){
                infoArray[i].movies.push(movie);
            }
        }
    }
    fs.writeFileSync('info.json', JSON.stringify(infoArray));
};

let getMovies = function(userN){
    let infoArray = loadInfoArray();
    for(let i = 0; i < infoArray.length; i++){
        if(infoArray[i].username === userN){
            return infoArray[i].movies;
        }
    }
};

let movieExist = function(userN , movie){
    let infoArray = loadInfoArray();
    for(let i = 0; i < infoArray.length; i++){
        if(infoArray[i].username === userN){
            if(infoArray[i].movies.includes(movie)){
                return true;
            }
            else{
                return false;
            }
        }
    }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log('server is running')
});


app.get('/', function(req,res){
    sess = req.session;
    if(sess.username){
        res.redirect('/home');
    }
    else{
        res.render('login',{logMessages:[]})
    }
});

app.get('/registration', function(req,res){
    sess = req.session;
    if(sess.username){
        res.redirect('/home');
    }
    else{
        res.render('registration', {login:[] , regMessages:[]});
    }
});

app.get('/home', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('home',{username:sess.username});
    }    
    else{
        res.redirect('/');
    }
});

app.get('/action', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('action')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/conjuring', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('conjuring')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/darkknight', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('darkknight')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/drama', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('drama')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/fightclub', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('fightclub',{watchlistMessage:[]});
    }    
    else{
        res.redirect('/');
    }
});

app.get('/godfather', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('godfather')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/godfather2', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('godfather2')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/horror', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('horror')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/scream', function(req,res){
    sess = req.session;
    if(sess.username){
        res.render('scream')
    }    
    else{
        res.redirect('/');
    }
});

app.get('/watchlist', function(req,res){
    sess = req.session;
    if(sess.username){
    let moviesArr = getMovies(sess.username);
    res.render('watchlist' , {moviesWatchlist:moviesArr});
    }
    else{
        res.redirect('/');
    }
});


app.post('/', function(req,res){
    if(loginValid(req.body.username, req.body.password)){
        sess = req.session;
        sess.username = req.body.username;
        res.redirect('/home');
    }
    else{
        res.render('login', {logMessages:['Wrong Username or password']});
    }
})

app.post('/register', function(req,res){
    if(usernameExist(req.body.username)){
        res.render('registration', {login:[] , regMessages:['Username already taken']});
    }
    else{
        addNewUser(req.body.username, req.body.password);
        res.render('registration', {login:['Registration completed, go back to login page'] , regMessages:[]});
    }
})
 
app.post('/search', function(req,res){
    let godfather = "The Godfather (1972)";
    let godfather2 = "The Godfather: Part II (1974)";
    let scream = "Scream (1996)";
    let conjuring = "The Conjuring (2013)";
    let fightclub = "Fight Club (1999)";
    let darkknight = "The Dark Knight (2008)";
    let movieArr = [];
    let linkArr = [];
    let input = req.body.Search.toLowerCase();

    if(godfather.toLowerCase().includes(input)){
        movieArr.push(godfather);
        linkArr.push("godfather");
    }
    if(godfather2.toLowerCase().includes(input)){
        movieArr.push(godfather2);
        linkArr.push("godfather2");
    }
    if(scream.toLowerCase().includes(input)){
        movieArr.push(scream);
        linkArr.push("scream");
    }
    if(conjuring.toLowerCase().includes(input)){
        movieArr.push(conjuring);
        linkArr.push("conjuring");
    }
    if(fightclub.toLowerCase().includes(input)){
        movieArr.push(fightclub);
        linkArr.push("fightclub");
    }
    if(darkknight.toLowerCase().includes(input)){
        movieArr.push(darkknight);
        linkArr.push("darkknight");
    }
    if(movieArr.length === 0){
        res.render('searchresults',{ message:"Movie not found" , moviesSearched:movieArr , links:linkArr})
    }
    else{
        res.render('searchresults',{ message:"Search results" , moviesSearched:movieArr , links:linkArr})
    }
})

app.post('/conjuringWatchlist', function(req,res){
    sess = req.session;
    if(sess.username){
        if(!movieExist(sess.username,"The Conjuring (2013)")){
            addMovie(sess.username,"The Conjuring (2013)")
            res.redirect('/watchlist');
        }
        else{
            res.render('watchlistMessage',{moviesWatchlist:['Movie is already in your watchlist']});
        }
    }
})

app.post('/darkknightWatchlist', function(req,res){
    sess = req.session;
    if(sess.username){
        if(!movieExist(sess.username,"The Dark Knight (2008)")){
            addMovie(sess.username,"The Dark Knight (2008)")
            res.redirect('/watchlist');
        }
        else{
            res.render('watchlistMessage',{moviesWatchlist:['Movie is already in your watchlist']});
        }
    }
})

app.post('/fightclubWatchlist', function(req,res){
    sess = req.session;
    if(sess.username){
        if(!movieExist(sess.username,"Fight Club (1999)")){
            addMovie(sess.username,"Fight Club (1999)")
            res.redirect('/watchlist');
        }
        else{
            res.render('watchlistMessage',{moviesWatchlist:['Movie is already in your watchlist']});
        }
    }
})

app.post('/godfatherWatchlist', function(req,res){
    sess = req.session;
    if(sess.username){
        if(!movieExist(sess.username,"The Godfather (1972)")){
            addMovie(sess.username,"The Godfather (1972)")
            res.redirect('/watchlist');
        }
        else{
            res.render('watchlistMessage',{moviesWatchlist:['Movie is already in your watchlist']});
        }
    }
})

app.post('/godfather2Watchlist', function(req,res){
    sess = req.session;
    if(sess.username){
        if(!movieExist(sess.username,"The Godfather: Part II (1974)")){
            addMovie(sess.username,"The Godfather: Part II (1974)")
            res.redirect('/watchlist');
        }
        else{
            res.render('watchlistMessage',{moviesWatchlist:['Movie is already in your watchlist']});
        }
    }
})

app.post('/screamWatchlist', function(req,res){
    sess = req.session;
    if(sess.username){
        if(!movieExist(sess.username,"Scream (1996)")){
            addMovie(sess.username,"Scream (1996)")
            res.redirect('/watchlist');
        }
        else{
            res.render('watchlistMessage',{moviesWatchlist:['Movie is already in your watchlist']});
        }
    }
})

app.post('/signout',function(req,res){
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    })
})
