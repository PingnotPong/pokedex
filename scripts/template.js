function getPokemonCardTemplate(pokemonName, pokemonId, pokemonImgUrl, pokemonFirstType, pokemonTypeHTML) {
    return `
                <div class="pokemon-card" onclick="openOverlay()">
                <div class="card-header">
                    <h2 class="m-0 p-8">${pokemonName}</h2>
                    <h2 class="m-0 p-8">${pokemonId}</h2>
                </div>
                <div class="basic-info">
                    <div class="pokemon-img ${pokemonFirstType}">
                        <img src="${pokemonImgUrl}"
                        alt="">
                    </div>
                    <div class="pokemon-types">
                        ${pokemonTypeHTML}
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