import { Chess } from "chess.js";

// ── Types ───────────────────────────────────────────────────────────────────

export interface MoveAnnotation {
  san: string;
  nag?: string;
  comment?: string;
  variations?: (string | MoveAnnotation)[][];
}

export interface MoveNode {
  id: string;
  san: string;
  fen: string;
  from: string;
  to: string;
  nag?: string | undefined;
  comment?: string | undefined;
  parentId: string;
  nextId: string | null;
  depth: number;
  moveNumber: number;
  isWhiteMove: boolean;
  mainLineIndex: number;
  variations: MoveNode[][];
}

export interface MoveTree {
  nodes: Map<string, MoveNode>;
  mainLine: MoveNode[];
  rootFen: string;
}

// ── Move Tree Builder ────────────────────────────────────────────────────────

function buildLine(
  parentFen: string,
  moves: (string | MoveAnnotation)[],
  parentId: string,
  depth: number,
  idPrefix: string,
  nodes: Map<string, MoveNode>,
  mainLine: MoveNode[] | null,
): MoveNode[] {
  const line: MoveNode[] = [];
  let currentFen = parentFen;
  let prevNodeId = parentId;

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (!move) continue;

    let san: string;
    let nag: string | undefined;
    let comment: string | undefined;
    let variations: (string | MoveAnnotation)[][] | undefined;

    if (typeof move === "string") {
      san = move;
    } else {
      san = move.san;
      nag = move.nag;
      comment = move.comment;
      variations = move.variations;
    }

    const fenFields = currentFen.split(" ");
    const activeColor = fenFields[1] || "w";
    const fullMoveNumber = parseInt(fenFields[5] || "1", 10);
    const isWhiteMove = activeColor === "w";

    try {
      const tempChess = new Chess(currentFen);
      const moveResult = tempChess.move(san);
      const newFen = tempChess.fen();

      let mainLineIdx = -1;
      if (mainLine) {
        mainLineIdx = mainLine.length;
      }

      const nodeId = idPrefix + "-" + i;
      const node: MoveNode = {
        id: nodeId,
        san: san,
        fen: newFen,
        from: moveResult.from,
        to: moveResult.to,
        nag: nag,
        comment: comment,
        parentId: prevNodeId,
        nextId: null,
        depth: depth,
        moveNumber: fullMoveNumber,
        isWhiteMove: isWhiteMove,
        mainLineIndex: mainLineIdx,
        variations: [],
      };

      nodes.set(nodeId, node);
      line.push(node);

      if (mainLine) {
        mainLine.push(node);
      }

      // Link previous node in this line
      if (line.length > 1) {
        const prevInLine = line[line.length - 2];
        if (prevInLine) {
          prevInLine.nextId = nodeId;
        }
      }

      // Process variations (branch from currentFen, the position BEFORE this move)
      if (variations) {
        for (let v = 0; v < variations.length; v++) {
          const varMoves = variations[v];
          if (!varMoves || varMoves.length === 0) continue;
          const varLine = buildLine(
            currentFen,
            varMoves,
            prevNodeId,
            depth + 1,
            nodeId + "-v" + v,
            nodes,
            null,
          );
          node.variations.push(varLine);
        }
      }

      prevNodeId = nodeId;
      currentFen = newFen;
    } catch {
      break;
    }
  }

  return line;
}

export function buildMoveTree(
  rootFen: string,
  moves: (string | MoveAnnotation)[],
): MoveTree {
  const nodes = new Map<string, MoveNode>();
  const mainLine: MoveNode[] = [];

  buildLine(rootFen, moves, "root", 0, "main", nodes, mainLine);

  return {
    nodes: nodes,
    mainLine: mainLine,
    rootFen: rootFen,
  };
}
