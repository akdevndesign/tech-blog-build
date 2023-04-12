const router = require("express").Router();
const withAuth = require("../utils/auth");
const { Comment, Post, User } = require("../Models");

// get all posts for homepage
router.get('/', async (req, res) => {
  try {
    // we need to get all Posts and include the User for each (change lines 8 and 9)
    const postData = await Post.findAll({
      include: [{ model: User }],
    });
    // serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));
    // we should render all the posts here
    const sessionData = {
      isLoggedIn: req.session.loggedIn,
      username: req.session.username,
    };
    res.render('home', { posts, sessionData });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET STINGLE POST ------TODO Render clicked blog post on page. 
router.get('/post/:id', async (req, res) => {
  try {
      const postData = await Post.findOne({
        where: {
          post_id:req.params.id,
        }
      });
      const userPost = postData ? postData.get({ plain: true }) : null;
      console.log(`user post: `, userPost)
      const sessionData = {
        isLoggedIn: req.session.loggedIn,
        username: req.session.username,
      };
      res.render('blogpost', { userPost, sessionData });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// // giving you the login and signup route pieces below, no changes needed.
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
