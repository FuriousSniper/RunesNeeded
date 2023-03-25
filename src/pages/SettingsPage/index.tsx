import React, { ChangeEvent, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFromLS, setToLS, BackgroundsEnum } from '../../utils/utils';
import { defaultRunesArray } from '../../utils/defaultValue';
import './index.css';
import { RuneItem } from '../../../types/common/main';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [deleteFromInventory, setDeleteFromInventory] = useState(getFromLS("deleteFromInventory") ? JSON.parse(getFromLS("deleteFromInventory")) : false)

  const handleDeleteFromInventory = (event: ChangeEvent) => {
    const value = ((event.target as HTMLInputElement).value) ==="true" ? true : false;
    setDeleteFromInventory(value)
    setToLS("deleteFromInventory",JSON.stringify(value))
    toast.success('Setting changed', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  const handleResetRunes = () => {
    confirmAlert({
      title: 'Reset',
      message: 'Are you sure to reset inventory?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setToLS("runes",JSON.stringify(defaultRunesArray))
            toast.success('Inventory resetted', {});
          },
          className: "buttonER"
        },
        {
          label: 'No',
          className: "buttonER"
        }
      ]
    });
  }

  const handleClearRunes= () => {
    confirmAlert({
      title: 'Clear',
      message: 'Are you sure to clear inventory?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => clearRunes(),
          className: "buttonER"
        },
        {
          label: 'No',
          className: "buttonER"
        }
      ]
    });
  }

  const clearRunes = () => {
    let runesArray=defaultRunesArray.map((rune: RuneItem) => {
        return {
          ...rune,
          inventoryAmount:0
        }
    })
    setToLS("runes",JSON.stringify(runesArray))
    toast.success('Inventory cleared', {});
  }

  const handleChangeBackground = (event: ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value
    for (const item in BackgroundsEnum) {
      if (value===item) {
        setToLS("background",JSON.stringify(value))
        window.dispatchEvent(new Event('backgroundChange'))
        return;
      }
    }
  }

  const getDefaultBackground = () => {
    let lsResult = getFromLS("background")
    
    if(!lsResult){
      return BackgroundsEnum.black
    }

    const parsedResult = JSON.parse(lsResult)

    for (const item in BackgroundsEnum) {
      if (parsedResult===item) {
        return parsedResult
      }
    }

    return BackgroundsEnum.black
  }

  return (
    <>
      <div className='options'>
        <div className='optionsLeft'>
        </div>
        <div className='optionsRight'>
          <Link to="/" className='buttonER'>Home</Link>
          <Link to="/inventory" className='buttonER'>Inventory</Link>
        </div>
      </div>
      <div className='row'>Settings</div>
      <div className='row settingRow'>
        <div className="leftSide">
          <label>Remove runes from inventory while deleting them from table of results</label>
        </div>
        <div className="rightSide">
          <select className='buttonER' name="deleteFromInventory" id="deleteFromInventory" onChange={handleDeleteFromInventory} defaultValue={String(deleteFromInventory)}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
        </div>
      </div>
      <div className='row settingRow'>
        <div className="leftSide">
          <label>Reset inventory runes (each rune has <b>99 items</b>)</label>
        </div>
        <div className="rightSide">
          <button type="submit" id="submitButton" className='buttonER' onClick={handleResetRunes}>Reset</button>
        </div>
       
      </div>
      <div className='row settingRow'>
      <div className="leftSide"><label>Clear inventory runes (each rune has <b>0 items</b>)</label></div>
      <div className="rightSide">
        <button type="submit" id="submitButton" className='buttonER' onClick={handleClearRunes}>Clear</button>
      </div>
      </div>
      <div className='row settingRow'>
      <div className="leftSide"><label>Change background</label></div>
      <div className="rightSide">
        <select className='buttonER' name="backgroundSelect" id="backgroundSelect" onChange={handleChangeBackground} defaultValue={getDefaultBackground()}>
          {(Object.keys(BackgroundsEnum) as Array<keyof typeof BackgroundsEnum>).sort().map((item: string) => {
            return <option value={item} key={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
          })}
        </select>
      </div>
      </div>
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

export default SettingsPage;
