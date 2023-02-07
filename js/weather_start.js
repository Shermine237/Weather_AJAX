//grab required elements
let btn = document.getElementById('btnSend');
let cityField = document.getElementById("city");
let response = document.getElementById('response');

//request options
let baseUrl = "http://api.openweathermap.org/data/2.5/weather"
let key = "3b8801a04a269716ee8c11e1f0b021e6";
let xhr;

//event listeners
btn.addEventListener('click', handleClick, false);


function handleClick(e) // Execute when we clic to send button
{
    //grab city value
    let city = cityField.value;
    //disable form
    cityField.disabled = true;
    btn.disabled = true;
    //show spinner
    updatePage(`<img src="images/spinner.gif" alt="spinner" id="spinner">`);
    
    //create xhr
    xhr = new XMLHttpRequest();
    xhr.open('GET', buildUrl(city));
    xhr.onreadystatechange = handleResponse; // onreadyst... it is triggered when the state of readystate (Xmlhttprequest attribute) change and executes the associated function
    xhr.send();
}


function handleResponse()   // Execute when we recieve any answer
{
    // readyState have 5 states (0 to 4), read XMLHttpRequest to know more
    if (xhr.readyState == 4) // if we recieve response from server
    {
        if (xhr.status == 200)
        {
            // if we recieve correct answer
            createSuccessHtml(JSON.parse(xhr.responseText));
        }
        else
        {
            // incorrect answer
            createErrorHtml(JSON.parse(xhr.responseText))
        }
    }
}


function createSuccessHtml(data)    // execute when we recieve correct answer readyState == 4 and status == 200
{
    let weather = data.weather[0];
    let html =
    `
        <h1>Le temps à ${data.name}</h1>
        <p class="weatherMain">
            <img src="http://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}" /><span>${weather.description}</span>
        </p>
        <p>Température : ${data.main.temp.toFixed(1)} °C</p> 
    `
    updatePage(html);
}


let createErrorHtml = (data) => // execute when we recieve incorrect answer readyState == 4 and status != 200
{

    let html = 
    `
        <h1>Une erreur s'est produite !</h1>
        <p>${data.message}</p>
    `
    updatePage(html);
}


/*Utilities*/
let buildUrl = city => `${baseUrl}?units=metric&lang=fr&q=${city}&appid=${key}`;
let updatePage = html => // to update html content page
{
    //empty response container
    response.innerHTML = '';
    //replace with htmlString
    response.insertAdjacentHTML( 'beforeend', html);
    //reset form
    cityField.disabled = false;
    btn.disabled = false;
}
