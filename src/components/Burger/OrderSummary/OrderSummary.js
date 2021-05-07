import React from 'react';
import Auxi from '../../../hoc/Auxi'
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    
    const ingredientSummary =  Object.keys(props.ingredients).
    map(igKey => {
        return <li key = {igKey}><span style = {{textTransform : 'capitalize'}}>{igKey} : {props.ingredients[igKey]}</span></li>
    }); 

    return (
        <Auxi>
            <h3>Your Order</h3>
            <p>Delicious Burger with the following ingredients</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price : {props.price.toFixed(2)} </strong></p>
            <p>Continue to Checkout?</p>
            <Button clicked = {props.purchaseCancelled} btnType = 'Danger'>CANCEL</Button>
            <Button clicked = {props.purchaseContinue}btnType = 'Success'>CONTINUE</Button>
        </Auxi>
    );
}

export default orderSummary;