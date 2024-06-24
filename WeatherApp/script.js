// Weather App Program

const apiKey = "2d70184fe4ca0b86a23405b70dc0dc1a";
const locationInput = document.getElementById("locationInput");
const weatherLabel = document.getElementById("weather");
const weatherIcon = document.getElementById("weatherIcon");
const tempLabel = document.getElementById("tempLabel");
const infoTag = document.getElementById("infoTag");
const humidityLabel = document.getElementById("humidity");
const windLabel = document.getElementById("wind");
const visibilityLabel = document.getElementById("visibility");
const weatherForm = document.querySelector(".weatherForm");
const feedback = document.getElementById("feedBack");

weatherForm.addEventListener("submit",event => {
    event.preventDefault();
    const city = locationInput.value;

    if(city){
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        getWeather(apiUrl);
        feedback.textContent = "";
    }
    else{
        feedback.style.color = "tomato";
        feedback.textContent = "Please Enter City Name."
    }
});

async function getWeather(apiUrl){
    try{
        const response = await fetch(apiUrl);

        //console.log(response);
    
        if(!response.ok){
            throw new Error("Could not fetch weather Data.");
        }
        else{
            feedback.textContent = "";
            const weatherData = await response.json();
            console.log(weatherData);
            const {name: city,
                    main: {temp, humidity},
                    weather: [{ description, icon}],
                    wind: {speed},
                    } = weatherData;
            //console.log(city, humidity, temp, description, icon, id, speed);
            weatherLabel.textContent = description;
            weatherIcon.src = `assets/weather-icons/${icon}.svg`;
            tempLabel.textContent = `${(temp - 273.15).toFixed(2)}°C`;
            const timeData = getDate(weatherData.dt, weatherData.timezone);
            const time = timeData.slice(17, 19) > 12 ? `${timeData.slice(17, 22)} PM` : `${timeData.slice(17, 22)} AM`;
            infoTag.textContent = `${city} ${time}`;
            humidityLabel.textContent = `${humidity}%`;
            windLabel.textContent = `${(speed * 3.6).toFixed(2)}km/h`;
            visibilityLabel.textContent = `${(weatherData.visibility /1000).toFixed(2)} km`;
        }
    }
    catch(error){
        console.error(error);
        feedback.style.color = "tomato";
        feedback.textContent = "Could not able to fetch weather data."
    }
}


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoords);
    }
    else{
        alert("Geolocation is not supported by this browser.")
    }
}
  
function getCoords(position) {
    const [lat, lon] = [position.coords.latitude, position.coords.longitude];
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    getWeather(apiUrl);
}

function getDate(dt, timezone) {
    const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
    const utc_milliseconds = utc_seconds * 1000;
    const local_date = new Date(utc_milliseconds).toUTCString();
    return local_date;
}


























