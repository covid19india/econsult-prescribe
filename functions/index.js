// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

let express = require("express");
let app = express();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

app.use(express.json());

let footer = "<p style=\"color:#777777; text-align:center; font-size:7pt\">\
Disclaimer: This prescription is based on the information provided by you in an online consultation and not on any physical verification. \
Visit a doctor in case of emergency. This prescription is valid in India only. \
<p>" 


app.post("/generateReport", (req, res) => {
    var details = req.body;
    ejs.renderFile(path.join(__dirname, './views/', "prescription-template.ejs"), {details: details}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
        var file_name = "prescription-" + details.prescription.id + ".pdf";
        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": {
                "height": "10mm",
            },
            "footer": {
                "height": "25mm",
                "contents": footer
            },
        };
        pdf.create(data, options).toStream(function(err, stream) {
            if (err) {
              res.json({
                message: 'Sorry, we were unable to generate pdf',
              });
            }
	    res.setHeader('Content-type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename='+file_name);
        stream.pipe(res); // your response
        });
    }
});
})



const api = functions.https.onRequest(app);

module.exports = {api}

