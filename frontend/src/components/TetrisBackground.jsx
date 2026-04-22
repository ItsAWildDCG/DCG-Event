export function TetrisBackground() {
  const pieces = [
    { style: { '--delay': '0s', '--duration': '8s', '--left': '5%' } },
    { style: { '--delay': '2s', '--duration': '10s', '--left': '15%' } },
    { style: { '--delay': '4s', '--duration': '7s', '--left': '25%' } },
    { style: { '--delay': '1s', '--duration': '9s', '--left': '35%' } },
    { style: { '--delay': '3s', '--duration': '11s', '--left': '45%' } },
    { style: { '--delay': '0.5s', '--duration': '8.5s', '--left': '55%' } },
    { style: { '--delay': '2.5s', '--duration': '9.5s', '--left': '65%' } },
    { style: { '--delay': '1.5s', '--duration': '10.5s', '--left': '75%' } },
    { style: { '--delay': '3.5s', '--duration': '8s', '--left': '85%' } },
    { style: { '--delay': '0.8s', '--duration': '12s', '--left': '95%' } },
  ];

  return (
    <div className="tetris-background">
      {pieces.map((piece, i) => (
        <div key={i} className="tetris-piece" style={piece.style}>
          <div className="tetris-block"></div>
          <div className="tetris-block"></div>
          <div className="tetris-block"></div>
          <div className="tetris-block"></div>
        </div>
      ))}
    </div>
  );
}
