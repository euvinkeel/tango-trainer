export enum TileIconType {
	EMPTY,
	SUN,
	MOON,
}

export enum ConstraintType {
	OPPOSITE,
	EQUAL,
}

export interface Coordinate {
    row: number;
    column: number;
}

// TileState describes everything needed to render a single tile on a board.
export interface TileState {
    iconType: TileIconType;
    locked: boolean;
    error: boolean;
}

// Constraint describes a relation/rule between two tile coordinates.
export interface Constraint {
    constraintType: ConstraintType;
    coordinate1: Coordinate;
    coordinate2: Coordinate;
}

// The BoardState holds everything needed to display a full board,
// including tile states and constraints.
export interface BoardState {
	tiles: TileState[];
	constraints: Constraint[];
    rows: number;
    columns: number; // redundant, but included for completion
}

export interface RuleViolation {
    highlightCoordinates: Coordinate[];
    reason: string;
}

export interface Rule {
    description: string;
    getViolations: (boardState: BoardState) => RuleViolation[];
}