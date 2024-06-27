export default class WorkoutTracker {
    static localStorageDataKey = "workout-tracker-entries";

    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
        this.entries = [];
        this.loadEntries();
        this.updateView();

        this.root.querySelector(".trackerAdd").addEventListener("click", () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDay().toString().padStart(2, "0");

            this.addEntry({
                date: `${year}-${month}-${day}`,
                workout: "",
                duration: 1,
                status: "Waiting"
            })
        });
    }

    static html() {
        return `
        <table class="tracker">
            <thead>
                <tr>
                <th>Date</th>
                <th>Workout</th>
                <th>Duration</th>
                <th>status</th>
                <th></th>
                </tr>
            </thead>
            <tbody class="trackerEntries"></tbody>
            <tbody>
                <tr class="trackerRow trackerRowAdd">
                    <td colspan="4">
                        <button type="button" class="trackerAdd">Add Workout &plus;</button>
                    </td>
                </tr>
            </tbody>
        </table>
        `;
    }

    static rowHtml(){
        return `
        <tr class="trackerRow">
          <td>
            <input type="date" class="trackerDate">
          </td>
          <td>
            <input type="text" class="trackerWorkout" list="workouts" placeholder="Enter workout">
            <datalist id="workouts">
              <option value="Running">Running</option>
              <option value="Walking">Walking</option>
              <option value="Cycling">Cycling</option>
              <option value="Swiming">Swiming</option>
              <option value="Yoga">Yoga</option>
              <option value="Push-up">Push-up</option>
              <option value="Pull-up">Pull-up</option>
            </datalist>
          </td>
          <td>
            <input type="number" class="trackerDuration" min="1" placeholder="1">
            <span class="trackerText"> minutes</span>
          </td>
          <td>
            <select class="trackerStatus">
              <option value="Waiting" >Waiting</option>
              <option value="Completed" >Completed</option>
              <option value="Incomplete" >Incomplete</option>
            </select>
          </td>
          <td>
            <button type="button" class="trackerBtn trackerDel">&times;</button>
          </td>
        </tr>
        `;
    }

    loadEntries(){
        this.entries = JSON.parse(localStorage.getItem(WorkoutTracker.localStorageDataKey) || "[]");
    }

    saveEntries(){
        localStorage.setItem(WorkoutTracker.localStorageDataKey, JSON.stringify(this.entries));
    }

    updateView(){
        const tableBody = this.root.querySelector(".trackerEntries");
        const addRow = data => {
            const template = document.createElement("template");
            let row = null;

            template.innerHTML = WorkoutTracker.rowHtml().trim();
            row = template.content.firstElementChild;

            row.querySelector(".trackerDate").value = data.date;
            row.querySelector(".trackerWorkout").value = data.workout;
            row.querySelector(".trackerDuration").value = data.duration;
            row.querySelector(".trackerStatus").value = data.status;

            row.querySelector(".trackerDate").addEventListener("change", ({target}) => {
                data.date = target.value;
                this.saveEntries();
            });

            row.querySelector(".trackerWorkout").addEventListener("change", ({target}) => {
                data.workout = target.value;
                this.saveEntries();
            });

            row.querySelector(".trackerDuration").addEventListener("change", ({target}) => {
                data.duration = target.value;
                this.saveEntries();
            });

            row.querySelector(".trackerStatus").addEventListener("change", ({target}) => {
                data.status = target.value;
                this.saveEntries();
            });

            row.querySelector(".trackerDel").addEventListener("click", () => {
                this.deleteEntry(data);
            });

            tableBody.appendChild(row);
        };

        tableBody.querySelectorAll(".trackerRow").forEach(row => {
            row.remove();
        });
        this.entries.forEach(data => addRow(data));
    }

    addEntry(data){
        this.entries.push(data);
        this.saveEntries();
        this.updateView();
    }

    deleteEntry(dataToDelete){
        this.entries = this.entries.filter(data => data !== dataToDelete);
        this.saveEntries();
        this.updateView();
    }
}