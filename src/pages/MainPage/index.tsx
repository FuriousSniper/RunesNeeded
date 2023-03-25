import React, { useEffect, useState } from 'react';
import './index.css';
import { RuneItem } from '../../../types/common/main';
import Modes from '../../components/Modes/Modes';
import Table from '../../components/Table/Table';
import { getFromLS, groupBy, ModesEnum, setToLS } from '../../utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import { defaultRunesArray } from '../../utils/defaultValue';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [requiredRunes, setRequiredRunes] = useState(Array<RuneItem>);
  const [runesArray, setRunesArray] = useState(Array<RuneItem>);
  const [runesWasted, setRunesWasted] = useState(Number);
  const [totalRunesAdded, setTotalRunesAdded] = useState(Number);
  const [deleteFromInventory, setDeleteFromInventory] = useState(getFromLS("deleteFromInventory") ? JSON.parse(getFromLS("deleteFromInventory")) : false)
  const [mode, setMode] = useState(ModesEnum.TARGET_MODE);

  const initializeInventoryRunesLS = () => {
    const runesFromLS = getFromLS("runes")
    
    if(!runesFromLS){
      setToLS("runes", JSON.stringify(defaultRunesArray))
      window.dispatchEvent(new Event('runesChange'))
      setRunesArray(defaultRunesArray)
      return;
    }
    
    setRunesArray(JSON.parse(runesFromLS))
    return;
  }

  useEffect(() => {
    initializeInventoryRunesLS()
  
    window.addEventListener('runesChange',  initializeInventoryRunesLS)
    return () => window.removeEventListener('runesChange', initializeInventoryRunesLS)
  }, [])

  const setInputValuePropFunc = (value: number) => {
    if(value<=0){
      toast.error('You have enough runes!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    calculateRunes(value, 0.1)
  }

  const calculateTotalAddedAmount = (array: RuneItem[]) => {
    let totalAdded = 0;
    array.forEach((element: RuneItem) => {
      totalAdded += element.amountNeeded! * element.value
    })

    setTotalRunesAdded(totalAdded)
  }

  const calculateRunes = (amount: number, waste: number) => {
    let initialAmount = amount
    runesArray.sort((a: RuneItem, b: RuneItem) => b.value - a.value);
    let requiredCoins: RuneItem[] = [];
    let index = 0;
    let coinsToUse = 0;
    let printValues=true
    while (amount > 0 && index<runesArray.length) {
      const currentCoin = runesArray[index].value;
      const currentInventoryAmount=runesArray[index].inventoryAmount!;
      let incrementIndex = true;

      for(coinsToUse;coinsToUse<currentInventoryAmount;coinsToUse++){

        if (amount - currentCoin > -currentCoin * waste) {
          amount -= currentCoin;
          requiredCoins.push(runesArray[index]);
          incrementIndex = false;
        }

        if (index === runesArray.length - 1 && amount>0) {
          amount -= currentCoin;
          requiredCoins.push(runesArray[index]);
        }
        if(amount<0){
          break;
        }
      }
      if (index <= runesArray.length - 1 && incrementIndex) {
        index++;
        coinsToUse=0;
      }
    }

    if(amount>0){
      if(waste<=1){
        calculateRunes(initialAmount,waste+0.1)
        printValues=false
      }
    }

    if(printValues){
      setRunesWasted(amount);

      const coinsGrouped = groupBy(requiredCoins, runesArray);
      calculateTotalAddedAmount(coinsGrouped);
      setRequiredRunes(coinsGrouped)
    }
  }

  const handleModeChange = () => {
    window.dispatchEvent(new Event('modeChange'))

    if (mode === ModesEnum.LEVEL_MODE) {
      setMode(ModesEnum.TARGET_MODE)
    }

    if (mode === ModesEnum.TARGET_MODE) {
      setMode(ModesEnum.LEVEL_MODE)
    }
  }

  const deleteArrayElement = (element: RuneItem) => {
    setRequiredRunes(requiredRunes.filter((rune) => rune.name !== element.name))

    if(deleteFromInventory){
      const updatedRunes= runesArray.map((rune: RuneItem) => {
        if(rune.name===element.name){
          return {
            ...rune,
            inventoryAmount: rune.inventoryAmount!-element.amountNeeded!
          }
        }
        else{
          return rune
        }
      })
      setRunesArray(updatedRunes)
      setToLS("runes",JSON.stringify(updatedRunes))
      window.dispatchEvent(new Event('runesChange'))
    }
  }

  return (
    <>
      <div className='options'>
        <div className='optionsLeft'>
          <button type="button" className='buttonER' onClick={handleModeChange} disabled={false}>Mode</button>
        </div>
        <div className='optionsRight'>
          <Link to="/inventory" className='buttonER'>Inventory</Link>
          <Link to="/settings" className='buttonER'>Settings</Link>
        </div>
      </div>
      <Modes inputValue={setInputValuePropFunc} mode={mode} />
      {
        totalRunesAdded > 0 &&
        <>
        <Table items={requiredRunes} deleteElement={deleteArrayElement} />
        <div className='row'>
          <div className='wrapper added'>
            Runes Added: {totalRunesAdded.toLocaleString()}
          </div>
          {runesWasted <= 0 &&
            <div className='wrapper wasted'>
              Runes Wasted: {runesWasted.toLocaleString()}
            </div>
          }
          {runesWasted > 0 &&
            <div className='wrapper notEnough'>
              Not enough runes by: {runesWasted.toLocaleString()}
            </div>
          }
          
        </div>
        </>
      }
      <div className='logo'></div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        limit={1}
      />
    </>
  );
}

export default MainPage;
