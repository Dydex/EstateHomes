import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from "./components/Main"
import Header from "./components/Header"
import Joke from "./components/Joke"
import JokesData from './JokesData';
import Data from './Data';



function App() {

  // const jokeElements = JokesData.map((joke) => {
  //   return <Joke setup={joke.setup} punchline={joke.punchline} />;
  // });

  // const mainElements = Data.map((data) => {
  //   return <Main 
  //     key={data.id}
  //     main={{
  //       img: data.img.src,
  //       title: data.title,
  //       location: data.country,
  //       googleMapsUrl: data.googleMapsLink,
  //       dates: data.dates,
  //       description: data.text
  //     }}
  //   /> 
  // })

  return (
    <div className="App">
      <Header />

      <Main />
      {/* <Main main={{
        image: logo,
        location: "Japan",
        googleMapsUrl: "https://www.google.com/maps/place/Mount+Fuji/@35.3606255,138.7273634,15z/data=!3m1!4b1!4m5!3m4!1s0x6019629a42fdc899:0xa6a1fcc916f857e!8m2!3d35.3606255!4d138.7273634",
        title: "Mount Fuji",
        startDate: "12 Jan 2021",
        endDate: "21 Jan 2021",
        description: "Mount Fuji is the tallest mountain in Japan standing at 3,776 meters (12,380 feet). Mount Fuji is the single most popular tourist site in Japan, for both Japanese and foreign tourists."
      }}
      /> */}

      {/* {mainElements} */}

      {/* {jokeElements} */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;

