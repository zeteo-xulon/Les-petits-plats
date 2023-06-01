
// const server = "./data/recipes.js"; == in case of backend server


// in case of backend server
// ==========================
// async function fetchServerData(server){
//     const response = await fetch(server);
//     const data = await response;
//     return data;
// }




// for(let j = 0; j < argumentsList.length; j++){
//     const argumentType = argumentsList[j].type;
//     const argument = argumentsList[j].name;
    
//     if(argumentType === "ingredients"){
//         console.log(recipes[i])
//         const recipeArgument = recipes[i].ingredients[j].ingredient.toLowerCase()
//         if(argument === recipeArgument){ recipesSet.add(recipes[i]) }
//     }

//     if(argumentType === "appliance"){
//         const recipeArgument = recipes[i].appliance.toLowerCase()
//         if(argument === recipeArgument){ recipesSet.add(recipes[i]) }
//     }

//     if(argumentType === "ustensils"){
//         const recipeArgument = recipes[i].ustensils[j].toLowerCase()
//         if(argument === recipeArgument){ recipesSet.add(recipes[i]) }
//     }
// }