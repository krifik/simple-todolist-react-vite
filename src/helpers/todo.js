
const todo = {

  CreateTodo: function(event) {
      const activity = {
        id: todo.GeneratedId(),
        activity: event.target.value,
        child: [],
        type: "TEST"
      }
      
      if(event.key === 'Enter') return activity
      return false;
  },
  
  DeleteTodo: function () {
    console.log("DELETED");
  },
  GeneratedId: function() {
    return Date.now()
  },
  FindNestedAndDelete: function(item, items, modeInsert = true) {
    let results = []
    
    items.forEach(element => {
      if(element.id === item.id){
        console.log("PARENT");
        const result = items.filter((el) => {
          return el.id !== item.id
        })
        results = result

      } 
      element.child.forEach((elNest) => {
        if(elNest.id === item.id) {
          const result = element.child.filter((el) => {
            return el.id !== item.id
          })
          element.child = result
          results = element
          console.log("CHILD", results);

        } 
        elNest.child.forEach((elNested) => {
          if(elNested.id === item.id) {
            console.log("NEST CHILD");
            const result = elNest.child.filter((el) => {
              return el.id !== item.id
            })
            elNest.child = result
            results = element
          }
          })
      })
    });
    console.log();
    return results
  },
  FindAndCreate: function(droppable, draggable, items) {
    let results = []
    
    items.forEach(element => {
      if(element.id === droppable.id){
        console.log("PARENT");
        const result = items.filter((el) => {
          return el.id !== droppable.id
        })
        results = result
  
      } 
      element.child.forEach((elNest) => {
        if(elNest.id === droppable.id) {
          const result = element.child.filter((el) => {
            return el.id !== droppable.id
          })
          // element.child = result
          elNest.child.push(draggable)
          results = element
          console.log("CHILD", elNest.child);

        } 
        elNest.child.forEach((elNested) => {
          if(elNested.id === droppable.id) {
            console.log("NEST CHILD");
            const result = elNest.child.filter((el) => {
              return el.id !== droppable.id
            })
            // elNest.child = result
            elNest.child.push(draggable)
            results = element
          }
          })
      })
    });
    console.log();
    return results
  }
}

export default todo