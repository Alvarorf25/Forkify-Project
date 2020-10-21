// Create an object with all the elements we select from our DOM

export const elements = {
    searchForm: document.querySelector('.search'),                     //It's the search button
    searchInput: document.querySelector('.search__field'),             //It's the search field
    searchRes: document.querySelector('.results'),                     //It's the results container
    searchResList: document.querySelector('.results__list'),           //It's the results list container (where it's going to be the Unorganized List <ul> list)
    searchResPages: document.querySelector('.results__pages'),         //It's the results pages container (to be selected to create the prev and next buttons)
    recipe: document.querySelector('.recipe'),                         //It's the recipe container
    shopping: document.querySelector('.shopping__list'),               //It's the shopping list container
    likesMenu: document.querySelector('.likes__field'),                //It's the likes field where all recipe liked will be
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'                       //it can't added to const "elements" because by the time the code elements runs loader is not yet on the page, so for that we add another central place to add "loader"
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);                     //to remove and element from the DOM we have to move up to the parent element "loader" then move down to remove a child and in order to do that we move up to the parent "loader"
};














/*
ADVICES:

- Get a central variable to have al de DOMs to get our code easy to maintain. Here it has a 
variable object for all the DOM.  
*/
