const API_URL = "https://pokeapi.co/api/v2/";
const BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const CONTAINER_REF = document.getElementById("card-container");

let loadedPokemon = "";
let numToLoad = 10;

async function init() {
    await getPokemon();
    renderPokemonCards();
}

async function getPokemon() {
    let response = await fetch(API_URL + "pokemon?limit=" + numToLoad + "&offset=0" + ".json")
    loadedPokemon = await response.json();
    loadedPokemon = loadedPokemon["results"];
}

async function setCurrentPokemon(indexOfPokemon) {
    currentPokemon = await fetch(loadedPokemon[indexOfPokemon]["url"])
        currentPokemon = await currentPokemon.json();
}

async function renderPokemonCards() {
    const CONTAINER_REF = document.getElementById("card-container");
    CONTAINER_REF.innerHTML = "";
    for (let i = 0; i < loadedPokemon.length; i++) {
        await setCurrentPokemon(i);
        pokemonName = currentPokemon["name"].charAt(0).toUpperCase() + currentPokemon["name"].slice(1);
        pokemonId = "#" + currentPokemon["id"];
        pokemonImgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + currentPokemon["id"] + ".png";
        pokemonFirstType = currentPokemon["types"][0]["type"]["name"];    
        pokemonTypeHTML = fillTypeTemplate();
        CONTAINER_REF.innerHTML += getPokemonCardTemplate(pokemonName, pokemonId, pokemonImgUrl, pokemonFirstType, pokemonTypeHTML)
    }
}

function fillTypeTemplate() {
    typeList = currentPokemon["types"];
    type = "";
    for(let j = 0; j < typeList.length; j++) {
        typeName = typeList[j]["type"]["name"];
        typeImgNr = typeList[j]["type"]["url"].slice(31, 33);
        typeImgNr = typeImgNr.replace("/", "")
        typeImgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/" + typeImgNr + ".png";
        type += getPokemonCardTypeTemplate(typeImgUrl, typeName)
    }
    return type;
}