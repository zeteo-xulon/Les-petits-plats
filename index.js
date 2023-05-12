import { 
    createImage, 
    createThis, 
    createThisInput, 
    CreateRecipeCard, 
    translatedUnit, 
    translatedBg, 
    translatedArgumentsContainer, 
    translatedArgument 
} from "./common.js";
const recipesSection = document.getElementById('recipes');
const searchIngredients = document.getElementById('searchIngredients');
const searchDevices = document.getElementById('searchDevices');
const searchTools = document.getElementById('searchTools');
const searchBar = document.getElementById('searchBar');
// const server = "./data/recipes.js"; == in case of backend server

let argumentsSelected = [];
let lastingRecipes = [];
console.log(recipes);

window.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.id === "searchIngredientsArrow"){
        return openOrCloseAdvancedSearch(e, searchIngredients, "ingredients", "searchIngredientsArrow", "searchIngredientsInput", "veuillez entrer un ingrédients", "Ingrédients");
    }
    if(e.target.id === "searchDevicesArrow"){
        return openOrCloseAdvancedSearch(e, searchDevices, "appliance", "searchDevicesArrow", "searchDevicesInput", "veuillez entrer le nom d'un appareils", "Appareils");
    }
    if(e.target.id === "searchToolsArrow"){
        return openOrCloseAdvancedSearch(e, searchTools, "ustensils", "searchToolsArrow", "searchToolsInput", "veuillez entrer un ustensil", "Ustensils");
    }
    if(e.target.classList.contains('argument__close')){
        return deleteArgument(e);
    }
})

searchBar.addEventListener('keyup', (e) => {
    e.preventDefault();
    const value = e.target.value;
    const recipesFromMainSearchInput = searchFromMainSearchInput(value);
    console.log(recipesFromMainSearchInput)
    //verifier si il y a des arguments dans le conteneur d'arguments
    const allArguments = getAllArguments();
    console.log(allArguments)
    if(allArguments.length > 0){
        const recipesFromArguments = searchFromArgumentsAndFoundRecipes(allArguments, recipesFromMainSearchInput);
        return displayRecipesCards(recipesFromArguments);
    }    
    if(recipesFromMainSearchInput.length === 0 && allArguments.length === 0){ return displayNoRecipeFound() }
    displayRecipesCards(recipesFromMainSearchInput);
})

