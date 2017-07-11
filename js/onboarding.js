
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
  getAllToDos();
}

function newAssignment() {
  var li = document.createElement("li");
  $('.selected').removeClass(selected);

  li.className = "selected";
  var assignName = document.getElementById("assignName").value;
  var courseName = document.getElementById("courseName").value;
  var deadline = document.getElementById("deadline").value;

  var a = document.createTextNode(assignName+ " ");
  var c = document.createTextNode("[" + courseName+ "] ");
  var d = document.createTextNode(deadline);

  li.appendChild(c);
  li.appendChild(a);
  li.appendChild(d);
  li.tagName = courseName;

  if (assignName === '' || courseName === '' || deadline === '') {
    alert("Please fill in all sections first!");
  } else {
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
    document.getElementById("example-tabs").appendChild(li);
    currentAssignment = record._id;
    $('#task-list').html('');
    setPushNotif(deadline, assignName);
  }
  deleteAssignment();
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
  if (currentAssignment === '' || !currentAssignment) {
    alert("Please select an assignment or create a new assignment first!");
  } else if (inputValue === '' || deadline === '') {
    alert("Please complete all fields first!");
  } else {
    document.getElementById("task-list").appendChild(li);
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
    setPushNotif(deadline, inputValue);
  }
  deleteAssignment();
  deleteTask("ToDos/");
}

function setPushNotif(deadline, assignName) {
    var dateVal = deadline.split('T')[0];
    var timeVal = deadline.split('T')[1];
    var hrVal = timeVal.split(":")[0];
    var minVal = timeVal.split(":")[1];
    var dueTime = new Date(dateVal);
    dueTime.setHours(hrVal);
    dueTime.setMinutes(minVal);

    var currentTime = new Date();
    console.log("the current time:" + currentTime);
    console.log("due time: " +  dueTime);
    var timeDiff = dueTime - currentTime;
    console.log("time diff: " +  timeDiff);
    if (timeDiff > 0) {
      setTimeout(function(){ notifyMe(assignName); }, timeDiff);
    }
}

function deleteTask(db) {
  var close = document.getElementsByClassName("close");
  var i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
      deleteRecord(db, this.id);
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
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.id = records[i]._id;
    li.id = records[i]._id;
    span.appendChild(txt);
    li.appendChild(span);
  }
  deleteTask("ToDos/");
}

function loadSublistPushNotifDeadlines(records) {
  for (var i=0; i<records.length; i++) {
    var assignName = records[i].content;
    var deadline = records[i].Deadline;
    console.log("record: " + records[i] + " assignName: " + assignName + " deadline: " + deadline )
    setPushNotif(deadline, assignName);
  }
}

function getAllToDos() {
  const query = new skygear.Query(ToDos);
  query.overallCount = true;
  query.limit = LIMIT;
  skygear.privateDB.query(query).then((records) => {
    console.log(records);
    console.log(records.constructor);
    var r = Array.from(records);
    console.log(Array.isArray(records));
    console.log(Array.isArray(r));
    console.log(r);
    loadSublistPushNotifDeadlines(r);
  }, (error) => {
    console.error(error);
  })
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

function getRecord (db, colName, content) {
  var query = new skygear.Query(db);
  query.equalTo(colName, content);
  skygear.privateDB.query(query).then((records) => {
    console.log(records);
    console.log(records.constructor);
    var r = Array.from(records);
    console.log(Array.isArray(records));
    console.log(Array.isArray(r));
    return r;
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
    var courseName = records[i].Course;
    var c = document.createTextNode("[" + courseName+ "] ");
    li.appendChild(c);
      var assignName = records[i].Assignment;
    var a = document.createTextNode(assignName + " ");
    li.appendChild(a);
    var deadline = records[i].Deadline;
    var d = document.createTextNode(deadline);
    li.appendChild(d);
    document.getElementById("example-tabs").appendChild(li);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close-assign";
    li.id = records[i]._id;
    li.tagName = courseName;
    span.id = records[i]._id;
    span.appendChild(txt);
    li.appendChild(span);
    var ul = document.createElement("ul");
    ul.id = assignName+courseName+deadline;
    ul.style.display = "none";

    setPushNotif(deadline, assignName);
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
  if (db === "Assignments/") {
    var query = new skygear.Query(ToDos);
    query.equalTo("AssignID", recID);
    var foundNotes = [];
    skygear.privateDB.query(query)
    .then((records) => {
      if (records.length > 0) {
        console.log(`Found ${records.length} record, going to delete them.`);
        foundNotes = records;
        var recsToDelete = [];
        records.forEach(function(rec) {
         recsToDelete.push(rec);
        });
        return skygear.privateDB.delete(recsToDelete); // return a Promise object
      } else {
          console.log("There weren't any to-dos for this assignment.")
      }
      })
    .then((errors) => {
      if(errors) {
        errors.forEach((perError, idx) => {
          if (perError) {
            console.error('Fail to delete', foundNotes[idx]);
          }
        });
      } else {
        console.log("Delete successfully!")
      }
    }, (reqError) => {
      console.error('Request error', reqError);
    });
  }
}

function logout () {
  skygear.logout().then(() => {
    console.log('logout successfully');
    location.href = "index.html"
  }, (error) => {
    console.error(error);
  });
}

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe(task) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  var notification = new Notification('Notification title', {
    icon: 'css/img/icon-todo-100.png',
    body: "Your assignment: " + task + " is due!",
  });
  notification.onclick = function () {
    window.open("https://xiuwenlu.github.io/Skygear-ToDoListApp/onboarding-prof.html");      
  };
}

