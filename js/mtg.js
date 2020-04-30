var cardURLs = [];

function createDeck(input) {
	var cardIDs = input.value.split(",");

	if (cardURLs.length != 0) {
		alert("you already have a deck...");
		return;
	}

	for (i = 0; i < cardIDs.length; i++) { 
    		cardURLs.push("https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + cardIDs[i].trim() + "&type=card");
	}
}

function draw() {
	if (cardURLs.length == 0) {
		alert("deck is empty. you either lost or need to input a deck.");
		return;
	}

	var div = document.createElement("div");

	var link = document.createElement("a");
	link.innerHTML = "<img src='" + cardURLs.shift() + "'>";
	link.id = uuid()
	link.href = "javascript:play('" + link.id + "');"

	div.appendChild(link)

	document.getElementById("hand").appendChild(div);
}


function play(id) {
	var n = document.getElementById(id);
	n.href = "javascript:tap('" + n.id + "');"

	var btn = document.createElement("button");
	btn.id = uuid();
	btn.setAttribute("onclick", "javascript:discard('" + n.id + "', '" + btn.id + "');");
	btn.innerText = "Move to graveyard";

	var div = n.parentNode;
	div.appendChild(btn);

	document.getElementById("inPlay").appendChild(div); 
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
	document.getElementById(btn1).remove();
	document.getElementById(btn2).remove();

	var link = document.getElementById(cardID);
	link.href = "javascript:play('" + link.id + "');"
	
	document.getElementById("hand").appendChild(link.parentNod);
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