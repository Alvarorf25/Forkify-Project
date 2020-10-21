//VIEW MODULE

import { elements } from './base';                                    //Import all DOMs from the base file

export const getInput = () => elements.searchInput.value;             //because this is an arrow function of 1 line it has an implicit return, so we don't need to write the "return" keyword and we need the value from the input users are going to type

export const clearInput = () => {
    elements.searchInput.value = '';                                  //clear the search field and we use curly braces beacuse otherwhise it has an impicit return after result of doing this, so here we are not returning anything
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';                            //to clear the list results when we type another input on the input field. ".innerHTML" is used to remove an html inside of its element
    elements.searchResPages.innerHTML = '';                           //to clear buttons every time we go to another page, so only the buttons are created go to display no to clone themselfs
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));               //Array.from transform the noteList getting from document.querySelectorALl()
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');       //it means: select all links based on attributes (CSS [attribute=value] Selector) .results__link[href] means that select all the href in the results__link
};

/* 
    //Explain each iteration with: 'Pasta with tomato and spinach'
    
  1.  accu: 0 / accu + cur.length = 5 / newTitle = ['Pasta']                     "pasta" has 5 characters
  2.  accu: 5 / accu + cur.lenght = 9 / newTitle = ['Pasta', 'with']             "with" has 4 characters
  3.  accu: 9 / accu + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']  "tomato" has 6 characters
  4.  accu: 15/ accu + cur.length = 18 / newTitle = ['and']                      "and" has 3 characters

  
*/
export const limintRecipeTitle = (title, limit = 17) => {                    
    const newTitle = [];
    if  (title.length > limit) {
        title.split(' ').reduce((accu, cur) => {                      //we first use split to split the title in each space taking the string and becoming it into an array and then we have the new array to apply reduce to accumulate all the elements of that array into a string until we pass the limit of lenght (defaul value 17 in this case). "The split() method is used to split a string into an array of substrings, and returns the new array."
            if (accu + cur.length <= limit) {                         //cur.length make referenc to the current word length
                newTitle.push(cur);                                   // if the conditions is <= limit then the word will be push into the newTitle array 
            }                                                         
            return accu + cur.length;                                 //value returned in each iteration to update
        }, 0);                                                        //inint value of the accumulator
        //return the result
        return `${newTitle.join(' ')} ...`;                           //join makes the opposite of split. it takes the array and join the elements in a string separating each word because of this .join(' ')                           
    }
    return title;
};

const renderRecipe = recipe => {                                      //This function is for 1 recipe
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.id}">
                <figure class="results__fig">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limintRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.sourceName}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type = 'prev' or 'next'                                                     //For renderButtons we have to create the same button so it better makes a function to create them and use them in renderButtons so "page" represent the page number and "type" the way button goes(prev or next)
const createButton = (page, type) => `                                         
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>    
`;                                        



const renderButtons = (page, numResults, resPerPage) => {                     // page, numResults(result number of the search), resPerPage (amount of results we get to display per page)
    const pages = Math.ceil(numResults / resPerPage);                         //Math.ceil is a function Math to round the number to the next ceiling so in case in the future the API gives 45 pages so 45/10 = 4.5 and we don't want 5 pages go around so Math.ceil helps if it gives for example 4.1 round the result to the next ceiling 5

    let button;                                                               //Declaring button as a let variable out of the block scope of the conditional in order to get access to it each time the code inside the conditional need it
    if (page === 1 && pages > 1) {                                            //this part && pages > 1 is in case we have just 1 page so that way it's not necessary to display a button to go to a next page
        // Only button to go to the next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {                                  //this part && pages > 1 is the same condition so in case the result of the new search has just a page, so it's not necessary to display a button to go to a next page
        // Only button to go to the prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

//Display 10 results for page and render pagination buttons
export const renderResults = (recipes, page = 1, resPerPage = 10) => {        //Function that is looping through the input array that will contain all the recipe's data, set the page number 1 as defaul for pagination and set the result number(10) for page as default too. 
    
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;                                            //example page resPerPage = 1 * 10 = 10 but the end does not include the last number it is going to be 9 so from 0 to 9 it has 10 numbers, that's because "slice()" the "end" argument does not include the end ex: if is 0 to 10 it's really from 0 to 9
    recipes.slice(start, end).forEach(renderRecipe);                          // instead of doing this: ""recipes.forEach(el => renderRecipe(el));"" is like this: recipes.forEach(renderRecipe); because that way we automatycally pass the current element into this function. In this case the input (recipe) will be "this.result" that contains all the data recipe from the API and show the element the way that is define in "renderRecipe"

    // Render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};







/*
ADVICES
- Get one function for each separate task
*/





