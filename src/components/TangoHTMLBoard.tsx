import { BoardState, ConstraintType } from "../types/types";
import { Tile } from "./Tile";

const generateDarkColor = () => {
  const r = Math.floor(Math.random() * 156);
  const g = Math.floor(Math.random() * 156);
  const b = Math.floor(Math.random() * 156);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

const TangoHTMLBoard = ({ boardState, winning, tileClickCallback }: { boardState: BoardState, winning?: boolean, tileClickCallback: (index: number) => void }) => {

	let boardColor = generateDarkColor();
	if (winning) {
		console.log("WIN STATE!");
		boardColor = `rgb(255,255,255)`
	}

	return (
		<>
			<div className="grid"
			style={{
				gridTemplateColumns: `repeat(${boardState.columns}, 60px)`,
				gridTemplateRows: `repeat(${boardState.rows}, 60px)`,
				backgroundColor: boardColor,
			}}>
				{boardState.tiles.map((tileState, i) => (
					<Tile key={i} startState={tileState} onClick={() => {
						tileClickCallback(i)
					}} />
				))}
				{boardState.constraints.map((constraint, i) => {
					const pxcell = 64;
					const basex = -boardState.columns / 2 * pxcell;
					const basey = -boardState.rows / 2 * pxcell;
					let finalx = basex;
					let finaly = basey;

					const midrow = (constraint.coordinate1.row + constraint.coordinate2.row) / 2
					const midcol = (constraint.coordinate1.column + constraint.coordinate2.column) / 2
					finalx += midcol * pxcell + (pxcell / 2)
					finaly += midrow * pxcell + (pxcell / 2)
					
					if (constraint.constraintType === ConstraintType.EQUAL) {
						return (
							<div
								className="constraint text-xl text-center"
								key={i}
								style={{
									transform: `translateX(${finalx}px) translateY(${finaly}px)`,
								} as React.CSSProperties}
							>
								=
							</div>
						)
					} else if (constraint.constraintType === ConstraintType.OPPOSITE) {
						return (
							<div
								className="constraint text-xl text-center"
								key={i}
								style={{
									transform: `translateX(${finalx}px) translateY(${finaly}px)`,
								} as React.CSSProperties}
							>
								x
							</div>
						)
					} else {
						throw "Invalid constraint type"
					}
				})}
			</div>
		</>
	);
};

export default TangoHTMLBoard