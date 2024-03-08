const fetch = require('node-fetch')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

var User = require('../models/User');

var usercontroller = require('../controllers/index');
var employeecontroller = require('../controllers/employee');
var agreementcontroller = require('../controllers/agreements');
var offercontroller = require('../controllers/offer');
var openservicecontroller = require('../controllers/openservice');
var providercontroller = require('../controllers/providers');
const { check, validationResult } = require('express-validator/check');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//offer table
router.get('/offers', (req, res) => 
{
  offercontroller.getroffers(req, res);
});

//bid table
router.get('/Agreementbids', (req, res) => 
{
  agreementcontroller.getagreementbidsforoffer(req, res);
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) =>  res.render('index', { title: 'Registartion'}));

router.get('/Masteragreement', ensureAuthenticated, function(req, res,){

  async function getagreements(req,res){
    //const posts = await fetch("https://provider-management-platform-server.onrender.com/agreements");
    const posts = await fetch("http://35.174.107.106:3000/agreement");
    const data = await posts.json()
    agreementcontroller.saveagreements(data,req,res);
   }
   getagreements(req,res);

  agreementcontroller.getagreement(req,res);
  //agreementcontroller.getagreement(req,res);
});

router.get('/Masteragreementbidding', ensureAuthenticated, function(req, res,next){
  async function getagreementbids(req,res){
    // const posts = await fetch("https://provider-management-platform-server.onrender.com/agreementsDetails");
    const posts = await fetch("http://35.174.107.106:3000/agreement");
    const data = await posts.json()
    agreementcontroller.biddingdata(data,req,res);
   }
   getagreementbids(req,res);

  agreementcontroller.getagreementbids(req,res);

  });

router.get('/AddEmployee', ensureAuthenticated, function(req, res,next){
  res.render('addemployee', {
    title: 'AddEmployee'
  })
  });

router.get('/Updateprofile', ensureAuthenticated, function(req, res,next){

  usercontroller.GetUserData(req,res);
  //const id =req.session.passport.user;
 
});


router.get('/offerEmployee', ensureAuthenticated, function(req, res,next){
  usercontroller.GetEmployeeData(req,res);
  });

  router.get('/Employeestatus', ensureAuthenticated, function(req, res,next){

    async function getofferstatus(req,res){
     const posts = await fetch("http://13.48.42.106:8000/request-details/");
      const data = await posts.json();
      employeecontroller.saveemployeestatus(data,req,res)
     }
     getofferstatus(req,res);
     employeecontroller.GetEmployeeData(req,res);
    });
router.get('/submitoffer', ensureAuthenticated, function(req, res,next){
     res.render('submitoffer', {
      title: 'submitoffer',
      "offerEmployeeDetails":req.query
    })
    });

router.get('/agreementdetails', ensureAuthenticated, function(req, res,next){
     res.render('agreementdetails', {
      title: 'Agreement Details',
      "AgreementDetails":req.query
    })
    });
router.get('/biddingdetails', ensureAuthenticated, function(req, res,next){
     res.render('biddingdetails', {
      title: 'Bidding Details',
      "BiddingDetails":req.query
    })
    });


router.get('/Agreementbids', function(req, res,next){
  agreementcontroller.getagreementbidsforoffer(req,res);
    });

router.get('/offers', function(req, res,next){
  offercontroller.getroffers(req,res);
    });

router.get('/getproviders', function(req, res,next){
  providercontroller.providers(req,res);
    });



router.get('/Openservices',ensureAuthenticated, (req, res) => {
  async function saveopenservicerequests(){
  const posts = await fetch("http://13.48.42.106:8000/request-details/");
   const data = await posts.json()
   console.log(data);
   openservicecontroller.openservicedata(data,req,res);
   
  }
  saveopenservicerequests();
  openservicecontroller.getopenservicerequests(req,res);

})
router.get('/offerEmployee', ensureAuthenticated, function(req, res,next){
  employeecontroller.GetEmployeeData(req,res);
  });

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
  agreementcounter=1;
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});


router.post('/register',[ 
  
  check('firstname')
  .isLength({ min: 1 })
  .withMessage("First name cannot be left blank")
  .isAlpha()
  .withMessage("First Nmae should only contains Alphabets"),

  check('lastname')
  .isLength({ min: 1 })
  .withMessage("last name cannot be left blank")
  .isAlpha()
  .withMessage("last Nmae should only contains Alphabets"),

  check('mobile')
  .matches(/^\+?[0-9]+[0-9\-]+[0-9]$/)
  .withMessage("please enter a valid mobile number"),

  check('email')
  .isEmail().withMessage('Please enter a valid email address')
  .trim()
  .normalizeEmail()
  .custom(value => {

   
      return findUserByEmail(value).then(User => {
        //if user email already exists throw an error
    })
  }),

  check('password')
  .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
  .matches(/\d/).withMessage('Password must contain one number')
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.cpassword) {
        // throw error if passwords do not match
        throw new Error("Passwords don't match");
    } else {
        return value;
    }
}),

