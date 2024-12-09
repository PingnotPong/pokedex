const API_ALL_URL = "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0";
const IMG_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const CARD_CONTAINER_REF = document.getElementById("card-container");
const OVERLAY_REF = document.getElementById("detailed-info-container");
const RENDER_MORE_REF = document.getElementById("render-more-container");
const SEARCHBAR_REF = document.getElementById("search-bar");
const TYPES = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"]

let allPokemon = [];
let loadedPokemon = {};
let searchedPokemon = [];
let numToLoad = 30;
let loadedPokemonNum = 0;
let searchActive = false;
let searchfieldInput = "";

async function init() {
    await getListOfAllPokemonUrls();
    emptyCardContainer();
    setloadSpinner(RENDER_MORE_REF);
    await renderPokemonCards();
    setShowMoreButtonIfNeeded((loadedPokemonNum < allPokemon.length));
}

async function getListOfAllPokemonUrls() {
    const response = await fetch(API_ALL_URL)
    const data = await response.json();
    allPokemon = data.results;
}

function emptyCardContainer() {
    CARD_CONTAINER_REF.innerHTML = "";
}

function setloadSpinner(element) {
    element.innerHTML = getLoadSpinnerTemplate();
}

async function renderPokemonCards() {
    let loadingbuffer = "";
    for (; loadedPokemonNum < numToLoad; loadedPokemonNum++) {
        await checkIfPokemonAlreadyLoaded(loadedPokemonNum);
        loadingbuffer += fillPokemonCardTemplate(loadedPokemonNum + 1);
    }
    CARD_CONTAINER_REF.innerHTML += loadingbuffer;
}

async function checkIfPokemonAlreadyLoaded(pokemonId) {
    if(loadedPokemon[pokemonId + 1]) {
    } else {
        await setCurrentPokemon(pokemonId);
        getNewPokemonInfo();
        getNewTypeArray();
        await getNewEvoChainArray();
        pushPokemonInformation(pokemonName, pokemonId, baseExp, height, weight, hpInPercent, attackInPercent, defenseInPercent, specialattackInPercent, specialdefenseInPercent, speedInPercent, pokemonTypeArray, evoChainArray)
    }
}

async function setCurrentPokemon(indexOfPokemon) {
    currentUrl = allPokemon[indexOfPokemon]["url"];
    currentPokemon = await fetch(currentUrl)
    currentPokemon = await currentPokemon.json();
}

function getNewPokemonInfo() {
    pokemonName = currentPokemon["name"].charAt(0).toUpperCase() + currentPokemon["name"].slice(1);
    pokemonId = currentPokemon["id"];
    baseExp = currentPokemon["base_experience"];
    height = currentPokemon["height"] / 10;
    weight = currentPokemon["weight"] / 10;
    hpInPercent = Math.round((currentPokemon["stats"][0]["base_stat"] / 255) * 100);
    attackInPercent = Math.round((currentPokemon["stats"][1]["base_stat"] / 255) * 100);
    defenseInPercent = Math.round((currentPokemon["stats"][2]["base_stat"] / 255) * 100);
    specialattackInPercent = Math.round((currentPokemon["stats"][3]["base_stat"] / 255) * 100);
    specialdefenseInPercent = Math.round((currentPokemon["stats"][4]["base_stat"] / 255) * 100);
    speedInPercent = Math.round((currentPokemon["stats"][5]["base_stat"] / 255) * 100);
}

function getNewTypeArray() {
    pokemonTypeArray = [];
    typeList = currentPokemon["types"];
    for (let j = 0; j < typeList.length; j++) {
        typeNr = typeList[j]["type"]["url"].slice(31);
        typeNr = typeNr.replace("/", "");
        pokemonTypeArray.push(typeNr);
    }
}

async function getNewEvoChainArray() {
    evoChainArray = [];
    evoJson = await getEvolutionChainJson(pokemonId);
    addEvoChain()
}

async function getEvolutionChainJson(pokemonId) {
    evoUrl = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId);
    evoUrl = await evoUrl.json();
    evoUrl = await fetch(evoUrl["evolution_chain"]["url"]);
    evoJson = evoUrl.json();
    return evoJson
}

