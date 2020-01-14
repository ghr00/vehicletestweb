var socket = io.connect('http://localhost:8080');

	var catalogueButtons = [];
	var catalogueData;

	var catalogue = 0;

	var timerCatalogue = null;
	var TIME = 1000;

	var row;
	
	showCatalogue();

	socket.on('catalogue', function(data) {

		//document.getElementById('catalogue').innerText = JSON.stringify(data);

		// on reset le catalogue d'abords
		var cat = document.getElementById('catalogue');
		while (cat.firstChild) {
		    cat.removeChild(cat.firstChild);
		}

		catalogueData = data; // on sauvegarde les données avant traitement pour les réutiliser ensuite

		row = document.createElement("section");
		row.className = "row";

		document.getElementById("catalogue").appendChild(row);

		var i;
		var para;
		var node;
		var str;
		var dat;
		var button;
		var image;
		var div;
		
		for(i = 0; i < data.length; i++)
		{
			div = document.createElement("div");
			div.className = "col-lg-4";

			para = document.createElement("p");

			dat = data[i];

			image = document.createElement('img');

			image.src = `vehImages/${dat.name}${dat.modele_name}.jpg`
			image.width = 100;
			image.height = 100;

			if(dat.image == null)
			{
				dat.image = image.src;
			}

			//str = `Nom du véhicule : ${dat.name} ${dat.modele_name}, prix :${dat.prix}DH, image : ${dat.image}`;
			str = `Nom du véhicule : ${dat.name} ${dat.modele_name}, prix :${dat.prix}DH`;

			button = document.createElement("button");
			button.innerHTML = "Acheter";
			button.onclick = function() {
				alert("Un rendez-vous vient d'être créé.");
			}
			
			catalogueButtons.push(button);

			node = document.createTextNode(str);
			
			para.appendChild(node);


			div.appendChild(para);
			div.appendChild(button);
			div.appendChild(image);

			row.appendChild(div);
			//document.getElementById("catalogue").appendChild(para);
			//document.getElementById("catalogue").appendChild(button);
			//document.getElementById("catalogue").appendChild(image);
			document.getElementById("catalogue").appendChild(row);
		}
	});

	socket.on('connexion_state', function(state) {

		if(state == 0)
		{
			document.getElementById('connexionStateText').innerText = "La connexion a échoué, verifez vos données.";
		}

		else
		{
			document.getElementById('connexionStateText').innerText = "Vous êtes connecté autant que {A_FAIRE}.";
		}
	});

	//document.getElementById("catalogue").style.display 				= "none";
	document.getElementById("formulaire_connexion").style.display 	= "none";
	document.getElementById("formulaire_inscription").style.display	= "none";

	function updateCatalogue()
	{
		writeCatalogue();
	}

	function rendez_vous(id)
	{
		alert(`Un rendez-vous avec un employé du concessionnaire vient d'être créé pour acheter cette ${catalogueData[i].name} ${catalogueData[i].modele_name} dont le prix est${catalogueData[i].prix}DH`);
	}

	function setConnexionUIState(state)
	{
		if(state == 1)
		{
			document.getElementById("formulaire_connexion").style.display 	= "block";

			setMainUIState(0);
		}

		else
		{
			document.getElementById("formulaire_connexion").style.display 	= "none";

			setMainUIState(1);
		}
	}


	function showCatalogue()
	{
		if(catalogue == 0)
		{
			writeCatalogue();

			setCatalogueState(1);

			timerCatalogue = window.setInterval(updateCatalogue, TIME);
		}

		else
		{
			setCatalogueState(0);

			clearInterval(timerCatalogue);

			timerCatalogue = null;
		}

	}

	function writeCatalogue()
	{
		socket.emit('request_catalogue');
	}

	function setCatalogueState(state)
	{
		if(state == 1)
		{
		    document.getElementById("catalogue").style.display	 			= "block";
		}

		else
		{
			document.getElementById("catalogue").style.display	 			= "none";
		}

		catalogue = state;
	}

	function setInscriptionUIState(state) {
		if(state == 1)
		{
			setConnexionUIState(0);

		    document.getElementById("formulaire_inscription").style.display 	= "block";

		    setMainUIState(0);
		}

		else
		{
			document.getElementById("formulaire_inscription").style.display 	= "none";

		    setMainUIState(1);
		}

		setCatalogueState(0);
	}

	function setMainUIState(state)
	{
		if(state == 1) // show
		{
			document.getElementById("mainText").style.display 	= "block";   

		    document.getElementById("main_menu").style.display 	= "block";
		}

		else // hide
		{
			document.getElementById("mainText").style.display 	= "none";   

		    document.getElementById("main_menu").style.display 	= "none";
		}

		setCatalogueState(0);
	}

	function Inscription() {

		// on recupere les données entrées par l'utilisateur

		var User 		=  document.getElementById("userInput").value;
		var Email 		=  document.getElementById("emailInput").value;
		var Password 	=  document.getElementById("passwordInput").value;

		var packet = {  
	    	user : User,  
	    	email : Email,
	    	password : Password  
	    };

		//socket.emit('inscription', packet); // on envoie les données au serveur pour faire inscrire l'utilisateur

		socket.emit('inscription', packet);

		setInscriptionUIState(0); // on cache l'ui de l'inscription aprés aprés avoir cliquer sur 'confirmer'
	}

	function Connexion() {

		// on recupere les données entrées par l'utilisateur

		var User 		=  document.getElementById("userInput2").value;
		var Password 	=  document.getElementById("passwordInput2").value;

		var packet = {  
	    	user : User,
	    	password : Password  
	    }; 

		socket.emit('connexion', packet); // on envoie les données au serveur pour verifier si tous est ok

		setConnexionUIState(0); // on cache l'ui de l'inscription aprés aprés avoir cliquer sur 'confirmer'
	}