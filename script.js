import "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js";

const searchInput = document.querySelector(".search-input");

const API_KEY = "ae4313ba250c4b8080e83509250406";

const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [
        1063, 1150, 1153, 1168, 1171, 1180, 1198, 1201, 1240, 1243, 1246, 1273,
        1276,
    ],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [
        1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222,
        1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282,
    ],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],
};

function findWeatherIcon(code) {
    const weatherIcon = Object.keys(weatherCodes).find((icon) => {
        return weatherCodes[icon].includes(code);
    });

    return weatherIcon;
}

function displayHourlyForecast(combinedHourlyData) {
    const currentHour = dayjs();
    const next24Hours = currentHour.add(24, "hour");

    const next24HoursData = combinedHourlyData.filter(({ time }) => {
        const forecastTime = dayjs(time);

        return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    let weatherList = "";
    console.log(next24HoursData);
    next24HoursData.forEach((weather) => {
        const weatherIcon = findWeatherIcon(weather.condition.code);

        weatherList += `
            <li class="weather-item">
                <p class="time">${dayjs(weather.time).format("HH:00")}</p>

                <img
                    src="./assets/icons/${weatherIcon}.svg"
                    alt=""
                    class="weather-icon"
                />

                <p class="temperature">${Math.floor(weather.temp_c)}°</p>
            </li>
        `;
    });

    document.querySelector(".weather-list").innerHTML = weatherList;
}

async function getWeatherDetails(cityName) {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log(data);

        const weatherIcon = findWeatherIcon(data.current.condition.code);

        const temperature = data.current.temp_c;
        const description = data.current.condition.text;

        document.querySelector(".current-weather").innerHTML = `
            <img
                src="./assets/icons/${weatherIcon}.svg"
                alt=""
                class="weather-icon"
            />

            <h2 class="temperature">
                ${Math.floor(temperature)}<span>°C</span>
            </h2>

            <p class="description">${description}</p>
        `;

        const combinedHourlyData = [
            ...data.forecast.forecastday[0].hour,
            ...data.forecast.forecastday[1].hour,
        ];

        displayHourlyForecast(combinedHourlyData);
    } catch (error) {
        console.log(error);
    }
}

searchInput.addEventListener("keyup", (event) => {
    const cityName = searchInput.value.trim();

    if (event.key === "Enter" && cityName) {
        getWeatherDetails(cityName);
    }
});
