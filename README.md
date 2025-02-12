# clono la cartella da github

npm create vite@latest

# alla domanda project-name inserisco . (dot)

npm install

# testo
npm run dev

# apro il .gitignore e aggiungo package-lock.json e .env

 # installo gli altri pacchetti che mi servono (bootstrap,axios, react-router-dom)

 # cancello il contenuto di App.jsx e rimuovo gli import che non mi servono
 # cancello i file che non mi servono

 #se voglio importo bootstrap in main.jsx prima del mio css custom
 import "bootstrap/dist/css/bootstrap.min.css";
Comincio ad editare App.jsx

Add to rules in eslint
rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ..reactHooks.configs.recommended.rules,
      "react/prop-types": 0, 👈
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
Routing
// in default layout es.
import { Outlet } from "react-router-dom";

import HeaderComponent from "../components/HeaderComponent";
import Alert from "../components/Alert";
import FooterComponent from "../components/FooterComponent";
export default function DefaultLayout() {
  return (
    <div>
      <HeaderComponent />
      <Alert />
      <main className="container">
        <Outlet />
      </main>

      <FooterComponent />
    </div>
  );
}

// in app.jsx es.
import { BrowserRouter, Routes, Route } from 'react-router-dom';

   <BrowserRouter>
      <Routes>
        <Route Component={DefaultLayout}>
          <Route path="/" Component={HomePage} />
          <Route path="/books" > 👈
            <Route index Component={MainPage} /> 👈
            <Route path=":id" Component={BookPage} /> 👈
            <Route path="create" Component={AddPizzaPage} /> 👈
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    
Context
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  
  useEffect(getData, []);
  
  function getData() {
    setLoading(true);
    axios
      .get(apiUrl + endpoint)
      .then((res) => {
        setMovies(res.data.results);       
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  
  const data = {
    movies
  };
  return (
    <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
  );
};

function useGlobalContext() {
  const context = useContext(GlobalContext);
  return context;
}

export { GlobalProvider, useGlobalContext };
In App.jsx use global context

<GlobalProvider>
  /* Routing o altri componenti children */
 </GlobalProvider>



 #scripts per branch

 Orsouene: 
 1. git fetch origin
git checkout 2-header-and-footer

Ele:
1. git fetch origin
git checkout 4-review-card

2. git fetch origin
git checkout 1-routing

Mel :  
1.git fetch origin

2.git checkout 3-card-and-book-details

3. git fetch origin
git checkout 7-homepage-lista-dei-libri

Fabio: 
1. git fetch origin
git checkout 5-form-component

2. git fetch origin
git checkout 6-pages-about-e-contact-us

