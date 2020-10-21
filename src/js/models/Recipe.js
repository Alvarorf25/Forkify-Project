import axios from 'axios'; 
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    
    async getRecipe() {
        try {
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeNutrition=false`);
            this.title = res.data.title;
            this.author = res.data.sourceName;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.ingredients = (res.data.extendedIngredients).map(a => a.originalString);                    //syntax: let result = objArray.map(a => a.foo)  or let result = objArray.map(({ foo }) => foo) From an array of objects, extract value of a property as array
        } catch(error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    };

    // COOKING TIME METHOD    
    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    // SERVINGS METHOD
    calcServings() {
        this.servings = 4;
    };

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'tbs', 'tbspp', 'tsps', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds'];                   //declare plurals first and then singulars
        const unitsShort = ['tbsp', 'tbsp', 'tbsp', 'tbsp', 'tsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];                             //to add other units it is necessary to spread adding more elements, in this case "kg", "g"

        const newIngredients = this.ingredients.map(el => {                   //here input is the entire ingredients array [{'ingredient 1'}, {'ingredient 2'}, {...}...]
            // 1. Uniform units
            let ingredient = el.toLowerCase();                                //We use "let" because this variable is going to be mutated
            unitsLong.forEach((unit, i) => {                                  //unit: represent each unit of "unitsLong" and "i": represent the index of each unit from "unitsLong"
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit, and ingredient
            const arrIng = ingredient.split(' ');                             // some ingredients have a number (1 text) or a number, unit and text (3 cup text) or some don't have any number (text). To solve this first test if there is a unit on the string and if so where it is located  (example input: [('1 cup of chopped Beef' output),()...] ['1', 'cup', 'of', 'chopped', 'Beef']
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));                 //Then we have to find the index at which the unit is located so we use units.includes(el2) to ask if the element that is passing in is in the units array (example input: ['1', 'cup', 'of', 'chopped', 'Beef'] findIndex where an element of input array get match with array unitsShort and if so "true" if not "false" and return the index where it's true)

            let objIng;
            if (unitIndex > - 1) {         
                // There is a unit

                //Ex. 4 1/2 cups, arrCount is [4, 1/2]
                //Ex. 4 cups, arrCount is [4] 
                const arrCount = arrIng.slice(0, unitIndex)                    //it takes the array arrIng at the position 0 and end when it finds unitIndex that is the index position where units start (this entire thing is ti separate numbers from text of an ingredient example 4 1/2 cup of oil, arrCount = [4, 1/2]. Then text starts: 'cup of oil' because unitIndex is position [2] where is unit "cup")

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));                 //this in case we get for example 1-1/2 replacing - by +  1+                 
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));        // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') --> 4.5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')          // from unitIndex (the position of the arrIng where we found a unit cup, tbsp, tsp etc) transform into a string takin (' ') space between elements and show it in ingredient element
                };

            } else if (parseInt(arrIng[0], 10)) {                             //Assuming a integer number could be at the position 0. 1st argument is the string to convert and 2nd argument is called the radix. This is the base number used in mathematical systems. For our use, it should always be 10.
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')                     //the entire array without the first element because the first one is the number and if we don't specify the second argument it goes all the way to the end
                };

            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: '1',
                    unit: '',
                    ingredient                                                //means ingredient: ingredient
                };
            }

            return objIng;                                                    // map return something
        });
        this.ingredients = newIngredients;
    };

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);                      // ing.count = ing.count * (newServings / this.servings) (a rule of 3);
        });

        this.servings = newServings;                                         // to update this.servings after we click the buttons 'dec' or 'inc'
    };   
}; 