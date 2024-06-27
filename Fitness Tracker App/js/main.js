import WorkoutTracker from "./workoutTracker.js";

const app = document.getElementById("app");

const wt = new WorkoutTracker(app);
//window.wt = wt;

console.log(wt.entries);

const dateInput = document.getElementById("dateInput");
const completeList = document.getElementById("completeList");
const incompleteList = document.getElementById("incompleteList");
const lookBtn = document.getElementById("lookBtn");

const goalBtn = document.getElementById("goalBtn");
const listContainer = document.getElementById("listContainer");

let goals = [];

lookBtn.addEventListener("click", event => {
    document.getElementById("completeList").innerHTML = "";
    document.getElementById("incompleteList").innerHTML = "";
    const dt = dateInput.value;
    //console.log(dt);
    wt.entries.forEach(entry => {
        if(entry.date == dt && entry.status == "Completed"){
            const node = document.createElement("li");
            //node.appendChild(document.createTextNode(`${entry.workout}  ${entry.duration} minutes`));
            node.textContent = `${entry.workout} --- ${entry.duration} minutes`;
            node.style.color = "lightgreen";
            node.style.fontWeight = "bold";
            completeList.appendChild(node);
        }
        else if(entry.date == dt && entry.status == "Incomplete"){
            const node = document.createElement("li");
            //node.appendChild(document.createTextNode(`${entry.workout}  ${entry.duration} minutes`));
            node.textContent = `${entry.workout} --- ${entry.duration} minutes`;
            node.style.color = "tomato";
            node.style.fontWeight = "bold";
            incompleteList.appendChild(node);
        }
    })
});

goalBtn.addEventListener("click", event => {
    setGoal();
});

function setGoal() {
    const goalInput = document.getElementById('goalInput').value;
    if (!goalInput || goalInput == '') {
        return;
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = goalInput;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        goals.push(goalInput);
        saveItems();
        loadItems();
        document.getElementById('goalInput').value = '';
    } 
}

function saveItems(){
    localStorage.setItem('fitnessGoal', JSON.stringify(goals));
}
function loadItems(){
    goals = JSON.parse(localStorage.getItem('fitnessGoal') || "[]");
}



listContainer.addEventListener("click", event => {
    if(event.target.tagName === "LI"){
        event.target.classList.toggle("checked");
    }
    else if(event.target.tagName === "SPAN"){
        event.target.parentElement.remove();
    }
}, false);









