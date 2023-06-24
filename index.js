import { 
    createThis, createThisInput, CreateRecipeCard, translatedBg, 
    translatedArgumentsContainer, translatedArgument, createAdvancedSearchButton,
    createOption, createAndDisplayArgument, translateInput
} from "./common.js";
const recipesSection = document.getElementById('recipes');
const searchIngredients = document.getElementById('searchIngredients');
const searchDevices = document.getElementById('searchDevices');
const searchTools = document.getElementById('searchTools');
const searchBar = document.getElementById('searchBar');
const argumentsContainer = document.getElementById('argumentsContainer');
const config = { childList: true };
const containerObserver = new MutationObserver((mutation) => { 
    return onContainerChange() 
});


let argumentsInContainer = [];
let lastingRecipes = [];


window.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.id === "searchIngredientsArrow"){
        return openOrCloseAdvancedSearch(e, searchIngredients, "ingredients", "searchIngredientsArrow", "searchIngredientsInput", "veuillez entrer un ingrédient", "Ingrédients");
    }
    if(e.target.id === "searchDevicesArrow"){
        return openOrCloseAdvancedSearch(e, searchDevices, "appliance", "searchDevicesArrow", "searchDevicesInput", "veuillez entrer le nom d'un appareil", "Appareils");
    }
    if(e.target.id === "searchToolsArrow"){
        return openOrCloseAdvancedSearch(e, searchTools, "ustensils", "searchToolsArrow", "searchToolsInput", "veuillez entrer un ustensile", "Ustensiles");
    }
    if(e.target.classList.contains('argument__close')){
        return deleteArgument(e);
    }
    if(e.target.classList.contains('search-btn')){
        return addArgument(e) 
    }
})

searchBar.addEventListener('keyup', (e) => {
    e.preventDefault();
    search();
    return checkAndDisplay();
})

searchIngredients.addEventListener('keyup', (e) => { e.preventDefault(); searchOptions(e) })
searchDevices.addEventListener('keyup', (e) => { e.preventDefault(); searchOptions(e) })
searchTools.addEventListener('keyup', (e) => { e.preventDefault(); searchOptions(e) })

document.addEventListener('DOMContentLoaded', () => { containerObserver.observe(argumentsContainer, config) })


displayRecipesCards(recipes);


// === SEARCH'S ===

/** 
* Function that checks all search containers
* Firstly, it performs a search with the content of the main search bar,
* then checks the content of the argument container by passing it the result of the main search.
* This function is triggered whenever there is a change in the input of the search bar
* or whenever an argument is added.
* Cases:
* 1 - The search bar has less than 3 characters, so the entire array of recipes is returned.
* 2 - The search bar has 3 or more characters, and recipes are found, this array is returned.
* 3 - The search bar has 3 or more characters, but no recipes are found, the message "no recipes match the search" is displayed.
* 
* 4 - There are no arguments in the container, the results from the main search are displayed.
* 5 - Arguments are present in the container, the recipes are sorted using the received array. If there are remaining recipes, they are displayed.
* 6 - Arguments are present in the container, the recipes are sorted using the received array. If there are no recipes remaining, the message "no recipes match the search" is displayed.
*/
function search(){
    let searchBarInputContent = document.getElementById('searchBar').value;
    // case 1,2,3
    searchFromMainSearchInput(searchBarInputContent)
    if(lastingRecipes.length === 0){ return displayNoRecipeFound }
    // case 4,5,6
    getAllArguments()
}

/**
 * It will filter the value from the recipes array with the value from the input of the main search bar
 * The function use the JavaScript method includes filter and some to check if the value is in the array
 * @param {String} value - what is typed in the input of the main search bar
 * @returns {Array} filteredRecipes - array of recipes that match the value
 */
function searchFromMainSearchInput(value) {
    if (value.length > 2) {
        const search = value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe => {
            const recipeName = recipe.name.toLowerCase();
            const recipeIngredients = recipe.ingredients;
            const recipeDescription = recipe.description.toLowerCase();
            return (
            recipeName.includes(search) ||
            recipeDescription.includes(search) ||
            recipeIngredients.some( ingredient => ingredient.ingredient.toLowerCase().includes(search) )
            );
        });
        return lastingRecipes = filteredRecipes;
    } else {
        return lastingRecipes = recipes; 
    }
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

/**
 * It will filter the recipes received by the main search input with the arguments received by the advanced search inputs
 * @param {*} argumentsList - Array of arguments received by the advanced search inputs
 * @param {*} recipes - Array of recipes received by the main search input
 * @returns {object} sortedRecipes - array of recipes sorted by the arguments received by the advanced search inputs
 */
function searchFromArgumentsAndFoundRecipes(argumentsList, recipes) {
    let workingRecipes = recipes;

    argumentsList.forEach(argument => {
        const argumentFromListName = argument.name.toLowerCase();

        workingRecipes = workingRecipes.filter(recipe => {
        if (argument.type === "ingredients") {
            return recipe.ingredients.some(ingredient => {
            const recipeArgumentName = ingredient.ingredient.toLowerCase();
            return recipeArgumentName === argumentFromListName;
            });
        } else if (argument.type === "appliance") {
            const recipeArgumentName = recipe.appliance.toLowerCase();
            return recipeArgumentName === argumentFromListName;
        } else if (argument.type === "ustensils") {
            return recipe.ustensils.some(ustensil => {
            const recipeArgumentName = ustensil.toLowerCase();
            return recipeArgumentName === argumentFromListName;
            });
        } else {
            console.log("This is not a valid argument type.");
            return false;
        }
        });
    });
    
    lastingRecipes = workingRecipes;
    return lastingRecipes;
}

