 // Theme toggle functionality
 const themeToggleBtn = document.getElementById('theme-toggle');
 const currentTheme = localStorage.getItem('theme') || 'light';

 document.documentElement.setAttribute('data-theme', currentTheme);
 themeToggleBtn.textContent = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

 themeToggleBtn.addEventListener('click', () => {
     const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
     document.documentElement.setAttribute('data-theme', newTheme);
     localStorage.setItem('theme', newTheme);
     themeToggleBtn.textContent = newTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
 });

 // Sample data
 const patients = [
     { name: 'Dhanush', age: 28, condition: 'Stuttering', progress: 75 },
     { name: 'Priya Sharma', age: 30, condition: 'Speech Delay', progress: 80 },
     { name: 'Aarav Patel', age: 35, condition: 'Fluency Disorder', progress: 60 }
 ];

 const sessions = [
     { date: '2024-09-28', patient: 'Jane Smith', duration: '45 minutes', progress: 'Improved fluency' },
     { date: '2024-09-27', patient: 'John Doe', duration: '30 minutes', progress: 'Steady improvement' },
     { date: '2024-09-26', patient: 'Paul Adams', duration: '60 minutes', progress: 'Significant progress' }
 ];

 const reports = [
     { patient: 'Alice Johnson', date: '2024-09-25', sessionsCovered: 'Sessions 1-10' },
     { patient: 'Bob Williams', date: '2024-09-24', sessionsCovered: 'Sessions 1-8' },
     { patient: 'Carol Brown', date: '2024-09-23', sessionsCovered: 'Sessions 1-12' }
 ];

 // Populate tables
 function populateTables() {
     const patientTable = document.getElementById('patientTable');
     const sessionTable = document.getElementById('sessionTable');
     const reportTable = document.getElementById('reportTable');

     patientTable.innerHTML = patients.map(patient => `
         <tr>
             <td>${patient.name}</td>
             <td>${patient.age}</td>
             <td>${patient.condition}</td>
             <td>${patient.progress}%</td>
             <td>
                 <button class="btn" onclick="editPatient('${patient.name}')">Edit</button>
                 <button class="btn" onclick="generateReport('${patient.name}')">Generate Report</button>
                 <button class="btn" onclick="showChart('${patient.name}')">View Chart</button>
             </td>
         </tr>
     `).join('');

     sessionTable.innerHTML = sessions.map(session => `
 <tr>
     <td>${session.date}</td>
     <td>${session.patient}</td>
     <td>${session.duration}</td>
     <td>${session.progress}</td>
     <td><button class="btn" onclick="viewSessionDetails('${session.date}', '${session.patient}')">View Details</button></td>
 </tr>
`).join('');

reportTable.innerHTML = reports.map(report => `
 <tr>
     <td>${report.patient}</td>
     <td>${report.date}</td>
     <td>${report.sessionsCovered}</td>
     <td>
         <button class="btn" onclick="viewReport('${report.patient}', '${report.date}')">View</button>
         <button class="btn" onclick="downloadReport('${report.patient}', '${report.date}')">Download</button>
     </td>
 </tr>
`).join('');
}

// Call populateTables on page load
document.addEventListener('DOMContentLoaded', populateTables);

// Chart.js initialization
let chartInstance;

function showChart(patientName) {
    const ctx = document.getElementById('patientChart').getContext('2d');

    // Sample progress data for each patient
    const patientProgressData = {
        'John Doe': [65, 70, 75, 80, 85, 90, 95],
        'Jane Smith': [55, 60, 70, 75, 80, 85, 90],
        'Paul Adams': [40, 45, 50, 55, 60, 65, 70]
    };

    // Destroy previous chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Check if patient data exists
    if (!patientProgressData[patientName]) {
        console.error(`No data found for patient: ${patientName}`);
        return;
    }

    // Create new chart
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
            datasets: [{
                label: `${patientName} Progress Over Time`,
                data: patientProgressData[patientName],
                backgroundColor: 'rgba(74, 130, 255, 0.2)',
                borderColor: 'rgba(74, 130, 255, 1)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Progress (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Weeks'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    // Make sure the chart container is visible
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
        chartContainer.style.display = 'block';
    }
}

// Function to generate a report
function generateReport(patientName) {
const patient = patients.find(p => p.name === patientName);
if (!patient) {
 alert('Patient not found');
 return;
}

const reportContent = `
 Patient Report: ${patient.name}
 -----------------------------------
 Age: ${patient.age}
 Condition: ${patient.condition}
 Progress: ${patient.progress}%

 Sessions Covered: 1-10
 Recommendations: Continue therapy with focus on ${patient.condition.toLowerCase()} exercises.
`;

const blob = new Blob([reportContent], { type: 'text/plain' });
const link = document.createElement('a');
link.href = window.URL.createObjectURL(blob);
link.download = `${patient.name}_Report.txt`;
link.click();
}

// Function to edit patient
let selectedPatient;
function editPatient(patientName) {
selectedPatient = patientName;
const patient = patients.find(p => p.name === patientName);
if (!patient) {
 alert('Patient not found');
 return;
}

document.getElementById('editName').value = patient.name;
document.getElementById('editAge').value = patient.age;
document.getElementById('editCondition').value = patient.condition;
document.getElementById('editProgress').value = patient.progress;

document.getElementById('editModal').style.display = 'block';
document.getElementById('overlay').style.display = 'block';
}

// Function to save edited patient details
function savePatient() {
const name = document.getElementById('editName').value;
const age = parseInt(document.getElementById('editAge').value);
const condition = document.getElementById('editCondition').value;
const progress = parseInt(document.getElementById('editProgress').value);

if (!name || isNaN(age) || !condition || isNaN(progress)) {
 alert('Please fill all fields with valid data');
 return;
}

const patientIndex = patients.findIndex(p => p.name === selectedPatient);
if (patientIndex !== -1) {
 patients[patientIndex] = { name, age, condition, progress };
 populateTables();
 closeModal();
} else {
 alert('Patient not found');
}
}

// Function to close the modal
function closeModal() {
document.getElementById('editModal').style.display = 'none';
document.getElementById('overlay').style.display = 'none';
}

// Function to view session details
function viewSessionDetails(date, patientName) {
alert(`Viewing session details for ${patientName} on ${date}`);
// In a real application, this would open a modal or navigate to a detailed view
}

// Function to view report
function viewReport(patientName, date) {
alert(`Viewing report for ${patientName} from ${date}`);
// In a real application, this would open the report in a new tab or modal
}

// Function to download report
function downloadReport(patientName, date) {
alert(`Downloading report for ${patientName} from ${date}`);
// In a real application, this would trigger a file download
}

// Function to generate a new report
function generateNewReport() {
alert('Generating a new report');
// In a real application, this would open a form to select a patient and date range
}
