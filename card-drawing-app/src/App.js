import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function App() {
  const [deck, setDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const deckIdRef = useRef(null);

  useEffect(() => {
    async function fetchDeck() {
      const response = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(response.data);
      deckIdRef.current = response.data.deck_id;
    }
    fetchDeck();
  }, []);

  const drawCard = async () => {
    if (!deck) return;

    try {
      const { deck_id } = deck;
      const response = await axios.get(`${API_BASE_URL}/${deck_id}/draw/?count=1`);

      if (response.data.remaining === 0) {
        alert("Error: no cards remaining!");
      } else {
        const card = response.data.cards[0];
        setDrawnCards((cards) => [...cards, card]);
        setDeck((d) => ({ ...d, remaining: response.data.remaining }));
      }
    } catch (error) {
      console.error("Error drawing card:", error);
    }
  };

  const shuffleDeck = async () => {
    if (!deck) return;

    setIsShuffling(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/${deckIdRef.current}/shuffle/`);
      setDeck((prevDeck) => ({ ...prevDeck, remaining: 52 }));
      setDrawnCards([]);
    } catch (error) {
      console.error("Error shuffling deck:", error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div>
      <h1>Card Drawing App</h1>
      <button onClick={drawCard} disabled={deck && deck.remaining === 0}>
        Draw a Card
      </button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        {isShuffling ? "Shuffling..." : "Shuffle Deck"}
      </button>
      <div
        style={{
          position: "relative",  // Ensures cards stack on top of each other
          width: "100px",  // Adjust width based on card size
          height: "150px", // Adjust height based on card size
        }}
      >
        {drawnCards.map((card) => (
          <Card key={card.code} image={card.image} />
        ))}
      </div>
    </div>
  );
}

export default App;
