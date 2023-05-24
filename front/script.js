window.addEventListener('load', async () => {
  const userForm = document.querySelector('#add-user-form');
  const tweetForm = document.querySelector('#add-tweet-form');
  const showUserTweetsForm = document.querySelector('#show-user-tweets-form');
  const showTopicForm = document.querySelector('#show-topic-form');
  const tweetList = document.querySelector('#tweet-list');
  const API_URL = 'http://localhost:5000'

  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  };

  const populateUserSelect = async () => {
    const userSelect = document.querySelectorAll('select[name="user"]');
    const response = await fetch(API_URL + '/users');
    const data = await response.json();

    userSelect.forEach(select => {
      select.innerHTML = '';
      select.append(createOption('', 'Select User'));
      data.forEach(user => {
        select.append(createOption(user.username, user.username));
      });
    });
  };

  //Adding a new user
  userForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;

    // Check if the user already exists
    const response = await fetch(API_URL + `/users/${username}`);
    if (!response.ok) {
      // User does not exist, create new user
      const response = await fetch(API_URL + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to create user: ${error}`);
        return;
      }
      console.log(`User ${username} created`);
    } else {
      console.log(`User ${username} already exists`);
    }

    // Add the user to the user dropdowns
    const option = document.createElement('option');
    option.text = username;
    option.value = username;

    const userDropdowns = document.querySelectorAll('select[name="user"]');
    userDropdowns.forEach(dropdown => {
      // Check if the user is already in the dropdown
      if (!Array.from(dropdown.options).some(opt => opt.value === username)) {
        dropdown.add(option);
      }
    });

    // Clear the form
    event.target.reset();
  });


  //Adding a new tweet
  tweetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = event.target.elements.user.value;
    const text = event.target.elements.text.value;
    const topic = event.target.elements.topic.value;
    const response = await fetch(API_URL + `/users/${user}/tweets`, {
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

  //Show user tweets
  showUserTweetsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = event.target.elements.user.value;
    const response = await fetch(API_URL + `/users/${user}/tweets`);
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

  //Show user's tweet
  showUserTweetsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const user = showUserTweetsUserSelect.value;

  const response = await fetch(API_URL + `/showUserTweets/${user}`);

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
  showTopicForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const topic = event.target.elements.topic.value;
    try {
      const response = await fetch(API_URL + `/topics/${topic}/tweets`);
      if (response.ok) {
        const data = await response.json();
        tweetList.innerHTML = '';
        data.forEach(tweet => {
          const li = document.createElement('li');
          li.innerHTML = `
            <h3>${tweet.author} (${new Date(tweet.timestamp * 1000).toLocaleString()})</h3>
            <p>${tweet.text}</p>
          `;
          tweetList.appendChild(li);
        });
      } else {
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  });

  await fetch(API_URL + '/').then(response => tweetList.innerHTML = response.json()).then(
      data => {

        tweetList.innerHTML = '';
        data.list.forEach(tweet => {
          const li = document.createElement('li');
          li.innerHTML = `
            <h3>${tweet.author} (${new Date(tweet.timestamp * 1000).toLocaleString()})</h3>
            <p>${tweet.text}</p>
          `;
          tweetList.appendChild(li);
        });
      }
  );
})
