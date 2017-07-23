let searchString
let searchResults

let nextGridListItem
let nextGridContentDiv

let cardHeadingDiv
let musicIcon
let trackNameSpan

let nextCardDiv
let thumbnailDiv
let nextTrackThumbnail
let thumbnailLink
let nextTrackDetailsDiv
let nextTrackDetailDiv
let trackDetail

let cardFooterDiv
let leftFooterPlaceHolder
let leftFooterSpan
let playIcon
let nextFooterPrice
let rightFooterSpan

let musicPlayer = document.querySelector("#audioPlayer")
let stoppedButtons = []
let querySelectorString

let allCards = []
let flipGenerator
let cardInterval


function playAudio(previewUrl, trackId) {
    let querySelectorString = "#button" + trackId.toString()
    let buttonIcon = document.querySelector(querySelectorString)

    let buttonIsStopped = stoppedButtons.indexOf(trackId.toString())
    if(buttonIsStopped === -1) {
      musicPlayer.pause()
      musicPlayer.currentTime = 0

      if(stoppedButtons.length > 0) {resetButtons()}

      musicPlayer.src = previewUrl
      musicPlayer.load()
      musicPlayer.play()
      musicPlayer.setAttribute("data-trackId", trackId.toString());

      buttonIcon.classList.remove("fa-play-circle-o")
      buttonIcon.classList.add("fa-stop-circle-o")

      stoppedButtons.push(trackId.toString())

    } else if(buttonIsStopped > -1){
      buttonIcon.classList.remove("fa-stop-circle-o")
      buttonIcon.classList.add("fa-play-circle-o")

      stoppedButtons.splice(buttonIsStopped, 1)

      musicPlayer.pause();
      musicPlayer.currentTime = 0

    } else {

    }

}


function resetButton(trackId) {
  let querySelectorString = "#button" + trackId.toString()
  let buttonIcon = document.querySelector(querySelectorString)

  buttonIcon.classList.remove("fa-stop-circle-o")
  buttonIcon.classList.add("fa-play-circle-o")

}

function resetButtons() {
  for(counter = 0; counter < stoppedButtons.length; counter++) {
    resetButton(stoppedButtons[counter])

  }
  stoppedButtons = []

}

function addMarquee(trackNameSpanId) {
  console.log(trackNameSpanId)

  trackNameSpanId.classList.remove("cut-text")
  trackNameSpanId.classList.add("marquee-text")

}

function removeMarquee(trackNameSpanId) {
  console.log(trackNameSpanId)

  trackNameSpanId.classList.remove("marquee-text")
  trackNameSpanId.classList.add("cut-text")

}

function* flipCard() {
  allCards = document.querySelectorAll("li > div")
  console.log("inside generator")
  for(counter = 0;counter < allCards.length;counter++) {
    allCards[counter].style.transform = "rotateY(0deg)"
    console.log(counter)
    console.log("before yeild")
    yield

  }
  clearInterval(cardInterval)

}


function makeRequest(event) {
  if(event) {
    event.preventDefault()

  }
  console.log("function starts")
  document.querySelector("#gridList").innerHTML = ""
  searchString = document.querySelector("#searchBox").value
  searchString = searchString.replace(" ", "+")
  searchString = "https://itunes.apple.com/search?media=music&limit=200&term=" + searchString

  displayLoading()
  fetch(searchString).then(
    function(response) {
      response.json().then((data) => {
        searchResults = data['results']
        displayResults(searchResults)

      })

    },
    function(error) {
      console.log(error)

    }

  ); // fetch

} // make request


function displayLoading() {
  let loadingIcon = document.createElement("i")
  loadingIcon.classList.add("fa")
  loadingIcon.classList.add("fa-spinner")
  loadingIcon.classList.add("fa-pulse")
  loadingIcon.classList.add("fa-5x")
  loadingIcon.classList.add("fa-fw")
  loadingIcon.style.color = "DodgerBlue"
  loadingIcon.width = "200px"
  document.querySelector("#searchResults").appendChild(loadingIcon)

}


