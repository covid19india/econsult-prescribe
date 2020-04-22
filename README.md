Prescription pdf template generator module.
This module has two directories:
1) public/ 
	This directory contains the client side form that takes input from user and makes an HTTP call to the cloud function that generates the PDF prescription.

2) functions/
	This director contains the cloud function code that receives the request from the client and sends a PDF in response.
	
## Running Locally
```shell script
# Clone the Repo
git clone https://github.com/covid19india/econsult-prescribe.git

# Install the dependencies
npm --prefix ./functions install ./functions

# Start the cloud functions api
npm --prefix ./functions run serve

# Start the Client
npx http-server ./public

Note: You'll have to update the XHR request in /public/assets/js/scripts.js to use dev_url instead of prod_url. 
```
Navigate to [http://localhost:8080/](http://localhost:8080/) in the browser
