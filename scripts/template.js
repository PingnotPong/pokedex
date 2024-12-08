function getPokemonCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, pokemonFirstType) {
    return `
            <div class="pokemon-card" onclick="openOverlay(${pokemonId})">
                <div class="card-header">
                    <h2 class="m-0 p-8">${pokemonName}</h2>
                    <h2 class="m-0 p-8">${pokemonId}#</h2>
                </div>
                <div class="basic-info">
                    <div class="pokemon-img ${pokemonFirstType}">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png"
                        alt="">
                    </div>
                    <div class="pokemon-types">
                        ${pokemonTypeHTML}
                    </div>
                </div>
            </div>
    `
}

function getPokemonCardTypeTemplate(typeImgUrl, typeName) {
    return `
            <img class="p-8" src="${typeImgUrl}"
            alt="${typeName}">
    `
}

function getOverlayCardTemplate(pokemonName, pokemonId, pokemonTypeHTML, baseExp, height, weight, hpInPercent, attackInPercent, defenseInPercent, specialattackInPercent, specialdefenseInPercent, speedInPercent, evoChain, lastId, nextId) {
    return`
            <div class="overlay-header p-8"><span>${pokemonName}</span><span>${pokemonId}#<button onclick="closeOverlay()">x</button></span></div>
            <div class="overlay-img-and-types">
                <div>
                    <img id="normal-img" class="overlay-pokemon-img"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png"
                        alt="">
                    <img id="shiny-img" class="overlay-pokemon-img d-none"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png"
                        alt="">
                </div>
                <div class="overlay-type-container">
                    <div class="toggle-shiny">
                        <button class="toggle-button" id="toggle-button"
                            onclick="toggleClass('active', 'toggle-button'), toggleClass('d-none', 'normal-img', 'shiny-img', 'evo-img-1', 'evo-img-1-shiny', 'evo-img-2', 'evo-img-2-shiny', 'evo-img-3', 'evo-img-3-shiny')">
                            <div class="toggle-circle"></div>
                        </button>
                        <span><i class="fa fa-arrow-left"></i> Shiny</span>
                    </div>
                    ${pokemonTypeHTML}
                </div>
            </div>
            <nav class="detailed-info-nav">
                <div><span onclick="changeInfoTab('main', 'stats', 'evo-chain')" id="main" class="selected">Main</span></div>
                <div><span onclick="changeInfoTab('stats', 'main', 'evo-chain')" id="stats">Stats</span></div>
                <div><span onclick="changeInfoTab('evo-chain', 'main', 'stats')" id="evo-chain">Evo-Chain</span></div>
            </nav>
            <div id="detailed-info-main">
                <div>
                    <span>Base Experience</span>
                    <span>${baseExp} xp</span>
                </div>
                <div>
                    <span>Height</span>
                    <span>${height} m</span>
                </div>
                <div>
                    <span>Weight</span>
                    <span>${weight} kg</span>
                </div>
            </div>
            <div id="detailed-info-stats" class="d-none">
                <div class="stat-container">
                    <span>HP</span>
                    <div>
                        <div class="visual-stat" style="width: ${hpInPercent}%;"></div>
                    </div>
                </div>
                <div class="stat-container">
                    <span>Attack</span>
                    <div>
                        <div class="visual-stat" style="width: ${attackInPercent}%;"></div>
                    </div>
                </div>
                <div class="stat-container">
                    <span>Defense</span>
                    <div>
                        <div class="visual-stat" style="width: ${defenseInPercent}%;"></div>
                    </div>
                </div>
                <div class="stat-container">
                    <span>Special Attack</span>
                    <div>
                        <div class="visual-stat" style="width: ${specialattackInPercent}%;"></div>
                    </div>
                </div>
                <div class="stat-container">
                    <span>Special Defense</span>
                    <div>
                        <div class="visual-stat" style="width: ${specialdefenseInPercent}%;"></div>
                    </div>
                </div>
                <div class="stat-container">
                    <span>Speed</span>
                    <div>
                        <div class="visual-stat" style="width: ${speedInPercent}%;"></div>
                    </div>
                </div>
            </div>
            <div id="detailed-info-evo-chain" class="d-none">
                ${evoChain}
            </div>
            <div class="last-next-pokemon">
                <button onclick="lastOverlayCard(${lastId})"><i class="fa fa-arrow-left"></i></button>
                <button onclick="nextOverlayCard(${nextId})"><i class="fa fa-arrow-right"></i></button>
            </div>
    `
}

function getEvoChainImgTemplate(evoNr, pokemonId) {
    return`
            <img id="evo-img-${evoNr}"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png"
                alt="">
            <img id="evo-img-${evoNr}-shiny"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png"
                alt=""
                class="d-none">
    `
}

function getEvoChainArrowTemplate() {
    return`
            <i class="fa fa-angle-double-right"></i>
    `
}

function getNoPokemonFoundTemplate() {
    return`
        <div class="no-pokemon-found">
            <h2>No Pokemon Found</h2>
        </div>
    `
}

function getLoadSpinnerTemplate() {
    return`
            <div class="pokeball-container">
                <svg class="pokeball" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="64" height="64">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="white" stroke-width="4" />
                    <rect x="2" y="48" width="96" height="4" fill="white" />
                    <circle cx="50" cy="50" r="12" fill="none" stroke="white" stroke-width="6" />
                    <circle cx="50" cy="50" r="6" fill="white" />
                </svg>
            </div>
    `
}

function getShowMoreButtonTemplate() {
    return`
            <button onclick="showMore()" class="render-more-button">Show More</button>
    `
}