check('username')
.isLength({ min: 1 })
.withMessage("username cannot be left blank")
.custom(value => {

    console.log("testing for username-1");
 
    return findUserByUsername(value).then(User => {
  })
}),

  
  check('terms','Please accept our terms and conditions').equals('yes'),

 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } else {
    console.log("i am before controller");
    usercontroller.AddUser(req, res);

  
  }
});

router.post('/edit',[ 
  
  check('firstname')
  .isLength({ min: 1 })
  .withMessage("First name cannot be left blank")
  .isAlpha()
  .withMessage("First Nmae should only contains Alphabets"),

  check('lastname')
  .isLength({ min: 1 })
  .withMessage("last name cannot be left blank")
  .isAlpha()
  .withMessage("last Nmae should only contains Alphabets"),

  check('mobile')
  .matches(/^\+?[0-9]+[0-9\-]+[0-9]$/)
  .withMessage("please enter a valid mobile number"),

  check('email')
  .isEmail().withMessage('Please enter a valid email address')
  .trim()
  .normalizeEmail(),

  check('password')
  .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
  .matches(/\d/).withMessage('Password must contain one number')
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.cpassword) {
        // throw error if passwords do not match
        throw new Error("Passwords don't match");
    } else {
        return value;
    }
}),

check('username','username cannot be left blank')
  .isLength({ min: 1 }),

 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } else {
    usercontroller.UpdateUser(req, res);

  
  }
});


router.post('/addemployee',upload.single('file'),[ 
  check('employee_name','Please  provide Employee Name')
  .isLength({ min: 1 }),
  check('provider_name','Please  provide provider person')
  .isLength({ min: 1 }),
  check('contactperson','Please  provide contact person')
  .isLength({ min: 1 }),
  check('externalperson','Please provide external person')
  .isLength({ min: 1 }),
  check('rate','Please provide rate')
  .isLength({ min: 1 }),
  check('notes','Please provide notes')
  .isLength({ min: 1 }),  
  check('dateuntil','Please provide date')
  .isLength({ min: 1 }),
   
 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } else {
    console.log("i am in employee route");
    employeecontroller.addemployee(req, res); 
  }
});



router.post('/update',[ 
   
  check('firstname')
  .isLength({ min: 1 })
  .withMessage("First name cannot be left blank")
  .isAlpha()
  .withMessage("First Nmae should only contains Alphabets"),

  check('lastname')
  .isLength({ min: 1 })
  .withMessage("last name cannot be left blank")
  .isAlpha()
  .withMessage("last Nmae should only contains Alphabets"),

  check('mobile')
  .matches(/^\+?[0-9]+[0-9\-]+[0-9]$/)
  .withMessage("please enter a valid mobile number"),

  check('email')
  .isEmail().withMessage('Please enter a valid email address')
  .trim()
  .normalizeEmail()
  .custom(value => {

      return findUserByEmail(value).then(user => {
        //if user email already exists throw an error
    })
  }),

  check('password')
  .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
  .matches(/\d/).withMessage('Password must contain one number')
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.cpassword) {
        // throw error if passwords do not match
        throw new Error("Passwords don't match");
    } else {
        return value;
    }
}),

check('username','username cannot be left blank')
  .isLength({ min: 1 }),

  check('provider','Provider cannot be left blank')
  .isLength({ min: 1 }),
  
  check('terms','Please accept our terms and conditions').equals('yes'),

 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } else {
    //usercontroller.FindUserByID(req, res);

  
  }
});

router.post('/addoffer', [ 
  check('servicerequest_id','Please  provide servicerequest_id')
  .isLength({ min: 1 }),
  check('agreement_title_id','Please  provide agreement_title_id')
  .isLength({ min: 1 }),
  check('agreement_title','Please  provide agreement_title')
  .isLength({ min: 1 }),
  check('project_information','Please  provide project_information')
  .isLength({ min: 1 }),
  check('employee_name','Please  provide employee_name')
  .isLength({ min: 1 }),
  check('provider_name','Please  provide provider_name')
  .isLength({ min: 1 }),
  check('contactperson','Please  provide contactperson')
  .isLength({ min: 1 }),
  check('externalperson','Please provide externalperson')
  .isLength({ min: 1 }),
  check('rate','Please provide rate')
  .isLength({ min: 1 }),
  check('dateuntil','Please provide dateuntil')
  .isLength({ min: 1 }),
  check('notes','Please provide notes')
  .isLength({ min: 1 }),
  check('document','Please provide document')
  .isLength({ min: 1 }),
  check('status','Please provide status')
  .isLength({ min: 1 }),   
 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } else {
    console.log("i am in employee route");
    offercontroller.addoffer(req, res); 
  }
 
});

