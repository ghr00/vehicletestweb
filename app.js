var express 	= 	require('express');
var app 		= 	express();
var server 		= 	require('http').Server(app);
var io 			= 	require('socket.io')(server);
var mysql 		= 	require('mysql');
var session 	= 	require('express-session');
var cookieParser= 	require('cookie-parser');
var bodyParser 	= 	require('body-parser');

/*************** CONFIGURATION **************/
server.listen(8080);
// WARNING: app.listen(80) will NOT work here!
app.use(express.static('public'));
app.use(session({
    key: 'user_sid',
    secret: 'vehicle_server_prototype',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

/********************************************/

/**************** MYSQL ****************/
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("[MySQL] Connected!");

  con.query("use vehiclesdb", function (err, result) {
    if (err) throw err;
    //console.log(result);
  });
});
/*************************************/

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(client) 
{
    console.log('Client connected...');

    client.on('request_catalogue', function() {

    	var sql = `SELECT Marque.name, Modele.modele_name, Vehicule.prix, Vehicule.image FROM Marque, Modele, Vehicule WHERE Vehicule.modele_id=Modele.modele_id AND Modele.id=Marque.id;`;

	   	con.query(sql, function (err, result, fields) {
			if (err) throw err;

			//console.log("[Serveur] Envoie du catalogue...");

			client.emit('catalogue', result);
		});
	});

    client.on('inscription', function(socket) {
	   	console.log("[Serveur] Reception d'une demande d'inscription...");

		console.log(socket);

		var user 		= socket.user;
		var email 		= socket.email;
		var password 	= socket.password;

		var sql = `INSERT INTO utilisateur (nom, email, mdp) VALUES ( '${user}', '${email}', '${password}' );`;

		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    console.log("[inscription]");
		    console.log(sql);
		  });
	});

	client.on('connexion', function(socket) {
	   	console.log("[Serveur] Reception d'un paquet de connexion...");

		console.log(socket);

		var user 		= socket.user;
		var password 	= socket.password;

		//var sql = `SELECT EXISTS( SELECT * FROM utilisateur WHERE utilisateur.nom LIKE '${user}' AND utilisateur.mdp LIKE '${password}' );`;
		var sql = `SELECT COUNT(*) AS total FROM utilisateur WHERE utilisateur.nom LIKE '${user}' AND utilisateur.mdp LIKE '${password}'`;

		  con.query(sql, function (err, result) {
		    if (err) throw err;

		    if(result[0].total == 1)
		    {
		    	console.log("[connexion] reussie, OK!");

		    	client.emit('connexion_state', 1);
		    } 	
			else
			{
				console.log("[connexion] echouee, NON!");

				client.emit('connexion_state', 0);
			}

		    console.log(result);
		  });
	});
}

);

/*var express 	= 	require('express');
var server 		= 	require('http').Server(app);
var app 		= 	express();
var mysql 		= 	require('mysql');
var io 			= 	require('socket.io')(server);
const session 	= 	require('express-session');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test"
});

server.listen(8080);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

app.use(session({secret: 'ssshhhhh'}));

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("use vehiclesdb", function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  con.query("SELECT * FROM Vehicule", function (err, result, fields) {
	    if (err) throw err;
	    console.log(result);

	    console.log(result[6].prix);
	});
});



var sess;

app.get('/', function(req, res) {
	 sess=req.session;

    sess.email; // equivalent to $_SESSION['email'] in PHP.
    sess.username; // equivalent to $_SESSION['username'] in PHP.

	res.sendFile('index.html', { root: __dirname });
});


app.get('/catalogue', function(req, res) {
	//res.sendFile('index.html', { root: __dirname });

	
});

// ... Tout le code de gestion des routes (app.get) se trouve au-dessus

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

*/