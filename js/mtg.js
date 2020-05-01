var cardURLs = [];

function buildURL(id) {
	return "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + id + "&type=card"
}

const actions = {
	GRAVEYARD: 0,
	HAND: 1,
	PLAY: 2,
}

const classes = {
	CARD: '.card',
	COUNTERS: '.counters',
	ART: '.art',
	ACTIONS: '.actions',
}

var HAND;
var PLAY;
var GRAVEYARD;

window.addEventListener('load', function () {
	HAND = document.getElementById("hand");
	PLAY = document.getElementById("play");
	GRAVEYARD = document.getElementById("graveyard");
})

// draw creates the cononical card object, and adds it to the #hand.
function draw() {
	if (cardURLs.length == 0) {
		alert("deck is empty. you either lost or need to input a deck.");
		return;
	}

	var id = cardURLs.shift();

	var card = document.createElement("div");
	card.classList.add("card");
	card.setAttribute("data-id", id);
	card.id = uuid();

	var counters = document.createElement("div");
	counters.classList.add("counters");
	card.appendChild(counters);

	var art = document.createElement("div");
	art.classList.add("art");
	art.innerHTML = "<img src='" + buildURL(id) + "'>";
	art.setAttribute("onclick", buildArtAction(card.id, actions.HAND))
	card.appendChild(art);

	card.appendChild(buildActionButtons(card.id, actions.HAND));
	
	appendToLocation(card, HAND);
}

function appendToLocation(obj, loc) {
	var set = loc.querySelectorAll("[data-id='" + obj.getAttribute("data-id") + "']");
	// if this card is already there, put this one next to it to make the board more sane.
	if (set.length > 0) {
		set[set.length-1].parentNode.insertBefore(obj, set[set.length-1].nextSibling);
	} else {
		loc.appendChild(obj); 
	}
}

function buildActionButtons(id, action) {
	var buttons = document.createElement("div");
	buttons.classList.add("actions");

	var btn = document.createElement("button");
	var btn2 = document.createElement("button");
	var btn3 = document.createElement("button");

	switch (action) {
		case actions.GRAVEYARD:
			btn.innerText = "Move to hand";
			btn.setAttribute("onclick", "javascript:cardAction('" + id + "', " + actions.HAND + ", '" + HAND.id + "');");
			btn2.innerText = "Move to play";
			btn2.setAttribute("onclick", "javascript:cardAction('" + id + "', " + actions.PLAY + ", '" + PLAY.id + "');");

			buttons.appendChild(btn);
			buttons.appendChild(btn2);
			break;
		case actions.PLAY:
			btn.innerText = "Move to hand";
			btn.setAttribute("onclick", "javascript:cardAction('" + id + "', " + actions.HAND + ", '" + HAND.id + "');");
			btn2.innerText = "Move to graveyard";
			btn2.setAttribute("onclick", "javascript:cardAction('" + id + "', " + actions.GRAVEYARD + ", '" + GRAVEYARD.id + "');");

			buttons.appendChild(btn);
			buttons.appendChild(btn2);
			break;
		case actions.HAND:
			btn.innerText = "Move to graveyard";
			btn.setAttribute("onclick", "javascript:cardAction('" + id + "', " + actions.GRAVEYARD + ", '" + GRAVEYARD.id + "');");

			buttons.appendChild(btn);
			break;
	}

	btn3.innerText = "Exile";
	btn3.setAttribute("onclick", "javascript:exile('" + id + "');");
	buttons.appendChild(btn3);

	return buttons
}

function buildArtAction(id, action) {
	switch (action) {
		case actions.GRAVEYARD:
			return "javascript:void(0);"
		case actions.HAND:
			return "javascript:cardAction('" + id + "', " + actions.PLAY + ", '" + PLAY.id + "')";
		case actions.PLAY:
			return "javascript:tap('" + id + "')";
	}
}

function exile(id) {
	document.getElementById(id).remove();
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

function cardAction(id, action, targetId) {
	var card = document.getElementById(id);

	if (tapped(id)) {
		tap(id)
	}

	card.querySelector(classes.ART).setAttribute("onclick", buildArtAction(id, action));
	card.querySelector(classes.ACTIONS).remove(); 
	card.appendChild(buildActionButtons(id, action));

	appendToLocation(card, document.getElementById(targetId));
}

// tap will alter a card between tapped and untapped state.
function tap(id) {
	var art = document.getElementById(id).querySelector(classes.ART);

	if (art.classList.contains("tapped")) {
		art.classList.remove("tapped");
	} else {
		art.classList.add("tapped");
	}
}

function tapped(id) {
	return document.getElementById(id).querySelector(classes.ART).classList.contains("tapped");
}

function untapAll() {
	document.querySelectorAll('.tapped').forEach(val => {
		val.classList.remove("tapped");
	});
}

// uuid provides a Universally Unique Identifier to use as an ID for each card.
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
