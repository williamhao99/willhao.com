import Link from "next/link";

export default function NotFound() {
  return (
    <center>
      <h1>404</h1>
      <p>Page not found... :(</p>
      <p>
        <Link href="/">
          <strong>← Return home</strong>
        </Link>
      </p>
    </center>
  );
}