function addEvoChain() {
    evoChainArray.push(evoJson["chain"]["species"]["url"].slice(42).replace("/", ""))
    evoJson?.chain?.evolves_to?.[0] && (
        evoChainArray.push(evoJson.chain.evolves_to[0]["species"]["url"].slice(42).replace("/", "")),
        evoJson?.chain?.evolves_to?.[0]?.evolves_to?.[0] && (
            evoChainArray.push(evoJson.chain.evolves_to[0].evolves_to[0]["species"]["url"].slice(42).replace("/", ""))
        )
    );
}

function pushPokemonInformation(pokemonName, pokemonId, baseExp, height, weight, hpInPercent, attackInPercent, defenseInPercent, specialattackInPercent, specialdefenseInPercent, speedInPercent, pokemonTypeArray, evoChainArray) {
    loadedPokemon[pokemonId +1] = {
        "name" : pokemonName,
        "baseExp" : baseExp,
        "height" : height,
        "weight" : weight,
        "hpInPercent" : hpInPercent,
        "attackInPercent" : attackInPercent,
        "defenseInPercent" : defenseInPercent,
        "specialattackInPercent" : specialattackInPercent,
        "specialdefenseInPercent" : specialdefenseInPercent,
        "speedInPercent" : speedInPercent,
        "pokemonTypeArray" : pokemonTypeArray,
        "evoChainArray" : evoChainArray
    }
}

function fillPokemonCardTemplate(searchedId) {
    getLoadedPokemonInfo(searchedId);
    return getPokemonCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, pokemonFirstType);
}

function getLoadedPokemonInfo(searchedId) {
    pokemonName = loadedPokemon[searchedId]["name"];
    pokemonId = searchedId;
    pokemonFirstType = TYPES[(loadedPokemon[searchedId].pokemonTypeArray[0]) - 1];
    pokemonTypeHTML = fillTypeTemplate(searchedId);
    baseExp = loadedPokemon[searchedId]["baseExp"];
    height = loadedPokemon[searchedId]["height"];
    weight = loadedPokemon[searchedId]["weight"];
    hpInPercent = loadedPokemon[searchedId]["hpInPercent"];
    attackInPercent = loadedPokemon[searchedId]["attackInPercent"];
    defenseInPercent = loadedPokemon[searchedId]["defenseInPercent"];
    specialattackInPercent = loadedPokemon[searchedId]["specialattackInPercent"];
    specialdefenseInPercent = loadedPokemon[searchedId]["specialdefenseInPercent"];
    speedInPercent = loadedPokemon[searchedId]["speedInPercent"];
    evoChainHTML = getEvolutionChainHTML(searchedId);
}

function fillTypeTemplate(searchedId) {
    typeList = loadedPokemon[searchedId].pokemonTypeArray;
    type = "";
    for (let j = 0; j < typeList.length; j++) {
        typeImgUrl = IMG_BASE_URL + "types/generation-viii/sword-shield/" + typeList[j] + ".png";
        typeName = TYPES[(typeList[j]) - 1];
        type += getPokemonCardTypeTemplate(typeImgUrl, typeName);
    }
    return type
}

function getEvolutionChainHTML(searchedId) {
    evoChainHTML = getEvoChainImgTemplate(1, loadedPokemon[searchedId]["evoChainArray"][0]);
    for (let i = 1; i < loadedPokemon[searchedId]["evoChainArray"].length; i++) {
        evoChainHTML += getEvoChainArrowTemplate(),
        evoChainHTML += getEvoChainImgTemplate((i + 1), loadedPokemon[searchedId]["evoChainArray"][i])
    }
    return evoChainHTML
}

function setShowMoreButtonIfNeeded(checkedBoolean) {
    RENDER_MORE_REF.innerHTML = checkedBoolean
        ? getShowMoreButtonTemplate()
        : "";
}

async function showMore() {
    numToLoad = numToLoad + 30;
    setloadSpinner(RENDER_MORE_REF);
    searchActive
        ? (await renderSearchedPokemon(), setShowMoreButtonIfNeeded(loadedPokemonNum < searchedPokemon.length))
        : (await renderPokemonCards(), setShowMoreButtonIfNeeded(loadedPokemonNum < allPokemon.length));
}

