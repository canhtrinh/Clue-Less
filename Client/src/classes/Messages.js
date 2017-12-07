import { store } from '../../renderer';
import { addToGameRoomList, deleteFromGameRoomList, updateGameRoomList
} from "../redux_app-state/actions/actions";
import ServerProxy from "./ServerProxy";

export default {

    generateMessageHeader(messageType) {

        let userId = store.getState().User.userId;
        let gameId = store.getState().User.game.id;

        let obj = {
            messageType: messageType,
            userId: userId,
            gameId
        };

        return obj;

    },

    generateMessageEnder() {

        return "\n";

    },

    generateLoginMessage(name) {


        let messageHeader = this.generateMessageHeader("loginMessage");

        let obj = Object.assign({}, messageHeader, { content: { username: name } });

        let messageEnd = this.generateMessageEnder();

        return JSON.stringify(obj) + messageEnd;
    },

    generateJoinGameMessage(gameName, isNew) {
        
        
        let messageHeader = this.generateMessageHeader("joinGame");

        let obj = Object.assign({}, messageHeader, { content: { 
            gameRoomName: gameName,
            isNew: isNew
        }});

        let messageEnd = this.generateMessageEnder();
        
        return JSON.stringify(obj) + messageEnd;
    },

    generateSelectCharacterMessage(character) {

        let messageHeader = this.generateMessageHeader("selectCharacter");
        
        let obj = Object.assign({}, messageHeader, { content: { 
            characterSelection: character
        }});

        let messageEnd = this.generateMessageEnder();
        
        return JSON.stringify(obj) + messageEnd;

    },

    parseJsonResponseFromServer(incomingMessage) {

        return JSON.parse(incomingMessage);

    },

    incomingMessageHandler(jsonResponse, messageType) {

        switch(messageType) {
            
            case "loginResponse":
                ServerProxy.handleLoginSuccessOrError(jsonResponse);
                break;

            case "joinGame":
                ServerProxy.handleJoinGameResponse(jsonResponse);
                break;

            // message updating gamelist
            case "gameListForLobby":
                let gameRoomList = jsonResponse.content.gameRoomList;
                store.dispatch(updateGameRoomList(gameRoomList));
                break;

            // message updating gamelist
            case "gameListUpdateOnGameAdded":
                let newGameRoom = jsonResponse.content;
                store.dispatch(addToGameRoomList(newGameRoom));
                break;

            case "gameListUpdateOnGameDeleted":
                let gameRoomThatWasDeleted = jsonResponse.content;
                store.dispatch(deleteFromGameRoomList(gameRoomThatWasDeleted));
                break;

            default:
                console.log("Response error :: not a proper messageType ::", messageType);
                break;
        }

    }

}