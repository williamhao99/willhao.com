"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Chessboard, defaultPieces } from "react-chessboard";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import type {
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  SquareHandlerArgs,
} from "react-chessboard";
import styles from "./ChessBoard.module.css";

// ── Types ───────────────────────────────────────────────────────────────────

export interface MoveAnnotation {
  san: string;
  nag?: string;
  comment?: string;
  variations?: (string | MoveAnnotation)[][];
}

interface MoveNode {
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

interface MoveTree {
  nodes: Map<string, MoveNode>;
  mainLine: MoveNode[];
  rootFen: string;
}

interface ChessBoardProps {
  fen: string;
  caption?: string;
  orientation?: "white" | "black";
  interactive?: boolean;
  moves?: (string | MoveAnnotation)[];
  solution?: string[];
}

// ── Constants ────────────────────────────────────────────────────────────────

const SELECTED_SQUARE_STYLE = {
  backgroundColor: "var(--color-highlight-selected)",
};
const LAST_MOVE_STYLE = { backgroundColor: "var(--color-highlight-last-move)" };
const CORRECT_STYLE = { backgroundColor: "var(--color-highlight-correct)" };
const INCORRECT_STYLE = { backgroundColor: "var(--color-highlight-incorrect)" };
const DARK_SQUARE_STYLE = { backgroundColor: "var(--color-board-dark)" };
const LIGHT_SQUARE_STYLE = { backgroundColor: "var(--color-board-light)" };
const BOARD_STYLE = { borderRadius: "var(--radius-sm)" };
const ANIMATION_DURATION = 200;
const OPPONENT_RESPONSE_DELAY = 400;
const WRONG_MOVE_RESET_DELAY = 800;

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

function buildMoveTree(
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

export default function ChessBoard({
  fen,
  caption,
  orientation,
  interactive,
  moves,
  solution,
}: ChessBoardProps) {
  // ── State ──────────────────────────────────────────────────────────────────

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const movePanelRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState(function () {
    return new Chess(fen);
  });
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [highlightStyles, setHighlightStyles] = useState<
    Record<string, React.CSSProperties>
  >({});

  // Puzzle state
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [puzzleStatus, setPuzzleStatus] = useState<
    "playing" | "waiting" | "correct" | "incorrect"
  >("playing");

  // Promotion picker state
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
    color: string;
  } | null>(null);

  // Game viewer state
  const [currentNodeId, setCurrentNodeId] = useState("root");

  let isPuzzleMode = false;
  if (interactive && solution && solution.length > 0) {
    isPuzzleMode = true;
  }

  // Checkpoint for multi-move puzzles (reset to last successful state, not start)
  const checkpointFenRef = useRef(fen);
  const checkpointIndexRef = useRef(0);

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(function cleanup() {
    return function clearPendingTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Prevent board-internal elements from receiving tab focus.
  // react-chessboard renders many focusable elements (squares, pieces);
  // tabbing through them shifts the board due to scroll-into-view inside overflow:clip.
  // Non-interactive boards use the `inert` attribute (set in JSX).
  // Interactive boards need click/drag, so we strip tabIndex via MutationObserver instead.
  useEffect(
    function preventBoardTabbing() {
      if (!interactive) return;
      const boardEl = boardRef.current;
      if (!boardEl) return;

      function stripTabIndex() {
        if (!boardEl) return;
        const els = boardEl.querySelectorAll(
          "[tabindex]:not([tabindex='-1']), button, a[href], input, select, textarea",
        );
        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          if (el instanceof HTMLElement) {
            el.tabIndex = -1;
          }
        }
      }

      const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["tabindex"],
      };

      stripTabIndex();
      const observer = new MutationObserver(function onMutation() {
        observer.disconnect();
        stripTabIndex();
        observer.observe(boardEl, observerConfig);
      });
      observer.observe(boardEl, observerConfig);

      return function disconnectObserver() {
        observer.disconnect();
      };
    },
    [interactive],
  );

  // Build move tree from the move list
  const moveTree = useMemo(
    function buildTree() {
      if (!moves || moves.length === 0) {
        return {
          nodes: new Map<string, MoveNode>(),
          mainLine: [] as MoveNode[],
          rootFen: fen,
        };
      }
      return buildMoveTree(fen, moves);
    },
    [fen, moves],
  );

  let isViewerMode = false;
  if (moves && moveTree.mainLine.length > 0) {
    isViewerMode = true;
  }

  // Auto-scroll move panel to active move
  useEffect(
    function scrollToActiveMove() {
      if (!movePanelRef.current) return;
      if (currentNodeId === "root") return;
      const activeButton = movePanelRef.current.querySelector(
        '[data-node-id="' + currentNodeId + '"]',
      );
      if (activeButton instanceof HTMLElement) {
        activeButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    [currentNodeId],
  );

  // ── Viewer Navigation ──────────────────────────────────────────────────────

  function goToStart() {
    setCurrentNodeId("root");
  }

  function goBack() {
    if (currentNodeId === "root") return;
    const node = moveTree.nodes.get(currentNodeId);
    if (!node) return;
    setCurrentNodeId(node.parentId);
  }

  function goForward() {
    if (currentNodeId === "root") {
      if (moveTree.mainLine.length > 0) {
        const first = moveTree.mainLine[0];
        if (first) {
          setCurrentNodeId(first.id);
        }
      }
      return;
    }
    const node = moveTree.nodes.get(currentNodeId);
    if (!node) return;
    if (node.mainLineIndex >= 0) {
      const next = moveTree.mainLine[node.mainLineIndex + 1];
      if (next) {
        setCurrentNodeId(next.id);
      }
    } else if (node.nextId) {
      setCurrentNodeId(node.nextId);
    }
  }

  function goToEnd() {
    if (currentNodeId === "root") {
      if (moveTree.mainLine.length === 0) return;
      const last = moveTree.mainLine[moveTree.mainLine.length - 1];
      if (last) {
        setCurrentNodeId(last.id);
      }
      return;
    }
    const node = moveTree.nodes.get(currentNodeId);
    if (!node) return;
    if (node.mainLineIndex >= 0) {
      const last = moveTree.mainLine[moveTree.mainLine.length - 1];
      if (last) {
        setCurrentNodeId(last.id);
      }
    } else {
      let end = node;
      while (end.nextId) {
        const next = moveTree.nodes.get(end.nextId);
        if (!next) break;
        end = next;
      }
      setCurrentNodeId(end.id);
    }
  }

  function goToNode(id: string) {
    setCurrentNodeId(id);
  }

  // Keyboard navigation — scoped to this component's container
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isViewerMode) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goBack();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goForward();
    }
  }

