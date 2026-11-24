import { codeToHtml } from "shiki";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  lang: string;
}

export default async function CodeBlock({ code, lang }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark-dimmed",
  });

  // Safe - Shiki escapes the code
  return (
    <div
      className={styles.wrapper}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
