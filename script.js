//ITEM CONTROLLER IIFE(Immediately Invoked Function Expression) 
// runs immediatley as it is defined
// (used to create a private scope and prevent variable pollution in the global scope.)
const itemCtrl=(function(){
    //item constructor function
    const item=function(id,details,amount){
        this.id=id;//Assigns the function parameter id to the property id of the object being created.
        this.details=details;
        this.amount=amount;
    }
    //data structure
    const data={
        items:[]//an empty array to store all income and expenses items
    }
    //public method
    return{
        //Why return an object? → To expose only selected functionalities while keeping data private.
        logData:function(){
            return data;
        },
        addMoney:function(description,amount){
            let ID =itemCtrl.createID();
            newMoney= new item(ID , description,amount);
            data.items.push(newMoney);
            return newMoney;
        },
        createID:function(){
            //create a random id number between 0 and 10000
            const idNum = Math.floor(Math.random()*10000);
            return idNum;
        },
        getIdNumber:function(item){
            //get the item ID
            const amountID=(item.parentElement.id);
            // console.log(amountID)
            //get the id in a array
            const itemArray=amountID.split('-');
            //get the id from the array
            // console.log(itemArray);
            const id=parseInt(itemArray[1]);
            return id;
        },
        deleteAmountArray:function(id){
            //get the id's
            const ids=data.items.map(function(item){
                //return item with the data
                return item.id;
            });
            //get the index
            const index=ids.indexOf(id)
            //remove the indexed item
            data.items.splice(index,1);
        }
    };
})();//closes and invokes IIFE
//UI controller encapsulate variables IIFE
const UICtrl=(function(){
    //ui selectors contains CSS selectors for diff elements
    const UISelectors={
        incomebtn:'#add_income',
        expenseBtn:'#add_expense',
        description:'#details',
        amount:'#amount',
        moneyEarned:'#income',
        moneyAvailable:'#total',
        moneySpent:'#expense',
        incomeList:'#income_container',
        expenseList:'#expense_container',
        incomeItem:'.income3_amount',
        expenseItem:'.expense4_amount',
        itemsContainer:'.items'
    };
    //public methods
    return{
        //return ui selectors (get selectors is a method used to acces to UI selectors
        // and allow access to them from outside module)
        getSelectors:function(){
            return UISelectors
        },
        getDescriptionInput:function(){// Fetches description input from the user.
            return{
                descriptionInput:document.querySelector(UISelectors.description).value//Gets the text input from the description field.
            }
        },
        getValueInput:function(){
            return{
                amountInput:document.querySelector(UISelectors.amount).value
            }
        },
        addIncomeItem:function(item){
        const div=document.createElement('div');
        div.classList='item_income';
        //add id to the item
        div.id=`item-${item.id}`
        //add html
        div.innerHTML=`
                <h4>${item.details}</h4>
            <p id="symbol3">$</p>
            <span class="income3_amount">${item.amount}</span>
            <i class="far fa-trash-alt"></i>
        `;
        document.querySelector(UISelectors.incomeList).
        insertAdjacentElement('beforeend',div);
        },
        clearInputs:function(){
            document.querySelector(UISelectors.description).value=''
            document.querySelector(UISelectors.amount).value=''
        },
        updateEarned:function(){
            //all earned items
            const allIncome=document.querySelectorAll(UISelectors.incomeItem);
            //array items
            const incomeCount=[...allIncome].map(item => +item.innerHTML);
            //calculate sum them
            const incomeSum=incomeCount.reduce(function(a,b){
                return a+b;
            },0);
            //display the sum
            const earnedTotal=document.querySelector(UISelectors.moneyEarned).innerHTML=incomeSum.toFixed(2);
        },
        addExpenseItem:function(item){
            const div=document.createElement('div');
        div.classList='item_expense';
        //add id to the item
        div.id=`item-${item.id}`
        //add html
        div.innerHTML=`
                <h4>${item.details}</h4>
            <p id="symbol4">$</p>
            <span class="expense4_amount">${item.amount}</span>
            <i class="far fa-trash-alt"></i>
        `;
        document.querySelector(UISelectors.expenseList).
        insertAdjacentElement('beforeend',div);
        },
        clearInputs:function(){
            document.querySelector(UISelectors.description).value=''
            document.querySelector(UISelectors.amount).value=''
        },
        updateSpent:function(){
            //all spent items
            const allExpense=document.querySelectorAll(UISelectors.expenseItem);
            //array items
            const expenseCount=[...allExpense].map(item => +item.innerHTML);
            //calculate sum them
            const expenseSum=expenseCount.reduce(function(a,b){
                return a+b;
            },0);
            //display the sum
            const spentTotal=document.querySelector(UISelectors.moneySpent).innerHTML=expenseSum.toFixed(2);
        },
        updateTotal:function(){
            const earned=document.querySelector(UISelectors.moneyEarned);
            const spent=document.querySelector(UISelectors.moneySpent);
            const available=document.querySelector(UISelectors.moneyAvailable);
            available.innerHTML=((+earned.innerHTML)-(+spent.innerHTML)).toFixed(2)
        },
        deleteAmount:function(id){
            //select the id which is created and delete it
            const amountID=`#item-${id}`;
            //select the amount with id to delete it from all
            const amountDelete=document.querySelector(amountID);
            //remove the selected one
            amountDelete.remove();
        }
    }

})();
//APP controller
const App=(function(){
    const loadEventListeners=function(){
        const UISelectors=UICtrl.getSelectors();//Fetches UI selectors from UICtrl.
        document.querySelector(UISelectors.incomebtn).addEventListener('click', addIncome);
        //Finds the button using its selector (#add_income).
        //Selects the "Add to Earned" button (#add_income).Adds a click event listener that triggers the addIncome function.
        document.querySelector(UISelectors.expenseBtn).addEventListener('click', addExpense);
        //delete item
        document.querySelector(UISelectors.itemsContainer).addEventListener('click',deleteItem);
    }
    const addIncome=function(){
        const description=UICtrl.getDescriptionInput();//Fetches description input.
        const amount=UICtrl.getValueInput();
        // console.log(description,amount)//logs input value to console
        if(description.descriptionInput !='' && amount.amountInput !=''){
            const newMoney = itemCtrl.addMoney(description.descriptionInput,amount.amountInput);
            //add items to the list
            UICtrl.addIncomeItem(newMoney);
            // clear the inputs every time
            UICtrl.clearInputs();
            //update the earned data
            UICtrl.updateEarned();
            //calculate total balance
            UICtrl.updateTotal();
            // const checkData =itemCtrl.logData();
            // console.log(checkData);
        }
    };
    //add the expense or i spent
    const addExpense=function(){
        const description=UICtrl.getDescriptionInput();//Fetches description input.
        const amount=UICtrl.getValueInput();
        // console.log(description,amount)//logs input value to console
        if(description.descriptionInput !='' && amount.amountInput !=''){
            const newMoney = itemCtrl.addMoney(description.descriptionInput,amount.amountInput);
            //add items to the list
            UICtrl.addExpenseItem(newMoney);
            // clear the inputs every time
            UICtrl.clearInputs();
            //update the spent data
            UICtrl.updateSpent();
            //calculate total balance
            UICtrl.updateTotal();
            // const checkData =itemCtrl.logData();
            // console.log(checkData);
        }
    };
    //deleting the items
    const deleteItem=function(e){
        if(e.target.classList.contains('far')){
            // console.log('del');
            //get the particular id number of the item
            const id=itemCtrl.getIdNumber(e.target)
            //delete the amount from the ui
            UICtrl.deleteAmount(id);
            //delete amount from the data
            itemCtrl.deleteAmountArray(id);
            //update the earned data
            UICtrl.updateEarned();
            //update the spent data
            UICtrl.updateSpent();
            //calculate total balance
            UICtrl.updateTotal();
            // const checkData =itemCtrl.logData();
            // console.log(checkData);
        }
        e.preventDefault()
    }
    //init function
    return{
        init: function(){//It is a public method inside the App module that initializes the application.
            //It runs loadEventListeners(), which sets up all event listeners.
            loadEventListeners();
        }
    };
})(itemCtrl,UICtrl);
App.init();