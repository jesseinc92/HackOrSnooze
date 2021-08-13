"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show new story form / add new story to page */

function navSubmitStory(evt) {
  console.debug('navSubmitStory', evt);
  hidePageComponents();
  $storyForm.show();
}

$navSubmit.on('click', navSubmitStory);

/** Show list of favorited stories */

function navShowFavorites(evt) {
  console.debug('navShowFavorites', evt);
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on('click', navShowFavorites);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
