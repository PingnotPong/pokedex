const API_ALL_URL = "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0";
const IMG_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const CARD_CONTAINER_REF = document.getElementById("card-container");
const OVERLAY_REF = document.getElementById("detailed-info-container");
const RENDER_MORE_REF = document.getElementById("render-more-container");
const SEARCHBAR_REF = document.getElementById("search-bar");

let allPokemon = [];
let searchedPokemon = [];
let numToLoad = 30;
let loadedPokemon = 0;
let searchActive = false;
let searchfieldInput = "";

async function init() {
    await getPokemon();
    CARD_CONTAINER_REF.innerHTML = "";
    setloadSpinner(RENDER_MORE_REF)
    renderPokemonCards();
    setShowMoreButtonIfNeeded((loadedPokemon < allPokemon.length));
}

async function getPokemon() {
    const response = await fetch(API_ALL_URL)
    const data = await response.json();
    allPokemon = data.results;
}

async function setCurrentPokemon(indexOfPokemon) {
    currentUrl = allPokemon[indexOfPokemon]["url"];
    currentPokemon = await fetch(currentUrl)
    currentPokemon = await currentPokemon.json();
}

async function renderPokemonCards() {
    let loadingbuffer = "";
    for (; loadedPokemon < numToLoad; loadedPokemon++) {
        await setCurrentPokemon(loadedPokemon);
        loadingbuffer += fillPokemonCardTemplate();
    }
    CARD_CONTAINER_REF.innerHTML += loadingbuffer;
}

function setloadSpinner(element) {
    element.innerHTML = getLoadSpinnerTemplate();
}

function setShowMoreButtonIfNeeded(checkedBoolean) {
    RENDER_MORE_REF.innerHTML = checkedBoolean
        ? getShowMoreButtonTemplate()
        : "";
}

function fillPokemonCardTemplate() {
    getPokemonInfo();
    return getPokemonCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, pokemonFirstType);
}

function checkNextAndLastId(idToCheck) {
    searchActive == true
        ? calculateSearchIds(idToCheck)
        : calculateIds(idToCheck)
}

function calculateSearchIds(idToCheck) {
    let searchedIndex = "";
    for (let i = 0; i < searchedPokemon.length; i++) {
        if ((idToCheck - 1) == searchedPokemon[i]) {
            searchedIndex = i;
            break;
        }
    }
    searchedIndex > 0 && searchedIndex < (loadedPokemon -1)
        ? (lastId = searchedPokemon[searchedIndex - 1], nextId = searchedPokemon[searchedIndex + 1])
        : searchedIndex === 0
            ? (lastId = searchedPokemon[loadedPokemon - 1], nextId = searchedPokemon[searchedIndex + 1])
            : (lastId = searchedPokemon[searchedIndex - 1], nextId = searchedPokemon[0])
    lastId++;
    nextId++;
}

function calculateIds(idToCheck) {
    idToCheck > 1 && idToCheck < loadedPokemon
        ? (lastId = idToCheck - 1, nextId = idToCheck + 1)
        : idToCheck === 1
            ? (lastId = loadedPokemon, nextId = idToCheck + 1)
            : (lastId = idToCheck - 1, nextId = 1)
}


function fillTypeTemplate() {
    typeList = currentPokemon["types"];
    type = "";
    for (let j = 0; j < typeList.length; j++) {
        typeName = typeList[j]["type"]["name"];
        typeImgNr = typeList[j]["type"]["url"].slice(31);
        typeImgNr = typeImgNr.replace("/", "")
        typeImgUrl = IMG_BASE_URL + "types/generation-viii/sword-shield/" + typeImgNr + ".png";
        type += getPokemonCardTypeTemplate(typeImgUrl, typeName)
    }
    return type;
}

async function openOverlay(pokemonId) {
    toggleClass("overflow-hidden", "body");
    toggleClass("d-none", "overlay");
    setloadSpinner(OVERLAY_REF);
    await renderOverlay(pokemonId);
}

