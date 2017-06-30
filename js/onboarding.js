// import skygear from 'skygear';
// import skygearError from 'skygear/lib/error';

// skygear.config({
//   'endPoint': 'https://onboarding.skygeario.com/', // trailing slash is required
//   'apiKey': '7db0c25041ab4154b82233f3e308b2ba',
// }).then(() => {
//   console.log('skygear container is now ready for making API calls.');
// }, (error) => {
//   console.error(error);
// });

function signup (username, password, passwordConf) {
  if (checkSignupInfo(username, password, passwordConf)) {
    skygear.signupWithUsername(username, password).then((user) => {
      console.log(user); // user object
      alert("Welcome, signed up successfully!");
    }, (error) => {
      console.error(error);
      if (error.error.code === skygearError.Duplicated) {
        // the username has already existed
        alert('This user already exists.');
      } else {
        // other kinds of error
        alert('Error!');
      }
    });
  }
}

function checkSignupInfo(username, password, passwordConfirm) {
  if (username.length < 1) {
      alert("Please enter a username.");
    return false;
  }
  if (password.length < 6) {
    alert("Password is too short. Please enter a password with atleast 6 characters.");
    return false;
  }
  if (password !== passwordConfirm) {
    alert("Password does not match. Please try again.");
    return false;
  }
  return true;
}

function login (username, password) {
  skygear.loginWithUsername(username, password).then((user) => {
    console.log(user); // user object
  }, (error) => {
    console.error(error);    
    if (error.error.code === skygearError.InvalidCredentials ||
        error.error.code === skygearError.ResourceNotFound ) {
      // incorrect username or password
      alert("Incorrect Username or Password.");
    } else {
      // other kinds of error
    }
  });
}

function logout (username, password) {
  skygear.logout().then(() => {
    console.log('logout successfully');
  }, (error) => {
    console.error(error);
  });
}

function addRecord(content) {
  skygear.publicDB.save(new Note({
    content
  })).then((record) => {
    console.log(record);
  }, (error) => {
    console.error(error);
  });
}

// var loginName = $("#username");
// var loginPass= $("#password");
// var signupName = $("#username");
// var signupPass= $("#password");
// var signupPassConfirm = $("#passwordConf");
// var loginSubmitBtn = $("#log-in");
// var signupSubmitBtn = $("#sign-up");
// var logoutBtn = $("#log-out");

// loginSubmitBtn.on("click", function(e) {
//   login(loginName.val(),loginPass.val());
// })

// signupSubmitBtn.on("click", function(e) {
//   signup(signupName.val(),signupPass.val(),signupPassConfirm.val());
// })

// logoutButton.on("click", function(e) {
//   logout();
// })

