export function createThis(elementType, className, id){
    const listOfClass = createClassArray(className)
    const element = document.createElement(elementType);
    className ? element.classList.add(...listOfClass) : null;
    id ? element.id = id : null;
    return element;
}

export function createThisInput(type, className, id, placeholder){
    const input = document.createElement('input');
    const listOfClass = createClassArray(className);
    type ? input.type = type : null;
    className ? input.classList.add(...listOfClass) : null;
    id ? input.id = id : null;
    placeholder ? input.placeholder = placeholder : null;
    return input;
}
export function createImage(source, alt, className, id){
    const listOfClass = createClassArray(className);
    const img = document.createElement('img');
    img.src = source;
    img.alt = alt;
    className ? img.classList.add(...listOfClass) : null;
    id ? img.id = id : null ;
    return img;
}
function createClassArray(className){
    if(className === null){ return null }
    const listOfClass = className.split(' ');
    return listOfClass;
}