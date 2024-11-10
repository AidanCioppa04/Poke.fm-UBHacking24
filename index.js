const key="0d233a8d757fa7ab78f3a5605a7567af"
let userPokemon1
let userSimilarArtists = []

//returns map of 100 similar artists {name, mbid}
async function findSimilarArtist(){
    query = document.getElementById("artistSeachInput").value
    
    try{
        const SearchRequest = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${query}&autocorrect=1&api_key=${key}&format=json`)
        const SearchResults = await SearchRequest.json()
        userSimilarArtists = SearchResults.similarartists.artist
        console.log(userSimilarArtists)
    }catch(error){
        userSimilarArtists = []
        console.log(error)
    }
}

async function getArtistTags(query){
    try{
        const SearchRequest = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getTags&artist=${query}&api_key=${key}&format=json`)
        const SearchResults = await SearchRequest.json()
        let tags=SearchResults
    }catch(error){console.log(error)}
}
async function userPokemon() {
    userPokemonSearch = document.getElementById('pokemonSearchInput').value
    userPokemon1 = await searchPokemon(userPokemonSearch)
    console.log(userPokemon1)
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

//takes two object ids, returns index [0-99]
function generateIndex(first,second) {
    index=(first+second)%99
    return index
}

async function generateReccomendations(){

    userSimilarArtists = userSimilarArtists.length == 0 ? findSimilarArtist() : userSimilarArtists

    if(userSimilarArtists.length == 0) {
        return error("no valid artist")
    }

    userPokemon1 ??= userPokemon() 
    if(!userPokemon1) {
        return error("no valid pokemon selected")
    }
    
    let berry = document.getElementById("berry").value
    if(!berry){
        return error("must pick a berry")
    } 
    berry = berry.slice(0,berry.indexOf('-'))
    berry = await pullBerry(berry)
    index = generateIndex(userPokemon1.id,berry.id)
    
    const primaryReccomendation = userSimilarArtists[index]
    console.log(primaryReccomendation.name)

    let tags = await getArtistTags(primaryReccomendation.name)
    console.log(tags)

}

function error(message){
    console.log(message)
}

async function main() {
    /*let obj= await findSimilarArtist("waterparks")
    let berry=await pullBerry("44")
    console.log(berry.name)
    let typeMon=await pullType("fire")
    console.log(typeMon.name)
    let genMon=await pullGeneration("8")
    console.log(genMon.name)
    let userMon=await userPokemon("chespin")
    console.log(userMon.name)
    
    
    let index=generateIndex(berry.id,userMon.id)
    console.log(index)
    console.log(obj[index].name)
    */

}
main() 