const STORAGE_KEY = 'personnel-app-data';

const defaultEmployees = [
  { id: 1, name: 'Amine Benali', position: 'Développeur', department: 'IT', gender: 'Homme' },
  { id: 2, name: 'Sonia Khelifi', position: 'Responsable RH', department: 'RH', gender: 'Femme' },
  { id: 3, name: 'Yassine Trabelsi', position: 'Comptable', department: 'Finance', gender: 'Homme' },
  { id: 4, name: 'Nadia Saidi', position: 'Chef marketing', department: 'Marketing', gender: 'Femme' }
];

const employeeForm = document.getElementById('employeeForm');
const employeeTableBody = document.getElementById('employeeTableBody');
const searchInput = document.getElementById('searchInput');
const totalEmployeesEl = document.getElementById('totalEmployees');
const maleCountEl = document.getElementById('maleCount');
const femaleCountEl = document.getElementById('femaleCount');
const resetDataBtn = document.getElementById('resetDataBtn');

let employees = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultEmployees;

function saveEmployees() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function renderStats() {
  totalEmployeesEl.textContent = employees.length;
  maleCountEl.textContent = employees.filter((emp) => emp.gender === 'Homme').length;
  femaleCountEl.textContent = employees.filter((emp) => emp.gender === 'Femme').length;
}

function renderTable(list = employees) {
  employeeTableBody.innerHTML = '';

  if (!list.length) {
    employeeTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:#6b7280; padding:20px;">Aucun employé trouvé.</td>
      </tr>
    `;
    return;
  }

  list.forEach((employee) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.department}</td>
      <td>${employee.gender}</td>
      <td>
        <button class="delete-btn" data-id="${employee.id}" type="button">Supprimer</button>
      </td>
    `;
    employeeTableBody.appendChild(row);
  });
}

function refreshTable() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = employees.filter((emp) => {
    const text = `${emp.name} ${emp.position} ${emp.department}`.toLowerCase();
    return text.includes(query);
  });

  renderStats();
  renderTable(filtered);
}

employeeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const position = document.getElementById('position').value.trim();
  const department = document.getElementById('department').value;
  const gender = document.getElementById('gender').value;

  if (!name || !position || !department || !gender) return;

  employees.push({
    id: Date.now(),
    name,
    position,
    department,
    gender
  });

  saveEmployees();
  employeeForm.reset();
  refreshTable();
});

searchInput.addEventListener('input', refreshTable);

employeeTableBody.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-btn');
  if (!button) return;

  const id = Number(button.dataset.id);
  employees = employees.filter((employee) => employee.id !== id);
  saveEmployees();
  refreshTable();
});

resetDataBtn.addEventListener('click', () => {
  if (confirm('Voulez-vous vraiment réinitialiser les données ?')) {
    employees = [...defaultEmployees];
    saveEmployees();
    employeeForm.reset();
    searchInput.value = '';
    refreshTable();
  }
});

refreshTable();
