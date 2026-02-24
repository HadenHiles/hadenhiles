import type { HistoryEntry } from "@/lib/store";

interface CommandContext {
  appendHistory: (e: HistoryEntry) => void;
  unlockHiddenOptions: () => void;
  activateMenuItem: (i: number) => void;
}

function out(text: string): HistoryEntry {
  return { type: "out", text };
}

function err(text: string): HistoryEntry {
  return { type: "err", text };
}

export function handleCommand(cmd: string, ctx: CommandContext) {
  const { appendHistory, unlockHiddenOptions, activateMenuItem } = ctx;

  // Normalise for matching
  const trimmed = cmd.trim();
  const lower = trimmed.toLowerCase();
  const parts = trimmed.split(/\s+/);
  const base = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  switch (true) {
    // ── help ──────────────────────────────────────────────────────────────────
    case lower === "help" || lower === "man" || lower === "man help":
      appendHistory(out("available commands:"));
      appendHistory(out("  help              — show this list"));
      appendHistory(out("  ls [flags]        — list contents"));
      appendHistory(out("  pwd               — print working directory"));
      appendHistory(out("  whoami            — about the operator"));
      appendHistory(out("  cat <file>        — read a file"));
      appendHistory(out("  echo <text>       — print text"));
      appendHistory(out("  date              — current date/time"));
      appendHistory(out("  uname [-a]        — system info"));
      appendHistory(out("  ps                — running processes"));
      appendHistory(out("  clear             — clear history"));
      appendHistory(out("  exit              — switch to GUI"));
      appendHistory(out("  git log           — commit history"));
      appendHistory(out("  curl              — fetch remote resources"));
      break;

    // ── ls variants ───────────────────────────────────────────────────────────
    case lower === "ls":
      appendHistory(out("projects  experience  knowledge  about  gui  contact"));
      break;

    case lower === "ls -a" || lower === "ls -la" || lower === "ls -al":
      unlockHiddenOptions();
      appendHistory(out("drwxr-xr-x  projects/"));
      appendHistory(out("drwxr-xr-x  experience/"));
      appendHistory(out("drwxr-xr-x  knowledge/"));
      appendHistory(out("drwxr-xr-x  about/"));
      appendHistory(out("drwxr-xr-x  gui/"));
      appendHistory(out("drwxr-xr-x  contact/"));
      appendHistory(out("-rw-r--r--  .hobbies       [hidden]"));
      appendHistory(out("-rw-r--r--  .homelab       [hidden]"));
      appendHistory(out("-rw-r--r--  .gear          [hidden]"));
      appendHistory(out("-rw-r--r--  .behind-scenes [hidden]"));
      appendHistory(out("hint: explore the GUI — some of these have hidden entries."));
      break;

    case lower === "ls -l":
      appendHistory(out("total 6"));
      appendHistory(out("drwxr-xr-x  projects/"));
      appendHistory(out("drwxr-xr-x  experience/"));
      appendHistory(out("drwxr-xr-x  knowledge/"));
      appendHistory(out("drwxr-xr-x  about/"));
      appendHistory(out("drwxr-xr-x  gui/"));
      appendHistory(out("drwxr-xr-x  contact/"));
      break;

    // ── pwd ───────────────────────────────────────────────────────────────────
    case lower === "pwd":
      appendHistory(out("/home/visitor/hadensystem"));
      break;

    // ── cd ────────────────────────────────────────────────────────────────────
    case base === "cd":
      if (!args || args === "~" || args === "/home/visitor") {
        appendHistory(out("~"));
      } else if (["projects", "experience", "knowledge", "about", "gui", "contact"].includes(args.replace("/", ""))) {
        appendHistory(out(`/home/visitor/hadensystem/${args.replace("/", "")}`));
        appendHistory(out("hint: use the menu above or press Enter to navigate there."));
      } else {
        appendHistory(err(`cd: ${args}: No such file or directory`));
      }
      break;

    // ── whoami ────────────────────────────────────────────────────────────────
    case lower === "whoami":
      appendHistory(out("haden hiles — principal software and devops engineer."));
      appendHistory(out("full stack engineer who designs from the user down"));
      appendHistory(out("and builds the system to match."));
      break;

    // ── cat ───────────────────────────────────────────────────────────────────
    case lower === "cat projects.yml":
      appendHistory(out("# engineering philosophy"));
      appendHistory(out("---"));
      appendHistory(out("  - ux first"));
      appendHistory(out("  - frictionless flows"));
      appendHistory(out("  - full stack ownership"));
      appendHistory(out("  - production stability"));
      appendHistory(out("  - practical automation"));
      appendHistory(out("---"));
      appendHistory(out("use Projects from the menu for the full breakdown."));
      break;

    case lower === "cat readme" || lower === "cat readme.md":
      appendHistory(out("# hadensystem v4.0"));
      appendHistory(out("a portfolio disguised as a terminal."));
      appendHistory(out("built with next.js, framer motion, zustand."));
      appendHistory(out("source: github.com/hadenhiles"));
      break;

    case base === "cat":
      if (!args) {
        appendHistory(err("cat: missing file operand"));
      } else {
        appendHistory(err(`cat: ${args}: No such file or directory`));
        appendHistory(out("available files: projects.yml, readme.md"));
      }
      break;

    // ── echo ──────────────────────────────────────────────────────────────────
    case base === "echo":
      appendHistory(out(args || ""));
      break;

    // ── date ──────────────────────────────────────────────────────────────────
    case lower === "date":
      appendHistory(out(new Date().toString()));
      break;

    // ── uname ─────────────────────────────────────────────────────────────────
    case lower === "uname" || lower === "uname -a":
      appendHistory(out("HadenOS 4.0.0 hadensystem #1 SMP Next.js/14 x86_64 JavaScript"));
      break;

    case lower === "uname -s":
      appendHistory(out("HadenOS"));
      break;

    case lower === "uname -r":
      appendHistory(out("4.0.0-hadensystem"));
      break;

    // ── hostname ──────────────────────────────────────────────────────────────
    case lower === "hostname":
      appendHistory(out("hadensystem"));
      break;

    // ── ps ────────────────────────────────────────────────────────────────────
    case lower === "ps" || lower === "ps aux" || lower === "ps -aux":
      appendHistory(out("  PID TTY          TIME CMD"));
      appendHistory(out("    1 tui      00:00:01 init"));
      appendHistory(out("   42 tui      00:00:04 react"));
      appendHistory(out("   43 tui      00:00:02 framer-motion"));
      appendHistory(out("   44 tui      00:00:00 zustand"));
      appendHistory(out("   99 tui      00:00:06 vibes"));
      break;

    // ── top / htop ────────────────────────────────────────────────────────────
    case lower === "top" || lower === "htop":
      appendHistory(out("top - hadensystem load: 0.01 0.01 0.00"));
      appendHistory(out("Tasks: 5 total, 1 running, 4 sleeping"));
      appendHistory(out("CPU:  2.0% user  0.1% sys  97.9% idle"));
      appendHistory(out("Mem:  ████░░░░░░░░░░░░  (mostly portfolio data)"));
      appendHistory(out(`press q to quit  (or just type another command)`));
      break;

    // ── ping ──────────────────────────────────────────────────────────────────
    case base === "ping":
      if (!args) {
        appendHistory(err("ping: usage: ping <destination>"));
      } else {
        appendHistory(out(`PING ${args}: 56 data bytes`));
        appendHistory(out(`64 bytes from ${args}: icmp_seq=0 ttl=64 time=1.2 ms`));
        appendHistory(out(`64 bytes from ${args}: icmp_seq=1 ttl=64 time=0.9 ms`));
        appendHistory(out(`^C --- ${args} ping statistics ---`));
        appendHistory(out(`2 packets transmitted, 2 received, 0% packet loss`));
      }
      break;

    // ── curl / wget ───────────────────────────────────────────────────────────
    case base === "curl" || base === "wget":
      appendHistory(out(`${base}: fetching... (this is a fictional shell)`));
      appendHistory(out("response: 200 OK — but there's nothing to fetch here."));
      appendHistory(out("try the GUI instead: type 'exit'"));
      break;

    // ── ssh ───────────────────────────────────────────────────────────────────
    case base === "ssh":
      appendHistory(err("ssh: connect to host failed: this is a portfolio, not a server."));
      break;

    // ── mkdir ─────────────────────────────────────────────────────────────────
    case base === "mkdir":
      if (!args) {
        appendHistory(err("mkdir: missing operand"));
      } else {
        appendHistory(out(`mkdir: cannot create directory '${args}': read-only filesystem`));
        appendHistory(out("(this portfolio doesn't accept contributions — yet)"));
      }
      break;

    // ── touch ─────────────────────────────────────────────────────────────────
    case base === "touch":
      if (!args) {
        appendHistory(err("touch: missing file operand"));
      } else {
        appendHistory(out(`touch: cannot touch '${args}': read-only filesystem`));
      }
      break;

    // ── rm variants ───────────────────────────────────────────────────────────
    case lower === "sudo rm -rf ." || lower === "sudo rm -rf /" || lower === "sudo rm -rf *"
      || lower === "rm -rf ." || lower === "rm -rf /" || lower === "rm -rf *"
      || lower === "sudo rm -rf ~" || lower === "rm -rf ~":
      appendHistory(out("nice try."));
      appendHistory(out("this shell is entirely fictional."));
      appendHistory(out("the portfolio is safe. you are safe."));
      break;

    case base === "rm":
      if (!args) {
        appendHistory(err("rm: missing operand"));
      } else {
        appendHistory(err(`rm: cannot remove '${args}': read-only filesystem`));
      }
      break;

    // ── cp / mv ───────────────────────────────────────────────────────────────
    case base === "cp" || base === "mv":
      appendHistory(err(`${base}: cannot operate: read-only filesystem`));
      break;

    // ── chmod / chown ─────────────────────────────────────────────────────────
    case base === "chmod" || base === "chown":
      appendHistory(err(`${base}: operation not permitted`));
      break;

    // ── find ──────────────────────────────────────────────────────────────────
    case base === "find":
      appendHistory(out("./projects"));
      appendHistory(out("./experience"));
      appendHistory(out("./knowledge"));
      appendHistory(out("./about"));
      appendHistory(out("./contact"));
      break;

    // ── grep ──────────────────────────────────────────────────────────────────
    case base === "grep":
      appendHistory(out("grep: this filesystem contains only good code."));
      appendHistory(out("no matches found for bad practices."));
      break;

    // ── which ─────────────────────────────────────────────────────────────────
    case base === "which":
      if (["node", "npm", "npx"].includes(args)) {
        appendHistory(out(`/usr/local/bin/${args}`));
      } else {
        appendHistory(err(`${base}: ${args}: not found`));
      }
      break;

    // ── env / printenv ────────────────────────────────────────────────────────
    case lower === "env" || lower === "printenv":
      appendHistory(out("SHELL=/bin/hadenshell"));
      appendHistory(out("USER=visitor"));
      appendHistory(out("HOME=/home/visitor"));
      appendHistory(out("TERM=xterm-256color"));
      appendHistory(out("THEME=dark"));
      appendHistory(out("ACCENT=#8A5CFF"));
      appendHistory(out("NODE_ENV=production"));
      break;

    // ── history ───────────────────────────────────────────────────────────────
    case lower === "history":
      appendHistory(out("use arrow keys to navigate the menu above."));
      appendHistory(out("command history is not persisted in this shell."));
      break;

    // ── clear ─────────────────────────────────────────────────────────────────
    case lower === "clear":
      // handled upstream in store.runTuiCommand — just break here as fallback
      break;

    // ── exit ──────────────────────────────────────────────────────────────────
    case lower === "exit" || lower === "quit" || lower === "q":
      appendHistory(out("handoff: guiRenderer engaged → projects"));
      setTimeout(() => activateMenuItem(4), 400);
      break;

    // ── editors ───────────────────────────────────────────────────────────────
    case lower === "vim" || lower === "vi" || lower === "nano" || lower === "emacs" || lower === "code":
      appendHistory(err(`${lower}: editor not available in this environment`));
      appendHistory(out("(relax, there's nothing to edit here anyway)"));
      break;

    // ── git ───────────────────────────────────────────────────────────────────
    case lower === "git log" || lower === "git log --oneline":
      appendHistory(out("commit a4f2e91 — ship portfolio v4.0"));
      appendHistory(out("commit 3c8b012 — add TUI boot sequence"));
      appendHistory(out("commit 7f1d443 — wire up animated handoff"));
      appendHistory(out("commit 2a9c887 — redesign with sawad inspiration"));
      appendHistory(out("commit f8e3c11 — initial commit"));
      break;

    case lower === "git status":
      appendHistory(out("On branch main"));
      appendHistory(out("nothing to commit, working tree clean"));
      break;

    case lower === "git diff":
      appendHistory(out("(no diff — this is a read-only production build)"));
      break;

    case base === "git":
      appendHistory(err(`git: '${args}' is not a git command`));
      appendHistory(out("try: git log, git status"));
      break;

    // ── node / npm ────────────────────────────────────────────────────────────
    case lower === "node" || lower === "node -v" || lower === "node --version":
      appendHistory(out("v20.11.0"));
      break;

    case lower === "npm -v" || lower === "npm --version":
      appendHistory(out("10.2.4"));
      break;

    case base === "npm":
      appendHistory(err(`npm: '${args}' is not available in this environment`));
      break;

    // ── sudo (generic) ────────────────────────────────────────────────────────
    case base === "sudo":
      appendHistory(err("sudo: command not found in this fictional shell"));
      appendHistory(out("(you don't need root access to view a portfolio)"));
      break;

    // ── man (specific) ────────────────────────────────────────────────────────
    case base === "man":
      if (!args) {
        appendHistory(err("man: what manual page do you want?"));
      } else {
        appendHistory(out(`No manual entry for ${args} in this environment.`));
        appendHistory(out("try: help"));
      }
      break;

    // ── default ───────────────────────────────────────────────────────────────
    default:
      appendHistory(err(`command not found: ${cmd}`));
      appendHistory(out("type 'help' for available commands."));
  }
}
