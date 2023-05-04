/**
 * create an element with a specified argument received
 * @param {string} elementType - type of element to create
 * @param {string} className - string of class to add to the element
 * @param {string} id - id to add to the element
 * @param {string} text - text to add to the element
 * @returns {object} element - DOM element created
 * example :
 * <div class="search__advanced__input" id="searchIngredientsInput"></div>
 */
export function createThis(elementType, className, id, text){
    const listOfClass = createClassArray(className)
    const element = document.createElement(elementType);
    className ? element.classList.add(...listOfClass) : null;
    id ? element.id = id : null;
    text ? element.innerText = text : null;
    return element;
}

/**
 * create an input with a specified argument received
 * @param {string} type - type of input
 * @param {string} className - string of class to add to the input
 * @param {string} id - id to add to the input
 * @param {string} placeholder - placeholder to add to the input
 * @returns {object} input - DOM input created
 * example :
 * <input
 * type="search"
 * class="search__advanced__input"
 * id="searchIngredientsInput"
 * placeholder="veuillez entrer un ingrédients"
 * >
 */
export function createThisInput(type, className, id, placeholder){
    const input = document.createElement('input');
    const listOfClass = createClassArray(className);
    type ? input.type = type : null;
    className ? input.classList.add(...listOfClass) : null;
    id ? input.id = id : null;
    placeholder ? input.placeholder = placeholder : null;
    return input;
}

/**
 * create an image with a specified argument received
 * @param {string} text - text to add to the button
 * @param {string} className - string of class to add to the button
 * @param {string} id - id to add to the button
 * @returns {object} image - image DOM element created
 * example :
 * <img 
 * src="./assets/chevron_white.png" 
 * alt="flèche vers le bas, ouvrir la recherche" 
 * class="arrow arrow-down" 
 * id="searchIngredientsArrow" 
 * >
 */
export function createImage(source, alt, className, id){
    const listOfClass = createClassArray(className);
    const img = document.createElement('img');
    img.src = source;
    img.alt = alt;
    className ? img.classList.add(...listOfClass) : null;
    id ? img.id = id : null ;
    return img;
}

/**
 * create a list of class from a string of class
 * @param {string} className - string of class to add to the element
 * @returns {array} listOfClass - array of class
 * example :
 * className = "btn btn-primary"
 * listOfClass = ["btn", "btn-primary"]
 */
function createClassArray(className){
    if(className === null){ return null }
    const listOfClass = className.split(' ');
    return listOfClass;
}


/**
 * create a recipe card from a recipe model and return it
 * @param {object} recipe - recipe model
 * @returns {object} card - recipe card DOM element created
 * 
 * recipe example model :
{
    "id": 1,
    "name" : "Limonade de Coco",
    "servings" : 1,
    "ingredients": [
        { "ingredient" : "Lait de coco", "quantity" : 400, "unit" : "ml" },
        { "ingredient" : "Jus de citron", "quantity" : 2 },
        { "ingredient" : "Crème de coco", "quantity" : 2, "unit" : "cuillères à soupe" },
        { "ingredient" : "Sucre", "quantity" : 30, "unit" : "grammes" },
        { "ingredient": "Glaçons" }
    ],
    "time": 10,
    "description": "Mettre les glaçons à votre goût dans le blender, ajouter le lait, la crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la consistence désirée",
    "appliance": "Blender",
    "ustensils": ["cuillère à Soupe", "verres", "presse citron" ]
},

 * HTML model :
 * 
    <article class="recipe__card card">
        <div class="bd-placeholder-img card-img-top"></div>
        <aside class="recipe__text">
            <div class="recipe__top-text">
                <h2 class="card-title">Card title</h2>
                <p class="card__cooking-time">
                    <span class="clock-icon__container">
                        <img src="./assets/clock_icon.png" class="clock-icon" alt="clock icon">
                    </span>
                            
                    <span class="cooking-time" id="cookingTime">99</span>min
                </p>
            </div>
            <div class="recipe__down-text">
                <ul class="recipe__ingredient">
                    <li class="recipe__ingredient__item">
                        <span class="recipe__ingredient__name"></span> : 
                        <span class="recipe__quantity-unit"></span>
                    </li>
                </ul>
                <p class="recipe__description"></p>
            </div> 
        </aside>
    </article>
*
 */
export class CreateRecipeCard{
    constructor(recipe){
        // top level
        this.article = createThis('article', 'recipe__card card');
        this.imageDiv = createThis('div', 'bd-placeholder-img card-img-top');
        this.aside = createThis('aside', 'recipe__text');
        // top text part
        this.topText = createThis('div', 'recipe__top-text');
        this.title = createThis('h2', 'card-title');
        this.title.innerText = recipe.name;
        this.cookingTime = createThis('p', 'card__cooking-time');
        this.clockIconContainer = createThis('span', 'clock-icon__container');
        this.clockIcon = createImage('./assets/clock_icon.png', 'clock icon', 'clock-icon');
        this.cookingTimeSpan = createThis('span', 'cooking-time');
        this.cookingTimeSpan.innerText = " " + recipe.time + " min";
        // down text part
        this.downText = createThis('div', 'recipe__down-text');
        this.ingredientList = new CreateIngredientList(recipe.ingredients);
        this.finishedIngredientList = this.ingredientList.render();
        this.description = createThis('p', 'recipe__description');
        // integration to DOM
        this.description.innerText = recipe.description;
        this.aside.append(this.topText, this.downText);
        this.topText.append(this.title, this.cookingTime);
        this.cookingTime.append(this.clockIconContainer, this.cookingTimeSpan);
        this.clockIconContainer.append(this.clockIcon);
        this.downText.append(this.finishedIngredientList, this.description);
        this.article.append(this.imageDiv, this.aside);
    }
    render(){
        return this.article;
    }
}

/**
 * create an html list of ingredients from a recipe object
 * @param {array} ingredients - array of ingredients
 * @returns {html} ul - html list of ingredients
 */
export class CreateIngredientList{
    constructor(ingredients){
        this.ingredients = ingredients;
        this.ingredientList = this.ingredients.map(item => {
            this.li = createThis('li', 'recipe__ingredient__item');
            this.ingredientName = createThis('span', 'recipe__ingredient__name');
            this.ingredientName.innerText = item.ingredient + (item.quantity ? " : " : "");
            this.ingredientQuantityAndUnit = (item.quantity ? item.quantity : null) + (item.unit ? theGoodUnit(item.unit) : null);
            this.ingredientName ? this.li.append(this.ingredientName) : null;
            this.ingredientQuantityAndUnit ? this.li.append(this.ingredientQuantityAndUnit) : null;
            return this.li;
        });
    }
    render(){
        const ul = createThis('ul', 'recipe__ingredient');
        this.ingredientList.forEach(li => { ul.appendChild(li) });
        return ul;
    }
}

/**
 * Verify the unit and return a version of the unit that follow the figma model
 * @param {string} unit - the unit to verify
 * @returns {string} the unit that follow the figma model
 * @example
 * theGoodUnit("grammes") // return "g"
 */ 
function theGoodUnit(unit){
    switch(unit){
        case "grammes" : return "g";
        case "cuillères à soupe" : return " cuillères";
        case "ml" : return "ml";
        case null : return null;
        default : return " "+ unit;
    }
}