/**
 * It will search the options in the recipes depending the type of the input
 * @param {*} e - the event
 * @returns the appropriate display function with the options
 */
function searchOptions(e){
    let type = translateInput(e.target.id);
    if(e.target.value.length > 2){
        let search = e.target.value.toLowerCase();
        let filtredRecipes = lastingRecipes.length !== 0 ? lastingRecipes : recipes;
        let optionsSet = new Set();
        for(let i = 0; i < filtredRecipes.length; i++){

            // ici la partie sur les ingrédients
            if(type === "ingredients"){
                const recipeIngredients = filtredRecipes[i].ingredients;
                for(let j=0; j < recipeIngredients.length; j++){
                    const ingredientName = recipeIngredients[j].ingredient.toLowerCase();
                    if(ingredientName.indexOf(search) !== -1){ optionsSet.add(ingredientName) }
                }
            }
            
            // ici la partie sur les appareils
            if(type === "appliance"){
                const applianceName = filtredRecipes[i].appliance.toLowerCase();
                if(applianceName.indexOf(search) !== -1){ optionsSet.add(applianceName) }
            }
            
            //ici la partie sur les ustencils
            if(type === "ustensils"){
                const ustensilsRecipe = filtredRecipes[i].ustensils;
                for(let j=0; j < ustensilsRecipe.length; j++){
                    const ustensilsName = ustensilsRecipe[j].toLowerCase();
                    if(ustensilsName.indexOf(search) !== -1){ optionsSet.add(ustensilsName) }
                }
            }

        }
        let translatedOptionsSetToArray = Array.from(optionsSet);
        if(translatedOptionsSetToArray.length === 0){ return noOptionFound(type) }
        return displayOptions(translatedOptionsSetToArray, type);
    } else {
        const options = findAllOptions(type);
        return displayOptions(options, type);
    }
}


//=== ARGUMENTS ===

// First, create an empty array, then check the argument container.
// If there are arguments, then add them to the array, specifying the argument type and the argument itself.
function getAllArguments(){
    let allArguments = new Set();
    const argumentsSelected = document.querySelectorAll('.argument');
    const thereIsArguments = argumentsSelected.length > 0;
    if(thereIsArguments){
        argumentsSelected.forEach(argument => {
            const argumentType = argument.classList[3];
            const type = translatedArgument(argumentType);
            const name = argument.innerText.toLowerCase();
            allArguments.add({type, name});
        })
        argumentsInContainer = Array.from(allArguments);
    }
}

/**
 * Adds an argument to the list of selected arguments.
 * @param {Event} e - The event object that triggered the function call.
 * @param {boolean} [isAlreadyInList=false] - A flag that indicates whether the argument is already in the list of selected arguments.
 * @returns {void}
 */
function addArgument(e, isAlreadyInList=false){
    const argument = e.target.innerText;
    getAllArguments();
    for(let i=0; i< argumentsInContainer.length; i++){ 
        if(argumentsInContainer[i].name === argument.toLowerCase()){  isAlreadyInList = true } 
    }
    if(argumentsInContainer.length === 0){ createAndDisplayArgument(e, argument) } 
    else if (!isAlreadyInList){ createAndDisplayArgument(e, argument) } 
    else { console.log("already in the list") }
}

// delete argument from the list and the DOM
function deleteArgument(e){
    const argument = e.target.parentElement.children[0].innerText.toLowerCase();
    const index = argumentsInContainer.indexOf(argument);
    argumentsInContainer.splice(index, 1);
    return e.target.parentElement.remove();
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


// === DISPLAYS ===

// display all options in the DOM
function checkAndDisplay(){
    if(argumentsInContainer.length > 0){
        searchFromArgumentsAndFoundRecipes(argumentsInContainer, lastingRecipes);
        if(lastingRecipes.length === 0){ return displayNoRecipeFound() }
        return displayRecipesCards(lastingRecipes);
    }    
    if(lastingRecipes.length === 0){ return displayNoRecipeFound() }
    displayRecipesCards(lastingRecipes);
}

// display all recipes in the DOM
function displayRecipesCards(givenRecipes) {
    // const recipes = await fetchServerData(server);  == in case of backend server
    const recipesCards = document.getElementById('recipes');
    recipesCards.innerHTML = "";
    givenRecipes.forEach(recipe => {
        const cardModel = new CreateRecipeCard(recipe);
        const card = cardModel.render();
        recipesCards.appendChild(card);
    });
}

// display the HTML container a message to explain no recipe has been found
function displayNoRecipeFound(){
    recipesSection.innerHTML = "";
    const para = createThis('p', 'recipes__not-found', null, `Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.`);
    recipesSection.appendChild(para);
}

// display all options in the DOM
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


//=== OPTIONS ===

/**
 * It creates an option element with the given argument and the given background color
 * @param {*} type - the type of the argument
 * @returns An array of all the options
 */
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
    return optionArray;
}

/**
 * It will create the HTML element for the case no option have been found
 * @param {*} type - the type of the argument
 * @returns The HTML element
 */
function noOptionFound(type){
    const argumentContainer = translatedArgumentsContainer(type);
    const bgColor = translatedBg(type);
    argumentContainer.innerHTML = "";
    const para = createThis('p', 'search__advanced__not-found txt-white ' + bgColor, null, `Aucun résultat ne correspond à votre recherche.`);
    return argumentContainer.appendChild(para);
}

// It will launch the search function and the display function
function onContainerChange(){
    search();
    checkAndDisplay();
}