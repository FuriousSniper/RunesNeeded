import React, { useEffect, useState } from 'react';
import './Modes.css';
import { ModesEnum, calculateRunesFromToLevel } from '../../utils/utils';
import Input from '../Input';
export interface ModeProps {
  inputValue: (value: number) => void;
  mode: ModesEnum;
}
function Modes(props: ModeProps) {
  const [shiftHeld, setShiftHeld] = useState(false);
  const [ctrlHeld, setCtrlHeld] = useState(false);

  const downHandler = ({key}: KeyboardEvent) => {
    if (key === 'Shift') {
      setShiftHeld(true);
    }
    if (key === 'Control') {
      setCtrlHeld(true)
    }
  }

  const upHandler = ({key}: KeyboardEvent) => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let returnValue = 0;
    event.preventDefault()
    
    if (props.mode === ModesEnum.LEVEL_MODE) {
      const currentLevel = Number(event.currentTarget.currentLevel.value)
      const newLevel =Number( event.currentTarget.newLevel.value)
      const ownedRunes = Number(event.currentTarget.ownedRunes.value)

      if(currentLevel<newLevel){
        const runesBetween = calculateRunesFromToLevel(currentLevel, newLevel);
        returnValue = runesBetween - ownedRunes;
        if (returnValue < 0) {
          returnValue = 0;
        }
      }
    }

    if (props.mode === ModesEnum.TARGET_MODE) {
      const targetRunes = Number(event.currentTarget.targetRunes.value)
      const ownedRunes = Number(event.currentTarget.ownedRunes.value)

      returnValue = targetRunes - ownedRunes;
      if (returnValue < 0) {
        returnValue = 0;
      }
    }

    props.inputValue(returnValue)
  }

  const returnLevelMode = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='inputRow'>
          <div className='inputWrapper'>
            <Input min={0} max={999999999} name={"ownedRunes"} labelLeft={"Runes Owned"} shiftHeld={shiftHeld} ctrlHeld={ctrlHeld}/>
          </div>
        </div>
        <div className='inputRow'>
          <div className='inputWrapper'>
            <Input min={1} max={713} name={"currentLevel"} labelLeft={"Current level"} shiftHeld={shiftHeld} ctrlHeld={ctrlHeld} shiftModifier={10} ctrlModifier={100}/>
          </div>
        </div>
        <div className='inputRow'>
          <div className='inputWrapper'>
            <Input min={1} max={713} name={"newLevel"} labelLeft={"New level"} shiftHeld={shiftHeld} ctrlHeld={ctrlHeld} shiftModifier={10} ctrlModifier={100}/>
          </div>
        </div>
        <div className='submitRow'>
          <button type="submit" id="submitButton" className='buttonER'>Confirm</button>
        </div>
      </form>
    )
  }

  const returnTargetMode = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='inputRow'>
          <div className='inputWrapper'>
            <Input min={0} max={999999999} name={"ownedRunes"} labelLeft={"Runes Owned"} shiftHeld={shiftHeld} ctrlHeld={ctrlHeld} shiftModifier={100} ctrlModifier={1000}/>
          </div>
        </div>
        <div className='inputRow'>
          <div className='inputWrapper'>
            <Input min={0} max={999999999} name={"targetRunes"} labelLeft={"Runes Target"} shiftHeld={shiftHeld} ctrlHeld={ctrlHeld} shiftModifier={100} ctrlModifier={1000}/>
          </div>
        </div>
        <div className='submitRow'>
          <button type="submit" id="submitButton" className='buttonER'>Confirm</button>
        </div>
      </form>
      )
  }

  const renderInput = (mode: ModesEnum) => {
    if (mode === ModesEnum.LEVEL_MODE) {
      return returnLevelMode()
    }
    if (mode === ModesEnum.TARGET_MODE) {
      return returnTargetMode()
    }
  }

  return (
    <>
      {renderInput(props.mode)}
    </>
  );
}

export default Modes;

