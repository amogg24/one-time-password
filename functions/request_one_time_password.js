const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  // Verify user provide a phone number
  if (!req.body.phone) {
    return res.status(422).send({ error: 'Must provide phone number'}); //422 faulty input
  }

  // Convert number to string and take out any non digits
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));

      twilio.messages.create({
        body: 'Your code is ' + code,
        to: phone,
        from: +13214246718
      }, (err) => {
        if (err) { return res.status(422).send(err); }

        admin.database().ref('users/' + phone)
          .update({ code: code, codeValid: true }, () => {
            res.send({ success: true });
          });
      })
    })
    .catch((err) => {
      res.status(422).send({ error: err});
  });
}
