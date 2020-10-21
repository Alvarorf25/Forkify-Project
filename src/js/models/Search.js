import axios from 'axios';                                     //importing a axios package. For packages we just specify the name not the path. for AJAX call http requests we're using axios instead of fetch because axios works for all browsers
import { key } from '../config';                               //  ../ means one folder above

export default class Search {
    constructor(query) {
        this.query = query;
    }

    
    //ASYNC METHOD
    async getResults() {        
        try {
            const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}&addRecipeInformation=true&number=30`);      // This is going to return a promise (like when we use fetch) so for that it has to be stored in a variable
            this.result = res.data.results;                  //all the data about the search are encapsulated inside of the object (this.result), so the new object we create for each instance
        } catch(error) {
            alert(error);
        }    
    }    
};







