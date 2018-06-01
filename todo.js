

//Controller, View의 존재를 전혀 모르게 구현.
class TodoModel {
    
    constructor(initialUrl) {
        this.todos = [];
        this.url = initialUrl;
    }

    addTodo(todo, fnAfter) {
        this.todos = [...this.todos, todo];
        fnAfter(this.todos);
    }

    get todoList () {
        return this.todos;
    }


    getInitialData() {
        fetch(this.url)
           .then(res=>res.json())
           .then(data=>)
        //    .then(data=> {
        //         this.todos = data.todos;
        //         //fnAfter(this.todos, this.fold);
        //         // this.notify(this.todos);
        //     }
    );
    }
}


class TodoController {

    //컨트롤러의 생성자는 모델과 뷰를 생성자로 주입받아 속성으로 관계를 형성하고,
    //초기화 작업을 호출한다.
    constructor(todoModel, inputView, listView, listFoldButtonView) {
        this.todoModel    = todoModel;
        this.inputView    = inputView;
        this.listView     = listView;
        this.listFoldButtonView = listFoldButtonView;
        this.initService();
    }

    //컨트롤러는 초기화작업에서 각 뷰들의 커스텀 이벤트들의 핸들러(리스너)로직을 
    //바인딩 시킬 책임을 가진다. 
    initService() {
        this.inputView.addTodoHandler = this.addTodoHandler.bind(this);
        this.listFoldButtonView.foldAfterHandler = this.foldAfterHandler.bind(this);
    }
    //또한 컨트롤러는 중간자로서 자신을 중간자로 하는 주입된
    //뷰들의 커스텀 이벤트의 핸들러 펑션의 구현의 책임도 가진다.
    addTodoHandler(todoString) {
        if(!todoString) return;
        this.todoModel.addTodo.call(this.todoModel, todoString, this.afterAddTodo.bind(this));
    }

    afterAddTodo(todoArray) {
        this.renderInputView(todoArray);
        this.renderListView(todoArray);

        this.renderlistFoldButtonView();
    }

    foldAfterHandler(param) {
        let toFold = param.toFold;
        this.listView.renderFold(toFold);
    }

    renderInputView(todoArray) {
        this.inputView.render();
    }

    renderListView(todoArray) {
        this.listView.render(todoArray);
    }

    renderlistFoldButtonView() {
        this.listFoldButtonView.render();
    }
}

//뷰는 속성으로 UI 비즈니스 흐름상 응집력있는 HTML 엘리먼트 집합을 속성으로 가지는 화면 개체를 의미한다.
//view들은 model이 어떤 것인지 전혀 모른다.
class InputView {

     //뷰의 생성자는 HTML로 부터 비즈니스적으로 상호협력관계에 있는 엘리먼트 집합을 셀렉트하여 자신의 멤버속성으로 할당하는 일과,
     //뷰단위에서 발생시킬 커스텀 이벤트를 선언하는 (리스너를 연결시킬 멤버프로퍼티 선언) 책임을 가진다.
     //뷰단위에서 발생시키는 커스텀 이벤트의 핸들러 로직은 컨트롤러가 구현과 할당의 책임을 가진다.
    constructor() {
        this.regButton = document.querySelector("button");
        this.inputElement = document.querySelector("input[name=todo]")
        this.addTodoHandler = null;
        this.initEvents();
    }

    //뷰의 초기화 작업은 자신이 다루는 HTML 엘리먼트들의 builtin 엘리면트 이벤트에 대한 리스너를 구현하고 등록하는 것이 대표적이다. 
    initEvents() {
        this.regButton.addEventListener("click", (e) => {
            const todoText = this.getTodoValue();
            this.addTodoHandler(todoText);
        });

        this.inputElement.addEventListener("keydown", (e) => {
            if(e.keyCode !== 13) return;
            const todoText = this.getTodoValue();
            this.addTodoHandler(todoText);
        });
    }

    getTodoValue() { 
        return document.querySelector("input[name=todo]").value;
    }

    //뷰는 자신만의 렌더링 함수를 구현할 책임을 가진다.
    render(inputData = "") {
        this.inputElement.value = inputData;
    }
}

class ListView {
    constructor(listElement) {
        this.listElement = document.querySelector(".todolist");
        this._ = {
            displayClassName : "visible"
        }
        this.todoList = null;
    }

    render(todoList, bVisible) {
        // if(!bVisible) this.listElement.style.display = "none";
        // else this.listElement.style.display = "block";

        let listHTML = todoList.reduce((html, todo) => {
            return `${html} <li> ${todo} </li> `;
        }, "")

        this.todoList = todoList;
        this.listElement.innerHTML = listHTML;
    }

    renderFold(bVisible) {
        this.todoList = document.querySelector(".todoList");

        if(!bVisible) this.todoList.classList.remove('visible');// this.listElement.style.display = "none";
        else this.todoList.classList.add('visible'); // this.listElement.style.display = "block";
    }
}

class ListFoldButtonView {
    constructor() {
        //1.자신이 포함할 엘리먼트를 쿼리셀렉터로 셀렉트해서 프로퍼티로  참조하고
        this.foldButton =  document.querySelector("button[class=fold]");
        this.todoList = document.querySelector(".todoList");
        this.foldAfterHandler = null;

        //2.포함한 엘리먼트의 뷰 이벤트 리스너를 등록해주는 함수를 호출해서 이벤트 리스너들을 등록
        this.initEvents();
    }

    initEvents() {

        this.foldButton.addEventListener("click", (e)=>{
            const text = e.target.innerHTML;
            if(text == '접기') { // e.target.innerHTML
                
                this.foldButton.innerText = '펴기';
                // this.todoList.classList.remove('visible'); //다른 뷰를 접근할것인가?
                this.foldAfterHandler({'toFold': false});
            } else {
                
                // this.todoList.classList.add('visible');
                this.foldAfterHandler({'toFold': true});
                this.foldButton.innerText = '접기';
            }
        });

    }
 
    render() {
        this.foldButton.classList.add("visible");
    }

}

// const todoModel = new TodoModel();
// const inputView = new InputView();
// const listView = new ListView();
// const listFoldButtonView = new ListFoldButtonView();
// const todoController = new TodoController(todoModel, inputView, listView, listFoldButtonView);



export {TodoModel, ListView, TodoController, InputView, ListFoldButtonView}