import React from 'react';
import './Lobby.css';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardTitle, CardText, Form, FormGroup, Label, Input,
    Modal, ModalHeader, ModalBody, ModalFooter, Row, Col,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { updateLoginStatus } from "../../redux_app-state/actions/actions";

import ServerProxy from '../../classes/ServerProxy';

import Game from "../Game_Page/Game";

const mapStateToProps = (state = {}) => {
    return {
        isLoggedIn: state.User.isLoggedIn
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateLoginStatus: (bool) => dispatch(updateLoginStatus(bool))
    };
};

export class Lobby extends React.Component {

    constructor() {
        super();
        this.toggleExistingRoomDropdown = this.toggleExistingRoomDropdown.bind(this);
        this.selectDropdownItem = this.selectDropdownItem.bind(this);
        this.state = {
            newRoomSelected: null, // if true, new room. if false, show existing list
            dropdownOpen: false,
            dropdownValue: ""
        }
    }

    toggleExistingRoomDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    selectDropdownItem(event) {
        console.log(event.target.innerText)
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
            dropdownValue: event.target.innerText
        });
    }

    renderNewVsExistingGameButtons() {
        return <Row>
            <Col sm="6">
                <Card body>
                    <Button onClick={() => this.setState({newRoomSelected: true})}>New Game</Button>
                </Card>
            </Col>
            <Col sm="6">
                <Card body>
                    <Button onClick={() => this.setState({newRoomSelected: false})}>Join Existing Game</Button>
                </Card>
            </Col>
        </Row>;
    }

    renderRoomOptions() {
        const { newRoomSelected } = this.state;
        if ( newRoomSelected !== null && newRoomSelected === true) {
            return <Form onSubmit={this.handleNewRoomSubmit.bind(this)}>
                <FormGroup>
                    <Label for="new-room">Enter a game name</Label>
                    <Input type="text" name="new-room" id="new-room" innerRef={node => this.newRoomName = node} />
                    <Button className="btn btn-block pointer-cursor">Submit</Button>
                </FormGroup>
            </Form>
        } else if ( newRoomSelected !== null && newRoomSelected === false ) {
            return <div><Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleExistingRoomDropdown}>
                <DropdownToggle caret>
                    Room Options
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Available Games</DropdownItem>
                    <DropdownItem onClick={this.selectDropdownItem}>Canh's game</DropdownItem>
                    <DropdownItem onClick={this.selectDropdownItem}>Brian's game</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem header>Unavailable Games</DropdownItem>
                    <DropdownItem disabled>Christina's game</DropdownItem>
                    <DropdownItem disabled>Simran's game</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            { this.state.dropdownValue ? `You want to join :: ${this.state.dropdownValue}` : null }
            <hr/>
            <Button disabled={this.state.dropdownValue.length === 0} onClick={this.handleExistingRoomSubmit.bind(this)} className="btn pointer-cursor">Submit</Button>
            </div>
        }
    }

    handleNewRoomSubmit(e) {
        
        if (this.newRoomName && this.newRoomName.value && this.newRoomName.value.length > 0) {

            console.log("This is the room typed in", this.newRoomName.value);
            ServerProxy.joinGame(this.newRoomName.value, true);
            this.newRoomName.value = "";

            let path = '/game';
            this.props.history.push(path);
            
        }

        e.preventDefault();
    
    }

    handleExistingRoomSubmit() {
        console.log("This is the room you wish to join", this.state.dropdownValue);
        if (this.state.dropdownValue && this.state.dropdownValue.length > 0) {
            ServerProxy.joinGame(this.state.dropdownValue, false);
        }
        this.setState({ dropdownValue: "" });
    }

    render() {

        if (this.props.isLoggedIn) {
            return (<div className="container">
                <div className="mt-5">
                    <div className="card-header">Choose your game options</div>
                    {this.renderNewVsExistingGameButtons()}
                </div>
                <hr/>
                { this.renderRoomOptions() }
            </div>);
        } else {
            return <Redirect to='/login'/>;
        }

    }

}

Lobby = withRouter(Lobby);

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);