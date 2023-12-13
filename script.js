const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const userlocation=document.querySelector(".userlocation");
const displayUserData=document.querySelector(".displayUserData");
const grantAccess=document.querySelector("#grantaccess");
const userTab=document.querySelector("#userTab");
const searchTab=document.querySelector("#searchTab");
const btn=document.querySelectorAll(".btn");
const loading=document.querySelector(".loading");
const searchTab2=document.querySelector(".searchTab2");
let searchCity=document.querySelector("#searchCity");
const searchIcon=document.querySelector("#searchIcon");
const notfound=document.querySelector(".notfound");
let currentTab=userTab;
currentTab.classList.add("tabCss");
userCalling();


userTab.addEventListener("click",()=>{

    notfound.classList.remove("active");
    displayUserData.classList.remove("active1");
    searchTab.classList.remove("tabCss");
    userTab.classList.add("tabCss");
    userCalling();
    currentTab=userTab;
});
searchTab.addEventListener("click",()=>{
    userTab.classList.remove("tabCss");
    searchTab.classList.add("tabCss");
    currentTab=searchTab;
     searchCity.value="";
    displayUserData.classList.remove("active");
    searchTab2.classList.add("active");
    userlocation.classList.remove("active");
});

function userCalling(){
                                                                         
    if(localStorage.key("latitude")&&localStorage.key("longitude"))
    {
        searchTab2.classList.remove("active");
        userlocation.classList.remove("active");
        displayUserData.classList.add("active");
        callingApi();
         
    }
    else{
        console.log("Not a localStorege");
        searchTab2.classList.remove("active");
        displayUserData.classList.remove("active");
        userlocation.classList.add("active");
        grantAccess.addEventListener("click", ()=>{
             getLocationAccess();
        });
        
    }
    
};

function getLocationAccess(){
    if(navigator.geolocation)                                              
    navigator.geolocation.getCurrentPosition(gotposition,errorposition);
   else{
       alert("Your browser does not have this feature");
   }
}

async function gotposition(position){
    const lat=  position.coords.latitude;
    const lon=  position.coords.longitude;
    localStorage.setItem("lon",lon);
    localStorage.setItem("lat",lat);
    userlocation.classList.remove("active");
    displayUserData.classList.add("active");
    callingApi();
}
function errorposition(){
    alert("Some Problem Occurs");
}

async  function callingApi()
{
    lat=localStorage.getItem("lat");
    lon=localStorage.getItem("lon");
    console.log(lat,lon);
    try{
        userlocation.classList.remove("active");
        displayUserData.classList.remove("active");
        loading.classList.add("active");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log(data);
        loading.classList.remove("active");
        userlocation.classList.remove("active");
        displayUserData.classList.add("active");
        renderWeatherInfo(data);   
    }
    catch(e){    
        console.log("Some Error occurs in Calling Api");
    }
}

searchIcon.addEventListener("click",(e)=>{
    let city=searchCity.value.trim();
    callingCityApi();
  async function callingCityApi(){  
    try{
       loading.classList.add("active1");
       loading.classList.add("active");
       const response2= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
       const data2= await response2.json();
       loading.classList.remove("active1");
       loading.classList.remove("active");
       notfound.classList.remove("active");
       if(data2?.main?.temp!=undefined)
       {
        renderWeatherInfo(data2);
        userlocation.classList.remove("active");
        displayUserData.classList.add("active1");
        displayUserData.classList.add("active");
       }
       else{
        error();
       }
       
    }
    catch(e){
        console.log("Some Error occurs in city fetching");
    }
}

})

 function renderWeatherInfo(data)
{
  
let cityName=document.querySelector("#cityName");
let countryFlag=document.querySelector("#countryFlag");
let desc = document.querySelector(".desc");
let weatherIcon=document.querySelector("#weatherIcon");
let weatherTemp=document.querySelector("#weatherTemp");
let datawindinfo=document.querySelector("[data-wind-info]");
let  datahumidityawind=document.querySelector("[ data-humiditya-wind]");
let datawindcloud=document.querySelector("[data-wind-cloud]");

countryFlag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
desc.innerText=data?.weather?.[0]?.main;
weatherIcon.src= `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
weatherTemp.innerText=data?.main?.temp+" °C";
datawindinfo.innerText=data?.wind?.speed + " m/s";
datahumidityawind.innerText=data?.main?.humidity +" %";
datawindcloud.innerText=data?.clouds?.all +" %";
cityName.innerText=data?.name;
}

function error(){  
    userlocation.classList.remove("active");  
    displayUserData.classList.remove("active");
    displayUserData.classList.remove("active1");
    notfound.classList.add("active"); 
    console.log("Error ke andar aa gya hu");   
}