async function searchForPokemon(event) {
    event?.preventDefault();
    getSearchbarInput();
    loadedPokemonNum = 0;
    searchActive = true;
    filterPokemonList();
    if(searchedPokemon.length > 0) {
        setloadSpinner(RENDER_MORE_REF),
        await renderSearchedPokemon(),
        setShowMoreButtonIfNeeded((loadedPokemonNum < searchedPokemon.length))
    } else {
        CARD_CONTAINER_REF.innerHTML = getNoPokemonFoundTemplate();
        setShowMoreButtonIfNeeded(false)
    }
}

function getSearchbarInput() {
    searchfieldInput = SEARCHBAR_REF.value
    searchfieldInput = searchfieldInput.toLowerCase()
}

function filterPokemonList() {
    searchedPokemon = [];
    allPokemon.forEach((pokemon, index) => {
        if (pokemon.name.includes(searchfieldInput)) {
            searchedPokemon.push(index + 1)
        }
    });
}

async function renderSearchedPokemon() {
    emptyCardContainer();
    let loadingbuffer = ""
    if (searchfieldInput != "") {
        for (i = loadedPokemonNum; i < numToLoad; i++) {
            await checkIfPokemonAlreadyLoaded((searchedPokemon[i]) - 1);
            loadingbuffer += fillPokemonCardTemplate(searchedPokemon[i]);
            loadedPokemonNum++;
            if (loadedPokemonNum == searchedPokemon.length) break;
        }
    }
    CARD_CONTAINER_REF.innerHTML += loadingbuffer;
}

function checkForSearchReset() {
    SEARCHBAR_REF.value.length < 3 && resetSearch();
}

function resetSearch() {
    searchfieldInput = "";
    emptyCardContainer();
    loadedPokemonNum = 0;
    searchActive = false;
    renderPokemonCards();
    setShowMoreButtonIfNeeded((loadedPokemonNum < allPokemon.length));
}

function openOverlay(idToOpen) {
    toggleClass("overflow-hidden", "body");
    toggleClass("d-none", "overlay");
    setloadSpinner(OVERLAY_REF);
    renderOverlay(idToOpen);
}

function toggleClass(classToToggle, ...elementid) {
    for (let i = 0; i < elementid.length; i++) {
        elementRef = document.getElementById(elementid[i]);
        elementRef?.classList.toggle(classToToggle);
    }
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderOverlay(idToOpen) {
    getLoadedPokemonInfo(idToOpen);
    checkNextAndLastId(idToOpen);
    OVERLAY_REF.innerHTML = getOverlayCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, baseExp, height, weight, hpInPercent, attackInPercent, defenseInPercent, specialattackInPercent, specialdefenseInPercent, speedInPercent, evoChainHTML, lastId, nextId);
}

function checkNextAndLastId(idToCheck) {
    searchActive == true
        ? calculateSearchIds(idToCheck)
        : calculateIds(idToCheck)
}

function calculateSearchIds(idToCheck) {
    let searchedIndex = 0;
    for (let i = 0; i < searchedPokemon.length; i++) {
        if ((idToCheck) == searchedPokemon[i]) {
            searchedIndex = i;
            break;
        }
    }
    searchedIndex > 0 && searchedIndex < (searchedPokemon.length -1)
        ? (lastId = searchedPokemon[searchedIndex - 1], nextId = searchedPokemon[searchedIndex + 1])
        : searchedIndex === 0
            ? (lastId = searchedPokemon[searchedPokemon.length - 1], nextId = searchedPokemon[searchedIndex + 1])
            : (lastId = searchedPokemon[searchedIndex - 1], nextId = searchedPokemon[0])
}

function calculateIds(idToCheck) {
    idToCheck > 1 && idToCheck < loadedPokemonNum
        ? (lastId = idToCheck - 1, nextId = idToCheck + 1)
        : idToCheck === 1
            ? (lastId = loadedPokemonNum, nextId = idToCheck + 1)
            : (lastId = idToCheck - 1, nextId = 1)
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

async function nextOverlayCard(nextId) {
    setloadSpinner(OVERLAY_REF);
    await checkIfPokemonAlreadyLoaded(nextId - 1);
    renderOverlay(nextId);
}

async function lastOverlayCard(lastId) {
    setloadSpinner(OVERLAY_REF);
    await checkIfPokemonAlreadyLoaded(lastId - 1);
    renderOverlay(lastId);
}

function closeOverlay() {
    toggleClass("overflow-hidden", "body");
    toggleClass("d-none", "overlay");
}