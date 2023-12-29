document.addEventListener("DOMContentLoaded", async () => {
  let localToDoLists;
  function getFromLoalstorage() {
    localToDoLists = JSON.parse(localStorage.getItem("toDoLists")) || [];
    return localToDoLists;
  }
  getFromLoalstorage();

  function checkEmptyListUi(localToDoLists) {
    if (localToDoLists.length === 0) {
      noToDo.style.display = "flex";
      return true;
    }
    noToDo.style.display = "none";
    return false;
  }

  function storeOnLocalStorage(newLocalToDoLists) {
    localStorage.setItem("toDoLists", JSON.stringify(newLocalToDoLists));
    return true;
  }

  function returnLi(todo) {
    let li = document.createElement("li");
    li.setAttribute("value", `${todo.todoName}`);
    let contentDiv = document.createElement("div");
    contentDiv.classList.add("list__content");
    let h2 = document.createElement("h2");
    h2.classList.add("todo__title");
    let p2 = document.createElement("p");
    let todoNode = document.createTextNode(`${todo.todoName}`);
    let todoDate = document.createTextNode(`${todo.submitDate}`);
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
    updateList(li, h2, p2, completeBtn);
    completeResultUi(todo, li, h2, p2, completeBtn);

    return true;
  }

  function totalCompletedLists(localToDoLists) {
    let numOfCompleted = localToDoLists.filter(
      (todo) => todo.complete === true
    ).length;

    return numOfCompleted;
  }

  function totalUncompletedLists(localToDoLists) {
    let numOfUncompleted = localToDoLists.filter(
      (todo) => todo.complete === false
    ).length;

    return numOfUncompleted;
  }

  let completeResult = (localToDoLists) => {
    const totalLists = localToDoLists.length;
    const numOfCompleted = totalCompletedLists(localToDoLists);
    const numOfUncompleted = totalUncompletedLists(localToDoLists);
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

  //
  const sortByName = (arrayObj) => {
    let newArrayObj = arrayObj.sort((a, b) => {
      const nameA = a.todoName.toLowerCase();
      const nameB = b.todoName.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    return newArrayObj;
  };

  //

  const toDoInput = document.getElementById("toDoInput");
  const todoList_lists = document.getElementById("todoList_lists");
  const inputForm = document.getElementById("inputForm");
  const searchInput = document.getElementById("search");
  const noToDo = document.getElementById("no__to__do");
  const toDoListsContainer = document.getElementById("localToDoLists");
  const circle__total__lists = document.getElementById("circle__total__lists");
  const circle__completed__lists = document.getElementById(
    "circle__completed__lists"
  );
  const circle__unCompleted__lists = document.getElementById(
    "circle__unCompleted__lists"
  );
  const todoResult = document.getElementById("todo__result");
  const notFound = document.getElementById("notFound");

  const deleteContainer = document.getElementById("deleteContainer");
  const noBtn = document.getElementById("no__btn");
  const yesBtn = document.getElementById("yes__btn");

  let domToDoLists;
  if (localToDoLists) {
    completeResult(localToDoLists);
    checkEmptyListUi(localToDoLists);

    localToDoLists.forEach((todo, indx) => {
      let isShownListsInDom = returnLi(todo);

      if (isShownListsInDom) {
        domToDoLists = document.querySelectorAll("li");
      }
    });
  }

  let inputList = "";
  toDoInput.addEventListener("change", async (e) => {
    inputList = e.target.value;
  });

  inputForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (inputList.trim() === "") {
      return;
    } else {
      let exitTodo = localToDoLists.find((list) => list.todoName === inputList);

      if (exitTodo) {
        alert("Todo with same name & charecter not accepted ..");
        return;
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

        let newLocalToDoLists = [...localToDoLists, list];

        newLocalToDoLists = sortByName(newLocalToDoLists);

        let isStore = storeOnLocalStorage(newLocalToDoLists);

        if (isStore) {
          let nextLocalToDoLists = getFromLoalstorage();

          todoList_lists.innerHTML = "";

          completeResult(nextLocalToDoLists);

          nextLocalToDoLists.forEach((todo) => {
            let isAgainShownListsInDom = returnLi(todo);

            if (isAgainShownListsInDom) {
              let nextDomToDoLists = document.querySelectorAll("li");
            }
          });
        }

        toDoInput.value = "";
        inputList = "";
        noToDo.style.display = "none";
      }
    }
  });

  //   //DELETE
  function deleteFun(deleteBtn, li) {
    let confirmDelete = false;

    deleteBtn.addEventListener("click", async () => {
      deleteContainer.style.display = "flex";

      noBtn.addEventListener("click", async () => {
        deleteContainer.style.display = "none";
      });

      yesBtn.addEventListener("click", async () => {
        deleteContainer.style.display = "none";
        confirmDelete = true;
        let value = li.getAttributeNode("value").value;

        if (confirmDelete) {
          const getLocalData = await getFromLoalstorage();

          if (getLocalData) {
            let newLocalToDoLists = getLocalData.filter(
              (todo, todoIndx) => value !== todo.todoName
            );

            let isStore = storeOnLocalStorage(newLocalToDoLists);

            if (isStore) {
              let nextLocalToDoLists = await getFromLoalstorage();
              if (nextLocalToDoLists.length === 0) {
                noToDo.style.display = "flex";
              }

              todoList_lists.innerHTML = "";

              completeResult(nextLocalToDoLists);

              nextLocalToDoLists.forEach((todo) => {
                let isAgainShownListsInDom = returnLi(todo);

                if (isAgainShownListsInDom) {
                  let nextDomToDoLists = document.querySelectorAll("li");
                }
              });
            }
          }
        }
      });
    });
    return;
  }

  async function updateList(li, p, p2, completeBtn) {
    completeBtn.addEventListener("click", async () => {
      let value = li.getAttributeNode("value").value;

      let getLocalData = await getFromLoalstorage();

      const index = await getLocalData.findIndex((list) => {
        return list.todoName === value;
      });

      if (index !== -1) {
        getLocalData[index].complete = !getLocalData[index].complete;
      }

      let isStore = storeOnLocalStorage(getLocalData);

      if (isStore) {
        let nextLocalToDoLists = await getFromLoalstorage();

        todoList_lists.innerHTML = "";

        completeResult(nextLocalToDoLists);

        nextLocalToDoLists.forEach((todo) => {
          let isAgainShownListsInDom = returnLi(todo);

          if (isAgainShownListsInDom) {
            let nextDomToDoLists = document.querySelectorAll("li");
          }
        });
      }
    });

    return;
  }

  const searchFun = () => {
    searchInput.addEventListener("input", async () => {
      let getLocalData = await getFromLoalstorage();
      let searchKey = searchInput.value.trim().toLowerCase();

      if (searchKey === "") {
        todoList_lists.innerHTML = "";

        getLocalData.forEach((todo) => {
          returnLi(todo);
        });

        notFound.style.display = "none";
      } else {
        let matchToDolists = await getLocalData.filter((data) =>
          data.todoName.toLowerCase().includes(searchKey)
        );
        todoList_lists.innerHTML = "";

        if (matchToDolists.length === 0) {
          notFound.style.display = "flex";
        } else {
          matchToDolists.forEach((todo) => {
            returnLi(todo);
          });
        }
      }
    });

    return;
  };

  searchFun();
});
