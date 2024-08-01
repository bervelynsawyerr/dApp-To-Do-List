const TodoList = artifacts.require("TodoList");

contract("TodoList", (accounts) => {
  let todoList;

  before(async () => {
    todoList = await TodoList.deployed();
  });

  it("should deploy the contract and set initial state", async () => {
    const taskCount = await todoList.taskCount();
    assert.equal(taskCount.toNumber(), 0, "Initial task count should be 0");
  });

  it("should create a task", async () => {
    await todoList.createTask("Task 1", 1, "General", Math.floor(Date.now() / 1000), { from: accounts[0] });
    const taskCount = await todoList.taskCount();
    const task = await todoList.tasks(taskCount.toNumber());

    assert.equal(task.id.toNumber(), taskCount.toNumber(), "Task ID should match task count");
    assert.equal(task.content, "Task 1", "Task content should be 'Task 1'");
    assert.equal(task.completed, false, "Task should not be completed initially");
    assert.equal(task.priority.toNumber(), 1, "Task priority should be Medium (1)");
    assert.equal(task.category, "General", "Task category should be 'General'");
  });

  it("should update a task", async () => {
    await todoList.updateTask(1, "Updated Task 1", 2, "Work", Math.floor(Date.now() / 1000) + 3600, { from: accounts[0] });
    const task = await todoList.tasks(1);

    assert.equal(task.content, "Updated Task 1", "Task content should be updated");
    assert.equal(task.priority.toNumber(), 2, "Task priority should be High (2)");
    assert.equal(task.category, "Work", "Task category should be updated to 'Work'");
  });

  it("should toggle task completion", async () => {
    await todoList.toggleCompleted(1, { from: accounts[0] });
    const task = await todoList.tasks(1);

    assert.equal(task.completed, true, "Task should be marked as completed");
  });

  it("should delete a task", async () => {
    await todoList.deleteTask(1, { from: accounts[0] });
    const task = await todoList.tasks(1);

    assert.equal(task.id.toNumber(), 0, "Task should be deleted");
  });

  it("should fetch user tasks", async () => {
    // Clear existing tasks
    let userTasks = await todoList.getUserTasks(accounts[0]);
    for (let taskId of userTasks) {
      await todoList.deleteTask(taskId.toNumber(), { from: accounts[0] });
    }

    // Create new tasks
    const result1 = await todoList.createTask("Task 2", 0, "Home", Math.floor(Date.now() / 1000), { from: accounts[0] });
    const result2 = await todoList.createTask("Task 3", 1, "Work", Math.floor(Date.now() / 1000) + 7200, { from: accounts[0] });

    // Fetch created task IDs from event logs
    const taskId2 = result1.logs[0].args.id.toNumber();
    const taskId3 = result2.logs[0].args.id.toNumber();

    // Fetch and assert user tasks
    userTasks = await todoList.getUserTasks(accounts[0]);
    assert.equal(userTasks.length, 2, "User should have 2 tasks");

    // Verify task existence by IDs fetched from events
    const task2 = await todoList.tasks(taskId2);
    assert.equal(task2.id.toNumber(), taskId2, "Task 2 should exist");

    const task3 = await todoList.tasks(taskId3);
    assert.equal(task3.id.toNumber(), taskId3, "Task 3 should exist");
  });

  it("should fetch task history", async () => {
    // Create a task
    const result = await todoList.createTask("Task 4", 1, "Test", Math.floor(Date.now() / 1000), { from: accounts[0] });
    
    // Fetch created task ID from event logs
    const taskId4 = result.logs[0].args.id.toNumber();
    
    // Update the task and toggle completion to generate history
    await todoList.updateTask(taskId4, "Updated Task 4", 1, "Test", Math.floor(Date.now() / 1000) + 3600, { from: accounts[0] });
    await todoList.toggleCompleted(taskId4, { from: accounts[0] });
    
    // Fetch and verify history
    const history = await todoList.getTaskHistory(taskId4);
    assert.equal(history.length, 2, "Task history should have 2 entries");
    assert.equal(history[0], "Updated Task Details", "First history entry should be 'Updated Task Details'");
    assert.equal(history[1], "Toggled Completion Status", "Second history entry should be 'Toggled Completion Status'");
  });
});
