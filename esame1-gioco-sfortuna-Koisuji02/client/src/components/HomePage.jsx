import { Link } from "react-router";

function HomePage(props) {
  return (
    <div className="home-page beach-bg d-flex flex-column align-items-center justify-content-center">
      <div className="homepage-main-row d-flex flex-row flex-wrap justify-content-center align-items-stretch gap-4 mt-4">

        {/* PARTE DI WELCOME e BOTTONI PER ANDARE A DEMO, LOGIN/GAME */}
        <div className="beach-card beach-home-card text-center d-flex flex-column justify-content-center align-items-center homepage-welcome">
          <h1 className="beach-title">
            <span role="img" aria-label="sun">🌞</span> Welcome to Unlucky Holidays!
          </h1>
          {props.user ? (
            <p className="beach-home-msg">
              Hello, <b>{props.user.username}</b>! Ready to play?
              <span role="img" aria-label="luggage"> 🧳</span>
            </p>
          ) : (
            <p className="beach-home-msg">
              Try the <b>demo</b> or <b>log in</b> to start your unlucky adventure!<br/>
              <span role="img" aria-label="wave">🌊</span> <span role="img" aria-label="umbrella">⛱️</span> <span role="img" aria-label="plane">✈️</span>
            </p>
          )}
          <div className="d-flex justify-content-center gap-3 mt-4 homepage-btn-row">
            <Link to="/demo" className="btn beach-btn">Try Demo</Link>
            {props.user && <Link to="/game" className="btn beach-btn beach-newgame-btn homepage-game-btn">Game</Link>}
            {!props.user && <Link to="/login" className="btn beach-btn beach-login-btn">Login</Link>}
          </div>
        </div>

        {/* PARTE DI REGOLE DEL GIOCO */}
        <div className="beach-card homepage-rules mt-0 p-4 text-left d-flex flex-column justify-content-center align-items-start">
          <h2 className="beach-title mb-3 homepage-rules-title"><span role="img" aria-label="rules">📜</span> Game Instructions</h2>
          <ul className="homepage-rules-list">
            <li>You start with <b>3 random cards</b> showing their "Bad Luck Index".</li>
            <li>Each round, you'll see a new vacation mishap card (without its Bad Luck Index).</li>
            <li>Guess where this new card fits among your cards, based on how unlucky you think it is.</li>
            <li>You have <b>30 seconds</b> to decide the position.</li>
            <li>If you guess correctly, you win the card and it is added to your collection!</li>
            <li>If you are wrong or time runs out, you lose the round and the card is lost.</li>
            <li>Win by collecting <b>6 cards</b> or lose after <b>3 wrong guesses</b>.</li>
          </ul>
          <div className="mt-3 homepage-rules-demo">
            <b>Demo mode:</b> 1 round only, no login required.<br/>
            <b>Full game:</b> Play until you win or lose, and track your history (login required).
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
