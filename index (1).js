const INVENTORY_API = "https://671ed77f320162bd16e5dbdc.mockapi.io/api/inventory";
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY";
let chart;

function updateTable(data) {
    const tableBody = document.getElementById("inventoryTable");
    tableBody.innerHTML = "";
    data.forEach(item => {
        const row = `<tr>
            <td>${item.item}</td>
            <td>${item.quantity}</td>
            <td>${item.status}</td>
            <td>${item.shipment}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function updateChart(data) {
    if (chart) chart.destroy();
    const ctx = document.getElementById("inventoryChart").getContext("2d");
    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d.item),
            datasets: [{
                label: "Quantity",
                data: data.map(d => d.quantity),
                backgroundColor: ["#007bff", "#dc3545", "#28a745"],
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

async function fetchData() {
    const loading = document.getElementById("loading");
    const errorAlert = document.getElementById("errorAlert");
    const weatherAlert = document.getElementById("weatherAlert");

    try {
        loading.style.display = "block";
        errorAlert.style.display = "none";

        // Fetch inventory and weather data
        const [inventoryRes, weatherRes] = await Promise.all([
            fetch(INVENTORY_API),
            fetch(WEATHER_API)
        ]);
        if (!inventoryRes.ok || !weatherRes.ok) throw new Error("API request failed");
        const [inventoryData, weatherData] = await Promise.all([
            inventoryRes.json(),
            weatherRes.json()
        ]);

        // Fuse data: infer shipment status
        const fusedData = inventoryData.map(item => {
            const isBadWeather = weatherData.weather[0].main.includes("Rain") || weatherData.weather[0].main.includes("Storm");
            const shipment = item.quantity < 60 && isBadWeather ? "Delayed" : "On Time";
            return { ...item, shipment };
        });

        // Update UI
        updateTable(fusedData);
        updateChart(fusedData);

        // Weather alert
        weatherAlert.style.display = weatherData.weather[0].main.includes("Rain") ? "block" : "none";
        weatherAlert.textContent = `Weather Alert: ${weatherData.weather[0].description} in ${weatherData.name}`;

    } catch (error) {
        console.error("Error fetching data:", error);
        errorAlert.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    setInterval(fetchData, 5000);
});