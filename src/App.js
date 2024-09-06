import { useState, useEffect } from "react";
import Graph from "/Users/yashtyagi/VScode/web_dev/React/Applications/hello_react/weather_app/src/Graph.js"

export default function App() {
  return (
    <div>
      <Welcome />
      <View />
    </div>
  );
}

function Welcome() {
  useEffect(() => {
    var utt = new SpeechSynthesisUtterance();
    utt.text = "Good Morning! Have a look at today's weather!!!";
    var voices = window.speechSynthesis.getVoices();
    utt.voice=voices[14];
    utt.rate=0.9;
    window.speechSynthesis.speak(utt);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  return (
    <div className="welcome">
      <h1>Welcome Folks...</h1>
    </div>
  );
}

function View(){
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [day,setDay] = useState(0);
  const [s_data,setsData]=useState(null);


  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const url = s_data===null?`https://api.weatherapi.com/v1/forecast.json?key=25cfc3d0d61b4c2692e54544242202&q=${latitude},${longitude}&aqi=no&days=5`:`https://api.weatherapi.com/v1/forecast.json?key=25cfc3d0d61b4c2692e54544242202&q=id:${s_data[0].id}&aqi=no&days=5`;
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchInfo();
  }, [s_data]);

  console.log(data);
  return (
    <div className="Main">
      <div className="load"><div>Loading</div><div id="load1">.</div><div id="load2">.</div><div id="load3">.</div></div>
      <div style={{display:loading?"none":""}}>
        <CurrWeather data={data} loading={loading} setLoading={setLoading} day={day} s_data={s_data} setsData={setsData}/>
        <Details data={data} day={day} setDay={setDay}/>
      </div>
  </div>
  )
}

function CurrWeather({data,loading,setLoading,day,s_data,setsData}) {
  
  const temperature = day===0?data.current?.temp_c:(data.forecast?.forecastday[day].day.maxtemp_c+data.forecast?.forecastday[day].day.mintemp_c)/2;
  const icon=day===0?data.current?.condition.icon:data.forecast?.forecastday[day].day.condition.icon;
  const text=day===0?data.current?.condition.text:data.forecast?.forecastday[day].day.condition.text;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const date=new Date();
  const day_time=data.current?.is_day?"Day":"Night";
  const city=data.location?.name;
  const [search,setSearch]=useState("");
  const [searchf,setSearchf]=useState("");
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const url = `https://api.weatherapi.com/v1/search.json?key=25cfc3d0d61b4c2692e54544242202&q=${searchf}&aqi=no`;
        const response = await fetch(url);
        const result = await response.json();
        setsData(result);
        
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    if(searchf!=="")
    {
      fetchInfo();
      setSearchf("");
    }
  }, [search,searchf,setsData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchf(e.target.querySelector('.search').value);
    setSearch("");
    setLoading(true);
  };

  console.log(s_data);
  return (
    <div className="left">
      <div className="searchbar">
        <form onSubmit={handleSubmit}>
          <input className="search" placeholder="Type in a Place..." type="text" value={search} onChange={(e)=>setSearch((search)=>search=e.target.value)}/>
          <button type="submit">&#128269;</button>
        </form>
      </div>
      <img src={`${icon}`} alt="Weather Icon" height="150px"/>
      <div>
        <p id="temp_p">{`${temperature}°C`}</p>
        <p id="text_p">{`${text}`}</p>
        <p id="info_p">{`${date.getDate()+day}-${months[date.getMonth()]}-${date.getFullYear()}`}<br/>{`${days[(date.getDay()+day)%7]}`} {`${day===0 ? ","+date.getHours():""} ${day===0 ? " : "+date.getMinutes():""} ${day===0 ? (date.getHours()>11?"PM":"AM"):""}`}<br/>{`${day===0 ? day_time:""}`}</p>
        <p id="city_p">{`${city}`}</p>
      </div>
    </div>
  );
}