  // Move label (e.g. "4. Qxf7#")
  function getMoveLabel(): string {
    if (currentNodeId === "root") return "Start";
    const node = moveTree.nodes.get(currentNodeId);
    if (!node) return "";
    if (node.isWhiteMove) {
      return node.moveNumber + ". " + node.san;
    }
    return node.moveNumber + "... " + node.san;
  }

  // ── Interactive Mode ───────────────────────────────────────────────────────

  function isPromotion(from: string, to: string): boolean {
    const piece = game.get(from as Square);
    if (!piece) return false;
    if (piece.type !== "p") return false;
    const toRank = to[1];
    if (piece.color === "w" && toRank !== "8") return false;
    if (piece.color === "b" && toRank !== "1") return false;

    // Confirm the move is actually legal before showing promotion overlay
    const legalMoves = game.moves({ square: from as Square, verbose: true });
    for (let i = 0; i < legalMoves.length; i++) {
      const m = legalMoves[i];
      if (!m) continue;
      if (m.to === to) return true;
    }
    return false;
  }

  function playOpponentResponse(currentFen: string, currentIndex: number) {
    if (!solution) return;
    const responseMove = solution[currentIndex + 1];
    if (!responseMove) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(function autoPlay() {
      try {
        const copy = new Chess(currentFen);
        const result = copy.move(responseMove);
        const newFen = copy.fen();
        const newIndex = currentIndex + 2;
        setGame(copy);
        setSolutionIndex(newIndex);
        checkpointFenRef.current = newFen;
        checkpointIndexRef.current = newIndex;
        const responseHighlights: Record<string, React.CSSProperties> = {};
        responseHighlights[result.from] = LAST_MOVE_STYLE;
        responseHighlights[result.to] = LAST_MOVE_STYLE;
        setHighlightStyles(responseHighlights);
        if (newIndex >= solution.length) {
          setPuzzleStatus("correct");
        } else {
          setPuzzleStatus("playing");
        }
      } catch {
        // Invalid response move in solution — ignore
      }
    }, OPPONENT_RESPONSE_DELAY);
  }

