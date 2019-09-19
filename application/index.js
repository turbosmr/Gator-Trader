const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('SFSU<br>CSC 648<br>Software Engineering<br>Fall 2019<br>Section 01<br>Team 03<br><br>Coming soon...');
});
app.listen(3000, () => console.log('Server running on port 3000'));
