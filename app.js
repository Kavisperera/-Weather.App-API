let localTimeInterval;  // Variable to store the interval ID for local time updates

// Function to display current time in the specified time zone
function showTime(timezone) {
    // Clear any existing  to stop local time updates
    if (localTimeInterval) clearInterval(localTimeInterval);

    // Set an to update time every second
    localTimeInterval = setInterval(() => {
        const time = new Date();
        const timeOptions = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const dateOptions = {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const timeString = new Intl.DateTimeFormat([], timeOptions).format(time);
        const dateString = new Intl.DateTimeFormat([], dateOptions).format(time);

        const [weekday, monthDay, year] = dateString.split(', ');
        const [month, day] = monthDay.split(' ');

        document.getElementById("time-date").innerHTML = timeString;
        document.getElementById("current-date").innerHTML = `${day} ${month} ${year}`;
        document.querySelector(".day").innerHTML = weekday;
    }, 1000); 
}

// Weather API key
const apiKey = "992a3649a580464780e194614240601";

// Update weather data
function updateWeather(location) {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`)
        .then(response => response.json())
        .then(data => {
            if (data?.current) {
                const { current, location: loc } = data;
                document.getElementById("main-temp").innerHTML = `${current.temp_c}°C`;
                document.getElementById("condition").innerHTML = current.condition.text;
                document.getElementById("temperature").innerHTML = `${current.temp_c}°C`;
                document.getElementById("humidity").innerHTML = `${current.humidity}%`;
                document.getElementById("speed").innerHTML = `${current.wind_kph} Km/h`;
                document.getElementById("region").innerHTML = loc.region;
                document.getElementById("country").innerHTML = loc.country;
                document.getElementById("condition-icon").src = `http:${current.condition.icon}`;
                showTime(loc.tz_id);  
                document.getElementById("location").innerHTML = loc.name;
            } else {
                console.log("Invalid data received");
            }
        })
        .catch(error => console.log("Error:", error));
}

// Initialize weather and local time for default location 
updateWeather("colombo");

// Display local time when the page loads
showTime(Intl.DateTimeFormat().resolvedOptions().timeZone);

// Event listener for search button
document.getElementById("search-btn").addEventListener("click", () => {
    const searchVal = document.getElementById("location-input").value.trim();
    if (searchVal) {
        clearInterval(localTimeInterval); 
        updateWeather(searchVal); 
    }
});