  function tryMove(from: string, to: string, promotion?: string): boolean {
    if (isPuzzleMode && puzzleStatus !== "playing") return false;

    // Show promotion picker if needed
    if (!promotion && isPromotion(from, to)) {
      setPendingPromotion({ from: from, to: to, color: game.turn() });
      return false;
    }

    try {
      const copy = new Chess(game.fen());
      const move = copy.move({
        from: from,
        to: to,
        promotion: promotion || "q",
      });

      // Puzzle mode: check against solution (compare by from/to/promotion, not SAN string)
      if (isPuzzleMode && solution) {
        const expectedSan = solution[solutionIndex];
        let expectedResult = null;
        if (expectedSan) {
          try {
            const tempGame = new Chess(game.fen());
            expectedResult = tempGame.move(expectedSan);
          } catch {
            // Invalid solution move — will fall through to wrong-move branch
          }
        }
        if (
          expectedResult &&
          move.from === expectedResult.from &&
          move.to === expectedResult.to &&
          move.promotion === expectedResult.promotion
        ) {
          // Correct move
          const newFen = copy.fen();
          setGame(copy);
          setSelectedSquare(null);

          const correctHighlights: Record<string, React.CSSProperties> = {};
          correctHighlights[move.from] = CORRECT_STYLE;
          correctHighlights[move.to] = CORRECT_STYLE;
          setHighlightStyles(correctHighlights);

          // Check if puzzle is fully solved
          if (solutionIndex + 1 >= solution.length) {
            setPuzzleStatus("correct");
          } else {
            // Block interaction until opponent response plays
            setPuzzleStatus("waiting");
            playOpponentResponse(newFen, solutionIndex);
          }
          return true;
        } else {
          // Wrong move — show red briefly, then reset
          const wrongHighlights: Record<string, React.CSSProperties> = {};
          wrongHighlights[move.from] = INCORRECT_STYLE;
          wrongHighlights[move.to] = INCORRECT_STYLE;
          setHighlightStyles(wrongHighlights);
          setGame(copy);
          setPuzzleStatus("incorrect");

          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(function resetAfterWrong() {
            setGame(new Chess(checkpointFenRef.current));
            setSolutionIndex(checkpointIndexRef.current);
            setSelectedSquare(null);
            setHighlightStyles({});
            setPuzzleStatus("playing");
          }, WRONG_MOVE_RESET_DELAY);
          return true;
        }
      }

      // Free interactive mode
      setGame(copy);
      setSelectedSquare(null);
      setHighlightStyles({});
      return true;
    } catch {
      return false;
    }
  }

  function handlePromotionChoice(piece: string) {
    if (!pendingPromotion) return;
    tryMove(pendingPromotion.from, pendingPromotion.to, piece);
    setPendingPromotion(null);
  }

  function cancelPromotion() {
    setPendingPromotion(null);
    setSelectedSquare(null);
    setHighlightStyles({});
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs): boolean {
    if (!interactive) return false;
    if (!targetSquare) return false;
    if (pendingPromotion) return false;
    return tryMove(sourceSquare, targetSquare);
  }

