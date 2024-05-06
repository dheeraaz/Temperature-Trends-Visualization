"use strict";

const key = '402bc5b1c8cc8f2634890c588fcfbdf6';
const url = 'https://api.openweathermap.org/data/2.5/forecast?&units=metric';

const inputBox = document.getElementById("input-box");
const inputBtn = document.getElementById("input-btn");

const graphBox = document.querySelector(".graph-box");

let cityName = "";
let minTemperature = 0;
let maxTemperature = 0;


// start: fetch data using openweather api

const weatherData = async () => {
    cityName = inputBox.value;
    let dateTempMap = {};

    const response = await fetch(url + `&q=${cityName}` + `&appid=${key}`);
    const data = await response.json();


    let lists = data.list;

    minTemperature = 200;
    maxTemperature = -200;
    lists.forEach((list) => {

        // console.log(list.main.temp, list.dt_txt);

        dateTempMap[list.dt_txt] = list.main.temp;
        if (list.main.temp < minTemperature) {
            minTemperature = list.main.temp;
        }

        if (list.main.temp > maxTemperature) {
            maxTemperature = list.main.temp;

        }

    });

    // console.log(dateTempMap);
    drawgraph(dateTempMap);
    displayData(minTemperature, maxTemperature);

}

// end: fetch data using openweather api 


inputBtn.addEventListener("click", () => {
    if (inputBox.value !== "") {
        graphBox.style.display = "block";
        weatherData()
    }
})

inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        if (inputBox.value !== "") {
            graphBox.style.display = "block";
            weatherData();
        }
    }
})

function displayData(minT, maxT) {
    const cityTitle = document.querySelector(".city-title p");
    const weatherReport = document.querySelector(".weather-report");
    const minTemperature = document.querySelector(".min-temperature p span");
    const maxTemperature = document.querySelector(".max-temperature p span");


    weatherReport.style.display = "block";

    cityTitle.innerText = inputBox.value.toUpperCase();
    minTemperature.innerText = minT.toFixed(2) + " °C";
    maxTemperature.innerText = maxT.toFixed(2) + " °C";
}



// start: draw graph
function drawgraph(elem) {

    const ctx = document.getElementById('myChart');

    let myLabel = [];
    let myData = [];

    for (let key in elem) {
        myLabel.push(key);
        myData.push(elem[key]);
    }

    const data = {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: myLabel,
        datasets: [{
            label: 'Temperature',
            // data: [65, 59, 80, 81, 56, 55, 40],
            data: myData,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    // Get the reference to the previously created chart
    let existingChart = Chart.getChart(ctx);

    // If there's an existing chart, destroy it
    if (existingChart) {
        existingChart.destroy();
    }
    new Chart(ctx, {
        type: 'line',
        data: data,
    });

}
// end: draw graph
