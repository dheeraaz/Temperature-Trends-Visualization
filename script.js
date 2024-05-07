"use strict";

const key = '402bc5b1c8cc8f2634890c588fcfbdf6';
const url = 'https://api.openweathermap.org/data/2.5/forecast?&units=metric';

const inputBox = document.getElementById("input-box");
const inputBtn = document.getElementById("input-btn");

const graphBox = document.querySelector(".graph-box");
const buttonGrp = document.querySelector(".button-grp");

const allDay = document.getElementById("all-day");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

let cityName = "";
let minTemperature = 0;
let maxTemperature = 0;

// search box and search button related
inputBtn.addEventListener("click", () => {
    if (inputBox.value !== "") {
        graphBox.style.display = "block";
        buttonGrp.style.display = "flex";

        weatherData();
    }
})

inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        if (inputBox.value !== "") {
            graphBox.style.display = "block";
            buttonGrp.style.display = "flex";

            weatherData();
        }
    }
})


// fetch data using openweather api
const weatherData = async () => {
    cityName = inputBox.value;
    let count = 0;

    const response = await fetch(url + `&q=${cityName}` + `&appid=${key}`);
    const data = await response.json();

    let lists = data.list;

    let dateTempMap = toDateTempObj(lists);
    let dateTempArray = convertToArray(dateTempMap);

    console.log(dateTempMap);
    console.log(dateTempArray);

    [minTemperature, maxTemperature] = getTempValue(dateTempArray[count]);
    drawgraph(dateTempArray[count],1);
    displayData(minTemperature, maxTemperature);
    count++;

    allDay.addEventListener("click", () => {
        [minTemperature, maxTemperature] = getTempValue(dateTempMap);
        drawgraph(dateTempMap, 0, "of all days");
        displayData(minTemperature, maxTemperature);
        count = 1;
    })

    next.addEventListener("click", ()=>{
        if(count>=0 && count<dateTempArray.length){
            [minTemperature, maxTemperature] = getTempValue(dateTempArray[count]);
            drawgraph(dateTempArray[count],1);
            displayData(minTemperature, maxTemperature);
            count++;
        }
    })

    previous.addEventListener("click", ()=>{
        if(count>0 && count<=dateTempArray.length){
            [minTemperature, maxTemperature] = getTempValue(dateTempArray[count-1]);
            drawgraph(dateTempArray[count-1]);
            displayData(minTemperature, maxTemperature);
            count--;
        }
    })

}

// for converting data lists into single object
function toDateTempObj(lists) {
    let dateTempMap = {};
    lists.forEach((list) => {
        dateTempMap[list.dt_txt] = list.main.temp;
    });

    return dateTempMap;
}


// for converting data into array of object
function convertToArray(dateTempMap) {
    let groupedObjects = [];
    let currentDate = null;
    let currentGroup = {};

    for (const key in dateTempMap) {
        const cdate = key.split(' ')[0];
        if (cdate !== currentDate) {
            if (Object.keys(currentGroup).length !== 0) {
                groupedObjects.push(currentGroup);
            }
            currentGroup = {};
            currentDate = cdate;
        }
        currentGroup[key] = dateTempMap[key];
    }

    if (Object.keys(currentGroup).length !== 0) {
        groupedObjects.push(currentGroup);
    }

    return groupedObjects;
}

//for getting minimum and maximum temperature value
function getTempValue(customObject) {
    minTemperature = 200;
    maxTemperature = -200;

    for (let key in customObject) {
        if (customObject[key] < minTemperature) {
            minTemperature = customObject[key];
        }

        if (customObject[key] > maxTemperature) {
            maxTemperature = customObject[key];
        }
    }

    return [minTemperature, maxTemperature];


}
// for drawing graph
function drawgraph(elem,fg, lT="") {

    const ctx = document.getElementById('myChart');
    let flag = fg;
    let labelText;

    //for label text message
    if(lT===""){
        for(let key in elem){
            labelText ="on "+key.split(' ')[0]; //for getting the first date of an object
            
            
            const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let toDate = new Date(labelText).getDay();
            
            labelText = labelText+" "+weekday[toDate]
          
            break;
        }
    }else{
        labelText = lT;
    }

    //for displaying x-axis value
    let xAxisName = [];
    let myData = [];

    if(flag===1){
        for (let key in elem) {
            xAxisName.push(key.split(' ')[1]);
            myData.push(elem[key]);
        }
    }else{
        for (let key in elem) {
            xAxisName.push(key);
            myData.push(elem[key]);
        }
    }

    const data = {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: xAxisName,
        datasets: [{
            label: `Temperature graph ${labelText}`,
            // data: [65, 59, 80, 81, 56, 55, 40],
            data: myData,
            fill: true,
            backgroundColor: 'rgba(215,226,244,0.6)',
            borderColor: 'rgb(51,206,152)',
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

//for displaying data inside weather-report
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
