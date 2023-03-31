
const username = "username";

fetch(`http://localhost:5000/showUserTweets/${username}`)
  .then(response => response.json())
  .then(data => {
    
    console.log(data);
   
  })
  .catch(error => {
    console.error(error);
    
  });
