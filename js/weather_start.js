//grab required elements
let btn = document.getElementById('btnSend');
let response = document.getElementById('response');

//request options
let baseUrl = "http://api.openweathermap.org/data/2.5/weather"
let key = "3b8801a04a269716ee8c11e1f0b021e6";

//initialize required variables
let promises = [];

//event listeners
btn.addEventListener('click', handleClick, false);


function handleClick(e) // Execute when we clic to send button
{
    //disable submit button
    btn.disabled = true;
    //loop around all 4 form fields
    document.querySelectorAll('.form-field').forEach((element, index) =>
    {
        //grab city field
        let cityField = document.getElementById(`city-${index}`);
        //get city value
        city = cityField.value;
        //disable city field
        cityField.disabled = true;
        //show corresponding spinner;
        updatePage(`<img src="images/spinner.gif" alt="spinner" id="spinner">`, index);
        //make a request
        let promise = makeRequest(city);
        promises.push(promise);
        promise.then(data => createSuccessHtml(data, index))
                .catch(error => createErrorHtml(error, index))
                .finally(() => resetCityField(cityField));
    });
    Promise.allSettled(promises)
            .then(() => {btn.disabled = false})
            .then(() => {promises = []});
}


function makeRequest(city)
{
    return new Promise((resolve, reject) => 
    {
        // Create xhr
        let xhr = new XMLHttpRequest();
        xhr.open('GET', buildUrl(city));
        // onreadystatechange... it is triggered when the state of readystate (Xmlhttprequest attribute) change and executes the associated function
        xhr.onreadystatechange = () =>
        // Execute when we recieve any answer (onreadystatechange change state)
        {
            // readyState have 5 states (0 to 4), read XMLHttpRequest to know more
            if (xhr.readyState == 4) // if we recieve response from server
            {
                if (xhr.status == 200)
                {
                    // if we recieve correct answer, we call 'resolve' parametter
                    resolve(JSON.parse(xhr.responseText));
                }
                else
                {
                    // incorrect answer, we call 'reject' parameter
                    reject(JSON.parse(xhr.responseText));
                }
            }
        }
        
        xhr.send();
    });
}


function createSuccessHtml(data, index)    // execute when we recieve correct answer readyState == 4 and status == 200
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
    updatePage(html, index);
}


let createErrorHtml = (data, index) => // execute when we recieve incorrect answer readyState == 4 and status != 200
{

    let html = 
    `
        <h1>Une erreur s'est produite !</h1>
        <p>${data.message}</p>
    `
    updatePage(html, index);
}


let resetCityField = (cityField) =>
{
    cityField.disabled = false;
    cityField.value = '';
}


/*Utilities*/
let buildUrl = city => `${baseUrl}?units=metric&lang=fr&q=${city}&appid=${key}`;
let updatePage = (html, index) => // to update html content page
{
    //empty response container
    let response = document.getElementById(`response-${index}`)
    response.innerHTML = '';
    //replace with htmlString
    response.insertAdjacentHTML( 'beforeend', html);
}
