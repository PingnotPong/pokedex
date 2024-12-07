const API_ALL_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const IMG_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const CARD_CONTAINER_REF = document.getElementById("card-container");
const OVERLAY_REF = document.getElementById("detailed-info-container");
const RENDER_MORE_REF= document.getElementById("render-more-container");
const SEARCHBAR_REF = document.getElementById("search-bar");

let allPokemon = [];
let searchedPokemon = [];
let numToLoad = 10;
let loadedPokemon = 0;
let searchbarActive = false;
let searchfieldInput = "";

async function init() {
    await getPokemon();
    renderPokemonCards();
}

async function getPokemon() {
    const response = await fetch(API_ALL_URL)
    const data = await response.json();
    allPokemon = data.results;
}

async function setCurrentPokemon(indexOfPokemon) {
    currentPokemon = await fetch(allPokemon[indexOfPokemon]["url"])
        currentPokemon = await currentPokemon.json();
}

async function renderPokemonCards() {
    CARD_CONTAINER_REF.innerHTML = "";
    for (;loadedPokemon < numToLoad; loadedPokemon++) {
        await setCurrentPokemon(loadedPokemon);
        CARD_CONTAINER_REF.innerHTML += fillPokemonCardTemplate();
    }
}

function fillPokemonCardTemplate() {
    getPokemonInfo();
    return getPokemonCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, pokemonFirstType);
}

function fillTypeTemplate() {
    typeList = currentPokemon["types"];
    type = "";
    for(let j = 0; j < typeList.length; j++) {
        typeName = typeList[j]["type"]["name"];
        typeImgNr = typeList[j]["type"]["url"].slice(31);
        typeImgNr = typeImgNr.replace("/", "")
        typeImgUrl = IMG_BASE_URL + "types/generation-viii/sword-shield/" + typeImgNr + ".png";
        type += getPokemonCardTypeTemplate(typeImgUrl, typeName)
    }
    return type;
}

function openOverlay(pokemonId,) {
    toggleClass("overflow-hidden", "body");
    toggleClass("d-none", "overlay");
    renderOverlay(pokemonId);
}

function toggleClass(classToToggle, ...elementid) {
    for(let i = 0; i < elementid.length; i++) {
        elementRef = document.getElementById(elementid[i]);
        if(elementRef) {
            elementRef.classList.toggle(classToToggle);    
        }
    }
}

async function renderOverlay(pokemonId) {
    await setCurrentPokemon(pokemonId - 1);
    await getPokemonInfo();
    OVERLAY_REF.innerHTML = getOverlayCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, baseExp, height, weight, hpInPercent, attackInPercent, defenseInPercent, specialattackInPercent, specialdefenseInPercent, speedInPercent, evoChainHTML);
}

async function getPokemonInfo() {
    pokemonName = currentPokemon["name"].charAt(0).toUpperCase() + currentPokemon["name"].slice(1);
    pokemonId = currentPokemon["id"];
    pokemonFirstType = currentPokemon["types"][0]["type"]["name"];    
    pokemonTypeHTML = fillTypeTemplate();
    baseExp = currentPokemon["base_experience"];
    height = currentPokemon["height"] / 10;
    weight = currentPokemon["weight"] / 10;
    hpInPercent = Math.round((currentPokemon["stats"][0]["base_stat"] / 255) * 100);
    attackInPercent = Math.round((currentPokemon["stats"][1]["base_stat"] / 255) * 100);
    defenseInPercent = Math.round((currentPokemon["stats"][2]["base_stat"] / 255) * 100);
    specialattackInPercent = Math.round((currentPokemon["stats"][3]["base_stat"] / 255) * 100);
    specialdefenseInPercent = Math.round((currentPokemon["stats"][4]["base_stat"] / 255) * 100);
    speedInPercent = Math.round((currentPokemon["stats"][5]["base_stat"] / 255) * 100);
    evoChainHTML = await getEvolutionChain(pokemonId);
}

async function getEvolutionChain(pokemonId) {
    evoJson = await getEvolutionChainJson(pokemonId);
    evoChainHTML = getEvoChainImgTemplate(1, evoJson["chain"]["species"]["url"].slice(42).replace("/", ""));
    if(evoJson?.chain?.evolves_to?.[0]) {
        evoChainHTML += getEvoChainArrowTemplate();
        evoChainHTML += getEvoChainImgTemplate(2, evoJson["chain"]["evolves_to"][0]["species"]["url"].slice(42).replace("/", ""))
    }
    if(evoJson?.chain?.evolves_to?.[0]?.evolves_to?.[0]) {
        evoChainHTML += getEvoChainArrowTemplate();
        evoChainHTML += getEvoChainImgTemplate(3, evoJson["chain"]["evolves_to"][0]["evolves_to"][0]["species"]["url"].slice(42).replace("/", ""))
    }
    return evoChainHTML
}

async function getEvolutionChainJson(pokemonId) {
    evoUrl = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId);
    evoUrl = await evoUrl.json();
    evoUrl = await fetch(evoUrl["evolution_chain"]["url"]);
    evoJson = evoUrl.json();
    return evoJson
}

function closeOverlay() {
    toggleClass("overflow-hidden", "body");
    toggleClass("d-none", "overlay");
}

function stopPropagation(event) {
    event.stopPropagation();
}

function searchForPokemon(event) {
    event?.preventDefault();
    searchfieldInput = SEARCHBAR_REF.value;
    filterPokemonList();
    renderSearchedPokemon();
}

async function renderSearchedPokemon() {
    CARD_CONTAINER_REF.innerHTML = "";
    loadedPokemon = 0;
    for (;loadedPokemon < numToLoad; loadedPokemon++) {
        await setCurrentPokemon(searchedPokemon[loadedPokemon]);
        CARD_CONTAINER_REF.innerHTML += fillPokemonCardTemplate()
    }
}

function filterPokemonList() {
    searchedPokemon = [];
    for(const pokemon of allPokemon) {
        if(pokemon.name.includes(searchfieldInput)) {
            pokemonId = pokemon["url"].slice(34);
            pokemonId = pokemonId.replace("/", "")    
            searchedPokemon.push(pokemonId -1)
        }
    }
}

function changeInfoTab(selectedTab, ...deselect) {
    navToSelect = document.getElementById(selectedTab);
    tabToSelect = document.getElementById("detailed-info-" + selectedTab)
    navToSelect.setAttribute("class", "selected");
    tabToSelect.setAttribute("class", "");
    for(let i = 0; i < deselect.length; i++) {
        navToDeselect = document.getElementById(deselect[i])        
        tabToDeselect = document.getElementById("detailed-info-" + deselect[i])  
        navToDeselect.setAttribute("class", "");
        tabToDeselect.setAttribute("class", "d-none");          
    }
}