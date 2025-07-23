let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let chart;

function addExpense() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (description && !isNaN(amount) && amount > 0) {
    const expense = {
      id: Date.now(),
      description,
      amount,
      category,
      date: new Date().toLocaleDateString()
    };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    renderExpenses();
    updateSummary();
    updateChart();
  } else {
    alert('Please enter a valid description and amount.');
  }
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  updateSummary();
  updateChart();
}

function filterExpenses() {
  const category = document.getElementById('filter-category').value;
  renderExpenses(category);
  updateSummary(category);
  updateChart(category);
}

function renderExpenses(filterCategory = 'All') {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';
  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(expense => expense.category === filterCategory);

  if (filteredExpenses.length === 0) {
    expenseList.innerHTML = '<p class="no-expenses">No expenses found.</p>';
    return;
  }

  filteredExpenses.forEach(expense => {
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
      <span>${expense.description} - $${expense.amount.toFixed(2)} (${expense.category}) - ${expense.date}</span>
      <button onclick="deleteExpense(${expense.id})">Delete</button>
    `;
    expenseList.appendChild(div);
  });
}

function updateSummary(filterCategory = 'All') {
  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(expense => expense.category === filterCategory);
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  document.getElementById('summary').textContent = `Total Expenses: $${total.toFixed(2)}`;
}

function updateChart(filterCategory = 'All') {
  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(expense => expense.category === filterCategory);

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];
  const categoryTotals = categories.map(category =>
    filteredExpenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
  );

  const ctx = document.getElementById('expenseChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: categoryTotals,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Expenses by Category'
        }
      }
    }
  });
}

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Initial render
renderExpenses();
updateSummary();
updateChart();
