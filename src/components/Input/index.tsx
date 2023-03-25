import React, { ChangeEvent, useEffect, useState } from 'react';
import './index.css';
export interface InputProps {
    handleChange?: (event: ChangeEvent) => void;
    initialValue?: number
    name: string;
    labelLeft?: string;
    min: number;
    max: number;
    arrowsEnabled?: boolean;
    removeLeadingZero?: boolean;
    shiftHeld?: boolean;
    ctrlHeld?: boolean;
    shiftModifier?: number;
    ctrlModifier?: number;
}
export const enum arrowsModes {
    INC = "INC",
    DEC = "DEC",
}
export const enum modifiers {
    SHIFT = 100,
    CTRL = 1000,
}
function Input(props: InputProps) {
    const [value, setValue] = useState(Number(props.initialValue) && props.initialValue!==undefined? props.initialValue : 0)
    const [shiftModifier, setShiftModifier] = useState(props.shiftModifier ? props.shiftModifier : modifiers.SHIFT)
    const [ctrlModifier, setCtrlModifier] = useState(props.ctrlModifier ? props.ctrlModifier : modifiers.CTRL)

    const refreshValue = () => {
        setValue(value)
    }

    useEffect(() => {
        refreshValue()
      
        window.addEventListener('modeChange',  refreshValue)
        return () => window.removeEventListener('modeChange', refreshValue)
    }, [])

    const handleChangeButton = (mode: string) => {
        let newAmount = value;

        if (mode === arrowsModes.INC) {
            if (newAmount + 1 <= props.max) {
                newAmount += 1
            }
        }
        if (mode === arrowsModes.DEC) {
            if (newAmount - 1 >= props.min) {
                newAmount -= 1
            }
        }

        setValue(newAmount)
    }

    const handleChange = (event: ChangeEvent) => {
        if(!!props.handleChange){
            props.handleChange(event)
        }
        const inputValue = Number((event.target as HTMLInputElement).value)
        let toSet = inputValue;

        if (props.shiftHeld) {
            if (Math.abs(inputValue - value) === 1) {
                toSet = value + ((inputValue - value) * shiftModifier);
            }
        }
        else if (props.ctrlHeld) {
            if (Math.abs(inputValue - value) === 1) {
                toSet = value + ((inputValue - value) * ctrlModifier);
            }
        }

        if (toSet < props.min) {
            toSet = props.min
        }
        if (toSet > props.max) {
            toSet = props.max
        }

        setValue(toSet)
    }

    return (
        <>
            {props.labelLeft &&
                <label htmlFor={props.name}>{props.labelLeft}</label>
            }
            {
                props.arrowsEnabled &&
                <button type="button" className='tickButtonER' onClick={() => handleChangeButton(arrowsModes.DEC)} disabled={value < props.min! ? true : false}>&#60;</button>
            }
            {
                <input type="number" name={`${props.name}`} id={`${props.name}`} className='numberInputER' value={props.removeLeadingZero ? String(value).replace(/^0+/, '') : String(value)} min={props.min} max={props.max} onChange={handleChange}/>
            }
            {
                props.arrowsEnabled &&
                <button type="button" className='tickButtonER' onClick={() => handleChangeButton(arrowsModes.INC)} disabled={value > props.max! ? true : false}>&#62;</button>
            }
        </>
    );
}

export default Input;
