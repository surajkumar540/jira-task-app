const addBtn = document.querySelector(".add");
const taskAndColor = document.querySelector(".task_and_color");
const textArea = document.querySelector(".inputbar");
let ticketColors = ["redcolor", "bluecolor", "yellowcolor", "greencolor"];
const ticketContainer = document.querySelector(".ticket_container");

var uid = new ShortUniqueId(); //unique id
let toggle = true;

let ticketArr = [];

if(localStorage.getItem("tickets")){
  let str = localStorage.getItem("tickets");
  let arr = JSON.parse(str);
  ticketArr = arr;
  for(let i=0; i<arr.length; i++){
    let ticketObject = arr[i];
    createTicket(ticketObject.ticketColor,ticketObject.textArea,ticketObject.id);
  }
}
let filterColor = document.querySelectorAll(".coloring"); 
for(let i=0; i<filterColor.length; i++)
{
  filterColor[i].addEventListener("click", function () {
    // console.log("clicked");
    let currentFilterColor = filterColor[i].classList[1];
    let filterdArr = [];
    for (let i = 0; i < ticketArr.length; i++) {
      if (ticketArr[i].ticketColor == currentFilterColor) {
        filterdArr.push(ticketArr[i]);
      }
    }
    // console.log(filterdArr);

    //remove all ticket on Browser
    let allTicket = document.querySelectorAll(".ticket");

    for (let j = 0; j < allTicket.length; j++) {
      allTicket[j].remove();
    }

    // create ticket for show on browser with using filter
    for (let i = 0; i < filterdArr.length; i++) {
      let ticket = filterdArr[i];
      let ticketColor = ticket.ticketColor;
      let textArea = ticket.textArea;
      let id = ticket.id;
      createTicket(ticketColor, textArea, id);
    }
});

  // double click to show al tickets on browser
  filterColor[i].addEventListener("dblclick", function () {
    //remove all ticket on Browser
    let allTicket = document.querySelectorAll(".ticket");

    for (let j = 0; j < allTicket.length; j++) {
      allTicket[j].remove();
    }

    // create all ticket for show on browser 
    for (let i = 0; i < ticketArr.length; i++) {
      let ticket = ticketArr[i];
      let ticketColor = ticket.ticketColor;
      let textArea = ticket.textArea;
      let id = ticket.id;
      createTicket(ticketColor, textArea, id);
    }
  });
};

//taskAndColor container
addBtn.addEventListener("click", function () {
  //show taskArea
  if (toggle) {
    taskAndColor.style.display = "flex";
  }

  //hide taskArea
  else {
    taskAndColor.style.display = "none";
  }
  toggle = !toggle;
});

//if press Enter then, taskAndColor container Hide
let ticketNavColor = ticketColors[0];
textArea.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Enter") {
    taskAndColor.style.display = "none";
    createTicket(ticketNavColor, textArea.value);
    textArea.value = "";
    toggle = !toggle;
  }

});

//border on color
const PriorityColor = document.querySelectorAll(".priority-color");
for (let i = 0; i < PriorityColor.length; i++) {
  PriorityColor[i].addEventListener("click", function () {
    for (let j = 0; j < PriorityColor.length; j++) {
      PriorityColor[j].classList.remove("default");
    }
    PriorityColor[i].classList.add("default");
    ticketNavColor = PriorityColor[i].classList[0];
  });
}

//create ticket
let id = uid();
function createTicket(ticketColor, textArea, ticketId) {
    let id;
    if (ticketId == undefined) {
      id = uid();
    } else { 
      id = ticketId;
    }
  let ticket = document.createElement("div");
  ticket.setAttribute("class","ticket");
  ticket.innerHTML = `<div class="ticketColor ${ticketColor}"></div>
                        <div class="uniqueId">#${id}</div>
                        <div class="content">${textArea}</div>
                        <div class="lock-unlock">
                            <i class="fa fa-lock"></i>
                        </div>`;
  //appendChi;d
  ticketContainer.appendChild(ticket);

  let content = ticket.querySelector(".content");
  //lock_unlock
  let lockAndUnlock = ticket.querySelector(".lock-unlock i");
  lockAndUnlock.addEventListener("click", function () {
    if (lockAndUnlock.classList.contains("fa-lock")) {
      lockAndUnlock.classList.remove("fa-lock");
      lockAndUnlock.classList.add("fa-unlock");
      content.setAttribute("contenteditable", "true");
    } else {
      lockAndUnlock.classList.remove("fa-unlock");
      lockAndUnlock.classList.add("fa-lock");
      content.setAttribute("contenteditable", "false");
    }

    //after change ui task content
      let ticketArrTaskIdx = getIdIdx(id);
      ticketArr[ticketArrTaskIdx].textArea = content.textContent; 
      updateLocalStorage();
    });

  //remove ticket
  ticket.addEventListener("click", function () {
  if (deleteToggle == false) {
       //remove ticket from UI
      ticket.remove();
      
      //remove ticket from ticketArr
      let ticketIdx = getIdIdx(id);
      ticketArr.splice(ticketIdx, 1);

      //update in localStorage
      updateLocalStorage();
    }

  });

  //ticketColorChange
  const ticketColorBand = ticket.querySelector(".ticketColor");

  ticketColorBand.addEventListener("click", function () {
    let currentTicketColor = ticketColorBand.classList[1]; //color
    let currentTicketColorIdx = -1; //idx
    for (let i = 0; i < ticketColors.length; i++) {
      if (currentTicketColor == ticketColors[i]) {
        currentTicketColorIdx = i;
        break;
      }
    }

    let nextColorIdx = (currentTicketColorIdx + 1) % ticketColors.length; // if blue give 3 index
    let nextColor = ticketColors[nextColorIdx];
    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(nextColor);

    //ticketArr Color
    let ticketIdx = getIdIdx(id);
    ticketArr[ticketIdx].ticketColor = nextColor;

      updateLocalStorage();
  })

if(ticketId == undefined){
  //   ticket push in array
  ticketArr.push({
    ticketColor: ticketColor,
    textArea: textArea,
    id: id,
  });
  //   console.log(ticketArr);
  updateLocalStorage();
}
}

//ticket delete btn toggle

const deleteTicket = document.querySelector(".delete");

let deleteToggle = "true";
deleteTicket.addEventListener("click", function () {
  if (deleteToggle) {
    deleteTicket.style.color = "red";
  } else {
    deleteTicket.style.color = "black";
  }
  deleteToggle = !deleteToggle;
});

function getIdIdx(id){
for(let i=0; i<ticketArr.length; i++){
      if(ticketArr[i].id == id){
        return i;
      }
    }
}

function updateLocalStorage(){
  let stringifyArr = JSON.stringify(ticketArr);
  localStorage.setItem("tickets",stringifyArr);
}