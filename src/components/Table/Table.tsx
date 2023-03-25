import React, { ChangeEvent } from "react";
import { RuneItem } from "../../../types/common/main";
import deleteIcon from '../../static/images/delete.png';
import './Table.css';
export interface TableProps {
  items: Array<RuneItem>
  deleteElement?: (element: RuneItem) => void;
}
function Table(props: TableProps) {
  return (
    <div className="row">
      <table>
        <thead>
            <tr>
              <td colSpan={2}>Rune name</td>
              <td>Value</td>
              <td>Amount needed</td>
            </tr>
        </thead>
        <tbody className="runesTable">
          {props.items.map((element, key) => {
            return (
              <tr key={key}>
                <>
                <td>
                  <div className="textureContainer">
                    <img src={element.texture} alt="" className="runeTexture" />
                      <img className="overlay" src={deleteIcon} alt="" onClick={() => props.deleteElement ? props.deleteElement(element) : ''} />
                  </div>
                </td>
                <td>{element.name}</td>
                <td>{element.value}</td>
                <td>{element.amountNeeded}</td>
                </>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
