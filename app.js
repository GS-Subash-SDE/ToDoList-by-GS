// localStorage.clear();
// console.log(document.querySelector(".fdiv").dataset.taskid);
const forms = document.querySelector('#forms');
const todayField = document.querySelector(".today-taks"); 
const futureField = document.querySelector(".future-taks"); 
const completeField = document.querySelector(".complete-taks"); 
const mainContainer = document.querySelector(".container");

// retrieving data local storage
const dataCollector = localStorage.getItem("originalData")?JSON.parse(localStorage.getItem('originalData')):[];
let ids = localStorage.getItem('getIds')?localStorage.getItem('getIds'):0;

// id genrator for data
function idGenerator() {
  return ++ids;
}
addTasks();
// add tasks
function addTasks() {
  // today task filtering
  console.log('entered addTasks function');
  // if (dataCollector.length == 0) {
  //   return;
  // }
  let todayArr = dataCollector.filter(a => {
    let currentDate = new Date().toDateString();
    let compareDate = new Date(a.date).toDateString();
    return !a["completed"] && currentDate === compareDate;
  });
  addToday(todayArr);
  
  // future task filtering
  let futureArr = dataCollector.filter(a => {
    let currentDate = new Date();
    let compareDate = new Date(a.date);
    return (
      !a["completed"] &&
      currentDate.getTime() < compareDate.getTime() &&
      currentDate.toDateString() != compareDate.toDateString()
    );  
  });

  let pastArr = dataCollector.filter((a) => {
    let currentDate = new Date();
    let compareDate = new Date(a.date);
    // console.log(currentDate.getTime());
    // console.log(compareDate.getTime());
    return (!a['completed'] && 
      currentDate.getTime() > compareDate.getTime() &&
      currentDate.toDateString() != compareDate.toDateString()
    );
  });

  addFuturePast(pastArr, futureArr);

  // completed task filtering
  let completedArr = dataCollector.filter((a) => a["completed"]);
  addCompleted(completedArr);
}


// adding today task in dashboard
function addToday(dataArr) {
  todayField.innerHTML = '';
  // console.log(dataArr);
  dataArr.forEach((a, i) => {
    console.log(a);
    todayField.appendChild(rowGenerator(a,i+1));    
  });  
}

// adding future task in dashboard
function addFuturePast(passtArr, futuredArr) {
  futureField.innerHTML = "";
  let ind = 0;
  futuredArr.forEach((a, i) => {
    ind += i + 1;
    futureField.appendChild(rowGenerator(a, ind));
  });
  passtArr.forEach((a, i) => {
    let ele = rowGenerator(a, ind + i + 1);
    ele.style.borderColor = "red";
    futureField.appendChild(ele);
  });
}


// adding completed task in dashboard
function addCompleted(dataArr) {
  completeField.innerHTML = '';
  dataArr.forEach((a, i) => {
    completeField.appendChild(rowGenerator(a,i+1));
  });
}


// Create elements
function rowGenerator(obj,seriealNo) {
  let element = document.createElement('div');
  element.classList.add('divs');
  element.dataTaskid = obj.id;
  if (!obj['completed']) {
    element.innerHTML = `
            <div>${seriealNo}. ${obj['name']}</div>
            <div>${obj['date']}</div>
            <div>Priority: ${obj['priority']}</div>
            <div class="edit-cont">
              <span class="material-symbols-outlined editBtn"> task_alt </span>
              <span class="material-symbols-outlined deleteBtn"> delete </span>
            </div>`;
  } else {
    element.innerHTML = `
            <div>${seriealNo}. ${obj["name"]}</div>
            <div>${obj["date"]}</div>
            <div>Priority: ${obj["priority"]}</div>
            <div class="edit-cont">
              <span class="material-symbols-outlined deleteBtn"> delete </span>
            </div>`;
  }
  element.id = obj['id'];
  
  return element;
}

// click event for delete button
mainContainer.addEventListener('click', (e) => {
  const deleteObj = e.target;
  if (!deleteObj.closest('.deleteBtn')) {
    return;
  }

  const selectedRow = deleteObj.parentNode.parentNode;
  deleteData(selectedRow.id);
  localStorage.setItem('originalData', JSON.stringify(dataCollector));
  addTasks(); 
  // selectedRow.remove();
});


// delete data from dataCollector
function deleteData(selectedId) {
  let n = dataCollector.length;
  for (let i = 0; i < n; i++){
    if (selectedId == dataCollector[i].id) {
      console.log(dataCollector[i]);
      dataCollector.splice(i, 1);
      break;
    }
  }
}
// click event for edit button
mainContainer.addEventListener('click', (e) => {
  const editObj = e.target;
  if (!editObj.closest('.editBtn')) {
    return;
  }

const selectedRow = editObj.parentNode.parentNode;
editData(selectedRow.id);
localStorage.setItem("originalData", JSON.stringify(dataCollector));
addTasks();
//   const selectedRow = editObj.parentNode.parentNode;
// editObj.remove();
//   completeField.appendChild(selectedRow);
});
// Edit data from dataCollector
function editData(selectedId) {
  let n = dataCollector.length;
  for (let i = 0; i < n; i++){
    if (selectedId == dataCollector[i].id) {
      console.log(dataCollector[i]);
      dataCollector[i].completed = true;
      break;
    }
  }
}


// Form submission event
forms.addEventListener('submit', (e) => {
  e.preventDefault();
console.log('submit');
  const data = {
    id: idGenerator(),
    name: forms.itemName.value,
    date: forms.taskDate.value,
    priority: forms.priority.value,
    completed: false,
  };
  dataCollector.push(data);
  localStorage.setItem('originalData', JSON.stringify(dataCollector));
  localStorage.setItem('getIds', JSON.stringify(data.id));
  forms.reset();
  addTasks();
});