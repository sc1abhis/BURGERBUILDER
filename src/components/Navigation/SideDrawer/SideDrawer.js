import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Auxi from '../../../hoc/Auxi'
import Backdrop from '../../UI/Backdrop/Backdrop'


import classes from '../SideDrawer/SideDrawer.module.css'

const sideDrawer = (props) =>{
    //... 
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
      attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Auxi>
            <Backdrop show={props.open} clicked={props.close}/>
            <div className = {attachedClasses.join(' ')}>
            <div className = {classes.Logo}><Logo/></div>
            
            <nav>
                <NavigationItems />
            </nav>
        </div>
        </Auxi>
        
    )
}

export default sideDrawer;