export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };                              //Create an objetc with the input and then push that objet to this.likes
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }
    
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);              //from the this.likes array find the index of the element that matches with the passing id in order to know what like is deleted the same that it's done with list.js      
        this.likes.splice(index, 1);                                         //delete from index position element just 1 element
    
        // Persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;              //Again we have to find the index where the current element id matches with the id that we're passing, then test if it's diffent to -1 becuase if we can't find any item with the id that we passed in, then this will be "-1" and if it is the entire expresion turns false, which is what we want because it means that the recipe with the id that it was passed in is not liked, otherwise itis true so it is liked 
    }

    getNumLikes() {
        return this.likes.length;                                            //Returns the amount of likes
    } 

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));           //localStorage.setItem  will set the data to be storage at the local window avoiding lose the data when the page loads. First argument is the key and the second one have to be string to transform in this caseour array into a string: JSON.stringify(something to be transformed)
    }

    readStorage() {                                                          //To read our save data from the browser 
        const storage = JSON.parse(localStorage.getItem('likes'));           //Again we use JSON and then "parse()" to convert our data back into the structure that it was before because remember it was and array then it was transformed into a string with JSON.stringify in order to be storage in the browser and then we have to read our data getting back into the structura that it was
        
        // Restoring likes from the localStorage if there are likes
        if (storage) this.likes = storage;                                   // to test if there is a storage like in the localStorage
    }
};