package Messages;

import java.lang.reflect.Type;

import com.google.gson.*;

public class CluelessDeserializer implements JsonDeserializer<MessageContainer> {
	@Override
	public MessageContainer deserialize(JsonElement je, Type type, JsonDeserializationContext jdc)
			throws JsonParseException {
		MessageContainer output = new MessageContainer();
		MessageHeader header = new MessageHeader();

		// First, let's get the header info
		header.setMessageType(je.getAsJsonObject().get("messageType").getAsString());
		header.setUserId(je.getAsJsonObject().get("userId").getAsInt());
		header.setGameId(je.getAsJsonObject().get("gameId").getAsInt());

		output.setMessageHeader(header);

		MessageBase obj = null;
		Gson gson = new Gson();
		JsonElement message = je.getAsJsonObject().get("content");

		switch (header.getMessageType()) {
		case "loginMessage":
			obj = gson.fromJson(message, LoginMessage.class);
			break;
		case "joinGame":
			obj = gson.fromJson(message, JoinGameMessage.class);
			break;
		case "startGame":
			obj = gson.fromJson(message, StartGameMessage.class);
			break;
		case "selectCharacter":
			obj = gson.fromJson(message, SelectCharacterMessage.class);
			break;
		case "move":
			obj = gson.fromJson(message, MoveMessage.class);
			break;
		case "suggest":
			obj = gson.fromJson(message, SuggestionMessage.class);
			break;
		case "showCard":
			obj = gson.fromJson(message, ShowCardMessage.class);
			break;
		case "accuse":
			obj = gson.fromJson(message, AccusationMessage.class);
			break;
		case "endTurn":
			obj = gson.fromJson(message, EndTurnMessage.class);
			break;
		default:
			System.out.println("This message sucks and isn't allowed" + header.getMessageType());
			break;
		}

		output.setMessageBase(obj);
		return output;
	}
}
