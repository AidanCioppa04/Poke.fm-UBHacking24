const key="0d233a8d757fa7ab78f3a5605a7567af"
let favoritePokemon
let userSimilarArtists = []
let berrySprite

function print(x) {
    console.log(x)
}

window.onload = () => {
    let ifIHaveToWriteDocumentDotGetElementByIdOneMoreTimeIWillExplode = document.getElementById('errorMessageContainer')
    ifIHaveToWriteDocumentDotGetElementByIdOneMoreTimeIWillExplode.onclick = () => {ifIHaveToWriteDocumentDotGetElementByIdOneMoreTimeIWillExplode.style.display = 'none'}
}

//returns map of 100 similar artists {name, mbid}
async function findSimilarArtist(){
    query = document.getElementById("artistSeachInput").value
    
    try{
        const SearchRequest = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${query}&autocorrect=1&api_key=${key}&format=json`)
        const SearchResults = await SearchRequest.json()
        userSimilarArtists = SearchResults.similarartists.artist
    }catch(error){
        userSimilarArtists = []
        console.log(error)
    }
}

async function getArtistTags(query){
    try{
        const SearchRequest = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=${query}&api_key=${key}&format=json`)
        const SearchResults = await SearchRequest.json()
        const topTags = SearchResults.toptags.tag
        let tags = []
        for(i=0;i<5&&topTags[i];i++){
            tags.push(topTags[i].name)
        }
        return tags
    }catch(error){console.log(error)}
}
async function userPokemon() {
    userPokemonSearch = document.getElementById('pokemonSearchInput').value
    favoritePokemon = await searchPokemon(userPokemonSearch)
}
//returns pokemon object
async function searchPokemon(query) {
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        const SearchResults = await SearchRequest.json()
        return SearchResults
    }catch(error){
        console.log(`Could not find results for your query: '${query}'`)
        return undefined
    }
}

//takes list of pokemon, returns one pokemon object from list
async function randomPokemonFromList(query){
    try{
        let random= Math.floor(Math.random()*2000)%query.length
        query=query[random].pokemon.name
        console.log(query)
        return searchPokemon(query)
    }catch(error){
    console.log(error)
    }
}
/*
async function pullPokemonSprite(query){
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        const SearchResults = await SearchRequest.json()
        return SearchResults.sprites.front_default
    }catch(error){
        console.log(`Could not find results for your query: '${query}'`)
        return undefined
    }
}
    */

//returns random pokemon object of a type
async function pullType(query){
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/type/${query}`)
        const SearchResults = await SearchRequest.json()
        let random= Math.floor(Math.random()*2000)%SearchResults.pokemon.length
        pokemon=SearchResults.pokemon[random].pokemon.name
        return searchPokemon(pokemon)
    }catch(error){
        console.log(error)
    }
}
//returns random pokemon object of a color
async function pullColor(query){
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/pokemon-color/${query}`)
        const SearchResults = await SearchRequest.json()
        let random= Math.floor(Math.random()*2000)%SearchResults.pokemon_species.length
        pokemon=SearchResults.pokemon_species[random].name
        return searchPokemon(pokemon)
    }catch(error){
        console.log(error)
    }
}
//returns list of pokemon from a generation
async function pullGeneration(query) {
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/generation/${query}`)
        const SearchResults = await SearchRequest.json()
        let random= Math.floor(Math.random()*2000)%SearchResults.pokemon_species.length
        pokemon=SearchResults.pokemon_species[random].name
        return searchPokemon(pokemon)
    }catch(error){
        console.log(error)
    }
}
//returns berry
async function pullBerry(query) {
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/berry/${query}`)
        const SearchResults = await SearchRequest.json()
        return SearchResults
    }catch(error){
        console.log(error)
    }
}

