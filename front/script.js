// Get references to the HTML elements we need to interact with
const addUserForm = document.querySelector('#add-user-form');
const addTweetForm = document.querySelector('#add-tweet-form');
const showUserTweetsForm = document.querySelector('#show-user-tweets-form');
const showTopicForm = document.querySelector('#show-topic-form');
const userSelect = document.querySelector('#user');
const showUserTweetsUserSelect = document.querySelector('#show-user-tweets-user');
const showTopicNameInput = document.querySelector('#show-topic-name');
const tweetList = document.querySelector('#tweet-list');

// When the user submits the add user form, send an API request to add the user to the database
addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(addUserForm);
  const username = formData.get('username');

  const response = await fetch(`/addUser/${username}`, {
    method: 'POST'
  });

  const result = await response.text();
  console.log(result);
});

// When the user submits the add tweet form, send an API request to add the tweet to the database
addTweetForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(addTweetForm);
  const user = userSelect.value;
  const text = formData.get('text');
  const topic = formData.get('topic');

  const response = await fetch(`/addTweet/${user}`, {
    method: 'POST',
    body: JSON.stringify({ text, topic }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const result = await response.text();
  console.log(result);
});

// When the user submits the show user tweets form, send an API request to get the user's tweets from the database
showUserTweetsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const user = showUserTweetsUserSelect.value;

  const response = await fetch(`/showUserTweets/${user}`);

  const tweets = await response.json();

  tweetList.innerHTML = '';

  for (const tweet of tweets) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="tweet">
        <div class="tweet-author">${tweet.author}</div>
        <div class="tweet-text">${tweet.text}</div>
        <div class="tweet-topic">${tweet.topic}</div>
        <div class="tweet-timestamp">${new Date(tweet.timestamp * 1000).toLocaleString()}</div>
      </div>
    `;
    tweetList.appendChild(listItem);
  }
});

// When the user submits the show topic form, send an API request to get the tweets for the topic from the database
showTopicForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const topic = showTopicNameInput.value;

  const response = await fetch(`/showTopic/${topic}`);

  const tweets = await response.json();

  tweetList.innerHTML = '';

  for (const tweet of tweets) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="tweet">
        <div class="tweet-author">${tweet.author}</div>
        <div class="tweet-text">${tweet.text}</div>
        <div class="tweet-topic">${tweet.topic}</div>
        <div class="tweet-timestamp">${new Date(tweet.timestamp * 1000).toLocaleString()}</div>
      </div>
    `;
    tweetList.appendChild(listItem);
  }
});

// On page load, populate the user select dropdown with the list of users from the database
window.addEventListener('load', async () => {
  const userForm = document.querySelector('#add-user-form');
  const tweetForm = document.querySelector('#add-tweet-form');
  const showUserTweetsForm = document.querySelector('#show-user-tweets-form');
  const showTopicForm = document.querySelector('#show-topic-form');
  const tweetList = document.querySelector('#tweet-list');

  // Helper function to create a new option element for a select element
  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  };

  // Populate the user select element in the add tweet form and show user tweets form
  const populateUserSelect = async () => {
    const userSelect = document.querySelectorAll('select[name="user"]');
    const response = await fetch('/users');
    const data = await response.json();

    userSelect.forEach(select => {
      select.innerHTML = '';
      select.append(createOption('', 'Select User'));
      data.forEach(user => {
        select.append(createOption(user.username, user.username));
      });
    });
  };

  // Handle adding a new user
  userForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const response = await fetch(`/users/${username}`, {
      method: 'POST'
    });

    if (response.ok) {
      alert(`User ${username} added successfully`);
      event.target.reset();
      await populateUserSelect();
    } else {
      alert(`Failed to add user ${username}`);
    }
  });

  // Handle adding a new tweet
  tweetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = event.target.elements.user.value;
    const text = event.target.elements.text.value;
    const topic = event.target.elements.topic.value;
    const response = await fetch(`/users/${user}/tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text: text,
        topic: topic
      })
    });

    if (response.ok) {
      alert(`Tweet added successfully`);
      event.target.reset();
    } else {
      alert(`Failed to add tweet`);
    }
  });

  // Handle showing user tweets
  showUserTweetsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = event.target.elements.user.value;
    const response = await fetch(`/users/${user}/tweets`);
    const data = await response.json();

    tweetList.innerHTML = '';
    data.forEach(tweet => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${tweet.author} (${new Date(tweet.timestamp * 1000).toLocaleString()})</h3>
        <p>${tweet.text}</p>
        <p><strong>Topic:</strong> ${tweet.topic}</p>
      `;
      tweetList.appendChild(li);
    });
  });

  // Handle showing tweets by topic
  showTopicForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const topic = event.target.elements.topic.value;
    const response = await fetch(`/topics/${topic}/tweets`);
    const data = await response.json();

    tweetList.innerHTML = '';
    data.forEach(tweet => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${tweet.author} (${new Date(tweet.timestamp * 1000)}))</h3>
        <p>${tweet.text}</p>
        `;
        tweetList.appendChild(li);
        }); 
  });
})
