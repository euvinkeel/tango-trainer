import { ConstraintType } from "../types/types";
import TangoTS from "../utils/TangoTS";
import { TangoRiveBoardTile } from "./TangoRiveBoardTile";
import { animated, useSprings } from "@react-spring/web";

const TangoRiveBoard = ({
	boardId,
	tangoTsApi,
	tileClickCallback,
}: {
	boardId: string;
	tangoTsApi: InstanceType<typeof TangoTS>;
	tileClickCallback: (index: number) => void;
}) => {

	const [props, api] = useSprings(
		tangoTsApi.boardState.tiles.length,
		(i) => ({
			from: { x: i*20, opacity: 0, transform: `rotateZ(180deg)`, borderRadius: "100px", },
			to: { x: 0, opacity: 1, transform: `rotateZ(0deg)`, borderRadius: 0, },
		}),
	);

	return (
		<animated.div
			className="grid"
			style={{
				gridTemplateColumns: `repeat(${tangoTsApi.boardState.columns}, 60px)`,
				gridTemplateRows: `repeat(${tangoTsApi.boardState.rows}, 60px)`,
				backgroundColor: `rgb(150, 150, 150)`,
			}}
		>
			{tangoTsApi.boardState.tiles.map((_, i) => (
				<animated.div key={i} style={{ ...props[i] }}>
					<TangoRiveBoardTile
						tileId={`${boardId}_tile_${i}`}
						key={i}
						boardIndex={i}
						tangoTsApi={tangoTsApi}
						onClick={() => {
							tileClickCallback(i);
						}}
					/>
				</animated.div>
			))}

			{tangoTsApi.boardState.constraints.map((constraint, i) => {
				const pxcell = 64;
				const basex = (-tangoTsApi.boardState.columns / 2) * pxcell;
				const basey = (-tangoTsApi.boardState.rows / 2) * pxcell;
				let finalx = basex;
				let finaly = basey;

				const midrow =
					(constraint.coordinate1.row + constraint.coordinate2.row) /
					2;
				const midcol =
					(constraint.coordinate1.column +
						constraint.coordinate2.column) /
					2;
				finalx += midcol * pxcell + pxcell / 2;
				finaly += midrow * pxcell + pxcell / 2;

				if (constraint.constraintType === ConstraintType.EQUAL) {
					return (
						<div
							className="constraint text-xl text-center"
							key={i}
							style={
								{
									transform: `translateX(${finalx}px) translateY(${finaly}px)`,
									userSelect: "none",
								} as React.CSSProperties
							}
						>
							=
						</div>
					);
				} else if (
					constraint.constraintType === ConstraintType.OPPOSITE
				) {
					return (
						<div
							className="constraint text-xl text-center"
							key={i}
							style={
								{
									transform: `translateX(${finalx}px) translateY(${finaly}px)`,
									userSelect: "none",
								} as React.CSSProperties
							}
						>
							x
						</div>
					);
				} else {
					throw "Invalid constraint type";
				}
			})}
		</animated.div>
	);
};

export default TangoRiveBoard;