router.post('/acceptagreement', [ 
  check('id','Please  provide Id')
  .isLength({ min: 1 }),
  check('title','Please  provide Title')
  .isLength({ min: 1 }),
  check('position','Please  provide position')
  .isLength({ min: 1 }),
  check('skill','Please provide skill')
  .isLength({ min: 1 }),
  check('salary','Please provide salary')
  .isLength({ min: 1 }),
  check('cycle','Please provide cycle')
  .isLength({ min: 1 }),
  check('jobStartDate','Please provide jobStartDate')
  .isLength({ min: 1 }),
  check('jobEndDate','Please provide jobEndDate')
  .isLength({ min: 1 }),
  check('technologyLevel','Please provide technologyLevel')
  .isLength({ min: 1 }),
  check('role','Please provide role')
  .isLength({ min: 1 }),  
  check('status','Please provide status')
  .isLength({ min: 1 }),
 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } 
  else {
    console.log("i am in employee route");
    agreementcontroller.updateagreement(req, res); 
  }
 
});

router.post('/bidagreement', [ 
  check('id','Please  provide id')
  .isLength({ min: 1 }),
  check('title','Please  provide title')
  .isLength({ min: 1 }),
  check('position','Please  provide position')
  .isLength({ min: 1 }),
  check('skill','Please provide skill')
  .isLength({ min: 1 }),
  check('salary','Please provide salary')
  .isLength({ min: 1 }),
  check('cycle','Please provide cycle')
  .isLength({ min: 1 }),
  check('jobStartDate','Please provide jobStartDate ')
  .isLength({ min: 1 }),
  check('jobEndDate','Please provide jobEndDate')
  .isLength({ min: 1 }),
  check('technologyLevel','Please provide technologyLevel')
  .isLength({ min: 1 }),
  check('role','Please provide role')
  .isLength({ min: 1 }),
  check('status','Please provide status')
  .isLength({ min: 1 }),
 ], function(req, res, next) {

    const errors = validationResult(req);

  if (!errors.isEmpty()) {     
      
     res.json({status : "error", message : errors.array()});

  } 
  else {
    console.log("i am in employee route");
    agreementcontroller.updatebid(req, res); 
  }
 
});

function findUserByEmail(email){
  
if(email){
    return new Promise((resolve, reject) => {
      var finduser = true;

      if (finduser)
      {
        User.Provider_A.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err)
            if (doc) return reject(new Error('This email already exists. Please enter another email.'))
            else return resolve(email)
        })
      }
       if (finduser)
      {
        User.Provider_B.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err)
            if (doc) return reject(new Error('This email already exists. Please enter another email.'))
            else return resolve(email)
        })
      }
       if (finduser)
      {
        User.Provider_C.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err)
            if (doc) return reject(new Error('This email already exists. Please enter another email.'))
            else return resolve(email)
        })
      }
       if (finduser)
      {
        User.Provider_D.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err)
            if (doc) return reject(new Error('This email already exists. Please enter another email.'))
            else return resolve(email)
        })
      }
      else 
      {
        return resolve(email)
      }

    })
  }
}

function findUserByUsername(username){
  console.log("testing for username-2");
  console.log(username);
  
  if(username){
      return new Promise((resolve, reject) => {
        var finduser = true;
  
        if (finduser)
        {
          
          User.Provider_A.findOne({ username: username })
            .exec((err, doc) => {
              console.log("testing for username-A");
              //console.log(doc.username);
              if (err) return reject(err)
              if (doc) return reject(new Error('This username already exists. Please enter another username.'))
              else return resolve(username)
          })
        }
         if (finduser)
        {
          User.Provider_B.findOne({ username: username })
            .exec((err, doc) => {
              if (err) return reject(err)
              if (doc) return reject(new Error('This username already exists. Please enter another username.'))
              else return resolve(username)
          })
        }
         if (finduser)
        {
          User.Provider_C.findOne({ username: username })
            .exec((err, doc) => {
              if (err) return reject(err)
              if (doc) return reject(new Error('This username already exists. Please enter another username.'))
              else return resolve(username)
          })
        }
         if (finduser)
        {
          User.Provider_D.findOne({ username: username })
            .exec((err, doc) => {
              if (err) return reject(err)
              if (doc) return reject(new Error('This username already exists. Please enter another username.'))
              else return resolve(username)
          })
        }
        else 
        {
          return resolve(username)
        }
  
      })
    }
  }
module.exports = router;