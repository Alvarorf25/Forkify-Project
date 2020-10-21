import uniqid from 'uniqid';

export default class List {
    constructor() {                                                   //this time around it's not necessary to pass anything because when initialice a new list just that we have an item set to an empty array
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),                                             //already installed the uniqid npm package so it will create a uniq identifier of each ofthe items, based on the smal library
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {                                                  //based on the passing "id" we want to find te position of the item that matches this id
        const index = this.items.findIndex(el => el.id === id);       //from the this.items array find the index of the element that matches with the passing id in order to know what item is deleted      
        // Difference betweend "splice" and "slice"
        //[2, 4, 8] splice(1, 2) --> returns [4, 8], original array is [2] mutate the array
        //[2, 4, 8] slice(1, 2) --> returns 4, original array is [2, 4, 8] NO mutate the array and no takes the 8 because it doesn't include the end
        this.items.splice(index, 1);                                   //remove item on the index (the position where the item is located) position and remove 1 element

    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;         //find the element from the array this.items that matches with the passing id and the count of that element will be equal to the newCount. Find returns the element itself
    }    
};