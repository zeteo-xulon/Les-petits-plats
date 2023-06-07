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
console.log(recipes);


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
    console.log(lastingRecipes)
    return checkAndDisplay();
})

searchIngredients.addEventListener('keyup', (e) => { e.preventDefault(); searchOptions(e) })
searchDevices.addEventListener('keyup', (e) => { e.preventDefault(); searchOptions(e) })
searchTools.addEventListener('keyup', (e) => { e.preventDefault(); searchOptions(e) })

document.addEventListener('DOMContentLoaded', () => { containerObserver.observe(argumentsContainer, config) })


displayRecipesCards(recipes);


// === SEARCH'S ===

/** function qui vérifie tous les conteneurs de recherche
 * Premierement ça va lancer une recherche avec le contenu de la barre de recherche principale
 * puis ça va vérifier dans le conteneur a argument son contenu, 
 * en lui passant le résultat de la recherche principale
 * cette fonction se lance à chaque fois qu'il y a un changement dans l'input de la barre de recherche
 * ou a chaque fois qu'un argument est ajouté
 * 
 * Case :
 * 1 - la barre de recherche a moins de 3 caractères, on envoi donc le tableau des recettes entier
 * 2 - la barre de recherche a 3 caractères ou plus, et on a des recettes trouvé, on envoi ce tableau
 * 3 - la barre de recherche a 3 caractères ou plus, et on a pas de recettes trouvé, on affiche le message "aucune recettes correspond a la recherche."
 * 
 * 4 - il n'y a pas d'arguments dans le conteneur, on affiche les résultat reçu par la barre de recherche principale
 * 5 - il y a des arguments dans le conteneur, on tri les recettes avec le tableau reçu, il reste des recettes, et on les affiches
 * 6 - il y a des arguments dans le conteneur, on tri les recettes avec le tableau reçu, il ne reste PAS de recettes. on affiche le message "aucune recettes correspond a la recherche."
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
 * 1. on filtre les recettes par nom de recette
* 2. on filtre les recettes par description de recette
* 3. on filtre les recettes par ingredients de recette
* 4. on affiche les recettes filtrées
* La méthode indexOf est utilisé car plus bas niveau et un peu plus rapide que includes
 * @param {String} value - ce qui est tapé dans l'input de la barre de recherche principale 
 * @returns le tableau selon la recherche ou celui par défaut.
 */
function searchFromMainSearchInput(value){
    if(value.length > 2){
        let search = value.toLowerCase();
        let recipesSet = new Set();
        for(let i = 0; i < recipes.length; i++){
            const recipeName = recipes[i].name.toLowerCase();
            const recipeIngredients = recipes[i].ingredients;
            const recipeDescription = recipes[i].description.toLowerCase();
            if(recipeName.indexOf(search) !== -1){ recipesSet.add(recipes[i]) }
            else if(recipeDescription.indexOf(search) !== -1){ recipesSet.add(recipes[i]) }
            else{
                for(let j=0; j < recipeIngredients.length; j++){
                const ingredientName = recipeIngredients[j].ingredient.toLowerCase();
                if(ingredientName.indexOf(search) !== -1){ recipesSet.add(recipes[i]) }
                } 
            }
        }
        let filtredRecipes = Array.from(recipesSet)
        return lastingRecipes = filtredRecipes;
    } 
    else { return lastingRecipes = recipes; }
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
function searchFromArgumentsAndFoundRecipes(argumentsList, recipes){
    let antiScopedSet = new Set();
    let sortedRecipes = recipes;

    for(let i = 0; i < argumentsList.length; i++){
        let argumentFromListName = argumentsList[i].name.toLowerCase();
  
            for(let j = 0; j < sortedRecipes.length; j++){
            let recipesSet = new Set();
            
                if( argumentsList[i].type === "ingredients"){
                    for(let k = 0; k < sortedRecipes[j].ingredients.length; k++){
                        let recipeArgumentName = sortedRecipes[j].ingredients[k].ingredient.toLowerCase();
                        if(recipeArgumentName === argumentFromListName){ recipesSet.add(sortedRecipes[j]) }
                    }
                }
                else if( argumentsList[i].type === "appliance"){
                        let recipeArgumentName = sortedRecipes[j].appliance.toLowerCase();
                        if(recipeArgumentName === argumentFromListName){ recipesSet.add(sortedRecipes[j]) }
                }
                else if( argumentsList[i].type === "ustensils"){
                    for(let k = 0; k < sortedRecipes[j].ustensils.length; k++){
                        let recipeArgumentName = sortedRecipes[j].ustensils[k].toLowerCase();
                        if(recipeArgumentName === argumentFromListName){ recipesSet.add(sortedRecipes[j]) }
                    }
                }
                else{ console.log("this is not a valid arguments type.") }
                recipesSet.forEach(recipe => antiScopedSet.add(recipe) )
            } 
        
        sortedRecipes = Array.from(antiScopedSet);
        antiScopedSet = new Set();
    }
    
    lastingRecipes = sortedRecipes;
    console.log( lastingRecipes)
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

// d'abord créer un tableau vide, puis aller checker le conteneur des arguments.
// S'il y a des arguments, alors on les ajoute au tableau en spécifiant le type d'argument et l'argument lui-même
function getAllArguments(){
    let allArguments = new Set();
    const argumentsSelected = document.querySelectorAll('.argument');
    const thereIsArguments = argumentsSelected[0] == undefined ? false : true;
    if(thereIsArguments){
        for(let argument of argumentsSelected){
            const argumentType = argument.classList[3];
            const type = translatedArgument(argumentType);
            const name = argument.innerText.toLowerCase();
            allArguments.add({type, name});
        }
        argumentsInContainer = Array.from(allArguments);
    }
}

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