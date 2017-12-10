package userAndGame;

import java.io.*;
import java.util.*;

public class Cell {
	public static enum CellType {
		CELL_TYPE_EMPTY, CELL_TYPE_HALLWAY, CELL_TYPE_ROOM
	}

	private ArrayList<String> m_characterList = new ArrayList<String>();
	private String m_name = "";
	private CellType m_cellType = null;
	private int m_x;
	private int m_y;

	public boolean addCharacter(String character) {
		boolean ret = false;
		switch (m_cellType) {
		case CELL_TYPE_EMPTY:
			ret = false;
			break;
		case CELL_TYPE_HALLWAY:
			if (m_characterList.size() == 0) {
				ret = true;
			}
			break;
		case CELL_TYPE_ROOM:
			ret = true;
			break;
		}

		if (ret) {
			m_characterList.add(character);
		}
		return ret;
	}

	public void removeCharacter(String character) {
		m_characterList.remove(character);
	}

	public ArrayList<String> getCharacters() {
		return m_characterList;
	}

	public boolean hasCharacter(String name) {
		return (m_characterList.contains(name));
	}

	public boolean hasCharacters() {
		return (m_characterList.size() > 0);
	}

	public String getName() {
		return m_name;
	}

	public void setName(String name) {
		m_name = name;
	}

	public CellType getType() {
		return m_cellType;
	}

	public void setType(CellType type) {
		m_cellType = type;
	}

	public int getX() {
		return m_x;
	}

	public int getY() {
		return m_y;
	}

	public void setPosition(int x, int y) {
		m_x = x;
		m_y = y;
	}
}
