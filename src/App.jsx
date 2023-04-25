import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import todoHelper from './helpers/todo.js'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [todos, setTodos] = useState([])
  const [activity, setActivity] = useState("")
  const [onDrag, setOnDrag] = useState({
    id: "", activity: "", child: [], type: ""
  })
  const [idOnDrag, setIdOnDrag] = useState(null)
  const inputRef = useRef(null)
  // useEffect(() => {
  //   // handleKeyDown()
  //   console.log(todos)
  // }, [todos])
  function handleKeyDown(event)  {
    let todo = todoHelper.CreateTodo(event)
    if (!todo) return;
    if (!todo.activity) return
    if(event.key === "Enter") {
      setActivity("")
    } 
    setTodos([...todos, todo])
  }

  function handleDrag(event) {
    // console.log(event)
  }
  function handleDragStart(event, onDragItem) {
    event.stopPropagation()
    event.target.classList.add("start")
    console.log("%cSTART", "background-color: red; color: white", onDragItem)
    setOnDrag({...onDrag,  id: onDragItem.id, activity: onDragItem.activity, child: onDragItem.child})
  }
  function handleDragEnd(event) {
    console.log("%cEND", "background-color: red; color: white")
    event.target.classList.remove("enter","over", "end", "start","top", "bot")
  }
  function handleDragEnter(event) {
    console.log("%cENTER", "background-color: red; color: white")
    event.target.classList.add("enter")
    // event.target.classList.remove("enter")
  }
  function handleDragExit(event) {
    console.log("%cEXIT", "background-color: black; color: white")
  }

  function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    // console.log("%cOVER", "background-color: red; color: white")
    // console.log(event);
    let position = event.pageY - event.currentTarget.getBoundingClientRect().y;
    let height = event.currentTarget.getBoundingClientRect().height 
    
    // drag cursor on 80% from bottom offset element
    if ((80/100 * height) < position) {
      console.log("IF");
      event.target.classList.add("bot")
      event.target.classList.remove("top", "over")
    // drag cursor on 20% from bottom offset element
    
    } else if((20/100 * height) > position) {
        event.target.classList.add("top");
        event.target.classList.remove("bot", "over")
    // drag cursor on center offset element
    } else {
        // console.log("ELSE");
        event.target.classList.add("over");
        event.target.classList.remove("top", "bot")
      }
  }

  function handleDragLeave(event) {
    // console.log("%cLEAVE", "background-color: blue; color: white")
    event.target.classList.remove( "over", "end", "enter", "top", "bot", "start")
  }
  function handleClick(event) {
    event.stopPropagation()
    console.log(event,"%cClicked", "background-color: salmon; color: black")
  }
  function handleOnDrop(event, elementDroppable) {
    // handle if draggable element drop on itself
    event.stopPropagation()
    if(elementDroppable.id === onDrag.id) return;
    let position = event.pageY - event.currentTarget.getBoundingClientRect().y;
    let height = event.currentTarget.getBoundingClientRect().height 
    // console.log(onDrag);
    // drop cursor on 80% from bottom offset element
    const todoIndexDroppable = todos.findIndex((el) => {
      return el.id === elementDroppable.id
    })
    
    const todoIndexDraggable = todos.findIndex((el) => {
      return el.id === onDrag.id
    })
    let reorderTodos = todos.filter((el) => {
      return el.id !== onDrag.id
    })

      // drop cursor on 20% from top offset element
    if ((80/100 * height) < position) {
      console.log("BOT")
      console.log(todoHelper.FindNestedAndDelete(onDrag, todos))
      reorderTodos.splice(todoIndexDroppable, 0, {
        id: onDrag.id,
        activity: onDrag.activity,
        child: onDrag.child,
        type: "TEST"
      })
      setTodos(reorderTodos)
      // drop cursor on 20% from bottom offset element
    } else if((20/100 * height) > position) {
      console.log("TOP")
      console.log(todoHelper.FindNestedAndDelete(onDrag, todos))

      reorderTodos.splice(todoIndexDroppable, 0, {
        id: onDrag.id,
        activity: onDrag.activity,
        child: onDrag.child,
        type: "TEST"
      })
      setTodos(reorderTodos)
    // drop cursor on center offset element
    } else {
      // reorderTodos.splice(todoIndexDroppable, 0, {
      //   id: onDrag.id,
      //   activity: onDrag.activity,
      //   child: onDrag.child
      // })
      // console.log();
      if(elementDroppable.type === "TEST") {
        console.log("TEST")
        
        reorderTodos[todoIndexDroppable].child = [...reorderTodos[todoIndexDroppable].child, {
          id: onDrag.id,
          activity: onDrag.activity,
          child: onDrag.child,
          type: "SUBTEST"
        }]
        setTodos(reorderTodos)
      } else if(elementDroppable.type === "SUBTEST") {
        console.log("SUBTEST")

        const newTodos = reorderTodos.filter((el) => {
          return elementDroppable.id !== el.id
        })
        // reorderTodos = [...reorderTodos, todoHelper.FindNestedAndDelete(onDrag, todos)]
        // reorderTodos = [...reorderTodos, todoHelper.FindAndCreate(onDrag, todos)]

        console.log(todoHelper.FindAndCreate(elementDroppable, onDrag, todos))

        setTodos(reorderTodos)
      }
      // console.log(reorderTodos[todoIndexDroppable])

      }
    event.target.classList.remove("enter","over", "end", "start","top", "bot")

  }
  return (
    <>
    <h1>
     Simple Todolist 
    </h1>
    <h5>Press enter to add new activity to todolist</h5>
    <button className='btn-ondrag'>Status On Drag {onDrag.activity}</button>
    <br />
    <input type="text" value={activity} onChange={(event) => setActivity(event.target.value)} onKeyDown={(event) => handleKeyDown(event)} />
    <ul>
      {todos.map((itemParent, indexParent) => {
        return <li className='draggable-cursor panel' draggable
        onDrop={(event) => handleOnDrop(event, itemParent)}
        onDragStart={(event) => handleDragStart(event, itemParent)}
        onDragEnd={(event) => handleDragEnd(event)}
        onDrag={(event) => handleDrag(event)}
        onDragOver={(event) => handleDragOver(event)}
        onDragLeave={(event) => handleDragLeave(event)}
        onClick={(event) => handleClick(event)}
        // onDragEnter={(event) => handleDragEnter(event)}
        // onDragOverCapture={(event) => handleDragExit(event)}
        key={itemParent.id}>
          {indexParent+1}. {itemParent.activity} 
          {itemParent.child.map((itemChild, indexChild) => {
            return <div key={itemChild.id} draggable className='draggable-cursor parent'
            onDrop={(event) => handleOnDrop(event, itemChild)}
            onDragStart={(event) => handleDragStart(event, itemChild)}
            onDragEnd={(event) => handleDragEnd(event)}
            onDrag={(event) => handleDrag(event)}
            onDragOver={(event) => handleDragOver(event)}
            onDragLeave={(event) => handleDragLeave(event)}
            onClick={(event) => handleClick(event)}
            >
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {indexParent+1}. {indexChild+1}. {itemChild.activity}
              {itemChild.child.map((itemNestedChild, index) => {
                return <div key={itemNestedChild.id} draggable className='draggable-cursor sub'
                onDrop={(event) => handleOnDrop(event, itemNestedChild)}
                onDragStart={(event) => handleDragStart(event, itemNestedChild)}
                onDragEnd={(event) => handleDragEnd(event)}
                onDrag={(event) => handleDrag(event)}
                onDragOver={(event) => handleDragOver(event)}
                onDragLeave={(event) => handleDragLeave(event)}
                onClick={(event) => handleDragStart(event)}
                >
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {indexParent+1}. {indexChild+1}. {index+1}. {itemNestedChild.activity}
                </div>
              })}
              </div>
          })}
          </li>
      })}
    </ul>
    </>
  )
}

export default App
