# Chess post

The unpublished chess post, parked here until it ships:

- `components/chessBoard/` - interactive board
- `app/blog/chess/` - post draft from June 2026 (pre-redesign; its `blogs.ts` entry is in `app/blog/blogs.ts`)
- `app/blog/breaking-plateaus/page.tsx` - empty post skeleton
- `app/sandbox/codeblock/` - code block sandbox

To bring the board back: `git checkout chess-post -- components/chessBoard`, then
`npm install chess.js@^1.4.0 react-chessboard@^5.8.6`.
