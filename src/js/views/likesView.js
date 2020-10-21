import { elements } from './base';
import { limintRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);    //from btn class .recipe__love we want to change from <use element (where the icon is located) ".setAtribute()" href as first argument and then the value img/icons.svg#${iconString}` the const iconString defined
    
    //icons.svg#icon-heart-outlined

};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';         //visibility is a property
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limintRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}n</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;    //here we used css selectorbut in this case we want to select just the href that have likes so just all the ".like__link" elements and then the parentElement because without that we just select <a></a> element so we need to delete the hole <li> element
    if (el) el.parentElement.removeChild(el);
};