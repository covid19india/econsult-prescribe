Prescription pdf template generator module.
This module serves the index.html file, which has a multi-step form the client can fill.
Upon submit, it sends a POST request to the node.js server which generates a PDF.

Next steps:
1) Add a database where the server can store the upcoming request JSON.
2) Add a page where a user can enter the prescription ID to get the PDF prescription template.
3) Add a route in the server, that takes a prescription ID, gets the JSON from the database and generates a PDF to send it to the user.
4) Automatically fetch doctor and patient details from other sources (google docs, tawkto API).

To install the npm modules:
$ npm install

To start the server:
$ node app.js



