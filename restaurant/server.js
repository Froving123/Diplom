const express = require('express');
const server = express();

try {
  server.listen(5000, () => {
    console.log('Server started on port 5000');
  });
} catch (err) {
  console.error('Error starting server:', err);
}
