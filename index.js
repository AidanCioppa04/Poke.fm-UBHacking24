const key="0d233a8d757fa7ab78f3a5605a7567af"
let favoritePokemon
let userSimilarArtists = []

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
        for(i=0;i<5;i++){
            tags.push(topTags[i].name)
        }
        console.log(tags)
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

function checkBerryChoice(pokemonID,berryID){
    index=(pokemonID+berryID)%100
    pokemonID=pokemonID%100
    evaluation =[]
    if(pokemonID<15){evaluation[0]="great"}
    else if(pokemonID<30){evaluation[0]="average"}
    else if(pokemonID<45){evaluation[0]="poor"}
    else if(pokemonID<67){evaluation[0]="hit or miss"}

    if(indexed)
}

//takes two object ids, returns index [0-99]
function generateIndex(first,second) {
    index=(first+second)%100
    return index
}

async function generateReccomendations(){

    userSimilarArtists.length == 0 && await findSimilarArtist()

    if(userSimilarArtists.length == 0) {
        return error("no valid artist")
    }

    favoritePokemon || await userPokemon() 
    if(!favoritePokemon) {
        return error("no valid pokemon selected")
    }
    
    let berry = document.getElementById("berry").value
    if(!berry){
        return error("must pick a berry")
    } 
    color = document.getElementById("color").value
    type = document.getElementById("type").value  
    generation = document.getElementById("generation").value
     
    print(favoritePokemon.id)
    print(favoritePokemon.name)
    berry = berry.slice(0,berry.indexOf('-'))
    berry = await pullBerry(berry)
    print(berry.name)
    index = generateIndex(favoritePokemon.id,berry.id)
    print(index)
    
    const primaryReccomendation = userSimilarArtists[index]
    console.log(primaryReccomendation.name)

    let primaryTags = await getArtistTags(primaryReccomendation.name)
     

}

function error(message){
    let errorMessageContainer = document.getElementById('errorMessageContainer')
    let errorMessageElement = document.getElementById('errorMessage')

    errorMessageElement.innerHTML = message
    errorMessageContainer.style.display = 'block'
    console.log("Error: "+message)
}