var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

User = require('./schemas/UserSchema');
Contact = require('./schemas/ContactSchema');

const mongo = require("./mongo.json");
const url = mongo.ConnectionString;

/* GET contact manager page for logged in user. */
router.get('/', function(req, res, next) {
	mongoose.connect(url, (err) => {
		if(err) {
			mongoose.disconnect();
			throw err;
		}
	
		Contact.find({
			daddy: req.session.uid
		}, (err, contacts) => {
            mongoose.disconnect();

            if(err) {
                throw err;
            }

            if(!contacts) {
			    req.session.uid = "";
			    req.session.hasError = true;
			    req.session.errorMessage = "There was a problem grabbing your contacts, please login again.";
			    res.redirect("/");
            }

            else {
                res.render('contacts', {
                    name: req.session.displayName,
                    contacts: contacts
                });
            }
		});
	});
});

// remove session data and redirect to login page
router.get('/logout', (req, res, next) => {
	req.session.destroy();
	res.redirect("/");
});

router.get('/search', (req, res, next) => {
	var search = req.query.search;

	mongoose.connect(url, (err) => {
		if (err) throw err;


		User.find({
			_id: req.session.uid,
			$text: {$search: search}
		}).exec((err, docs) => {
			mongoose.disconnect();

			if (err) throw err;
			if (!docs) res.status(500).end();

			res.status(200).send(docs);
		});
	});
});

router.post('/add', (req, res, next) => {
	// TODO: add contact from request body
	// mongoose.connect(url, (err) => {
	// 	// User.findOne({
	// 	// 	_id: "5c58a9e5c9d4070c2147830a"
	// 	// }, (err, user) => {
	// 	var contact = Contact({
	// 		daddy: "5c58a9e5c9d4070c2147830a",
	// 		firstName: "Sean",
	// 		lastName: "Zoom",
	// 		phoneNumber: "4732683424",
	// 		email: "mail@mail.com",
	// 		addressLineOne: "String st",
	// 		addressLineTwo: "apartment 31",
	// 		city: "orlando",
	// 		state: "String",
	// 		zipcode: "23424"
	// 	});
	// 	contact.save((err) =>{
	// 		mongoose.disconnect();
	//
	// 	});
	// });
});

module.exports = router;
