import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/prose/Prose";
import ViewCounter from "@/components/viewCounter/ViewCounter";
import ChessBoard from "@/components/chessBoard/ChessBoard";
import type { MoveAnnotation } from "@/components/chessBoard/ChessBoard";
import styles from "../BlogPost.module.css";

export const metadata: Metadata = {
  title: "Chess",
  description: "TODO",
  alternates: {
    canonical: "https://willhao.com/blog/chess",
  },
  openGraph: {
    title: "Chess",
    description: "TODO",
    url: "https://willhao.com/blog/chess",
    type: "article",
  },
};

const operaGameMoves: (string | MoveAnnotation)[] = [
  { san: "e4", nag: "!", comment: "The King's Pawn opening." },
  "e5",
  "Nf3",
  { san: "d6", nag: "?!", comment: "The Philidor Defense. Passive but solid." },
  { san: "d4", nag: "!", comment: "Morphy immediately challenges the center." },
  "Bg4",
  {
    san: "dxe5",
    comment: "Opening the position while Black's king is still in the center.",
  },
  "Bxf3",
  "Qxf3",
  "dxe5",
  {
    san: "Bc4",
    comment: "Targeting f7, the weakest square in Black's position.",
  },
  "Nf6",
  { san: "Qb3", nag: "!", comment: "Doubling the attack on f7 and b7." },
  "Qe7",
  "Nc3",
  {
    san: "c6",
    comment: "Trying to hold b7, but this further weakens the dark squares.",
  },
  {
    san: "Bg5",
    nag: "!",
    comment: "Pinning the knight and increasing the pressure.",
  },
  "b5",
  {
    san: "Nxb5",
    nag: "!!",
    comment:
      "A stunning sacrifice. Morphy gives up a knight to rip open Black's position.",
  },
  "cxb5",
  { san: "Bxb5+", comment: "Check! The Black king is forced into the open." },
  "Nbd7",
  {
    san: "O-O-O",
    nag: "!",
    comment: "Castling with tempo, putting the rook on the open d-file.",
  },
  "Rd8",
  {
    san: "Rxd7",
    nag: "!!",
    comment: "The exchange sacrifice - the rook is worth less than the attack.",
  },
  "Rxd7",
  {
    san: "Rd1",
    comment: "Every white piece is in the attack. Black is helpless.",
  },
  "Qe6",
  { san: "Bxd7+", comment: "Eliminating the last defender." },
  "Nxd7",
  {
    san: "Qb8+",
    nag: "!!",
    comment: "The queen sacrifice! Morphy's most famous move.",
  },
  "Nxb8",
  { san: "Rd8#", comment: "Checkmate. A masterpiece of attacking chess." },
];

const exampleWithVariations: (string | MoveAnnotation)[] = [
  { san: "e4", comment: "The most popular opening move." },
  {
    san: "e5",
    comment: "The Open Game.",
    variations: [
      [
        {
          san: "c5",
          comment: "The Sicilian Defense - Black's most ambitious reply.",
        },
        "Nf3",
        {
          san: "d6",
          comment: "The Najdorf/Classical setup.",
          variations: [
            [
              "Nc6",
              "d4",
              "cxd4",
              { san: "Nxd4", comment: "The Open Sicilian." },
            ],
          ],
        },
        "d4",
        "cxd4",
        "Nxd4",
        "Nf6",
        "Nc3",
        { san: "a6", nag: "!", comment: "The Najdorf Variation." },
      ],
      [
        { san: "e6", comment: "The French Defense." },
        "d4",
        "d5",
        {
          san: "Nc3",
          comment: "The Classical French.",
          variations: [
            [{ san: "e5", comment: "The Advance Variation." }, "c5", "Nf6"],
          ],
        },
        "Bb4",
        { san: "e5", comment: "The Winawer Variation - sharp and complex." },
      ],
    ],
  },
  "Nf3",
  {
    san: "Nc6",
    variations: [
      [
        { san: "Nf6", comment: "The Petroff Defense." },
        "Nxe5",
        "d6",
        "Nf3",
        "Nxe4",
      ],
      [
        "d6",
        {
          san: "d4",
          comment: "The Philidor - transposing to the Opera Game structure.",
        },
      ],
    ],
  },
  {
    san: "Bb5",
    comment: "The Ruy Lopez - one of the oldest and most respected openings.",
    variations: [
      [
        "Bc4",
        "Nf6",
        { san: "d3", comment: "The Italian Game - Giuoco Pianissimo." },
      ],
    ],
  },
  {
    san: "a6",
    comment: "The Morphy Defense, challenging the bishop.",
    variations: [
      [
        { san: "Nf6", comment: "The Berlin Defense - famously solid." },
        "O-O",
        "Nxe4",
        "d4",
        "Nd6",
        { san: "Bxc6", comment: "The Berlin Endgame after dxc6." },
        "dxc6",
        "dxe5",
        "Nf5",
      ],
    ],
  },
  "Ba4",
  "Nf6",
  "O-O",
  {
    san: "Be7",
    comment: "The Closed Ruy Lopez.",
    variations: [
      [{ san: "b5", comment: "The Open Ruy Lopez." }, "Bb3", "Nxe4"],
    ],
  },
  "Re1",
  "b5",
  "Bb3",
  "d6",
  "c3",
  { san: "O-O", comment: "A standard position in the Closed Ruy Lopez." },
];

export default function ChessPage() {
  return (
    <Prose>
      <Link
        href="/blog"
        className="back-link"
      >
        ← Back to Blog
      </Link>

      <h1>Chess</h1>
      <h2>TODO: subtitle or one-line deck describing the post.</h2>

      <div className={styles.meta}>
        <time dateTime="2026-02-08">February 2026</time>
        <span className={styles.dot}>·</span>
        <ViewCounter slug="blog-chess" />
      </div>

      {/* TODO: Write your content here */}

      <h3>Test Board</h3>
      <p>Static position - the Scholar's Mate threat:</p>
      <ChessBoard
        fen="r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"
        caption="White threatens Qxf7#. Black must play carefully."
      />

      <p>Puzzle - find the winning move for White:</p>
      <ChessBoard
        fen="r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"
        caption="Find the checkmate in one."
        interactive
        solution={["Qxf7#"]}
      />

      <p>Promotion test - push the pawn to e8:</p>
      <ChessBoard
        fen="8/4P3/8/8/8/8/8/4K2k w - - 0 1"
        caption="White pawn on e7. Push to e8 and pick a piece."
        interactive
      />

      <p>
        Game viewer - step through the Opera Game (Morphy vs. Duke/Count, 1858):
      </p>
      <ChessBoard
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        moves={operaGameMoves}
        caption="The Opera Game. Use arrow keys or buttons to navigate."
      />

      <p>Variation test - Ruy Lopez with sub-variations:</p>
      <ChessBoard
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        moves={exampleWithVariations}
        caption="Click a variation move to enter it. Arrow keys stay in the current line."
      />

      <Link
        href="/blog"
        className={"back-link " + styles.backBottom}
      >
        ← Back to Blog
      </Link>
    </Prose>
  );
}
