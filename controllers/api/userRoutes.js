const router = require("express").Router();

const { User } = require("../../models");

router.post('/', (req, res) => {
  
   User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }).then(userData => {
       req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.loggedIn = true;
        req.session.name = userData.name;
        console.log(req.session.loggedIn);

        res.status(200).json(userData);
       })
    }).catch(err => {
    res.status(500).json(err);
  });
  });

  router.post('/login', async (req, res) => {

    const userData = await User.findOne({ where: { email: req.body.email } });
  
    if (!userData) {
      res.status(400).json({ message: "Incorrect email or password!" });
      return;
    }
  
    const Password = await userData.checkPassword(req.body.password);
  
    if (!Password) {
      res.status(400).json({ message: "Incorrect email or password!" });
      return;
    }
  
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      req.session.name = userData.name;
  
      res.json({user: userData, message: 'Welcome!' });
    });
  });

  router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
      req.session.destroy(() =>{
        res.status(204).end();
      });
    }else {
      res.status(404).end();
    }
  });

  module.exports = router;
  





