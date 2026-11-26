import type { Metadata } from "next";
import CodeBlock from "@/components/codeBlock/CodeBlock";
import Prose from "@/components/prose/Prose";

// Preview-only test page: noindex because the sandbox layout that used to
// provide it was deleted. Delete this page when CodeBlock testing is done.
export const metadata: Metadata = {
  title: "CodeBlock Sandbox",
  description: "Visual test page for the Shiki CodeBlock component.",
  robots: {
    index: false,
    follow: false,
  },
};

const tsCode = [
  "interface User {",
  "  id: number;",
  "  name: string;",
  "  email?: string;",
  "}",
  "",
  "async function fetchUser(id: number): Promise<User> {",
  '  const response = await fetch("/api/users/" + id);',
  "  if (!response.ok) {",
  '    throw new Error("Failed to fetch user " + id);',
  "  }",
  "  return response.json();",
  "}",
  "",
  "// Generic helper — pick a subset of keys from an object",
  "function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {",
  "  const result = {} as Pick<T, K>;",
  "  for (const key of keys) {",
  "    result[key] = obj[key];",
  "  }",
  "  return result;",
  "}",
].join("\n");

const pyCode = [
  "from dataclasses import dataclass",
  "from typing import Optional",
  "import requests",
  "",
  "@dataclass",
  "class User:",
  "    id: int",
  "    name: str",
  "    email: Optional[str] = None",
  "",
  "def fetch_user(user_id: int) -> User:",
  '    """Fetch a user from the API by ID."""',
  '    response = requests.get(f"/api/users/{user_id}")',
  "    response.raise_for_status()",
  "    return User(**response.json())",
  "",
  "# List comprehension over a hypothetical users list",
  "admins = [u for u in users if u.is_admin]",
].join("\n");

const cssCode = [
  ".button {",
  "  --button-bg: var(--color-brand);",
  "",
  "  display: inline-flex;",
  "  align-items: center;",
  "  padding: 0.5rem 1rem;",
  "  background: var(--button-bg);",
  "  border-radius: 6px;",
  "  transition: background 200ms ease;",
  "}",
  "",
  ".button:hover {",
  "  background: color-mix(in srgb, var(--button-bg) 80%, white);",
  "}",
  "",
  "@media (max-width: 768px) {",
  "  .button {",
  "    width: 100%;",
  "  }",
  "}",
].join("\n");

const jsonCode = [
  "{",
  '  "name": "willhao.com",',
  '  "version": "1.0.0",',
  '  "scripts": {',
  '    "dev": "next dev",',
  '    "build": "next build",',
  '    "type-check": "tsc --noEmit"',
  "  },",
  '  "dependencies": {',
  '    "next": "^16.1.3",',
  '    "react": "^19.2.3",',
  '    "shiki": "^4.0.2"',
  "  }",
  "}",
].join("\n");

const bashCode = [
  "#!/usr/bin/env bash",
  "set -euo pipefail",
  "",
  "# Deploy the static build to the VM",
  'DEPLOY_USER="will"',
  'DEPLOY_HOST="willhao.com"',
  'DEPLOY_PATH="/var/www/willhao"',
  "",
  'echo "Building project..."',
  "npm run build",
  "",
  'echo "Syncing to $DEPLOY_HOST..."',
  'rsync -avz --delete .next/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"',
  "",
  'echo "Done."',
].join("\n");

const rustCode = [
  "use std::collections::HashMap;",
  "",
  "#[derive(Debug, Clone)]",
  "struct User {",
  "    id: u64,",
  "    name: String,",
  "    email: Option<String>,",
  "}",
  "",
  "impl User {",
  "    fn new(id: u64, name: &str) -> Self {",
  "        Self {",
  "            id,",
  "            name: name.to_string(),",
  "            email: None,",
  "        }",
  "    }",
  "}",
  "",
  "fn count_by_domain(users: &[User]) -> HashMap<String, usize> {",
  "    let mut counts = HashMap::new();",
  "    for user in users {",
  "        if let Some(email) = &user.email {",
  "            let domain = email.split('@').nth(1).unwrap_or(\"\");",
  "            *counts.entry(domain.to_string()).or_insert(0) += 1;",
  "        }",
  "    }",
  "    counts",
  "}",
].join("\n");

const goCode = [
  "package main",
  "",
  "import (",
  '    "encoding/json"',
  '    "fmt"',
  '    "net/http"',
  ")",
  "",
  "type User struct {",
  '    ID    int64  `json:"id"`',
  '    Name  string `json:"name"`',
  '    Email string `json:"email,omitempty"`',
  "}",
  "",
  "func fetchUser(id int64) (*User, error) {",
  '    resp, err := http.Get(fmt.Sprintf("/api/users/%d", id))',
  "    if err != nil {",
  "        return nil, err",
  "    }",
  "    defer resp.Body.Close()",
  "",
  "    var user User",
  "    if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {",
  "        return nil, err",
  "    }",
  "    return &user, nil",
  "}",
].join("\n");

const longLineCode =
  'const veryLongLine = "this is a deliberately long single line of code that exceeds the width of the prose container so we can verify horizontal scrolling works correctly inside the CodeBlock gutter-rule frame";';

const inlineExampleCode = 'const message = "hello, world";';

export default function CodeBlockSandboxPage() {
  return (
    <Prose>
      <h1>CodeBlock Sandbox</h1>
      <h2>Visual test page for the Shiki-rendered CodeBlock component.</h2>

      <p>
        This page exercises every visual aspect of the CodeBlock: multiple
        languages, inline-vs-block code distinction, horizontal scrolling for
        long lines, and spacing around code in prose flow. Delete this page
        before shipping.
      </p>

      <h3>Inline code in prose</h3>
      <p>
        Inline code like <code>const x = 42</code> uses the IN·6 styling:
        monospace, slightly smaller, semibold, brand-blue. It should look
        distinct from regular text without being visually heavy. Multiple inline
        references like <code>useEffect</code>, <code>useState</code>, and{" "}
        <code>useMemo</code> should all read consistently. Inline code should
        not inherit any of the block code styling below.
      </p>

      <h3>TypeScript</h3>
      <CodeBlock
        code={tsCode}
        lang="typescript"
      />

      <h3>Python</h3>
      <CodeBlock
        code={pyCode}
        lang="python"
      />

      <h3>CSS</h3>
      <CodeBlock
        code={cssCode}
        lang="css"
      />

      <h3>JSON</h3>
      <CodeBlock
        code={jsonCode}
        lang="json"
      />

      <h3>Bash</h3>
      <CodeBlock
        code={bashCode}
        lang="bash"
      />

      <h3>Rust</h3>
      <CodeBlock
        code={rustCode}
        lang="rust"
      />

      <h3>Go</h3>
      <CodeBlock
        code={goCode}
        lang="go"
      />

      <h3>Long single line (horizontal scroll test)</h3>
      <p>
        The block below has one very long line. It should scroll horizontally
        within the gutter-rule frame and not break the page layout.
      </p>
      <CodeBlock
        code={longLineCode}
        lang="typescript"
      />

      <h3>Mixed prose and code flow</h3>
      <p>
        Code blocks should breathe inside paragraphs. The block below sits
        between two paragraphs and should feel naturally embedded in the reading
        flow.
      </p>
      <CodeBlock
        code={inlineExampleCode}
        lang="typescript"
      />
      <p>
        After the block, prose should continue with normal rhythm. No extra
        margin collapse, no awkward gap.
      </p>
    </Prose>
  );
}
