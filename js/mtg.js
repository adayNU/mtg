var cardURLs = [];

function buildURL(id) {
	return "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + id + "&type=card"
}

// Not sure how legit this is, just stole it off the internet.
// https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
function shuffle (array) {
	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};

function createDeck(input) {
	var cardIDs = input.value.split(",");

	if (cardURLs.length != 0) {
		alert("you already have a deck...");
		return;
	}

	for (i = 0; i < cardIDs.length; i++) { 
    		cardURLs.push(cardIDs[i].trim());
	}

	cardURLs = shuffle(cardURLs)
}

function draw() {
	if (cardURLs.length == 0) {
		alert("deck is empty. you either lost or need to input a deck.");
		return;
	}

	var id = cardURLs.shift()

	var div = document.createElement("div");
	div.classList.add("card");
	div.setAttribute("data-id", id);

	var link = document.createElement("a");
	link.innerHTML = "<img src='" + buildURL(id) + "'>";
	link.id = uuid()
	link.href = "javascript:play('" + link.id + "');"

	div.appendChild(link);

	var btn = document.createElement("button");
	btn.id = uuid();
	btn.setAttribute("onclick", "javascript:discard('" + link.id + "', '" + btn.id + "');");
	btn.innerText = "Move to graveyard";
	div.appendChild(btn);

	var inHand = document.getElementById("hand").querySelectorAll("[data-id='" + div.getAttribute("data-id") + "']");
	// if this card is already in hand, put this one next to it to make the board more sane.
	if (inHand.length > 0) {
		insertAfter(div, inHand[inHand.length-1]);
	} else {
		document.getElementById("hand").appendChild(div); 
	}
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function play(id) {
	var n = document.getElementById(id);
	n.href = "javascript:tap('" + n.id + "');"

	var div = n.parentNode;

	var inPlay = document.getElementById("inPlay").querySelectorAll("[data-id='" + div.getAttribute("data-id") + "']");
	// if this card is already in play, put this one next to it to make the board more sane.
	if (inPlay.length > 0) {
		insertAfter(div, inPlay[inPlay.length-1]);
	} else {
		document.getElementById("inPlay").appendChild(div); 
	}
}

// tap will alter a card between tapped and untapped state.
function tap(id) {
	var n = document.getElementById(id).children[0];

	if (n.classList.contains("tapped")) {
		n.classList.remove("tapped");
	} else {
		n.classList.add("tapped");
	}
}

function tapped(id) {
	return document.getElementById(id).children[0].classList.contains("tapped");
}

function resurectToHand(btn1, btn2, cardID) {
	var n = document.getElementById(cardID);
	
	document.getElementById(btn1).remove();
	
	var btn = document.getElementById(btn2);
	btn.id = btn2;
	btn.setAttribute("onclick", "javascript:discard('" + n.id + "', '" + btn.id + "');");
	btn.innerText = "Move to graveyard";

	var link = document.getElementById(cardID);
	link.href = "javascript:play('" + link.id + "');"
	
	document.getElementById("hand").appendChild(link.parentNode);
}

function resurectToPlay(btn1, btn2, cardID) {
	var n = document.getElementById(cardID);

	document.getElementById(btn1).remove();

	var btn = document.getElementById(btn2);
	btn.id = btn2;
	btn.setAttribute("onclick", "javascript:discard('" + n.id + "', '" + btn.id + "');");
	btn.innerText = "Move to graveyard";

	var link = document.getElementById(cardID);
	link.href = "javascript:tap('" + n.id + "');"

	document.getElementById("inPlay").appendChild(link.parentNode);

}

// discard ...
function discard(cardID, buttonId) {
	var n = document.getElementById(cardID);

	if (tapped(cardID)) {
		tap(cardID)
	}

	var btn = document.getElementById(buttonId);
	var btn2 = document.createElement("button");
	btn2.id = uuid();
	btn2.innerText = "Move to play";
	btn2.setAttribute("onclick", "javascript:resurectToPlay('" + btn.id + "', '" + btn2.id + "', '" + n.id + "');");
	btn.innerText = "Move to hand";
	btn.setAttribute("onclick", "javascript:resurectToHand('" + btn.id + "', '" + btn2.id + "', '" + n.id + "');");

	n.parentNode.appendChild(btn2);
	
	document.getElementById("graveyard").appendChild(n.parentNode);
}

// uuid provides a Universally Unique Identifier to use as an ID for each card.
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
