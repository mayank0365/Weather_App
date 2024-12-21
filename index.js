const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


let oldTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("curr-tab");
getfromSessionStorage();
            
function switchTab(newTab){
    if(newTab != oldTab) {
        oldTab.classList.remove("curr-tab");
        oldTab = newTab;
        oldTab.classList.add("curr-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab your weather me aa chuke he to weathe display krna padega
            //so let check local storage first for cordinates if we have saved then there

            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates =sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
      //agar present he
      grantAccessContainer.classList.add("active");

    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grnacontainer invisible
     grantAccessContainer.classList.remove("active");
     //make loader visible
     loadingScreen.classList.add("active");

     //API call

     try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

        );
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
     }
     catch(err){
        loadingScreen.classList.remove("active");
     }

}

function renderWeatherInfo(weatherInfo){
    //first fetch the elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherdesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]")
    const humidity=document.querySelector("[data-humidity]")
    const cloudiness=document.querySelector("[data-cloudiness]");


    //fetch values fromm weather info and put in ui elements

    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png  `;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        //show an alert for no geolocation support available
    }

}

function showPosition(position){

    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName ==="")return;

    else
    fetchSearchWeatherInfo(cityName);
    

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=await fetch(
           ` https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric
 `       );

 const data= await response.json();
 loadingScreen.classList.remove("active");
 userInfoContainer.classList.add("active");
 renderWeatherInfo(data);


    }
    catch(e){

    }


}