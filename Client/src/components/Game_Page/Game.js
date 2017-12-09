import React from 'react';
import "./Game.css";
import classnames from 'classnames';
import { Redirect, withRouter } from 'react-router-dom';
import { Jumbotron, Button, Col, Row, 
    Nav, NavItem, NavLink, TabContent, TabPane, Card, CardTitle, CardText, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import { initiateGameBoard, updateMyPosition, updateMyNeighbors } from "../../redux_app-state/actions/actions";

import { GameBoard } from "../../classes/gameBoard";
import { Game as GameClass } from "../../classes/game";

import Cell from "./Cell";

const mapStateToProps = (state = {}) => {
    console.log(state.GameBoard);
    return {
        isLoggedIn: state.User.isLoggedIn,
        board: state.GameBoard.board,
        myPosition: state.GameBoard.myPosition,
        myNeighbors: state.GameBoard.myNeighbors,
        myCharacter: state.GameSession.myCharacter,
        myCards: state.GameSession.myCards
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initiateGameBoard: (gameBoard) => dispatch(initiateGameBoard(gameBoard)),
        updateMyPosition: (cell) => dispatch(updateMyPosition(cell)),
        updateMyNeighbors: (neighbors) => dispatch(updateMyNeighbors(neighbors))        
    };
};

export class Game extends React.Component {

    constructor(props) {
        super(props);
    
        this.toggleTabs = this.toggleTabs.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
          activeTab: null,
          neighbors: null,
          modal: false
        };
        this.neighbors = null;
    }
    
    toggleTabs(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    toggleModal() {
        this.setState({
          modal: !this.state.modal
        });
      }

    componentDidMount() {
        console.log("this is the game board :: ", GameBoard);

        // transform board into 5x5
        let twoDBoard = [];
        let firstRow = GameBoard.board.slice(0,5);
        let secondRow = GameBoard.board.slice(5,10);
        let thirdRow = GameBoard.board.slice(10,15);
        let fourthRow = GameBoard.board.slice(15,20);
        let fifthRow = GameBoard.board.slice(20);
        twoDBoard = [[...firstRow], [...secondRow], [...thirdRow], [...fourthRow], [...fifthRow]];

        this.props.initiateGameBoard(twoDBoard);
        this.props.updateMyPosition(GameBoard.board[0]);
        this.props.updateMyNeighbors();
        
    }

    componentWillReceiveProps(nextProps) {
        let nullChecker = this.props.myPosition && this.props.board;
        if(nullChecker && this.props.myPosition !== nextProps.myPosition) {
            console.log("myPosdiff", this.props.myPosition, nextProps.myPosition)
            let { myPosition } = nextProps;
            console.log("updating neighbors with position change");
            let myCoordinates = [myPosition.m_x, myPosition.m_y];
            let neighbors = GameBoard.getValidNeighbors(myPosition.m_x, myPosition.m_y, this.props.board);
            this.props.updateMyNeighbors(neighbors);
            console.log("neighbors", getNeighbors);
        }
    }

    renderCells() {
        let board = GameBoard.board;
        let cells = [];
        let { myNeighbors } = this.props;
        for (let i = 0; i < board.length; i++) {

            let isNeighbor = false;
            
            myNeighbors ? myNeighbors.forEach((neighbor) => {
                if(board[i] && board[i].m_x === neighbor[0] && board[i].m_y === neighbor[1]) {
                    isNeighbor = true;
                    console.log("isNeighbor")
                }
            }) : null;

            let highlightClassName = this.state.activeTab === '1' && isNeighbor
                ? " highlight "
                : "";

            let className=board[i] === null
                ? " black-out " 
                : !board[i].m_isHallway
                    ? " room-fill " 
                    : " hallway-fill ";
            className += board[i] && board[i].m_isHallway && board[i].m_x % 2 > 0 
                ? " hallway-tall " 
                : board[i] && board[i].m_isHallway
                    ? " hallway-wide "
                    : "";
            className += highlightClassName;
            cells.push(<Cell 
                key={i} index={i} 
                cellPiece={board[i]} 
                className={className}
            />);
        }
        return <div className="game-board">{cells}</div>;
    }

    generateNavItem(tab, text) {
        return <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === tab })} onClick={() => { this.toggleTabs(tab); }}>
                {text}
            </NavLink>
        </NavItem>;
    }

    renderSelectionAction() {
        return <div>
            <h4 className="margin-top">Select An Action</h4>
            <Nav tabs>
                {this.generateNavItem('1','Move Character')}
                {this.generateNavItem('2','Make Suggestion')}
                {this.generateNavItem('3','Make Accusation')}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <div className="margin-top"></div>
                {this.renderMoveCharacterScreen()}
                {this.renderMakeSuggestionScreen()}
                {this.renderMakeAccusationScreen()}
            </TabContent>
        </div>;
    }

    renderMoveCharacterScreen() {
        let { board, myPosition, myNeighbors } = this.props;
        if (this.state.activeTab === '1') {
            console.log("updating neighbors");
            let myCoordinates = [myPosition.m_x, myPosition.m_y];
            let neighbors = GameBoard.getValidNeighbors(myPosition.m_x, myPosition.m_y, this.props.board);
            if (!this.props.myNeighbors) {
                this.props.updateMyNeighbors(neighbors);
            }
            console.log("neighbors", neighbors);
        }

        return <TabPane tabId="1">
            <Row>
                <Col sm="12">
                    <Card body>
                        <CardTitle>Where do you want to go?</CardTitle>
                        { board && myNeighbors ? myNeighbors.map((position, i) => {
                            let onClick = this.moveCharacter.bind(this,position);
                            return <Button key={i} onClick={onClick} className="margin-bottom">{board[position[0]][position[1]].m_name}</Button>
                        }) : null }
                    </Card>
                </Col>
            </Row>
        </TabPane>        
    }

    moveCharacter(destination) {
        GameClass.move(destination);
        let message = `Moving you to coordinates ${destination}`; // TBU
        alert(message);
        this.setState({ activeTab: null });
    }

    renderMakeSuggestionScreen() {
        return <TabPane tabId="2">
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle>Character</CardTitle>
                        <CardText>Choose wisely.</CardText>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle>Weapon</CardTitle>
                        <CardText>Do you have evidence?</CardText>
                    </Card>
                </Col>
            </Row>
            <div className="margin-top"></div>
            <Card><Button onClick={this.makeSuggestion.bind(this,"Miss. Scarlet", "Axe", "Conservatory")}>Make your suggestion</Button></Card>
        </TabPane>        
    }

    makeSuggestion(character, weapon, currentRoom) {
        GameClass.makeSuggestion(character, weapon, currentRoom);
    }

    renderMakeAccusationScreen() {
        return <TabPane tabId="3">
            <Row>
            <Col sm="6">
                <Card body>
                    <CardTitle>Accuse A Character</CardTitle>
                    <CardText>Choose wisely.</CardText>
                </Card>
            </Col>
            <Col sm="6">
                <Card body>
                    <CardTitle>Choose Your Weapon</CardTitle>
                    <CardText>Are you sure?</CardText>
                </Card>
            </Col>
            </Row>
            <div className="margin-top"></div>
            <Card><Button onClick={this.makeAccusation.bind(this,"Miss. Scarlet", "Axe", "Conservatory")}>Make your accusation. Good luck.</Button></Card>
        </TabPane>       
    }

    makeAccusation(character, weapon, currentRoom) {
        GameClass.makeAccusation(character, weapon, currentRoom);
    }

    renderTurnIndicator() {
        return <h1>It is your turn</h1>;
    }

    renderCardModel() {
        return (
            <div>
              <Modal style={{ width: '600px' }} isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                <ModalHeader toggle={this.toggleModal}>Your cards</ModalHeader>
                <ModalBody>
                    <Row>
                    {this.props.myCards 
                        ? this.props.myCards.map((card, i) => {
                            return (
                                <Col key={i} sm="4">
                                    <Card className="max-height" inverse style={{ backgroundColor: '#333', borderColor: '#333' }} body outline>
                                        <CardText>{card}</CardText>
                                    </Card>
                                </Col>
                            )
                        }) 
                        : null }
                    </Row>
                </ModalBody>
                <ModalFooter>
                  <Button color="info" onClick={this.toggleModal}>Understood</Button>
                </ModalFooter>
              </Modal>
            </div>
          );
    }

    render() {
        const { isLoggedIn, board, myPosition, myCharacter } = this.props;

        if (this.props.isLoggedIn) {
            return (<div className="container">
                <Row>
                    <Col xs="7">{ myCharacter ? <h3 className="margin-bottom">Hello, {myCharacter}</h3> : null}</Col>
                    <Col xs="5">
                        <Row className="pull-right">
                            <Button color="secondary" onClick={this.toggleModal}>View your cards</Button>
                            {this.renderCardModel()}
                        </Row>              
                    </Col>
                </Row>

                <Row>
                    <Col xs="7">{this.renderCells()}</Col>
                    <Col className="stacked-rows" xs="5">
                        <Row className="right-top">{this.renderTurnIndicator()}</Row>              
                        { board && myPosition ? <Row className="right-bottom">{this.renderSelectionAction()}</Row> : null }
                    </Col>
                </Row>
            </div>);
        } else {
            return <Redirect to='/login'/>;
        }



    }

}

Game = withRouter(Game);

export default connect(mapStateToProps, mapDispatchToProps)(Game);