function Details({data,day,setDay}){

  const [show,setShow] = useState(true);

  const dataList=[
    {
      id:'1',
      text:"Humidity",
      value:day===0?data.current?.humidity+" %":data.forecast?.forecastday[day].day.avghumidity+" %",
      others:null
    },
    {
      id:'2',
      text:"Wind",
      value:day===0?data.current?.wind_mph+"m/h":data.forecast?.forecastday[day].day.maxwind_mph+"m/h",
      others:data.current?.wind_dir
    },
    {
      id:'3',
      text:day===0?"Real Feel":"Average Temperature",
      value:day===0?data.current?.feelslike_c+" °C":(data.forecast?.forecastday[day].day.maxtemp_c+data.forecast?.forecastday[day].day.mintemp_c)/2+" °C",
      others:day===0?data.current?.feelslike_f+" °F":(data.forecast?.forecastday[day].day.maxtemp_f+data.forecast?.forecastday[day].day.mintemp_f)/2+" °F",
    },
    {
      id:'4',
      text:"UV Index",
      value:day===0?data.current?.uv:data.forecast?.forecastday[day].day.uv,
      others:'Moderate'
    },
    {
      id:'5',
      text:"Pressure",
      value:data.current?.pressure_mb+" mb",
      others:data.current?.pressure_in+" in"
    },
    {
      id:'6',
      text:"Visibility",
      value:day===0?data.current?.vis_miles+" Miles":data.forecast?.forecastday[day].day.avgvis_miles+" Miles",
      others:data.current?.vis_km+" KM"
    },
    {
      id:'7',
      text:"Clouds",
      value:data.current?.cloud,
      others:null
    },
    {
      id:'8',
      text:"Precipitation",
      value:day===0?data.current?.precip_mm+" mm":data.forecast?.forecastday[day].day.totalprecip_mm+" mm",
      others:day===0?data.current?.precip_in+" in":data.forecast?.forecastday[day].day.totalprecip_in+" in"
    }
  ];
  const date=new Date();
  const g_data=[]
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(date.getFullYear(),date.getMonth(),date.getDate(),i);
    const temperature = data.forecast?.forecastday[day].hour[i].temp_c;
    g_data.push({ time, temperature });
  }

  return (
    <div className="right">
      <div className="days">
        <ul>
          <li className={day === 0 ? 'selected' : ''} onClick={() => { setDay(0) }}>Today</li>
          <li className={day === 1 ? 'selected' : ''} onClick={() => { setDay(1) }}>Tomorrow</li>
          <li className={day>1 ? 'selected' : ''}  id="drop_down">
            <span>Next 7 Days</span>
            <div className="dropdown_content">
              <ul>
                <li className={day === 2 ? 'selected' : ''} onClick={() => { setDay(2) }}>{`${date.getDate()+2}`}</li>
                <li className={day === 3 ? 'selected' : ''} onClick={() => { setDay(3) }}>{`${date.getDate()+3}`}</li>
                <li className={day === 4 ? 'selected' : ''} onClick={() => { setDay(4) }}>{`${date.getDate()+4}`}</li>
                <li className={day === 5 ? 'selected' : ''} onClick={() => { setDay(5) }}>{`${date.getDate()+5}`}</li>
                <li className={day === 6 ? 'selected' : ''} onClick={() => { setDay(6) }}>{`${date.getDate()+6}`}</li>
                <li className={day === 7 ? 'selected' : ''} onClick={() => { setDay(7) }}>{`${date.getDate()+7}`}</li>
                <li className={day === 8 ? 'selected' : ''} onClick={() => { setDay(8) }}>{`${date.getDate()+8}`}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="datacols" style={{visibility:show?"visible":"hidden"}}>
        {dataList.map((factor)=>(
          <div key={factor.id}  >
            <span id="text_d">{`${factor.text}`}</span>
            <span id="value_d">{`${factor.value}`}</span>
            <span id="others_d">{`${factor.others!==null?factor.others:""}`}</span>
          </div>
        ))}
        <div key='9' onClick={()=>{setShow(!show)}} className="more">
            <span id="text_d">Show</span>
            <span id="value_d">More</span>
          </div>
      </div>
      <div className="data_graph" style={{visibility:show?"hidden":"visible"}}>
        <Graph data={g_data}/>
        <div className="sun">
          <span>{`Sunrise : ${data.forecast?.forecastday[day].astro.sunrise}`}</span>
          <span>{`Sunset : ${data.forecast?.forecastday[day].astro.sunset}`}</span>
        </div>
        <button className="btn" onClick={()=>{setShow(!show)}}>Show Less</button>
      </div>
    </div>
  )
}