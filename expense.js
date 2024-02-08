var transactions = [];
var balanceAmount = 0.0;
var incomeAmount = 0.0;
var expenseAmount = 0.0;
transactions = JSON.parse(localStorage.getItem("transactions")) || [];
function getlist() {
  var status = document.querySelector(".status");
  if (transactions.length === 0) {
    status.innerHTML = "No Transactions";
  } else {
    status.innerHTML = "";
    transactions.forEach((trans) => {
      addedcard(trans);
    });
  }
}
getlist();
function calculate(trans, isEdit = false) {
  if (isEdit) {
    if (trans.type === "income") {
      incomeAmount -= trans.amount - 0;
      balanceAmount -= trans.amount - 0;
    } else {
      expenseAmount -= trans.amount - 0;
      balanceAmount += trans.amount - 0;
    }
  } else {
    if (trans.type === "income") {
      incomeAmount += trans.amount - 0;
      balanceAmount += trans.amount - 0;
    } else {
      expenseAmount += trans.amount - 0;
      balanceAmount -= trans.amount - 0;
    }
  }
  var balanceSec = document.querySelector(".balance p");
  balanceSec.textContent = `$ ${balanceAmount}`;
  var incomeSec = document.querySelector(".income p");
  incomeSec.textContent = `$ ${incomeAmount}`;
  var expenseSec = document.querySelector(".expense p");
  expenseSec.textContent = `$ ${expenseAmount}`;
}
function addTransaction(initialValues = {}, existingCard = null) {
  var transactionFormDiv = document.createElement("div");
  transactionFormDiv.id = "transactionForm";
  //Close button
  var closeButton = document.createElement("span");
  closeButton.innerHTML =
    '<i class="fa-solid fa-xmark" style="color:red;font-size: 25px;"></i>';
  closeButton.style.float = "right";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = function () {
    document.body.removeChild(transactionFormDiv);
  };

  // Form
  var form = document.createElement("form");

  var itemLabel = document.createElement("label");
  itemLabel.textContent = "Item Name";
  itemLabel.setAttribute("for", "item");
  form.appendChild(itemLabel);

  var itemInput = document.createElement("input");
  itemInput.type = "text";
  itemInput.id = "item";
  itemInput.setAttribute("required", "true");
  form.appendChild(itemInput);

  var typeLabel = document.createElement("label");
  typeLabel.textContent = "Type";
  typeLabel.setAttribute("for", "type");
  form.appendChild(typeLabel);

  var typeSelect = document.createElement("select");
  typeSelect.name = "type";
  typeSelect.id = "type";

  var incomeOption = document.createElement("option");
  incomeOption.value = "income";
  incomeOption.textContent = "Income";
  typeSelect.appendChild(incomeOption);

  var expenseOption = document.createElement("option");
  expenseOption.value = "expense";
  expenseOption.textContent = "Expense";
  typeSelect.appendChild(expenseOption);

  form.appendChild(typeSelect);

  var amountLabel = document.createElement("label");
  amountLabel.textContent = "Amount";
  amountLabel.setAttribute("for", "amount");
  form.appendChild(amountLabel);

  var amountInput = document.createElement("input");
  amountInput.type = "text";
  amountInput.id = "amount";
  amountInput.setAttribute("required", "true");
  form.appendChild(amountInput);

  var dateLabel = document.createElement("label");
  dateLabel.textContent = "Expense Date";
  dateLabel.setAttribute("for", "date");
  form.appendChild(dateLabel);

  var dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.id = "date";
  form.appendChild(dateInput);
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.id = "submit";
  form.appendChild(submit);
  itemInput.value = initialValues.name || "";
  typeSelect.value = initialValues.type || "income";
  amountInput.value = (initialValues.amount ?? "").replace("$", "");
  dateInput.value = initialValues.date || "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (existingCard) {
      calculate(
        {
          name: initialValues.name,
          type: initialValues.type,
          amount: initialValues.amount.replace("$", ""),
          date: initialValues.date,
        },
        true
      );
    }

    var itemName = itemInput.value;
    var itemType = typeSelect.value;
    var itemAmount = amountInput.value;
    var itemDate = dateInput.value;
    var formattedDate = formatDateString(itemDate);
    var transaction = {
      name: itemName,
      type: itemType,
      amount: itemAmount,
      date: formattedDate,
    };
    if (existingCard) {
      updateCard(existingCard, itemName, itemType, formattedDate, itemAmount);
      var indexToUpdate = transactions.findIndex(
        (trans) => trans.name === transaction.name
      );

      // Update the existing transaction
      transactions[indexToUpdate] = {
        name: itemName,
        type: itemType,
        amount: itemAmount,
        date: formattedDate,
      };

      calculate(transaction);
      window.localStorage.setItem("transactions", JSON.stringify(transactions));
    } else {
      if (transactions.length === 0) {
        var status = document.querySelector(".status");
        status.innerHTML = "";
      }
      transactions.push(transaction);
      // Add the transaction
      addedcard(transaction);
    }
    document.body.removeChild(transactionFormDiv);
  });
  transactionFormDiv.appendChild(closeButton);
  transactionFormDiv.appendChild(form);

  document.body.appendChild(transactionFormDiv);

  transactionFormDiv.style.display = "block";
}
function updateCard(card, itemName, itemType, itemDate, itemAmount) {
  card.querySelector("h3").textContent = itemName;
  card.querySelector("span:first-of-type").textContent = itemType;
  card.querySelector("span:nth-of-type(2)").textContent = itemDate;
  card.querySelector("span:last-of-type").textContent = `$${itemAmount}`;
}
function formatDateString(dateString) {
  var dateParts = dateString.split("-");
  return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
}
function addedcard(transaction) {
  calculate(transaction);
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  var insertIndex = transactions.findIndex((trans) => trans === transaction);
  var card = document.createElement("div");
  card.className = "card";
  var title = document.createElement("h3");
  title.textContent = transaction.name;
  card.appendChild(title);
  var type = document.createElement("span");
  type.textContent = transaction.type;
  card.appendChild(type);
  var date = document.createElement("span");
  date.textContent = transaction.date;
  card.appendChild(date);

  var amount = document.createElement("span");
  amount.textContent = `$${transaction.amount}`;
  if (transaction.type === "income") {
    amount.style.color = "yellowgreen";
  } else {
    amount.style.color = "red";
  }
  card.appendChild(amount);
  var edit = document.createElement("button");
  edit.textContent = "Edit";
  edit.id = "edit";
  card.appendChild(edit);
  edit.addEventListener("click", function (event) {
    var parentCard = event.target.parentNode;

    var itemName = parentCard.querySelector("h3").textContent;
    var itemType = parentCard.querySelector("span:first-of-type").textContent;
    var itemDate = parentCard.querySelector("span:nth-of-type(2)").textContent;
    var itemAmount = parentCard.querySelector("span:last-of-type").textContent;
    function returnDateString(dateString) {
      var dateParts = dateString.split("/");
      return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
    }
    itemDate = returnDateString(itemDate);
    addTransaction(
      {
        name: itemName,
        type: itemType,
        amount: itemAmount,
        date: itemDate,
      },
      parentCard
    );
  });

  var deletebut = document.createElement("button");
  deletebut.textContent = "Delete";
  deletebut.id = "delete";
  card.appendChild(deletebut);
  deletebut.addEventListener("click", function (event) {
    parentCard = event.target.parentNode;
    itemName = parentCard.querySelector("h3").textContent;
    itemAmount = parentCard.querySelector("span:last-of-type").textContent;
    indexToUpdate = transactions.findIndex((trans) => trans.name === itemName);
    calculate(transactions[indexToUpdate], true);
    transactions.splice(indexToUpdate, 1);

    window.localStorage.setItem("transactions", JSON.stringify(transactions));
    parentCard.remove();
    var status = document.querySelector(".status");
    if (transactions.length === 0) {
      status.innerHTML = "No Transactions";
    }
  });
  var tranSection = document.querySelector(".transactions");
  if (insertIndex === 0) {
    tranSection.prepend(card);
  } else {
    var previousCard = tranSection.children[insertIndex - 1];
    previousCard.insertAdjacentElement("afterend", card);
  }
  window.localStorage.setItem("transactions", JSON.stringify(transactions));
}
