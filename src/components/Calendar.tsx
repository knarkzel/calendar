import './Calendar.css';

enum State {
  Finished,
  Missing,
  Failed,
}

// Utility functions
function range(start: number, end: number): number[] {
  let days = [];
  for (let i = start; i <= end; i += 1) {
    days.push(i);
  }
  return days;
}

function randomState(): State {
  let chance = Math.random();
  if (chance < 0.97) {
    return State.Finished;
  } else if (chance < 0.99) {
    return State.Missing;    
  } else {
    return State.Failed;
  }
}

function mockTasks(days: number[], taskNames: string[]): Map<string, Task[][]> {
  let month = new Map();
  for (let name of taskNames) {
    let totalTasks = days.map((day) => {
      let amount = range(1, Math.random() * 5);
      let tasksForDay = amount.map((id) => new Task(`Task ${id}`, randomState()));
      return tasksForDay;
    })
    month.set(name, totalTasks);
  }
  return month;
}

// Business logic
class Task {
  name: string;
  state: State;

  constructor(name: string, state: State) {
    this.name = name;
    this.state = state;
  }
}

function tasksToState(tasks: Task[]): State {
  if (tasks.some((task) => task.state == State.Failed)) {
    return State.Failed;
  } else if (tasks.some((task) => task.state == State.Missing)) {
    return State.Missing;
  } else {
    return State.Finished;
  }
}

function Calendar() {
  const taskNames = [
    "Frys",
    "Kjøl 4",
    "Pølse",
    "Kjøledisk",
    "Frys 2",
    "Kjølerom 3",
  ];
  const days = range(1, 28);
  const tasks = mockTasks(days, taskNames);
  
  return (
    <div>
      <h2 style={{textAlign: "center"}}>
        <button style={{margin: "0 1em"}}>←</button>
          Februar
        <button style={{margin: "0 1em"}}>→</button>
      </h2>
      <table>
        <thead>
          <tr>
            <td>Enheter</td>
            {days.map((day) => (<td>{day}</td>))}
          </tr>
        </thead>
        <tbody>
          {[...tasks.entries()].map(([name, totalTasks]) => (
            <tr>
              <td>{name}</td>
              {totalTasks.map((tasks) => {
                let state = tasksToState(tasks);
                if (state == State.Failed) {
                  return <td>❌</td>
                } else if (state == State.Missing) {
                  return <td>⚠️</td>
                } else {
                  return <td>✅</td>
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
