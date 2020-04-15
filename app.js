let express = require("express");
let app = express();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var bodyParser = require('body-parser')

let footer = "<p style=\"color:#777777; text-align:center; font-size:7pt\">\
Disclaimer: This prescription is based on the information provided by you in an online consultation and not on any physical verification. \
Visit a doctor in case of emergency. This prescription is valid in India only. \
<p>" 

app.use(express.json());
app.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

app.use("/assets",  express.static(__dirname + '/public/assets'));

app.get('/', function (req, res) {
      res.sendFile(__dirname + '/public/index.html');
});

app.post("/generateReport", (req, res) => {
    var details = req.body;
    ejs.renderFile(path.join(__dirname, './views/', "prescription-template.ejs"), {details: details}, (err, data) => {
    if (err) {
	  console.log(err);
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