function toggleClass(classToToggle, ...elementid) {
    for (let i = 0; i < elementid.length; i++) {
        elementRef = document.getElementById(elementid[i]);
        elementRef?.classList.toggle(classToToggle);
    }
}

async function renderOverlay(pokemonId) {
    await setCurrentPokemon(pokemonId - 1);
    await getPokemonInfo();
    await checkNextAndLastId(pokemonId);
    OVERLAY_REF.innerHTML = getOverlayCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, baseExp, height, weight, hpInPercent, attackInPercent, defenseInPercent, specialattackInPercent, specialdefenseInPercent, speedInPercent, evoChainHTML, lastId, nextId);
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
    addEvoChain(2, evoJson?.chain?.evolves_to?.[0]);
    addEvoChain(3, evoJson?.chain?.evolves_to?.[0]?.evolves_to?.[0]);
    return evoChainHTML
}

function addEvoChain(evoLevel, evoData) {
    evoData && (
        evoChainHTML += getEvoChainArrowTemplate(),
        evoChainHTML += getEvoChainImgTemplate(evoLevel, evoData["species"]["url"].slice(42).replace("/", ""))
    );
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

function checkForSearchReset() {
    SEARCHBAR_REF.value.length < 3 && resetSearch();
}

function resetSearch() {
    searchfieldInput = "";
    CARD_CONTAINER_REF.innerHTML = "";
    loadedPokemon = 0;
    searchActive = false;
    renderPokemonCards();
}

function searchForPokemon(event) {
    event?.preventDefault();
    searchfieldInput = SEARCHBAR_REF.value;
    loadedPokemon = 0;
    searchActive = true;
    filterPokemonList();
    setloadSpinner(RENDER_MORE_REF);
    renderSearchedPokemon();
    setShowMoreButtonIfNeeded((loadedPokemon < searchedPokemon.length))
}

async function renderSearchedPokemon() {
    CARD_CONTAINER_REF.innerHTML = "";
    let loadingbuffer = ""
    if (searchfieldInput != "") {
        for (i = loadedPokemon; i < numToLoad; i++) {
            await setCurrentPokemon(searchedPokemon[i]);
            loadingbuffer += fillPokemonCardTemplate();
            loadedPokemon++;
            if (loadedPokemon == searchedPokemon.length) break;
        }
    }
    CARD_CONTAINER_REF.innerHTML += loadingbuffer;
}

function filterPokemonList() {
    searchedPokemon = [];
    allPokemon.forEach((pokemon, index) => {
        if (pokemon.name.includes(searchfieldInput)) {
            searchedPokemon.push(index)
        }
    });
}

function changeInfoTab(selectedTab, ...deselect) {
    navToSelect = document.getElementById(selectedTab);
    tabToSelect = document.getElementById("detailed-info-" + selectedTab)
    navToSelect.setAttribute("class", "selected");
    tabToSelect.setAttribute("class", "");
    for (let i = 0; i < deselect.length; i++) {
        navToDeselect = document.getElementById(deselect[i])
        tabToDeselect = document.getElementById("detailed-info-" + deselect[i])
        navToDeselect.setAttribute("class", "");
        tabToDeselect.setAttribute("class", "d-none");
    }
}

async function showMore() {
    numToLoad = numToLoad + 30;
    setloadSpinner(RENDER_MORE_REF);
    searchActive
        ? (await renderSearchedPokemon(), setShowMoreButtonIfNeeded(loadedPokemon < searchedPokemon.length))
        : (await renderPokemonCards(), setShowMoreButtonIfNeeded(loadedPokemon < allPokemon.length));
}

async function nextOverlayCard(nextId) {
    setloadSpinner(OVERLAY_REF);
    await renderOverlay(nextId);
}

async function lastOverlayCard(lastId) {
    setloadSpinner(OVERLAY_REF);
    await renderOverlay(lastId);
}
