/*
import React, { useEffect, useState } from 'react';
import getWeb3 from './web3';
import getContract from './getContract';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskContent, setTaskContent] = useState('');
  const [priority, setPriority] = useState(0); // 0: Low, 1: Medium, 2: High
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyTasks = [
      { id: 1, content: "Sample Task 1", completed: false, priority: 0, category: "Work" },
      { id: 2, content: "Sample Task 2", completed: true, priority: 1, category: "Personal" },
    ];
    setTasks(dummyTasks);
    setLoading(false);
  }, []);
  

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize web3, accounts, and contract
        const web3 = await getWeb3();
        console.log("Web3 initialized:", web3);

        const accounts = await web3.eth.getAccounts();
        console.log("Accounts:", accounts);

        const contract = await getContract(web3);
        console.log("Contract instance:", contract);

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);

        // Fetch the list of tasks
        const taskCount = await contract.methods.taskCount().call();
        console.log("Task count:", taskCount);

        const tasks = [];
        for (let i = 1; i <= taskCount; i++) {
          const task = await contract.methods.tasks(i).call();
          console.log(`Task ${i}:`, task);
          tasks.push(task);
        }
        setTasks(tasks);

        // Add example tasks
        await addExampleTasks();

        // Handle account and network changes
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', (newAccounts) => {
            console.log("Accounts changed", newAccounts);
            setAccounts(newAccounts);
          });

          window.ethereum.on('chainChanged', (chainId) => {
            console.log("Network changed", chainId);
            window.location.reload(); // Refresh the page to reflect the new network
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Could not connect to contract or chain.", error);
        setLoading(false);
      }
    };
    init();
  }, []);

  const addExampleTasks = async () => {
    if (!contract || !accounts) return;

    const exampleTasks = [
      { content: "Review Project Proposal", priority: 2, category: "Work", dueDate: "2024-08-05" },
      { content: "Grocery Shopping", priority: 1, category: "Personal", dueDate: "2024-08-03" },
      { content: "Morning Exercise", priority: 0, category: "Health", dueDate: "2024-08-02" }
    ];

    for (const task of exampleTasks) {
      try {
        const dueDateTimestamp = new Date(task.dueDate).getTime() / 1000; // Convert to UNIX timestamp
        await contract.methods.createTask(task.content, task.priority, task.category, dueDateTimestamp).send({ from: accounts[0] });
        console.log(`Task '${task.content}' added successfully.`);
      } catch (error) {
        console.error(`Failed to add task '${task.content}':`, error);
      }
    }

    // Refresh the tasks list
    const taskCount = await contract.methods.taskCount().call();
    const allTasks = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = await contract.methods.tasks(i).call();
      allTasks.push(task);
    }
    setTasks(allTasks);
  };

  const createTask = async () => {
    if (!taskContent || !category || !dueDate) {
      return alert("Please fill all fields.");
    }
    try {
      setLoading(true);
      const dueDateTimestamp = new Date(dueDate).getTime() / 1000; // Convert to UNIX timestamp
      console.log("Creating task with:", { taskContent, priority, category, dueDateTimestamp });

      await contract.methods.createTask(taskContent, priority, category, dueDateTimestamp).send({ from: accounts[0] });
      
      // Refresh the tasks list after creating a new task
      const taskCount = await contract.methods.taskCount().call();
      const task = await contract.methods.tasks(taskCount).call();
      console.log("New task created:", task);
      setTasks([...tasks, task]);
      setTaskContent('');
      setCategory('');
      setDueDate('');
    } catch (error) {
      console.error("Failed to create task:", error);
    }
    setLoading(false);
  };

  const toggleCompleted = async (taskId) => {
    try {
      setLoading(true);
      console.log("Toggling completion for task ID:", taskId);
      await contract.methods.toggleCompleted(taskId).send({ from: accounts[0] });
      const updatedTask = await contract.methods.tasks(taskId).call();
      console.log("Updated task:", updatedTask);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    }
    setLoading(false);
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      console.log("Deleting task ID:", taskId);
      await contract.methods.deleteTask(taskId).send({ from: accounts[0] });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div>
      <h1>Decentralized To-Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Task Content"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <select onChange={(e) => setPriority(Number(e.target.value))} value={priority}>
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
            />
            {task.content} - {task.category} - Priority: {['Low', 'Medium', 'High'][task.priority]}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
*/


import React, { useEffect, useState } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskContent, setTaskContent] = useState('');
  const [priority, setPriority] = useState(0); // 0: Low, 1: Medium, 2: High
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comment out the contract interaction and use dummy data instead
    // This is to check if the UI can render data correctly
    setLoading(false);
    setTasks([
      { id: 1, content: 'Buy groceries', completed: false, priority: 1, category: 'Personal', dueDate: Math.floor(new Date('2024-08-05').getTime() / 1000) },
      { id: 2, content: 'Finish project report', completed: true, priority: 2, category: 'Work', dueDate: Math.floor(new Date('2024-08-10').getTime() / 1000) },
      { id: 3, content: 'Schedule meeting with team', completed: false, priority: 0, category: 'Work', dueDate: Math.floor(new Date('2024-08-03').getTime() / 1000) },
      { id: 4, content: 'Exercise for 30 minutes', completed: false, priority: 0, category: 'Health', dueDate: Math.floor(new Date('2024-08-01').getTime() / 1000) },
    ]);
  }, []);

  const createTask = () => {
    if (!taskContent || !category || !dueDate) {
      return alert("Please fill all fields.");
    }
    // Add task to dummy data
    const newTask = {
      id: tasks.length + 1,
      content: taskContent,
      completed: false,
      priority: priority,
      category: category,
      dueDate: Math.floor(new Date(dueDate).getTime() / 1000)
    };
    setTasks([...tasks, newTask]);
    setTaskContent('');
    setCategory('');
    setDueDate('');
  };

  const toggleCompleted = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  if (loading) {
    return <div>Loading UI...</div>;
  }

  return (
    <div>
      <h1>Decentralized To-Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Task Content"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <select onChange={(e) => setPriority(Number(e.target.value))} value={priority}>
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
            />
            {task.content} - {task.category} - Priority: {['Low', 'Medium', 'High'][task.priority]}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