function displayResults(searchResults) {
  // removes loading icon
  let display = document.querySelector("#searchResults")
  display.removeChild(display.lastChild)

  console.log(searchResults)
  Object.keys(searchResults).forEach((key) => {
    console.log(searchResults[key].trackName)

    // list item padding is used for space between cards
    nextGridListItem = document.createElement("li");

    // this is the border of the card and contains
    // the header, thumbnailDiv, details Div, and footer
    nextGridContentDiv = document.createElement("div");

    console.log(searchResults[key].trackName.length)
    // if title length is long add marquee mouseover
    if(searchResults[key].trackName.length > 21) {
      console.log("adding mouseover")
      nextGridContentDiv.setAttribute( "onmouseover", ("addMarquee(track" + searchResults[key].trackId.toString() + ")") )
      nextGridContentDiv.setAttribute( "onmouseout", ("removeMarquee(track" + searchResults[key].trackId.toString() + ")") )
    }

    // heading for the card
    cardHeadingDiv = document.createElement("div")
    cardHeadingDiv.classList.add("cardHeadingDiv")

    musicIcon = document.createElement("i")
    musicIcon.classList.add("fa")
    musicIcon.classList.add("fa-music")
    musicIcon.classList.add("musicIcon")

    // track name is inside a span to cut-text
    // and for marquee
    trackNameSpan = document.createElement("span")
    trackNameSpan.id = "track" + searchResults[key].trackId.toString()
    trackNameSpan.classList.add("cut-text")
    trackNameSpan.appendChild(musicIcon)
    trackNameSpan.appendChild(document.createTextNode( searchResults[key].trackName) )

    cardHeadingDiv.appendChild(trackNameSpan)
    nextGridContentDiv.appendChild(cardHeadingDiv)

    // contains thumbnailDiv and details div
    // main card area
    nextCardDiv = document.createElement("div");
    nextCardDiv.classList.add("cardDiv")

    //track artwork
    if(searchResults[key].artworkUrl100) {
      thumbnailDiv = document.createElement("div")
      thumbnailDiv.classList.add("thumbnailDiv")

      nextTrackThumbnail = document.createElement("img");
      nextTrackThumbnail.classList.add("itemThumbnail")
      nextTrackThumbnail.src = searchResults[key].artworkUrl100

      thumbnailLink = document.createElement("a")
      thumbnailLink.href = searchResults[key].trackViewUrl
      thumbnailLink.appendChild(nextTrackThumbnail)

      thumbnailDiv.appendChild(thumbnailLink)
      nextCardDiv.appendChild(thumbnailDiv)

    } else {
      thumbnailDiv = document.createElement("div")
      thumbnailDiv.classList.add("thumbnailDiv")

      nextTrackThumbnail = document.createElement("div");
      nextTrackThumbnail.style.backgroundColor = "#CCCCCC";
      nextTrackThumbnail.style.width = "107px";
      nextTrackThumbnail.style.height = "80px";
      thumbnailDiv.appendChild(nextTrackThumbnail)
      nextCardDiv.appendChild(thumbnailDiv)
    }

    // contains artistName and collectionName
    nextTrackDetailsDiv = document.createElement("div");

    // artist name
    nextTrackDetailDiv = document.createElement("div")
    nextTrackDetailDiv.classList.add("trackDetailDiv")

    trackDetail = document.createElement("span")
    trackDetail.appendChild(document.createTextNode("Artist:"))
    trackDetail.classList.add("trackDetailSpan")
    trackDetail.classList.add("detailLabel")
    nextTrackDetailDiv.appendChild(trackDetail)

    trackDetail = document.createElement("span")
    trackDetail.appendChild(document.createTextNode(searchResults[key].artistName))
    trackDetail.classList.add("trackDetailSpan")
    nextTrackDetailDiv.appendChild(trackDetail)
    nextTrackDetailsDiv.appendChild(nextTrackDetailDiv)

    // collection name
    nextTrackDetailDiv = document.createElement("div")
    nextTrackDetailDiv.classList.add("trackDetailDiv")

    trackDetail = document.createElement("span")
    trackDetail.appendChild(document.createTextNode("Collection:"))
    trackDetail.classList.add("trackDetailSpan")
    trackDetail.classList.add("detailLabel")
    nextTrackDetailDiv.appendChild(trackDetail)

    trackDetail = document.createElement("span")
    trackDetail.appendChild(document.createTextNode(searchResults[key].collectionName))
    trackDetail.classList.add("trackDetailSpan")
    nextTrackDetailDiv.appendChild(trackDetail)
    nextTrackDetailsDiv.appendChild(nextTrackDetailDiv)

    nextTrackDetailsDiv.classList.add("trackDetailsDiv")
    nextCardDiv.appendChild(nextTrackDetailsDiv)

    // card footer
    cardFooterDiv = document.createElement("div")
    cardFooterDiv.classList.add("cardFooterDiv")

    // play icon is positioned absolutely, this
    // span is in the position that play icon would be in
    // with a static position, it keeps the price centered
    // since the footer is a flexbox with space-between
    leftFooterPlaceHolder = document.createElement("span")
    cardFooterDiv.appendChild(leftFooterPlaceHolder)

    leftFooterSpan = document.createElement("span")
    leftFooterSpan.classList.add("leftFooterSpan")

    playIcon = document.createElement("i")
    playIcon.classList.add("fa")
    playIcon.classList.add("fa-play-circle-o")
    playIcon.setAttribute("data-preview", searchResults[key].previewUrl);
    playIcon.setAttribute("data-trackId", searchResults[key].trackId.toString());
    playIcon.setAttribute("id", "button" + searchResults[key].trackId.toString());
    playIcon.setAttribute("onclick", "playAudio( this.getAttribute('data-preview'), this.getAttribute('data-trackId') )")

    leftFooterSpan.appendChild(playIcon)
    cardFooterDiv.appendChild(leftFooterSpan)

    // track price
    nextFooterPrice = document.createElement("span")
    nextFooterPrice.appendChild( document.createTextNode("$" + searchResults[key].trackPrice) )
    nextFooterPrice.classList.add("trackPrice")
    nextFooterPrice.classList.add("middleFooterSpan")
    cardFooterDiv.appendChild(nextFooterPrice)

    rightFooterSpan = document.createElement("span")
    cardFooterDiv.appendChild(rightFooterSpan)

    // append content div to next grid list item then
    // append the next grid list item onto the gridlist
    nextGridContentDiv.appendChild(nextCardDiv)
    nextGridContentDiv.appendChild(cardFooterDiv)
    nextGridListItem.appendChild(nextGridContentDiv)
    document.getElementById("gridList").appendChild(nextGridListItem)

  }) // object keys forEach

  // use interval and generator function to flip cards
  flipGenerator = flipCard()
  console.log("got to generator")
  cardInterval = setInterval(() => {flipGenerator.next()}, 50)
  console.log("got past generator")

} // display results
