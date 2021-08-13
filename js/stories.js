"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  $favoritesList.hide();
  $userStoriesList.hide();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showFavorite = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteButton ? generateDeleteButton() : ''}
        ${showFavorite ? generateFavoriteButton(currentUser, story) : ''}
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** generates HTML for the delete button */

function generateDeleteButton() {
  return `<div class="delete-button">
            <i class="fas fa-trash"></i>
          </div>`;
}

/** generates HTML for the favorite button */

function generateFavoriteButton(user, story) {
  const isFavorite = user.isFavorite(story);
  const heartType = isFavorite ? 'fas' : 'far';

  return `<div class="favorite">
            <i class="${heartType} fa-heart"></i>
          </div>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of current user favorites, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug('putFavoritesOnPage');

  $favoritesList.empty();

  // loop through all of the favorited stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $favorite = generateStoryMarkup(story);
    $favoritesList.append($favorite);
  }

  $favoritesList.show();
}

/** Gets list of user-made stories, generates their HTML, and puts on page. */

function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage');

  $userStoriesList.empty();

  const userStories = currentUser.ownStories;

  //loop through all of the user stories and generate HTML for them
  for (let story of userStories) {
    const $userStory = generateStoryMarkup(story, true);
    $userStoriesList.append($userStory);
  }

  $userStoriesList.show();
}

/** Gets new story details from form and then puts on page. */

async function createNewStory() {
  console.debug('createNewStory');

  await storyList.addStory(currentUser, {
    title: $newStoryTitle.val(),
    author: $newStoryAuthor.val(),
    url: $newStoryUrl.val()
  });

  $storyForm.hide();
  putStoriesOnPage();
}

$storyForm.on('submit', createNewStory);

/** Gets storyId and username for favorite */

async function handleFavoriteButton(evt) {
  console.debug('handleFavoriteButton');
  // get the storyId from the li attribute
  const storyId = evt.target.closest('li').id;
  const story = storyList.stories.find(story => story.storyId === storyId);

  if(evt.target.classList.contains('fas')) {
    await currentUser.removeFavorite(currentUser, story);
    evt.target.classList.toggle("fas");
    evt.target.classList.toggle("far");
  } else {
    await currentUser.addFavorite(currentUser, story);
    evt.target.classList.toggle("far");
    evt.target.classList.toggle("fas");
  }
}

$body.on('click', '.favorite', handleFavoriteButton);

/** Gets story information and deletes it */

async function deleteStory(evt) {
  console.debug('deleteStory');

  // get the storyId from the li attribute
  const storyId = evt.target.closest('li').id;

  // update the story list and then re-display the user-story list
  await storyList.removeStory(currentUser, storyId);
  putUserStoriesOnPage();
}

$body.on('click', '.delete-button', deleteStory);