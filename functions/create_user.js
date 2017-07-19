const admin = require('firebase-admin');

module.exports = function(req, res) {
  // Verify user provide a phone number
  if (!req.body.phone) {
    return res.status(422).send({ error: 'Bad Input'}); //422 faulty input
  }

  // Format the phone number to remove dashes and parens
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  // Create a new user account with phone number
  // the id of the user is their phone number
  admin.auth().createUser({ uid: phone })
    .then(user => res.send(user))
    .catch(err =>res.status(422).send({ error: err}));

  // Respond to use request saying account was made
}
