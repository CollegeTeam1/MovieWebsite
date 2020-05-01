const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const alert = require('alert-node')
var session = require('express-session')
var port = process.env.PORT || 3000; 




app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret: 'secretid', resave: true,
saveUninitialized: true}));


//load users from a file
let loadUsers = function(){
    try {
        let bufferedData = fs.readFileSync('users.json')
        let dataString = bufferedData.toString()
        let usersDict = JSON.parse(dataString)
        return usersDict
    } 
    catch (error) {
        return [];
    }
   
}

//add user to the JSON file
let addUser = function(username, password){
   // console.log("add user method")
    
    let users = loadUsers()

    if (checkUser(username)){
       
    }

    else{
        users.push({
            "key1": username ,  "key2": password , "watchlist": []
        });
        console.log(users)
        fs.writeFileSync('users.json', JSON.stringify(users))
    }

    
}

//check if the user is already registered
let checkUser = function(username){
    //true if the user is ALREADY registered
    let users = loadUsers()
    
    for(var i in users){
        
        if(username == users[i].key1){
            return true
        }  
    }
    return false

}

//check that the password is correct
let checkPassword = function(username, password){
    //true if the user is ALREADY registered
    let users = loadUsers()
    
    for(var i in users){
        
        if(username == users[i].key1 && password == users[i].key2 ){
            return true
        }  
    }
    return false

}

//get wishlist movies of a specific user
let loadMovies = function(username){
    try {
        let bufferedData = fs.readFileSync('users.json')
        let dataString = bufferedData.toString()
        let users = JSON.parse(dataString)
        let wl = []
        for(var i in users){
        
            if(users[i].key1 == username){
                wl = users[i].watchlist
            }  
        }
        
        return wl
    } 
    catch (error) {
        return [];
    }
   
}

//check if the movie is already in the user's wishlist
let checkMovie = function(movie,username){
    //true if the movie is ALREADY in watchlist
    let movies = loadMovies(username)
    
    for(var i in movies){
        
        if(movie == movies[i]){
            return true
        }  
    }
    return false

}


let addtowatchlist = function(movie,username){
    // console.log("add user method")
     let users = loadUsers()

    console.log("add to wl method")
        
        for(var i in users){

            if(username == users[i].key1 ){
                console.log(username + " 's " + users[i].watchlist)
                users[i].watchlist.push(movie)
                break
            }  
        }


        fs.writeFileSync('users.json', JSON.stringify(users))
     
 
     
 }


// GET REQUESTS //////////////////////////////////
app.get('/', function(req,res){
    var msg = "  "
    res.render("login", {
            alert : msg})
}
)

app.get('/registration', function(req,res){
    var msg = "  "
    res.render("registration", {
            alert : msg})
}
)

app.get('/watchlist', function(req,res){
    
    res.render('watchlist',{
    watchlist : loadMovies(req.session.username)})
}
)

app.get('/horror', function(req,res){
    res.render('horror')
}
)

app.get('/action', function(req,res){
    res.render('action')
}
)

app.get('/conjuring', function(req,res){
    var msg = ["  "]
    res.render("conjuring", {
            alert : msg
        })
    }
)
app.get('/darkknight', function(req,res){
    var msg = ["  "]
    res.render("darkknight", {
            alert : msg
        })
    }
)

app.get('/drama', function(req,res){
    res.render('drama')
}
)

app.get('/fightclub', function(req,res){
    var msg = ["  "]
    res.render("fightclub", {
            alert : msg
        })
    }
)

app.get('/godfather', function(req,res){
    var msg = ["  "]
    res.render("godfather", {
            alert : msg
        })
    }
)

app.get('/godfather2', function(req,res){
    var msg = ["  "]
    res.render("godfather2", {
            alert : msg
        })
    }
)

app.get('/scream', function(req,res){
    var msg = ["  "]
    res.render("scream", {
            alert : msg
        })
    }
)
///////////////////////////////////////////////




// POST REQUESTS //////////////////////////////////
app.post('/register', function(req,res){
    console.log("OP checkuser method" ,checkUser())

    if(checkUser(req.body.username)==false){
        //SUCCESS MESSAGE
        //res.send("Registration Successful")
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        addUser(req.body.username, req.body.password)

        res.render("home")
    }
    else{
        var msg = "This username already exists, please try a different one"
        res.render("registration", {
            alert : msg
        })
        //res.send("This username already exists, please try again with a different username")

        //ERROR MESSAGE
    }

    
})

//add to watchlist
app.post('/addtowl', function(req,res){
    console.log(req.body.bname)
   
 
    if(checkMovie(req.body.bname,req.session.username) ){
        console.log("already there")
        let movie = (req.body.bname).replace(/\s+/g, '').toLowerCase();
        var msg = "This movie is already in the watchlist"
        
        res.render(movie, {
            alert : msg})
             
            
            //alert("This movie is already in the watchlist")
    }
    else{
    addtowatchlist(req.body.bname,req.session.username)}
    //res.redirect('back');
    
})

//SEARCH functionality
app.post('/search', function(req,res){
   var arr = ["conjuring", "darkknight","fightclub", "godfather","godfather2", "scream" ]
    var result = []
    console.log("result contains" + result)

var x = []
console.log("x array")
console.log(x)

var s = (req.body.Search).replace(/\s+/g, '').toLowerCase();

   for(var i in arr){
    console.log(s)    
    if (arr[i].includes(s) && s != ""){
        console.log("gowa if")  
        result.push(arr[i])
        console.log(result)
    }  
    }

    if (result.length == 0){
        res.render("noresults", {
            searchkey : req.body.Search})     }
    else{
    console.log("inside else")
    console.log("result nafsaha")
    console.log(result)
    res.render('searchresults',{
        results : result}) 
    
    }
    result = []
    console.log(result + "end of method")
    
} )
   

//LOGIN 
app.post('/', function(req,res){
    //console.log("in post method")

    if(checkUser(req.body.username) && checkPassword(req.body.username, req.body.password)==true){
        //req.session = req.body.username
        //console.log("session in login"+ req.session)
        req.session.username = req.body.username;
        req.session.password = req.body.password;


        console.log("the user")
        console.log(req.session.username)

        res.render("home")
    }
    else{
        
        //res.send("incorrect username or password")
        var msg = "incorrect username or password"
        res.render("login", {
            alert : msg}) 

        //ERROR MESSAGE
    }

    //addUser(req.body.username, req.body.password)
    
})
///////////////////////////////////////////////////




app.listen(port, ()=>{
    console.log('server is running')
})

