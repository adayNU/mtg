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

	var link = document.createElement("a");
	link.innerHTML = "<img src='" + cardURLs.shift() + "'>";
	link.id = uuid()
	link.href = "javascript:move('" + link.id + "');"

	document.getElementById("hand").appendChild(link);
}

function move(id) {
	var n = document.getElementById(id);
	n.id = id;
	n.href = "javascript:tap('" + n.id + "');"

	document.getElementById("inPlay").appendChild(n); 
}

function tap(id) {
	var n = document.getElementById(id).children[0];

	if (n.classList.contains("tapped")) {
		n.classList.remove("tapped");
	} else {
		n.classList.add("tapped");
	}
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}