const Modal = {
    
    toggle(){
        document.querySelector('.modal-overlay')
        .classList
        .toggle('active');
    }
}




const transactions = [
{
    
    description: 'Luz',
    amount:-50000,
    date:'23/01/2021'
},
{
    
    description: 'Website',
    amount:500000,
    date:'23/01/2021'
},
{
    
    description: 'Internet',
    amount:-20000,
    date:'23/01/2021'
},
];

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions));

    }
}

const Transaction = {
    all:Storage.get(),
    add(transaction){
        Transaction.all.push(transaction);

        App.reload();
    },
    remove(index){
        Transaction.all.splice(index,1);
        App.reload();
    },
    incomes(){
        let income = 0;

        Transaction.all.forEach(transaction =>{
            if(transaction.amount > 0){
                income += transaction.amount;
            }

        });


        return income;
    },
    expenses(){
        let expense = 0;

        Transaction.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expense += transaction.amount;
            }

        });


        return expense;
    },
    total(){
        // let total = Transaction.incomes() + Transaction.expenses();
        // console.log(total);
        // return total;
        
        return Transaction.incomes() + Transaction.expenses();
    }
}


const DOM = {
    transactionsContainer:document.querySelector('#data-table tbody'),
    addTransaction(transaction,index){
        
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction,index){
        const CSSclass = transaction.amount > 0 ? "income":"expense";
        
        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
    
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
    
        `
        
        return html;
    },
    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML =Utils.formatCurrency(Transaction.expenses());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
            
        Utils.formatTotalCard();    
        
            
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    }


}

const Utils = {
    formatAmount(value){
        value = value * 100;
        
        return Math.round(value);
    },
    formatDate(date){
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        });

        return  signal + value;
    },
    formatTotalCard(){
        // const totalCardContent = document.querySelector('.card.total #totalDisplay').innerText.includes('-');
        const totalCardContent = document.querySelector('.card.total #totalDisplay').innerText;
        const num = Number(totalCardContent.replace(/[^0-9\.-]+/g,""));
        const totalCard = document.querySelector('.card.total');

        if(num<0){
            totalCard.classList.add('red-bg');
            totalCard.classList.remove('blue-bg');
        }else if(num>0){
            totalCard.classList.add('blue-bg');
            totalCard.classList.remove('red-bg');

            
        }else if(num === 0){
            totalCard.classList.remove('blue-bg');
            totalCard.classList.remove('red-bg');
        }
    }
}

const Form = {
    description:document.querySelector('input#description'),
    amount:document.querySelector('input#amount'),
    date:document.querySelector('input#date'),
    getValues(){
        return{
            description:Form.description.value,
            amount:Form.amount.value,
            date:Form.date.value
        }
    },
    
    validateFields(){
        const {description, amount, date} = Form.getValues();

        if(description.trim() === "" || 
           amount.trim() === "" || 
           date.trim() === ""){
               throw new Error("Por favor, preencha todos os campos");
           }
        
    },
    formatValues(){
        let {description, amount, date} = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }

        
    },
    clearFields(){
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event){
        event.preventDefault();


        try {
            // Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.toggle();
            
        } catch (error) {
            // alert(error.message);
            console.error(error);
        }


    }
}



const App = {
    init() {
        Transaction.all.forEach((transaction, index)=>{
            DOM.addTransaction(transaction,index);
        });
        DOM.updateBalance();
       
        
        Storage.set(Transaction.all);
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
}



App.init();



// Transaction.add({
    
//     description:'Alo',
//     amount:200,
//     date:'23/01/2021'

// });
// const td = {

//    toggle:function(str){
//        const minus = str.closest('tr').classList;
          
    
//     //    minus.remove('restored-item');
//     //    minus.add('removed-item');
//        minus.add('removed-item');
//            setTimeout(() =>{

//                minus.add('none');
//            },800);
    
    

    
    
//    }
// }


