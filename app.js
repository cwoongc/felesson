import {TodoModel, ListView, TodoController, InputView, ListFoldButtonView} from "./todo.js";

// const initialDataUrl = "http://localhost:8080/data/initData.json";
// const todoModel = new TodoModel(initialDataUrl);
const todoModel = new TodoModel();
const listView = new ListView();
const inputView = new InputView();
const listFoldButtonView = new ListFoldButtonView();

const todoController = new TodoController(todoModel, inputView, listView, listFoldButtonView);