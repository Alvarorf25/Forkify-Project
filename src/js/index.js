//CONTROLLER MODULE

import Search from './models/Search';                                                //Here I import the class Search from this path './models/Search' 
import Recipe from './models/Recipe';                                                //Import the default class Recipe     
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';                                    //Import all of the function stored in the "searchView" file because we already know we're going to need all the function of the view module in the controller module
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';                  //Import all DOMs from the base file


/** GLOBAL STATE OF THE APP *        
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 Note: All this data will be stored in one central variable 
 "state" which we can have access throughout controller.
*/
const state = {};
//window.state = state;                                                              //To make all of the starte available to us in the global window objet to for testing purposes

/*******************
* SEARCH CONTROLLER
*/

const controlSearch = async () => {                                                  //async function that will be called whatever the form is submitted
    
    // 1. Get query from view 
    const query = searchView.getInput();   
    
    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);                                            //state.search is where all the object node lists (new instances based on the Search class) will be

        // 3. Prepare UI for results
        searchView.clearInput();                                                     //calling the method to clean the input field
        searchView.clearResults();                                                   //calling the method to clear the result list when we search for another input
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();                                             //before rendering we have to await for the results otherwise we can't render anything because probably our render function will happen before the results from the API comes, for that reason it needs "await" and the function needs to be an async one
    
            // 5. Render results on UI after gets the results from the API               //For this we "await" the promise in step 4   
            clearLoader();                                                               //calling the method to clear the loader
            searchView.renderResults(state.search.result);                               //Calling the renderResults function we the result stored in "this.result" from the Search.js and make a loop to all the results(10 arrays recipes in this case) to give me the data (recipe)
        
        } catch(error) {
            alert('Something went wrong with the search...');
            clearLoader(); 
        }
    }
};

elements.searchForm.addEventListener('submit', e => {         
    e.preventDefault();                                                              //prevent the page reloads when we click the search button
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {                             //Here is applied the concept of event delegation which consists in attach an event listenet in an element that is already there and the try to figure it out where the click happend. In this case the element that is there when we load the page is "results__pages" defined into this variable "searchResPages" 
    const btn = e.target.closest('.btn-inline');                                     //Using the closest() method to specify wherever we click into the button take the entire button and not the other elements inside of it like the icon svg or the text "Page number" so for that btn-inline is the entire button. The reason to use closest is because we know exactly where is the element to click
    
    if (btn) {                                                                       //e: represent our click evente and .target: is where the event happen
        const goToPage = parseInt(btn.dataset.goto, 10);                             //using the data set to save this in data-goto on the html segment from searchView "createButton" for button's functionality. parseInt to convert the string into a number an based on 10 because is from 0 to 9
        searchView.clearResults(); 
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});


/*******************
* RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    // Get the id from the Url 
    const id = window.location.hash.replace('#', '');                                 //window.location: is the entire Url if we use the "hash" property on it that's then just the hash. Next it comes .replace('#', ''); to replace the hash for nothing because all we need is the id number
    
    if (id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create a new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();                                           //"await" for getting the data asynchronously because is data we get from the Url and we want the rest of the code is only executed after we get back the with the data
            state.recipe.parseIngredients();

            // Calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));          //to get the likes if the recipa has after reload the page
                    
        } catch(error) {            
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*******************
* LIST CONTROLLER
*/

const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);           //because of ingredients is an array so looping this array we're going to get for each element of ingredients we're going to add an element to our list. Then we save the result in a const because our addItem method returns something
        listView.renderItem(item);                                                   //to render the item as the way we defined on listView
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {                                   //where do we want to add the event? at the shopping__list section that is define in base.js as "shopping"
    const id = e.target.closest('.shopping__item').dataset.itemid;                   //Here we use the closest method because we need to specifically find the element which contains the "id" we want to read, so in this case the shopping__item is the closest elemen which contains the id (<li class="shopping__item" data-itemid=${item.id}>) /listView.js/ and the closest element where the click happens

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {                         //to update the arrow buttons of the shopping list we select .shoppinh__count-value and in this case no select any child because it doesn't have any   
        const val = parseFloat(e.target.value, 10);                                  //Here we need to read de value of the input when we click the arrow buttons on the shopping__list for that we use the current element: "e", because it's a click event we have to specify where was the click so ".target"(e.target is the element that was clicked), and the de value of the current element ".value" and parseFloat to get a number instead of a string value
        state.list.updateCount(id, val);                                             //then apply the updateCount method passing the "id" of the element generated from the "uniqid npm package" and the current value to update the value in the UI
    }
});


/*******************
* LIKE CONTROLLER
*/   

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {

        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);                                               //calling the function renderLike with the newLike that we get in (// Add like to the state)
        
     
    // User HAS liked current recipe    
    } else {

        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);                                             //callig the function deleteLike with the currentID we get up in const "currentID = state.recipe.id;"
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();                                                       //Create a new like but in the window object 
    
    // Restore likes
    state.likes.readStorage();                                                       //Getting our likes back when the page loads 
    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));                   //state.likes.likes the secon likes refers to the array this."likes" and for each element (named "like") render the element 
});

// Handling RECIPE button clicks                                                     // All the event handler that happen on recipe will be handled here
elements.recipe.addEventListener('click', e => {                                     // we use event delegation here because by the tambien the page is loaded the buttons are not there yet. Another thing is we can't use closest like on searchResPages because we have multiple buttons around the increase and decrease buttons
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {                        // match with .btn-decrease or .btn-decrease * that means any child of btn-decrease
        
        // Decrease button is clicked
        if (state.recipe.servings > 1) {                                             // to avoid a NaN result on the amount of each ingredient only decrease when the amount of servings is greater than 1
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {    
        
        // Increase button is click
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredient to shopping list
        controlList();

    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }    
});











