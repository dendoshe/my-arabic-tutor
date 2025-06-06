import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [language, setLanguage] = useState("sv");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      setInputText("");
      setResponseData(null);
    }, [language]);

    const testPostRequest = async () => {
      console.log("sending request to backend");
      setLoading(true);
      const url = `https://my-arabic-tutor-api.onrender.com/tutor/${language}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        setResponseData(data);
        console.log("Translation result:", data);
      } catch (error) {
        console.error("Error during POST request:", error);
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <div className="App">
      <header className="App-header">
  {/*<h1>{language === "sv" ? "Lär mig arabiska" : "Teach me Arabic"}</h1>*/}
        <div className="input-box">
        <div className="flag-selector">
        <button
          className={`flag-btn ${language === "sv" ? "selected" : ""}`}
          onClick={() => setLanguage("sv")}
          aria-label="Switch to Swedish"
        >
          🇸🇪
        </button>
        <button
          className={`flag-btn ${language === "en" ? "selected" : ""}`}
          onClick={() => setLanguage("en")}
          aria-label="Switch to English"
        >
          🇬🇧
        </button>
      </div>
        </div>

        <div className="input-section">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === "sv"
                ? "Skriv svensk text att översätta"
                : "Enter english text to translate"
            }
            rows={4}
            className="text-input"
          />
          <button onClick={testPostRequest} className="send-button" disabled={loading}>
          {loading ? (
            <div className="loader-button" />
          ) : (
            language === "sv" ? "Översätt" : "Translate"
          )}
        </button>
           
        </div>

        {responseData && (
          <section className="result-section">
            <div className="translation-box">
              <div className="translation-label">Transliteration</div>
              {responseData.arabic_translit.split(/(?<=[.?!])\s+/).map((sentence, index) => (
                <p key={index} className="transliteration-sentence">
                  <strong>{index + 1}. </strong>{sentence}
                </p>
              ))}
            </div>
        
            <div className="translation-box">
              <div className="translation-label">Arabic Script</div>
              {responseData.arabic_script.split(/(?<=[.?!؟!])\s+/).map((sentence, index) => (
                <p key={index} className="arabic-script-sentence">
                  <strong>{index + 1}. </strong>{sentence}
                </p>
              ))}
            </div>
        
            <div className="translation-box">
              <div className="translation-label">
                {language === "sv" ? "Engelska" : "English"}
              </div>
              <p>              {responseData.english.split(/(?<=[.?!])\s+/).map((sentence, index) => (
                <p key={index} className="transliteration-sentence">
                  <strong>{index + 1}. </strong>{sentence}
                </p>
              ))}</p>
            </div>
        
            {language === "sv" && (
              <div className="translation-box">
                <div className="translation-label">
                  {language === "sv" ? "Ursprungstext" : "Originating text"}
                </div>
                <p>{responseData.swedish}</p>
              </div>
            )}
          </section>
        )}
        
      </header>
    </div>
  );
}

export default App;
