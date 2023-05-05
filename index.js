import { createImage, createThis, createThisInput, CreateRecipeCard } from "./common.js";

const searchIngredients = document.getElementById('searchIngredients');
const searchDevices = document.getElementById('searchDevices');
const searchTools = document.getElementById('searchTools');
const searchBar = document.getElementById('searchBar');
// const server = "./data/recipes.js"; == in case of backend server

let argumentsSelected = [];
let foundRecipes = [];
console.log(recipes);

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
    if(e.target.classList.contains('argument__close')){
        return deleteArgument(e);
    }
})

searchBar.addEventListener('keyup', (e) => {
    e.preventDefault();

    if(e.target.value.length > 2){
        let search = e.target.value.toLowerCase();
        let filtredRecipes = [];

        /** en plusieur temps :
        * 1. on filtre les recettes par nom de recette
        * 2. on filtre les recettes par description de recette
        * 3. on filtre les recettes par ingredients de recette
        * 4. on affiche les recettes filtrées
        * La méthode indexOf est utilisé car plus bas niveau et un peu plus rapide que includes 
        */
        for(let i = 0; i < recipes.length; i++){
            const recipeName = recipes[i].name.toLowerCase();
            const recipeIngredients = recipes[i].ingredients;
            const recipeDescription = recipes[i].description.toLowerCase();

            if(recipeName.indexOf(search) !== -1){ filtredRecipes.push(recipes[i]) }
            else if(recipeDescription.indexOf(search) !== -1){ filtredRecipes.push(recipes[i]) }
            else{
                for(let j=0; j < recipeIngredients.length; j++){
                const ingredientName = recipeIngredients[j].ingredient.toLowerCase();
                if(ingredientName.indexOf(search) !== -1){ filtredRecipes.push(recipes[i]) }
                } 
            }
        }
        console.log(filtredRecipes)
        foundRecipes = filtredRecipes;
        return displayRecipesCards(filtredRecipes);
    } else { 
        return displayRecipesCards(recipes) 
    }
})
searchIngredients.addEventListener('keyup', (e) => {
    e.preventDefault();
    if(e.target.value.length > 2){
        let search = e.target.value.toLowerCase();
        let filtredRecipes = [];
        for(let i = 0; i < recipes.length; i++){
            const recipeIngredients = recipes[i].ingredients;
            for(let j=0; j < recipeIngredients.length; j++){
                const ingredientName = recipeIngredients[j].ingredient.toLowerCase();
                if(ingredientName.indexOf(search) !== -1){ filtredRecipes.push(recipes[i]) }
            }
        }
        console.log(filtredRecipes)
        return displayRecipesCards(filtredRecipes);
    } else {
        return displayRecipesCards(recipes)
    }
})



const displayRecipesCards = (givenRecipes) => {
    // const recipes = await fetchServerData(server);  == in case of backend server
    const recipesCards = document.getElementById('recipes');
    recipesCards.innerHTML = "";
    givenRecipes.forEach(recipe => {
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

displayRecipesCards(recipes);

/**
 * create a button with a specified argument received
 * @param {string} text - text to add to the button
 * @param {string} className - string of class to add to the button
 * @param {string} id - id to add to the button
 * @returns {object} button - button DOM element created
 * example :
 * <button class="btn btn-transparent" id="searchIngredientsArrow">
 *     <img src="./assets/chevron_white.png" alt="flèche vers le bas, ouvrir la recherche" class="arrow arrow-down" >
 * </button>
 */ 
function createAdvancedSearchButton(specificId, sens){
    const button = createThis('button', 'btn-transparent');
    const img = createImage('./assets/chevron_white.png', 'flèche vers le bas, ouvrir la recherche', 'arrow arrow-'+sens ,specificId);
    button.appendChild(img);
    return button;
}

/**
 * 2 cases :
 *  1. open advanced search single input and close others inputs and display text
 *  2. close advanced search single input and display text
 * @param {object} e - event
 * @param {object} search - DOM element to add the input
 * @param {string} arrowId - id of the arrow to change
 * @param {string} inputId - id of the input to create
 * @param {string} placeholder - placeholder of the input to create
 * @param {string} text - text to display when closing the input
 * @returns {object} search - DOM element with the input or the text
 * example :
 * <div class="search__advanced__input">
 *    <input type="text" id="searchIngredientsInput" placeholder="veuillez entrer un ingrédients">
 * </div>
 * <div class="search__advanced__text txt-white">
 *   Ingrédients
 * </div>
 */
function openOrCloseAdvancedSearch(e, search, arrowId, inputId, placeholder, text){
    if(e.target.classList.contains("arrow-down")){
        closeAllAdvancedSearch();
        const btn = createAdvancedSearchButton(arrowId, "up");
        const input = createThisInput("search", "search__advanced__input", inputId, placeholder);
        search.innerHTML= "";
        search.appendChild(btn);
        return search.appendChild(input);
    }
    else if(e.target.classList.contains("arrow-up")){
        return close(search, arrowId, text);
    } 
}

// close advanced search single input and display text
function close(search, arrowId, text){
    search.innerHTML = "";
    const btn = createAdvancedSearchButton(arrowId, "down");
    const para = createThis('p', 'search__advanced__text txt-white')
    para.innerText = text;
    search.appendChild(btn);
    return search.appendChild(para);
}

// close all advanced search input and display text
function closeAllAdvancedSearch(){
    close(searchIngredients, "searchIngredientsArrow", "Ingrédients");
    close(searchDevices, "searchDevicesArrow", "Appareils");
    close(searchTools, "searchToolsArrow", "Ustencils");
}

// delete argument from the list and the DOM
function deleteArgument(e){
    console.log(e)
    console.log(e.target.parentElement.children[0].innerText)
    const argument = e.target.parentElement.children[0].innerText;
    const index = argumentsSelected.indexOf(argument);
}
/**
 * create a button with a specified argument received
 * @param {string} text - text to add to the button
 * @param {string} className - string of class to add to the button
 * @returns {object} button - button DOM element created
 * example :
 *  
 <btn class="btn argument bg-blue txt-white">
    <span class="argument__text">Coco</span>
    <img src="./assets/white_circle_delete_icon.png" alt="delete cross" class="argument__close" height="20" width="20">
</btn>
*/
function createArgument(bgColor, text){
    const button = createThis('button', 'btn argument txt-white ' + bgColor);
    const span = createThis('span', 'argument__text', null, text);
    const img = createImage('./assets/white_circle_delete_icon.png', 'delete cross', 'argument__close');
    img.height = 20;
    img.width = 20;
    button.appendChild(span);
    button.appendChild(img);
    return button;
}