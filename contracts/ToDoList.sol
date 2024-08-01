// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    enum Priority { Low, Medium, High }
    struct Task {
        uint id;
        string content;
        bool completed;
        Priority priority;
        string category;
        uint dueDate;
        string[] history;
    }

    mapping(uint => Task) public tasks;
    mapping(address => uint[]) public userTasks;

    event TaskCreated(uint id, string content, bool completed, Priority priority, string category, uint dueDate);
    event TaskDeleted(uint id);
    event TaskUpdated(uint id, string content, Priority priority, string category, uint dueDate);
    event TaskCompleted(uint id, bool completed);
    event TaskHistoryUpdated(uint id, string update);

    modifier taskExists(uint _id) {
        require(tasks[_id].id != 0, "Task does not exist");
        _;
    }

    function createTask(string memory _content, Priority _priority, string memory _category, uint _dueDate) public {
        taskCount++;
        string[] memory emptyHistory;
        tasks[taskCount] = Task(taskCount, _content, false, _priority, _category, _dueDate, emptyHistory);
        userTasks[msg.sender].push(taskCount);
        emit TaskCreated(taskCount, _content, false, _priority, _category, _dueDate);
    }

    function deleteTask(uint _id) public taskExists(_id) {
        // Remove the task from the user's task list
        uint[] storage taskList = userTasks[msg.sender];
        for (uint i = 0; i < taskList.length; i++) {
            if (taskList[i] == _id) {
                taskList[i] = taskList[taskList.length - 1];
                taskList.pop();
                break;
            }
        }
        delete tasks[_id];
        emit TaskDeleted(_id);
    }

    function updateTask(uint _id, string memory _content, Priority _priority, string memory _category, uint _dueDate) public taskExists(_id) {
        Task storage task = tasks[_id];
        task.content = _content;
        task.priority = _priority;
        task.category = _category;
        task.dueDate = _dueDate;

        task.history.push("Updated Task Details");
        emit TaskUpdated(_id, _content, _priority, _category, _dueDate);
        emit TaskHistoryUpdated(_id, "Updated Task Details");
    }

    function toggleCompleted(uint _id) public taskExists(_id) {
        Task storage task = tasks[_id];
        task.completed = !task.completed;
        task.history.push("Toggled Completion Status");
        emit TaskCompleted(_id, task.completed);
        emit TaskHistoryUpdated(_id, "Toggled Completion Status");
    }

    function getUserTasks(address _user) public view returns (uint[] memory) {
        return userTasks[_user];
    }

    function getTaskHistory(uint _id) public view taskExists(_id) returns (string[] memory) {
        return tasks[_id].history;
    }
}
