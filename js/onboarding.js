
function signup (username, password, passwordConf) {
    if (checkSignupInfo(username, password, passwordConf)) {
      skygear.signupWithUsername(username, password).then((user) => {
        console.log(user); // user object
        alert("Welcome, signed up successfully!");
        location.href = "onboarding-prof.html"
      }, (error) => {
        console.error(error);
        if (error.error.code === skygear.ErrorCodes.Duplicated) {
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


  function checkLoginInfo(username, password) {
    if (username.length < 1) {
        alert("Please enter a username.");
      return false;
    }
    if (password.length < 6) {
      alert("Password is too short. Please enter a password with atleast 6 characters.");
      return false;
    }
    return true;
  } 

  function login (username, password) {
    if (checkLoginInfo(username,password)) {
      skygear.loginWithUsername(username, password).then((user) => {
        console.log(user); // user object
        location.href = "onboarding-prof.html"
      }, (error) => {
        console.error(error);    
        if (error.error.code === skygear.ErrorCodes.InvalidCredentials ||
            error.error.code === skygear.ErrorCodes.ResourceNotFound ) {
          // incorrect username or password
          alert("Incorrect Username or Password.");
        } else {
          alert("Error!");
        }
      });
    } 
  }

  function loadValues() {
    getAssignments();
  }

  function newAssignment() {
    var li = document.createElement("li");
    var assignName = document.getElementById("assignName").value + " ";
    var courseName = document.getElementById("courseName").value + " ";
    var deadline = document.getElementById("deadline").value;

    var a = document.createTextNode(assignName);
    var c = document.createTextNode(courseName);
    var d = document.createTextNode(deadline);

    li.appendChild(a);
    li.appendChild(c);
    li.appendChild(d);
    if (assignName === '' || courseName === '' || deadline === '') {
      alert("Please fill in all sections first!");
    } else {
      document.getElementById("example-tabs").appendChild(li);
      document.getElementById("assignName").value = "";
      document.getElementById("courseName").value = "";
      document.getElementById("deadline").value = "";
      var record = new Assignments({
        "Assignment" : assignName, "Course" : courseName, "Deadline": deadline
      });
      addAssignmentRecord(record);
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.appendChild(txt);
      span.className = "close-assign";
      li.id = record._id;
      span.id = record._id;
      li.appendChild(span);
      var ul = document.createElement("ul");
      ul.className = "assignmentClass";
      ul.id = record._id;
      document.getElementById("task-ul").appendChild(ul);
      deleteTask();
    }
  }

  function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("task-input").value;
    var deadline = document.getElementById("due-date").value;
    var date = document.createElement("SPAN");
    var t = document.createTextNode(inputValue);
    var d = document.createTextNode(deadline);
    date.appendChild(d);
    date.className = "dates";
    li.appendChild(t);
    li.appendChild(date);
    if (inputValue === '' || deadline === '') {
      alert("Please complete all fields first!");
    } else {
      // document.getElementById("task-list").appendChild(li);
      // var ul = $('#' + currentAssignment + ' .assignmentClass');
      // ul.appendChild(li); 
      document.getElementById("task-input").value = "";
      document.getElementById("due-date").value = "";
      var record = new ToDos({
         "content" : inputValue, "Deadline" : deadline, "AssignID":currentAssignment
      })
      addContentRecord(record);
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.appendChild(txt);
      span.className = "close";
      span.id = record._id;
      li.id = record._id;
      li.appendChild(span);
    }
    deleteTask();
}

function deleteTask() {
  var close = document.getElementsByClassName("close");
  var i;
  for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
      deleteRecord('ToDos', this.id);
    }
  }
}
function addContentRecord(rec) {
  skygear.privateDB.save(rec).then((record) => {
    console.log(record);
  }, (error) => {
    console.error(error);
  });
}

function addAssignmentRecord(rec) {
  skygear.privateDB.save(rec).then((record) => {
    console.log("This is how the record looks: " + record._id);
    return record._id;
  }, (error) => {
    console.error(error);
    return false;
  });
}

function loadTaskRecords(records) {

  for (var i=0; i<records.length; i++) {
    var li = document.createElement("li");
    var inputValue = records[i].content;
    var deadline = records[i].Deadline;
    var t = document.createTextNode(inputValue);
    var date = document.createElement("SPAN");
    date.className = "dates";
    var d = document.createTextNode(deadline);
    li.appendChild(t);
    date.appendChild(d);
    li.appendChild(date);
     
    document.getElementById("task-list").appendChild(li);
    // document.getElementsByClassName("tabs-content").getElementsById(currentAssignment).appendChild(li);

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.id = records[i]._id;
    span.appendChild(txt);
    li.appendChild(span);
  }
  deleteTask();
}

function getRecordByContent(content) {
  const query = new skygear.Query(ToDos);
  query.equalTo("content", content);
  query.limit = 1;
  skygear.privateDB.query(query).then((records) => {
    console.log("current record " + records[0]);
    const rec = records[0];
      return rec._id;
    }, (error) => {
    console.error(error);
  })
}

function getRecords(assignmentID) {
  console.log("The current assignmentID: " + assignmentID);
  var query = new skygear.Query(ToDos);
  query.equalTo("AssignID", assignmentID);
  skygear.privateDB.query(query).then((records) => {
    console.log("Record: " + records);
    console.log(records.constructor);
    var r = Array.from(records);
    console.log(Array.isArray(records));
    console.log(Array.isArray(r));
    console.log("Record with this id: " + r);
    loadTaskRecords(r);
  }, (error) => {
    console.error(error);
  })
}

function getAssignments() {
  const query = new skygear.Query(Assignments);
  query.overallCount = true;
  query.limit = LIMIT;
  skygear.privateDB.query(query).then((records) => {
    console.log(records);
      console.log(records.constructor);
      var r = Array.from(records);
      console.log(Array.isArray(records));
      console.log(Array.isArray(r));
      console.log(r);
      loadAssignments(r);
  }, (error) => {
    console.error(error);
  })
}

function loadAssignments(records) {
  for (var i=0; i<records.length; i++) {
    var li = document.createElement("li");
    var assignName = records[i].Assignment + " ";
    var a = document.createTextNode(assignName);
    li.appendChild(a);
    var courseName = records[i].Course + " ";
    var c = document.createTextNode(courseName);
    li.appendChild(c);
    var deadline = records[i].Deadline;
    var d = document.createTextNode(deadline);
    li.appendChild(d);
    document.getElementById("example-tabs").appendChild(li);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close-assign";
    li.id = records[i]._id;
    span.id = records[i]._id;
    span.appendChild(txt);
    li.appendChild(span);
  }
  deleteAssignment();
}

function deleteAssignment() {
  var close = document.getElementsByClassName("close-assign");
    var i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
        deleteRecord('Assignments/', this.id);
      }
    }
}

function deleteRecord(db, recID) {
  skygear.privateDB.delete({
    id: db + recID
  }).then((record) => {
    console.log(record);
  }, (error) => {
    console.error(error);
  });
}

function logout (username, password) {
  skygear.logout().then(() => {
    console.log('logout successfully');
  }, (error) => {
    console.error(error);
  });
}





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

