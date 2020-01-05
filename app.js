// Storage Controller 
const StorageCtrl = (function(){
  return {
    // Public Methods
    storeItem: function(item){
      let items;

      //Check if any items in local storage
      if(localStorage.getItem('items') === null){
        
        items = [];
        
        // push new item
        items.push(item);

        //set localStorage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // get current item list
        items = JSON.parse(localStorage.getItem('items'));
        
        // push new item
        items.push(item);

         //set localStorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      
      if(localStorage.getItem('items') === null){
      
        items = [];
      
      } else {

        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    }
  }
})()

// Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public Methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name,calories){
      let ID;
      
      // Create id
      if(data.items.length > 0){
        ID = data.items[data.items.length-1].id + 1;
      }else{
        ID = 0;
      }

      //Calories to number
      calories = parseInt(calories);

      // Create New Item
      newItem = new Item(ID, name, calories);
      
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById:function(id){
      let found = null;

      //loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
        
      });
      return found;
    },
    updateItem: function(name, calories){
      //Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id){
      // get ids
      ids = data.items.map(function(item){return item.id});

      // get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index,1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(it){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let totalCalories = 0;
      
      // Loop through each item and add calories
      data.items.forEach(function(item){
        totalCalories += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = totalCalories;
      
      // return total
      return data.totalCalories;
      
    },
    logData: function(){
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors= {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn:'.update-btn',
      deleteBtn:'.delete-btn',
      backBtn: '.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
    }


    // Public Methods
    return {
      populateItemList: function(items){
        let html = '';

        items.forEach(function(item){
          html += `<li id='item-${item.id}' class='collection-item'>
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>`;
        })
        
        // Insert List items
        document.querySelector(UISelectors.itemList).innerHTML = html;
        
      },
      getItemInput:function(){
        return{
          name:document.querySelector(UISelectors.itemNameInput).value,
          calories:document.querySelector(UISelectors.itemCaloriesInput).value
        }
      },
      addListItem: function(item){
        //Show the list
        document.querySelector(UISelectors.itemList).style.display = 'block';
        // create LI element
        const li = document.createElement('li');
        // add class
        li.className = 'collection-item';
        // add ID
        li.id = `item-${item.id}`;
        // add html
        li.innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
        `;
        //insertItem
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
      },
      updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        // Turn Nodelist into array
        listItems = Array.from(listItems);

        listItems.forEach(function(listItem){
          const itemID = listItem.getAttribute('id');

          if(itemID === `item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
        `;
          }
        });
      },
      deleteListItem: function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
      },
      clearInput: function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';  
      },
      addItemToForm: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
      }, 
      removeItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        // turn nodelist into array
        listItems = Array.from(listItems);

        listItems.forEach(function(item){
          item.remove();
        });
      },
      hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
      },
      showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = `${totalCalories}`;
      },
      clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';

      },
      showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';

      },
      getSelectors: function(){
        return UISelectors;
      }
    }
})();

// App Controller
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
  // Load Event Listener
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getSelectors();

    // Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //disable submit on enter
    document.addEventListener('keypress',function(e){
      if(e.keyCode === 13|| e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    // Edit icon click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Delete Item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Delete Item Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add Item itemAddSubmit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if(input.name !== '' && input.calories !== ''){
      //Add Item
      const newItem = ItemCtrl.addItem(input.name,input.calories);

      //add item to ui list
      UICtrl.addListItem(newItem);

      //Store in local storage
      StorageCtrl.storeItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in local storage
      StorageCtrl.storeItem(newItem);

      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();

  }

  //Update item submit
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;
      
      // break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add Item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  const itemUpdateSubmit = function(e){
    // get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete Button Event
  const itemDeleteSubmit = function(e){
    // get current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Clear items event
  const clearAllItemsClick = function(){
    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI 
    UICtrl.removeItems();

    //Hid the updateListItem
    UICtrl.hideList();
  }

  // public methods
  return{
    init: function(){
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      //fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        UICtrl.populateItemList(items);
      }

      // populate list with items
      UICtrl.populateItemList(items);

      //Get Total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //add total calories to UICtrl
      UICtrl.showTotalCalories(totalCalories);

      // Load Event loadEventListeners
      loadEventListeners();
    }
  }

})(ItemCtrl,StorageCtrl,UICtrl);



App.init();






















