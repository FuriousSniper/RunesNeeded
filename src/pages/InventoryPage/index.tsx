import React, { ChangeEvent, useEffect, useState } from 'react';
import { RuneItem } from '../../../types/common/main';
import { getFromLS, setToLS } from '../../utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../../components/Input';
import './index.css';
import { Link } from 'react-router-dom';

const InventoryPage = () => {
  const [runesInventory, setRunesInventory] = useState(getFromLS("runes") ? JSON.parse(getFromLS("runes")).sort((a: RuneItem, b: RuneItem) => a.value - b.value) : undefined);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [ctrlHeld, setCtrlHeld] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const maxLimit = 699;
  const minLimit = 0;

  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === 'Shift') {
      setShiftHeld(true);
    }
    if (key === 'Control') {
      setCtrlHeld(true)
    }
  }

  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === 'Shift') {
      setShiftHeld(false);
    }
    if (key === 'Control') {
      setCtrlHeld(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  const handleChangeInput = (element: RuneItem, event: ChangeEvent) => {
    const updatedRunes = runesInventory.map((rune: RuneItem) => {
      if (rune.name === element.name) {
        return {
          ...rune,
          inventoryAmount: Number((event.target as HTMLInputElement).value)
        }
      }
      else {
        return rune
      }
    })
    setRunesInventory(updatedRunes)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updatedRunes = runesInventory.map((rune: RuneItem, key: Number) => {
      return{
        ...rune,
        inventoryAmount: Number(event.currentTarget[`Input-${key}`].value)
      }
    })
    setRunesInventory(updatedRunes)

    setToLS("runes", JSON.stringify(updatedRunes))
    window.dispatchEvent(new Event('runesChange'))
    toast.success('Inventory Saved', {});
    setDisableSave(true)
    setTimeout(() => setDisableSave(false), 3000)
  }

  return (
    <>
      <div className='options'>
        <div className='optionsLeft'>
        </div>
        <div className='optionsRight'>
          <Link to="/" className='buttonER'>Home</Link>
          <Link to="/settings" className='buttonER'>Settings</Link>
        </div>
      </div>
      <div className='row'>Inventory</div>
      <form onSubmit={handleSubmit}>
        <div className="row">
            {runesInventory &&
              <table>
                <thead>
                  <tr className='tableHeader'>
                    <td colSpan={2}>Rune name</td>
                    <td>Value</td>
                    <td>Inventory amount</td>
                  </tr>
                </thead>
                <tbody className="runesTable">
                  {runesInventory.map((element: RuneItem, key: number) => {
                    return (
                      <tr key={key}>
                        <td>
                          <div className="textureContainer">
                            <img src={element.texture} alt="" className="runeTexture" />
                          </div>
                        </td>
                        <td>{element.name}</td>
                        <td>{element.value}</td>
                        <td className='inputTd'>
                          <Input name={`Input-${key}`} initialValue={runesInventory[key].inventoryAmount} min={minLimit} max={maxLimit} shiftHeld={shiftHeld} ctrlHeld={ctrlHeld} shiftModifier={10} ctrlModifier={100} arrowsEnabled={true} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            }
        </div>
        <div className="row">
          <button type="submit" id="submitButton" className='buttonER' disabled={disableSave}>Save changes</button>
        </div>
      </form>
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

export default InventoryPage;
