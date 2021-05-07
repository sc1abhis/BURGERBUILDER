import React from 'react';
import classes from './BuildControls.module.css'
import BuildControl from './BuildControl/BuildControl';
import { checkPropTypes } from 'prop-types';

const controls = [
    {label : 'Salad' , type : 'salad'},
    {label : 'Cheese' , type : 'cheese'},
    {label : 'Bacon' , type : 'bacon'},
    {label : 'Meat' , type : 'meat'}
]
const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price : <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl key={ctrl.label} label={ctrl.label}
                added={() => props.ingredientAdded(ctrl.type)}
                remove={() => props.ingredientRemove(ctrl.type)}
                //disabled = {props.disabled[ctrl.type]} 
            />
        ))}
        <button className = {classes.OrderButton}
        disabled = {!props.purchaseable}
        onClick = {props.ordered}>ORDER NOW</button>
    </div>

); 

export default buildControls;   