  function onPieceClick({ square }: PieceHandlerArgs) {
    if (!interactive) return;
    if (!square) return;
    if (pendingPromotion) return;
    if (isPuzzleMode && puzzleStatus !== "playing") return;

    const sq = square as Square;

    if (selectedSquare && selectedSquare !== sq) {
      if (tryMove(selectedSquare, sq)) return;
    }

    const turn = game.turn();
    const piece = game.get(sq);
    if (!piece) return;
    if (piece.color !== turn) return;

    const selected: Record<string, React.CSSProperties> = {};
    selected[sq] = SELECTED_SQUARE_STYLE;
    setSelectedSquare(sq);
    setHighlightStyles(selected);
  }

  function onSquareClick({ square }: SquareHandlerArgs) {
    if (!interactive) return;
    if (!selectedSquare) return;
    if (!square) return;
    if (pendingPromotion) return;
    if (isPuzzleMode && puzzleStatus !== "playing") return;

    if (tryMove(selectedSquare, square)) return;

    setSelectedSquare(null);
    setHighlightStyles({});
  }

  function handleReset() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGame(new Chess(fen));
    setSelectedSquare(null);
    setHighlightStyles({});
    setSolutionIndex(0);
    setPuzzleStatus("playing");
    setPendingPromotion(null);
    checkpointFenRef.current = fen;
    checkpointIndexRef.current = 0;
  }

  // ── Derived Values ────────────────────────────────────────────────────────

  const boardOrientation = orientation || "white";
  let currentPosition = game.fen();
  if (isViewerMode) {
    if (currentNodeId === "root") {
      currentPosition = fen;
    } else {
      const node = moveTree.nodes.get(currentNodeId);
      if (node) {
        currentPosition = node.fen;
      }
    }
  }
  let currentHighlights = highlightStyles;
  if (isViewerMode) {
    currentHighlights = {};
    if (currentNodeId !== "root") {
      const node = moveTree.nodes.get(currentNodeId);
      if (node) {
        currentHighlights[node.from] = LAST_MOVE_STYLE;
        currentHighlights[node.to] = LAST_MOVE_STYLE;
      }
    }
  }
  let figureTabIndex: number | undefined;
  if (isViewerMode) {
    figureTabIndex = 0;
  }

  let canDrag = false;
  if (
    interactive &&
    !isViewerMode &&
    puzzleStatus === "playing" &&
    !pendingPromotion
  ) {
    canDrag = true;
  }

  let boardOptions: Parameters<typeof Chessboard>[0]["options"] = {
    position: currentPosition,
    boardOrientation: boardOrientation,
    allowDragging: canDrag,
    squareStyles: currentHighlights,
    darkSquareStyle: DARK_SQUARE_STYLE,
    lightSquareStyle: LIGHT_SQUARE_STYLE,
    boardStyle: BOARD_STYLE,
    animationDurationInMs: ANIMATION_DURATION,
  };

  if (!isViewerMode) {
    boardOptions = {
      ...boardOptions,
      onPieceDrop: onPieceDrop,
      onPieceClick: onPieceClick,
      onSquareClick: onSquareClick,
    };
  }

  let canGoBack = currentNodeId !== "root";
  let canGoForward = false;
  if (currentNodeId === "root" && moveTree.mainLine.length > 0) {
    canGoForward = true;
  } else {
    const currentNode = moveTree.nodes.get(currentNodeId);
    if (currentNode) {
      if (currentNode.mainLineIndex >= 0) {
        if (currentNode.mainLineIndex < moveTree.mainLine.length - 1) {
          canGoForward = true;
        }
      } else if (currentNode.nextId) {
        canGoForward = true;
      }
    }
  }
  let atMainEnd = false;
  if (moveTree.mainLine.length > 0) {
    const last = moveTree.mainLine[moveTree.mainLine.length - 1];
    if (last && currentNodeId === last.id) {
      atMainEnd = true;
    }
  }
  if (!atMainEnd && currentNodeId !== "root") {
    const currentNode = moveTree.nodes.get(currentNodeId);
    if (
      currentNode &&
      currentNode.mainLineIndex < 0 &&
      currentNode.nextId === null
    ) {
      atMainEnd = true;
    }
  }

  // ── Render Helpers ──────────────────────────────────────────────────────────

  function renderPromotionOverlay() {
    if (!pendingPromotion) return null;

    const toFile = pendingPromotion.to[0];
    const toRank = pendingPromotion.to[1];
    if (!toFile || !toRank) return null;

    // Calculate file position (0-7), accounting for board orientation
    let fileIndex = toFile.charCodeAt(0) - "a".charCodeAt(0);
    if (boardOrientation === "black") {
      fileIndex = 7 - fileIndex;
    }

    // Overlay starts from the promotion rank side of the board
    const isTopAligned =
      (toRank === "8" && boardOrientation === "white") ||
      (toRank === "1" && boardOrientation === "black");

    const overlayStyle: React.CSSProperties = {
      left: "calc(" + fileIndex + " * var(--file-width))",
    };
    if (isTopAligned) {
      overlayStyle.top = "0";
    } else {
      overlayStyle.bottom = "0";
    }

    // Pick correct colored pieces (captured when promotion was initiated)
    const colorPrefix = pendingPromotion.color;
    const pieceKeys = ["q", "r", "b", "n"];
    const pieceIds = [
      colorPrefix + "Q",
      colorPrefix + "R",
      colorPrefix + "B",
      colorPrefix + "N",
    ];

    const buttons: React.ReactNode[] = [];
    for (let i = 0; i < pieceKeys.length; i++) {
      const key = pieceKeys[i];
      const id = pieceIds[i];
      if (!key || !id) continue;
      const PieceRenderer = defaultPieces[id];
      if (!PieceRenderer) continue;
      buttons.push(
        <button
          key={key}
          className={styles.promotionPiece}
          tabIndex={-1}
          onClick={function () {
            handlePromotionChoice(key);
          }}
          aria-label={id}
        >
          {PieceRenderer()}
        </button>,
      );
    }

    return (
      <div
        className={styles.promotionOverlay}
        style={overlayStyle}
      >
        {buttons}
        <button
          className={styles.promotionCancel}
          tabIndex={-1}
          onClick={cancelPromotion}
          aria-label="Cancel promotion"
        >
          {"\u2715"}
        </button>
      </div>
    );
  }

  function renderPuzzleBanner() {
    if (!isPuzzleMode) return null;
    if (puzzleStatus === "correct") {
      return (
        <div className={styles.puzzleBanner + " " + styles.puzzleCorrect}>
          Correct!
          <button
            className={styles.puzzleReset}
            onClick={handleReset}
            aria-label="Reset puzzle"
          >
            Reset
          </button>
        </div>
      );
    }
    if (puzzleStatus === "incorrect") {
      return (
        <div className={styles.puzzleBanner + " " + styles.puzzleIncorrect}>
          Incorrect — try again
        </div>
      );
    }
    if (game.turn() === "w") {
      return (
        <div className={styles.puzzleBanner + " " + styles.puzzleWhite}>
          White to Move
        </div>
      );
    }
    return (
      <div className={styles.puzzleBanner + " " + styles.puzzleBlack}>
        Black to Move
      </div>
    );
  }

  function getNagClass(nag: string): string {
    if (nag === "!" || nag === "!!") return styles.nagGood || "";
    if (nag === "?" || nag === "??") return styles.nagBad || "";
    if (nag === "!?" || nag === "?!") return styles.nagInteresting || "";
    return "";
  }

  function buildMoveElements(node: MoveNode): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    let buttonClass = styles.moveButton;
    if (currentNodeId === node.id) {
      buttonClass = styles.moveButton + " " + styles.moveActive;
    }
    result.push(
      <button
        key={node.id}
        className={buttonClass}
        data-node-id={node.id}
        onClick={function () {
          goToNode(node.id);
        }}
      >
        {node.san}
        {node.nag && (
          <span className={styles.nag + " " + getNagClass(node.nag)}>
            {node.nag}
          </span>
        )}
      </button>,
    );
    if (node.comment) {
      result.push(
        <span
          key={"c-" + node.id}
          className={styles.moveComment}
        >
          {node.comment}
        </span>,
      );
    }
    return result;
  }

  function renderLine(line: MoveNode[]): React.ReactNode[] {
    const elements: React.ReactNode[] = [];
    let needsContinuation = false;

    for (let i = 0; i < line.length; i++) {
      const node = line[i];
      if (!node) continue;

      if (node.isWhiteMove) {
        elements.push(
          <span
            key={"num-" + node.id}
            className={styles.moveNumber}
          >
            {node.moveNumber + "."}
          </span>,
        );
      } else if (i === 0 || needsContinuation) {
        elements.push(
          <span
            key={"num-" + node.id}
            className={styles.moveNumber}
          >
            {node.moveNumber + "..."}
          </span>,
        );
      }

      needsContinuation = false;

      const moveEls = buildMoveElements(node);
      for (let j = 0; j < moveEls.length; j++) {
        const el = moveEls[j];
        if (el) elements.push(el);
      }

      if (node.comment) {
        needsContinuation = true;
      }

      if (node.variations.length > 0) {
        for (let v = 0; v < node.variations.length; v++) {
          const varLine = node.variations[v];
          if (!varLine || varLine.length === 0) continue;
          elements.push(
            <div
              key={"var-" + node.id + "-" + v}
              className={styles.variationContainer}
            >
              {renderLine(varLine)}
            </div>,
          );
        }
        needsContinuation = true;
      }
    }

    return elements;
  }

  function renderMovePanel() {
    return (
      <div
        ref={movePanelRef}
        className={styles.movePanel}
      >
        {renderLine(moveTree.mainLine)}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const boardElement = (
    <div
      className={styles.board}
      ref={boardRef}
      inert={!interactive || undefined}
    >
      <Chessboard options={boardOptions} />
      {renderPromotionOverlay()}
    </div>
  );

  let controlsElement: React.ReactNode = null;
  if (isViewerMode) {
    controlsElement = (
      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={goToStart}
          disabled={!canGoBack}
          aria-label="Go to start"
        >
          {"|\u2190"}
        </button>
        <button
          className={styles.navButton}
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Previous move"
        >
          {"\u2190"}
        </button>
        <span className={styles.moveLabel}>{getMoveLabel()}</span>
        <button
          className={styles.navButton}
          onClick={goForward}
          disabled={!canGoForward}
          aria-label="Next move"
        >
          {"\u2192"}
        </button>
        <button
          className={styles.navButton}
          onClick={goToEnd}
          disabled={atMainEnd}
          aria-label="Go to end"
        >
          {"\u2192|"}
        </button>
      </div>
    );
  }

  return (
    <figure
      className={styles.figure}
      tabIndex={figureTabIndex}
      onKeyDown={handleKeyDown}
    >
      {isViewerMode && (
        <div className={styles.viewerLayout}>
          {boardElement}
          {renderMovePanel()}
        </div>
      )}
      {!isViewerMode && boardElement}
      {renderPuzzleBanner()}
      {controlsElement}
      {caption && (
        <figcaption>
          {caption}
          {interactive && !isPuzzleMode && game.fen() !== fen && (
            <button
              className={styles.resetButton}
              onClick={handleReset}
              aria-label="Reset board to starting position"
            >
              Reset
            </button>
          )}
        </figcaption>
      )}
      {!caption && interactive && !isPuzzleMode && game.fen() !== fen && (
        <div className={styles.resetOnly}>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            aria-label="Reset board to starting position"
          >
            Reset
          </button>
        </div>
      )}
    </figure>
  );
}
