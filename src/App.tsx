import React, { useEffect, useState } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import {Helmet} from "react-helmet";
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';
import InventoryPage from './pages/InventoryPage';
import { getFromLS, BackgroundsEnum } from './utils/utils';
import './App.css';

const App = () => {
  const [background, setBackground] = useState(String)

  const initBackground = () => {
    let lsResult = getFromLS("background")
    
    if(!lsResult){
      setBackground(BackgroundsEnum.black)
      return;
    }

    const parsedResult = JSON.parse(lsResult)

    for (const item in BackgroundsEnum) {
      if (parsedResult===item) {
        setBackground(parsedResult)
        return;
      }
    }

    setBackground(BackgroundsEnum.black)
    return;
  }
  
  useEffect(()=>{
    initBackground()
  })

  useEffect(() => {
    initBackground()
  
    window.addEventListener('backgroundChange',  initBackground)
    return () => window.removeEventListener('backgroundChange', initBackground)
  }, [])
//<RouterProvider router={router} />
  return (
    <div className={`App ${background}`}>
      <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/inventory" element={<InventoryPage/>}/>
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default App;