searchIngredients.addEventListener('keyup', (e) => {
    e.preventDefault();
    if(e.target.value.length > 2){
        let search = e.target.value.toLowerCase();
        let filtredOptions = [];
        for(let i = 0; i < lastingRecipes.length; i++){
            const recipeIngredients = lastingRecipes[i].ingredients;
            for(let j=0; j < recipeIngredients.length; j++){
                const ingredientName = recipeIngredients[j].ingredient.toLowerCase();
                if(ingredientName.indexOf(search) !== -1){ filtredOptions.push(recipes[i]) }
            }
        }
        if(filtredOptions.length === 0){ return noOptionFound('ingredients') }
        console.log(filtredOptions)
        return displayOptions(filtredOptions, 'ingredients');
    } else {
        const options = findAllOptions("ingredients");
        return displayOptions(options, 'ingredients');
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

function searchFromMainSearchInput(value){
    if(value.length > 2){
        let search = value.toLowerCase();
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
        lastingRecipes = filtredRecipes;
        return filtredRecipes;
    } else { 
        return recipes;
    }
}
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
function openOrCloseAdvancedSearch(e, search, type, arrowId, inputId, placeholder, text){
    const argumentContainer = translatedArgumentsContainer(type);
    const bgColor = translatedBg(type);
    console.log(argumentContainer)
    if(e.target.classList.contains("arrow-down")){
        closeAllAdvancedSearch();
        const btn = createAdvancedSearchButton(arrowId, "up");
        const input = createThisInput("search", "search__advanced__input", inputId, placeholder);
        search.innerHTML= "";
        search.appendChild(btn);
        const allOption = findAllOptions(type);
        for(let i = 0; i < allOption.length && i < 30; i++){
            const optionBtn = createOption(allOption[i], bgColor);
            argumentContainer.appendChild(optionBtn);
        }
        return search.appendChild(input);
    }
    else if(e.target.classList.contains("arrow-up")){
        argumentContainer.innerHTML = "";
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

// close all advanced search input and display text and empty all arguments container
function closeAllAdvancedSearch(){
    close(searchIngredients, "searchIngredientsArrow", "Ingrédients");
    close(searchDevices, "searchDevicesArrow", "Appareils");
    close(searchTools, "searchToolsArrow", "Ustencils");
    emptyAllArgumentsContainer();
}
//empty all arguments container
function emptyAllArgumentsContainer(){
    emptyArgumentsContainer("ingredients");
    emptyArgumentsContainer("appliance");
    emptyArgumentsContainer("ustensils");
}
//empty arguments a unique container
function emptyArgumentsContainer(type){
    const argumentContainer = translatedArgumentsContainer(type);
    argumentContainer.innerHTML = "";
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

function displayNoRecipeFound(){
    recipesSection.innerHTML = "";
    const para = createThis('p', 'recipes__not-found', null, `Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.`);
    recipesSection.appendChild(para);
}
function noOptionFound(type){
    const argumentContainer = translatedArgumentsContainer(type);
    const bgColor = translatedBg(type);
    argumentContainer.innerHTML = "";
    const para = createThis('p', 'search__advanced__not-found txt-white ' + bgColor, null, `Aucun résultat ne correspond à votre recherche.`);
    return argumentContainer.appendChild(para);
}
function displayAdvancedSearchOption(options){

}
function displayOptions(options, type){
    const optionsContainer = translatedArgumentsContainer(type);
    const bgColor = translatedBg(type);
    optionsContainer.innerHTML = "";
    if(options.length === 0){
        return noOptionFound(optionsContainer, bgColor);
    }
    for(let i = 0; i < options.length && i < 30; i++){
        const optionArgument = createOption(options[i], bgColor);
        optionsContainer.appendChild(optionArgument);
    }
}

/**
 * create a button with a specified argument received
 * @param {string} text - text to add to the button
 * @param {string} className - string of class to add to the button
 * @returns {object} button - button DOM element created
 * example :
 * <button class="search-btn txt-white bg-blue ingredients">Lait de coco</button>
 */
function createOption(option, bgColor){
    const optionArgument = createThis('button', 'search-btn txt-white ' + bgColor, null, option);
    return optionArgument;
}

function findAllOptions(type){
    let optionArray = [];
    let newSet = new Set();
    for(let i = 0; i < recipes.length; i++){
        if(type === "appliance"){ 
            newSet.add(recipes[i].appliance)
        } else if (type === "ingredients"){
            for(let j = 0; j < recipes[i].ingredients.length; j++){
               newSet.add(recipes[i].ingredients[j].ingredient);
            } 
        } else if(type === "ustensils"){
            for(let j = 0; j < recipes[i].ustensils.length; j++){
                newSet.add(recipes[i].ustensils[j]);
            } 
        }
    }
    optionArray = Array.from(newSet);
    console.log(optionArray)
    return optionArray;
}
// d'abord créer un tableau vide, puis aller checker le conteneur des arguments.
// S'il y a des arguments, alors on les ajoute au tableau en spécifiant le type d'argument et l'argument lui-même
function getAllArguments(){
    let allArguments = [];
    const argumentsSelected = document.querySelectorAll('.argument');
    console.log(argumentsSelected)
    if(argumentsSelected.length > 0){
        for(let i = 0; i < argumentsSelected.length; i++){
            const argument = argumentsSelected[i];
            const type = argument.parentElement.classList[2];
            const translatedType = translatedArgument(type);
            allArguments.push({translatedType, argument});
        }
    return allArguments;
    }
}

function searchFromArgumentsAndFoundRecipes(argumentsList, recipes){
    const finalRecipes = [];
    // pour chaque recette on va vérifier si le premier argument est présent dans la recette
    // puis cela nous donnera un tableau de recettes qui contiennent le premier argument
    // puis on va vérifier si le deuxième argument est présent dans le tableau de recettes
    // et ainsi de suite
    for(let i = 0; i < recipes.length; i++){
        let stock = [];
        for(let j = 0; j < argumentsList.length; j++){
            const argumentType = argumentsList[j].translatedType;
            const argument = argumentsList[j].argument.innerText.toLowerCase();
            
            if(argumentType === "ingredients"){
                const recipeArgument = recipes[i].ingredients[j].ingredient.toLowerCase()
                if(argument === recipeArgument){ stock.push(recipes[i]) }
            }

            if(argumentType === "appliance"){
                const recipeArgument = recipes[i].appliance.toLowerCase()
                if(argument === recipeArgument){ stock.push(recipes[i]) }
            }

            if(argumentType === "ustensils"){
                const recipeArgument = recipes[i].ustensils[j].toLowerCase()
                if(argument === recipeArgument){ stock.push(recipes[i]) }
            }
        }
    }
}