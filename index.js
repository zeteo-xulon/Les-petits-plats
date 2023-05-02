import { createImage, createThis, createThisInput, CreateRecipeCard } from "./common.js";

const searchIngredients = document.getElementById('searchIngredients');
const searchDevices = document.getElementById('searchDevices');
const searchTools = document.getElementById('searchTools');
// const server = "./data/recipes.js"; == in case of backend server

window.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.id === "searchIngredientsArrow"){
        return openOrCloseAdvancedSearch(e, searchIngredients, "searchIngredientsArrow", "searchIngredientsInput", "veuillez entrer un ingrédients", "Ingrédients");
    }
    if(e.target.id === "searchDevicesArrow"){
        return openOrCloseAdvancedSearch(e, searchDevices, "searchDevicesArrow", "searchDevicesInput", "veuillez entrer le nom d'un appareils", "Appareils");
    }
    if(e.target.id === "searchToolsArrow"){
        return openOrCloseAdvancedSearch(e, searchTools, "searchToolsArrow", "searchToolsInput", "veuillez entrer un ustencil", "Ustencils");
    }
})


const displayRecipesCards = () => {
    // const recipes = await fetchServerData(server);  == in case of backend server
    const recipesCards = document.getElementById('recipes');
    recipesCards.innerHTML = "";
    recipes.forEach(recipe => {
        const cardModel = new CreateRecipeCard(recipe);
        const card = cardModel.render();
        recipesCards.appendChild(card);
    });
}

// in case of backend server
// ==========================
// async function fetchServerData(server){
//     const response = await fetch(server);
//     console.log(response);
//     const data = await response;
//     console.log(data);
//     return data;
// }

displayRecipesCards();

function createAdvancedSearchButton(specificId, sens){
    const button = createThis('button', 'btn-transparent');
    const img = createImage('./assets/chevron_white.png', 'flèche vers le bas, ouvrir la recherche', 'arrow arrow-'+sens ,specificId);
    button.appendChild(img);
    return button;
}


function openOrCloseAdvancedSearch(e, search, arrowId, inputId, placeholder, text){
    if(e.target.classList.contains("arrow-down")){
        const btn = createAdvancedSearchButton(arrowId, "up");
        const input = createThisInput("search", "search__advanced__input", inputId, placeholder);
        search.innerHTML= "";
        search.appendChild(btn);
        return search.appendChild(input);
    }
    else if(e.target.classList.contains("arrow-up")){
        search.innerHTML = "";
        const btn = createAdvancedSearchButton(arrowId, "down");
        const para = createThis('p', 'search__advanced__text txt-white')
        para.innerText = text;
        search.appendChild(btn);
        return search.appendChild(para);
    } 
}