import type { HistoryEntry } from "@/lib/store";

interface CommandContext {
  appendHistory: (e: HistoryEntry) => void;
  unlockHiddenOptions: () => void;
  activateMenuItem: (i: number) => void;
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

function out(text: string): HistoryEntry {
  return { type: "out", text };
}

function err(text: string): HistoryEntry {
  return { type: "err", text };
}

export function handleCommand(cmd: string, ctx: CommandContext) {
  const { appendHistory, unlockHiddenOptions, activateMenuItem, currentPath, setCurrentPath } = ctx;

  // Normalise for matching
  const trimmed = cmd.trim();
  const lower = trimmed.toLowerCase();
  const parts = trimmed.split(/\s+/);
  const base = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");
  const argsLower = args.toLowerCase();

  // Resolve full path string for pwd output
  const fullPath = currentPath === "~"
    ? "/home/visitor/hadensystem"
    : `/home/visitor/hadensystem/${currentPath.replace("~/", "")}`;

  // Valid section directories
  const SECTIONS = ["projects", "experience", "knowledge", "about", "gui", "contact"];

  switch (true) {
    // ── help ──────────────────────────────────────────────────────────────────
    case lower === "help" || lower === "man" || lower === "man help":
      appendHistory(out("available commands:"));
      appendHistory(out("  help              — show this list"));
      appendHistory(out("  ls [flags]        — list contents"));
      appendHistory(out("  cd <dir>          — change directory (cd .. to go back)"));
      appendHistory(out("  pwd               — print working directory"));
      appendHistory(out("  whoami            — about the operator"));
      appendHistory(out("  cat <file>        — read a file"));
      appendHistory(out("  echo <text>       — print text"));
      appendHistory(out("  serve <section>   — navigate to a section"));
      appendHistory(out("  date              — current date/time"));
      appendHistory(out("  uname [-a]        — system info"));
      appendHistory(out("  ps                — running processes"));
      appendHistory(out("  clear             — clear history"));
      appendHistory(out("  exit              — switch to GUI"));
      appendHistory(out("  git log           — commit history"));
      break;

    // ── ls variants ───────────────────────────────────────────────────────────
    case lower === "ls": {
      if (currentPath === "~/projects") {
        appendHistory(out("ten-thousand-shot-challenge  the-pond  group-of-seven-trail-app"));
        appendHistory(out("nextshift  skill-drills  timmies-helper  video-scraper"));
      } else if (currentPath === "~/experience") {
        appendHistory(out("v1.0-foundations  v2.0-building-products  v3.0-owning-the-stack  v4.0-ux-first"));
      } else if (currentPath === "~/knowledge") {
        appendHistory(out("frontend  backend  devops-automation  systems-networking  storytelling"));
      } else if (currentPath === "~/about") {
        appendHistory(out("family.txt  craft.txt  play.txt"));
        appendHistory(out("hint: try ls -a to reveal hidden files"));
      } else if (currentPath === "~/contact") {
        appendHistory(out("email:    hi@hadenhiles.com"));
        appendHistory(out("linkedin: linkedin.com/in/hadenhiles"));
        appendHistory(out("github:   github.com/HadenHiles"));
      } else {
        appendHistory(out("projects  experience  knowledge  about  gui  contact"));
      }
      break;
    }

    case lower === "ls -a" || lower === "ls -la" || lower === "ls -al": {
      if (currentPath === "~/about") {
        unlockHiddenOptions();
        appendHistory(out("-rw-r--r--  family.txt"));
        appendHistory(out("-rw-r--r--  craft.txt"));
        appendHistory(out("-rw-r--r--  play.txt"));
        appendHistory(out("-rw-------  .hobbies       [permission: 600]"));
        appendHistory(out("-rw-------  .homelab       [permission: 600]"));
        appendHistory(out("-rw-------  .gear          [permission: 600]"));
        appendHistory(out("-rw-------  .behind-scenes [permission: 600]"));
        appendHistory(out("hint: sudo cat <file> to read restricted files"));
      } else if (currentPath === "~/projects") {
        appendHistory(out("ten-thousand-shot-challenge  the-pond  group-of-seven-trail-app"));
        appendHistory(out("nextshift  skill-drills  timmies-helper  video-scraper"));
      } else if (currentPath === "~/experience") {
        appendHistory(out("v1.0-foundations  v2.0-building-products  v3.0-owning-the-stack  v4.0-ux-first"));
      } else if (currentPath === "~/knowledge") {
        appendHistory(out("frontend  backend  devops-automation  systems-networking  storytelling"));
      } else if (currentPath === "~/contact") {
        appendHistory(out("email:    hi@hadenhiles.com"));
        appendHistory(out("linkedin: linkedin.com/in/hadenhiles"));
        appendHistory(out("github:   github.com/HadenHiles"));
      } else {
        unlockHiddenOptions();
        appendHistory(out("drwxr-xr-x  projects/"));
        appendHistory(out("drwxr-xr-x  experience/"));
        appendHistory(out("drwxr-xr-x  knowledge/"));
        appendHistory(out("drwxr-xr-x  about/"));
        appendHistory(out("drwxr-xr-x  gui/"));
        appendHistory(out("drwxr-xr-x  contact/"));
        appendHistory(out("hint: cd about && ls -a to find the hidden files."));
      }
      break;
    }

    case lower === "ls -l": {
      if (currentPath === "~/projects") {
        appendHistory(out("total 7"));
        appendHistory(out("drwxr-xr-x  ten-thousand-shot-challenge/"));
        appendHistory(out("drwxr-xr-x  the-pond/"));
        appendHistory(out("drwxr-xr-x  group-of-seven-trail-app/"));
        appendHistory(out("drwxr-xr-x  nextshift/"));
        appendHistory(out("drwxr-xr-x  skill-drills/"));
        appendHistory(out("drwxr-xr-x  timmies-helper/"));
        appendHistory(out("drwxr-xr-x  video-scraper/"));
      } else if (currentPath === "~/about") {
        appendHistory(out("total 3"));
        appendHistory(out("-rw-r--r--  family.txt"));
        appendHistory(out("-rw-r--r--  craft.txt"));
        appendHistory(out("-rw-r--r--  play.txt"));
      } else {
        appendHistory(out("total 6"));
        appendHistory(out("drwxr-xr-x  projects/"));
        appendHistory(out("drwxr-xr-x  experience/"));
        appendHistory(out("drwxr-xr-x  knowledge/"));
        appendHistory(out("drwxr-xr-x  about/"));
        appendHistory(out("drwxr-xr-x  gui/"));
        appendHistory(out("drwxr-xr-x  contact/"));
      }
      break;
    }

    // ── pwd ───────────────────────────────────────────────────────────────────
    case lower === "pwd":
      appendHistory(out(fullPath));
      break;

    // ── cd ────────────────────────────────────────────────────────────────────
    case base === "cd": {
      const dest = argsLower;
      if (!dest || dest === "~" || dest === "/home/visitor" || dest === "/home/visitor/hadensystem") {
        setCurrentPath("~");
        appendHistory(out("~"));
      } else if (dest === ".." || dest === "../") {
        if (currentPath === "~") {
          appendHistory(out("~ (already at root)"));
        } else {
          setCurrentPath("~");
          appendHistory(out("~"));
        }
      } else if (dest === "/" || dest === "./") {
        setCurrentPath("~");
        appendHistory(out("~"));
      } else if (SECTIONS.includes(dest.replace(/^\.\//, "").replace(/\/$/, ""))) {
        const section = dest.replace(/^\.\//, "").replace(/\/$/, "");
        setCurrentPath(`~/${section}`);
        appendHistory(out(`~/hadensystem/${section}`));
      } else {
        appendHistory(err(`cd: ${args}: No such file or directory`));
      }
      break;
    }

    // ── whoami ────────────────────────────────────────────────────────────────
    case lower === "whoami":
      appendHistory(out("haden hiles — principal software and devops engineer."));
      appendHistory(out("full stack engineer who designs from the user down"));
      appendHistory(out("and builds the system to match."));
      break;

    // ── cat ───────────────────────────────────────────────────────────────────
    // Hidden file permission errors
    case base === "cat" && (argsLower === ".hobbies" || argsLower === ".homelab" || argsLower === ".gear" || argsLower === ".behind-scenes"):
      appendHistory(err(`cat: ${args}: Permission denied`));
      appendHistory(out("hint: sudo cat <file> to read restricted files"));
      break;

    // About text files
    case lower === "cat family.txt":
      appendHistory(out("# family"));
      appendHistory(out("My wife Shannon and I have been married since July 2025. We bought"));
      appendHistory(out("our first house in Oct 2025 and have a spoiled golden retriever"));
      appendHistory(out("named Harvey — our pride and joy. Best time of year is cottage"));
      appendHistory(out("country, where Harvey launches off the dock and we air-dry on the boat."));
      break;

    case lower === "cat craft.txt":
      appendHistory(out("# craft"));
      appendHistory(out("I build software the way I want software to feel as a user:"));
      appendHistory(out("simple, fast, and frictionless — but still nice to look at."));
      appendHistory(out(""));
      appendHistory(out("\"Simplicity beats cleverness."));
      appendHistory(out(" If it needs a manual, it probably needs a redesign.\""));
      break;

    case lower === "cat play.txt":
      appendHistory(out("# play"));
      appendHistory(out("Sports:    Hockey · Golf · Squash — if it's competitive, I love it."));
      appendHistory(out("Music:     Guitar"));
      appendHistory(out("Watching:  LOTR · GOT · Mr. Robot (IYKYK)"));
      appendHistory(out("Weekends:  house projects, home media server, cottage with family."));
      break;

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
        if (currentPath === "~/about") {
          appendHistory(out("available files: family.txt, craft.txt, play.txt"));
          appendHistory(out("hint: ls -a to see hidden files"));
        } else {
          appendHistory(out("available files: projects.yml, readme.md"));
        }
      }
      break;

    // ── echo ──────────────────────────────────────────────────────────────────
    case base === "echo":
      appendHistory(out(args));
      break;

    // ── serve ─────────────────────────────────────────────────────────────────
    case lower === "serve":
      appendHistory(out("usage: serve <section>"));
      appendHistory(out("  serve projects    — open projects section"));
      appendHistory(out("  serve experience  — open experience section"));
      appendHistory(out("  serve knowledge   — open knowledge section"));
      appendHistory(out("  serve about       — open about section"));
      appendHistory(out("  serve gui         — switch to GUI"));
      appendHistory(out("  serve contact     — open contact modal"));
      break;

    case lower === "serve projects" || lower === "serve work":
      appendHistory(out("serving projects..."));
      setTimeout(() => activateMenuItem(0), 300);
      break;

    case lower === "serve experience":
      appendHistory(out("serving experience..."));
      setTimeout(() => activateMenuItem(1), 300);
      break;

    case lower === "serve knowledge":
      appendHistory(out("serving knowledge..."));
      setTimeout(() => activateMenuItem(2), 300);
      break;

    case lower === "serve about":
      appendHistory(out("serving about..."));
      setTimeout(() => activateMenuItem(3), 300);
      break;

    case lower === "serve gui":
      appendHistory(out("switching to GUI..."));
      setTimeout(() => activateMenuItem(4), 300);
      break;

    case lower === "serve contact":
      appendHistory(out("opening contact..."));
      setTimeout(() => activateMenuItem(5), 300);
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
      appendHistory(out("commit 2a9c887 — redesign with minimilist inspiration"));
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

    // ── sudo cat hidden files ─────────────────────────────────────────────────
    case lower === "sudo cat .hobbies":
      appendHistory(out("# .hobbies — play pillar"));
      appendHistory(out("sports:    Hockey · Golf · Squash"));
      appendHistory(out("music:     Guitar"));
      appendHistory(out("reading:   when the mood strikes"));
      appendHistory(out("watching:  LOTR · GOT · Mr. Robot (IYKYK)"));
      appendHistory(out("weekends:  house projects, home media server, cottage with family"));
      break;

    case lower === "sudo cat .homelab":
      appendHistory(out("# .homelab — personal infrastructure"));
      appendHistory(out("media server:  Plex running on Docker"));
      appendHistory(out("stack:         self-hosted on dedicated hardware"));
      appendHistory(out("hobbies:       home automation, network tweaks, ongoing projects"));
      appendHistory(out("priority:      Harvey on the dock > everything else"));
      break;

    case lower === "sudo cat .gear":
      appendHistory(out("# .gear — tech stack"));
      appendHistory(out("mobile:    Flutter / Dart / C++"));
      appendHistory(out("frontend:  React · TypeScript · Next.js · Tailwind"));
      appendHistory(out("backend:   Node.js · Express · Firebase · PHP"));
      appendHistory(out("devops:    Docker · CI/CD pipelines · production infra"));
      appendHistory(out("editor:    VS Code"));
      break;

    case lower === "sudo cat .behind-scenes":
      appendHistory(out("# .behind-scenes — craft pillar"));
      appendHistory(out("\"Every flow, button, color, API, and deployment decision"));
      appendHistory(out(" starts from the same place: as a user, what would I"));
      appendHistory(out(" expect right here?\""));
      appendHistory(out(""));
      appendHistory(out("Simplicity beats cleverness."));
      appendHistory(out("If it needs a manual, it probably needs a redesign."));
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
