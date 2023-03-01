import './Calendar.css';
import { useState, useEffect } from 'react';

enum State {
  Finished,
  Missing,
  Failed,
}

// Utility functions
function range(start: number, end: number): number[] {
  let days: number[] = [];
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
      console.log(tasksForDay);
      return tasksForDay;
    })
    month.set(name, totalTasks);
  }
  return month;
}

const taskNames = [
  "Frys",
  "Kjøl 4",
  "Pølse",
  "Kjøledisk",
  "Frys 2",
  "Kjølerom 3",
];

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

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

function stateToIcon(state: State): string {
  if (state == State.Failed) {
    return "❌";
  } else if (state == State.Missing) {
    return "⚠️";      
  } else {
    return "✅";            
  }
}

interface ShowDay {
  day: number;
  name: string;
}

export default function Calendar() {
  // State
  const [days, setDays] = useState<number[]>([]);
  const [month, setMonth] = useState<Date>(new Date().getMonth());
  const [tasks, setTasks] = useState<Map<string, Task[][]>>(new Map());
  const [showDay, setShowDay] = useState<ShowDay | null>(null);
  
  // Update tasks with new mock tasks when month changes
  useEffect(() => {
    const daysInMonth = new Date(2023, month, 0).getDate();
    const days = range(1, daysInMonth);
    setDays(days);
    setTasks(mockTasks(days, taskNames));
  }, [month]);

  // Helpers for changing month
  const incrementMonth = () => {
    if (month >= 12) {
      setMonth(1);
    } else {
      setMonth(month + 1);      
    }
  };

  const decrementMonth = () => {
    if (month <= 1) {
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div>
      <h2>
        <button onClick={decrementMonth}>←</button>
        {monthNames[month - 1]}
        <button onClick={incrementMonth}>→</button>
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
              {totalTasks.map((tasks, day) => {
                let state = tasksToState(tasks);
                let icon = stateToIcon(state);
                return <td><a href="#" onClick={() => setShowDay({ day, name })}>{icon}</a></td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {showDay && <>
                    <h3>{showDay.name}</h3>
                    <ul>
                      {tasks.get(showDay.name)[showDay.day].map((task) => {
                        let state = tasksToState(tasks.get(showDay.name)[showDay.day]);
                        let icon = stateToIcon(state);
                        return <li>{icon} {task.name}</li>
                    })}
                    </ul>
                  </>}
    </div>
  );
}
