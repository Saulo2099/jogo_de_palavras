import "./GameOver.css";

const GameOver = ({retry, score}) => {
  return (
    <div>
      <h1>GameOver</h1>
      <h2>
        a sua pontuação foi: <span>{score}</span>
      </h2>
        <button onClick={retry}>Reiniciar</button>
    </div>
  )
}

export default GameOver