import React, { Component } from 'react';
import Auxi from '../../hoc/Auxi';
import classes from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

class Layout extends Component  {

    state = {
        showSideDrawer: false
    }
    sideDrawerClosedHandler = {
        sideDrawer: () => {
            this.state.show ? this.setState({ show: false }) : this.setState({ show: true })
        }
    }

    render () {
        return(
            <Auxi>
                <Toolbar open={this.state.showSideDrawer}
                    close={this.sideDrawerClosedHandler.sideDrawer} />
                <SideDrawer open={this.state.show}
                    close={this.sideDrawerClosedHandler.sideDrawer} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxi>
        )
    
    }
}

export default Layout;