async function pullBerrySprite(query){
    try{
        const SearchRequest = await fetch(`https://pokeapi.co/api/v2/item/${query}`)
        const SearchResults = await SearchRequest.json()
        return SearchResults.sprites.default
    }catch(error){
        console.log(error)
    }
}
function checkBerryChoice(pokemonID,berryID){
    index=(pokemonID+berryID)%100
    pokemonID=pokemonID%100
    evaluation =[]
    if(pokemonID<15)     {evaluation[0]="great"}
    else if(pokemonID<30){evaluation[0]="average"}
    else if(pokemonID<45){evaluation[0]="poor"}
    else                 {evaluation[0]="hit or miss"}

    if(index<33)         {evaluation[1]="great"}
    else if(index<66)    {evaluation[1]="alright"}
    else                 {evaluation[1]="poor"}
    return evaluation
}

//takes two object ids, returns index [0-99]
function generateIndex(first,second) {
    index=(first+second)%100
    return index
}

async function generateReccomendations(){

    await findSimilarArtist()
    if(userSimilarArtists.length == 0) {
        return error("no valid artist")
    }

    await userPokemon() 
    if(!favoritePokemon) {
        return error("no valid pokemon selected")
    }
    
    let berry = document.getElementById("berry").value
    if(!berry){
        return error("must pick a berry")
    } 
    berrySprite=await pullBerrySprite(berry)
    print(berrySprite)
    favoritePokemonSprite=favoritePokemon.sprites.front_default
    print(favoritePokemonSprite)
    color = document.getElementById("color").value
    type = document.getElementById("type").value  
    generation = document.getElementById("generation").value
     

    berry = berry.slice(0,berry.indexOf('-'))
    berry = await pullBerry(berry)
    index = generateIndex(favoritePokemon.id,berry.id)
    
    const primaryReccomendation = userSimilarArtists[index]
    

    let primaryTags = await getArtistTags(primaryReccomendation.name)
    
    let typeRecPoke
    let typeRec
    if(type !== ''){
        typeRecPoke = await pullType(type)
        index = generateIndex(typeRecPoke.id,berry.id)
        typeRec = userSimilarArtists[index]
    }

    let genRecPoke
    let genRec
    if(generation !== ''){
        genRecPoke = await pullGeneration(generation)
        index = generateIndex(genRecPoke.id, berry.id)
        genRec = userSimilarArtists[index]
    }

    let colorRecPoke
    let colorRec
    if(color !== '') {
        colorRecPoke = await pullColor(color)
        index = generateIndex(colorRecPoke.id, berry.id)
        colorRec = userSimilarArtists[index]
    }


    let finalReccomendations = [{
        artist: primaryReccomendation,
        pokemon:favoritePokemon,
    }]

    genRec && finalReccomendations.push({
        artist: genRec,
        pokemon: genRecPoke
    })

    typeRec && finalReccomendations.push({
        artist: typeRec,
        pokemon: typeRecPoke
    })

    colorRec && finalReccomendations.push({
        artist:colorRec,
        pokemon:colorRecPoke
    })

    displayResults(finalReccomendations)

    
}

// param 'results' is an array of objects of format:
// {artist:artistName, pokemon:pokemonName}
// results[0] is the primary reccomendation
function displayResults(results) {
    for(i=0;i<4;i++) {
        let container = document.getElementById('rec'+i)
        if(!results[i]){
            container.style.display = 'none'
            continue
        }

        if(Math.floor(Math.random()*4096) == 1) {
            re
        }

        container.querySelector('img').src=results[i].pokemon.sprites["front_default"]
        container.querySelector('span.pokemonName').innerHTML=results[i].pokemon.name
        container.querySelector('a.artistName').innerHTML=results[i].artist.name
        container.querySelector('a.artistName').href=results[i].artist.url
        container.style.display = "flex"
    }
}

function error(message){
    let errorMessageContainer = document.getElementById('errorMessageContainer')
    let errorMessageElement = document.getElementById('errorMessage')

    errorMessageElement.innerHTML = message
    errorMessageContainer.style.display = 'block'
    console.log("Error: "+message)
}