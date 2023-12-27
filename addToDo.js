document.addEventListener("DOMContentLoaded", async () => {
  const toDoInput = document.getElementById("toDoInput");
  const todoList_lists = document.getElementById("todoList_lists");
  const inputForm = document.getElementById("inputForm");
  const searchInput = document.getElementById("search");
  const noToDo = document.getElementById("no__to__do");
  const todoList = document.getElementById("todoList");
  const circle__total__lists = document.getElementById("circle__total__lists");
  const circle__completed__lists = document.getElementById(
    "circle__completed__lists"
  );
  const circle__unCompleted__lists = document.getElementById(
    "circle__unCompleted__lists"
  );
  const todoResult = document.getElementById("todo__result");
  const notFound = document.getElementById("notFound");
  let lists_items = document.querySelectorAll("li");
  const deleteContainer = document.getElementById("deleteContainer");
  const noBtn = document.getElementById("no__btn");
  const yesBtn = document.getElementById("yes__btn");

  function getFromLoalstorage() {
    let toDoLists = JSON.parse(localStorage.getItem("toDoLists")) || [];
    console.log(toDoLists.length);
    return toDoLists;
  }

  let toDoLists = getFromLoalstorage();

  function storeOnLocalStorage(toDoLists) {
    return localStorage.setItem("toDoLists", JSON.stringify(toDoLists));
  }

  function emptyListUi(toDoLists) {
    if (toDoLists.length === 0) {
      noToDo.style.display = "flex";
      todoResult.style.display = "none";
    } else {
      noToDo.style.display = "none";
      todoResult.style.display = "flex";
    }

    return;
  }

  //check to list empty or not
  emptyListUi(toDoLists);

  function totalCompletedLists(toDoLists) {
    let numOfCompleted = toDoLists.filter(
      (todo) => todo.complete === true
    ).length;

    return numOfCompleted;
  }

  function totalUncompletedLists(toDoLists) {
    let numOfUncompleted = toDoLists.filter(
      (todo) => todo.complete === false
    ).length;

    return numOfUncompleted;
  }

  let completeResult = (toDoLists) => {
    const totalLists = toDoLists.length;
    const numOfCompleted = totalCompletedLists(toDoLists);
    const numOfUncompleted = totalUncompletedLists(toDoLists);
    circle__total__lists.innerHTML = totalLists;
    circle__completed__lists.innerHTML = numOfCompleted;
    circle__unCompleted__lists.innerHTML = numOfUncompleted;

    return;
  };

  let completeResultUi = (todo, li, h2, p2, completeBtn) => {
    if (todo.complete) {
      li.classList.add("todo__complete");
      h2.classList.add("todo__complete__text");
      p2.classList.add("todo__complete__text");
      completeBtn.classList.add("todo__complete__text");
      completeBtn.classList.add("btn__complete__toggleBg");
    } else {
      li.classList.remove("todo__complete");
      h2.classList.remove("todo__complete__text");
      p2.classList.remove("todo__complete__text");
      completeBtn.classList.remove("todo__complete__text");
      completeBtn.classList.remove("btn__complete__toggleBg");
    }

    return;
  };

  function returnLi(todo) {
    let li = document.createElement("li");
    li.setAttribute("value", `${todo.todoName}`);
    let contentDiv = document.createElement("div");
    contentDiv.classList.add("list__content");
    let h2 = document.createElement("h2");
    h2.classList.add("todo__title");
    let p2 = document.createElement("p");
    let todoNode = document.createTextNode(`Todo: ${todo.todoName}`);
    let todoDate = document.createTextNode(`Date: ${todo.submitDate}`);
    let buttondiv = document.createElement("div");
    buttondiv.classList.add("btn__div");
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "DELETE";
    deleteBtn.classList.add("btn__danger");
    let completeBtn = document.createElement("button");
    completeBtn.innerHTML = "COMPLETE";
    completeBtn.classList.add("btn__complete");

    h2.appendChild(todoNode);
    contentDiv.appendChild(h2);
    p2.appendChild(todoDate);
    contentDiv.appendChild(p2);
    buttondiv.appendChild(completeBtn);
    buttondiv.appendChild(deleteBtn);
    li.appendChild(contentDiv);
    li.appendChild(buttondiv);
    todoList_lists.appendChild(li);

    deleteFun(deleteBtn, li);

    emptyListUi(toDoLists);

    updateList(completeBtn, li, h2, p2, completeBtn);

    completeResult(toDoLists);

    completeResultUi(todo, li, h2, p2, completeBtn);

    return li;
  }

  //DELETE
  function deleteFun(deleteBtn, li) {
    let confirmDelete = false;

    deleteBtn.addEventListener("click", async () => {
      // let confirmDelete = confirm("Are you sure want to Delete it.");
      deleteContainer.style.display = "flex";

      noBtn.addEventListener("click", async () => {
        console.log("no...........");
        deleteContainer.style.display = "none";
      });

      yesBtn.addEventListener("click", async () => {
        deleteContainer.style.display = "none";
        confirmDelete = true;
        // console.log(confirmDelete);
        let value = li.getAttributeNode("value").value;
        console.log(li.getAttributeNode("value").value);

        if (confirmDelete) {
          toDoLists = toDoLists.filter(
            (todo, todoIndx) => value !== todo.todoName
          );

          emptyListUi(toDoLists);

          storeOnLocalStorage(toDoLists);

          completeResult(toDoLists);

          li.remove();
        }
      });

      // // console.log(confirmDelete);
      // let value = li.getAttributeNode("value").value;
      // console.log(li.getAttributeNode("value").value);

      // if (confirmDelete) {
      //   toDoLists = toDoLists.filter(
      //     (todo, todoIndx) => value !== todo.todoName
      //   );

      //   emptyListUi(toDoLists);

      //   storeOnLocalStorage(toDoLists);

      //   completeResult(toDoLists);

      //   li.remove();
      // }
    });

    return;
  }

  //UPDATE
  function updateList(completeBtn, li, p, p2, completeBtn) {
    completeBtn.addEventListener("click", async () => {
      let value = li.getAttributeNode("value").value;
      console.log(li.getAttributeNode("value").value);
      console.log(toDoLists);

      const index = toDoLists.findIndex((list) => {
        return list.todoName === value;
      });

      if (index !== -1) {
        toDoLists[index].complete = !toDoLists[index].complete;
      }
      storeOnLocalStorage(toDoLists);

      let newTodo = toDoLists[index];
      completeResult(toDoLists);

      completeResultUi(newTodo, li, p, p2, completeBtn);
    });

    return;
  }

  //shown in page...
  toDoLists.forEach((todo, indx) => {
    const li = returnLi(todo);
  });

  let inputList = "";
  let list;

  toDoInput.addEventListener("change", async (e) => {
    inputList = e.target.value;
  });

  inputForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (inputList.trim() === "") {
      alert("Add to do...");
    } else {
      // check todo exist or not

      let exitTodo = toDoLists.find((list) => list.todoName === inputList);

      if (exitTodo) {
        alert("Todo with same name & charecter not accepted ..");
      } else {
        list = {
          todoName: inputList,
          submitDate: new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          complete: false,
        };
        console.log(list);
        toDoLists = [...toDoLists, list];
        storeOnLocalStorage(toDoLists);
        getFromLoalstorage();
        returnLi(list);
        lists_items = document.querySelectorAll("li");

        toDoInput.value = "";
        inputList = "";
      }
    }
  });

  let serach_key = "";
  const searchFun = () => {
    searchInput.addEventListener("input", async () => {
      let getData = getFromLoalstorage();
      if (getData) {
        if (searchInput.value.trim() === "") {
          // alert("Search to do...");
          notFound.style.display = "none";
          lists_items.forEach((li, indx) => {
            todoList_lists.appendChild(li);
          });

          getData.forEach((data) => {
            returnLi(data);
          });
        } else {
          serach_key = searchInput.value;

          let matchList = 0;
          lists_items.forEach((li) => {
            let values = li.getAttributeNode("value").value;

            if (values.includes(serach_key)) {
              todoList_lists.appendChild(li);
              matchList++;
              console.log("==================================", matchList);
            } else {
              notFound.style.display = "none";
              li.remove();
            }
          });

          // Update lists_items after modifying the DOM
          lists_items = document.querySelectorAll("li");

          if (matchList >= 1) {
            notFound.style.display = "none";
            console.log(matchList);
          } else {
            notFound.style.display = "flex";
          }
        }
      }
    });
    return;
  };

  searchFun();

  // const searchBlurFun = () => {
  //   searchInput.addEventListener("blur", () => {
  //     console.log(typeof searchInput.value);

  //     if (searchInput.value === "") {
  //       console.log("empty search with lists: ", lists);
  //       lists.forEach((li) => {
  //         todoList_lists.appendChild(li);
  //       });

  //       if (lists) {
  //         notFound.style.display = "none";
  //       }
  //     }
  //   });
  // };
  // searchBlurFun();
});
