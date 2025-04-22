const inventoryData = [
    { item: "Widget A", quantity: 150, status: "In Stock" },
    { item: "Widget B", quantity: 50, status: "Low Stock" },
    { item: "Widget C", quantity: 300, status: "In Stock" }
];

function updateTable() {
    const tableBody = document.getElementById("inventoryTable");
    tableBody.innerHTML = "";
    inventoryData.forEach(data => {
        const row = `<tr>
            <td>${data.item}</td>
            <td>${data.quantity}</td>
            <td>${data.status}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function renderChart() {
    const ctx = document.getElementById("inventoryChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: inventoryData.map(d => d.item),
            datasets: [{
                label: "Quantity",
                data: inventoryData.map(d => d.quantity),
                backgroundColor: ["#007bff", "#dc3545", "#28a745"],
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateTable();
    renderChart();
});