import type { HistoryEntry } from "@/lib/store";
import type { Project, Job, KnowledgeCategory } from "@/types/content";
import projectsData from "@/content/projects.json";
import jobsData from "@/content/jobs.json";
import knowledgeData from "@/content/knowledge.json";

const projects = projectsData as Project[];
const jobs = jobsData as Job[];
const knowledge = knowledgeData as KnowledgeCategory[];

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Slugs derived from JSON — stay in sync with data
const jobSlugs = jobs.map((j) => j.slug);
const knowledgeSlugs = knowledge.map((k) => slugify(k.category));
const projectSlugs = projects.map((p) => p.id);

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

// Parse path levels: "~/experience/how-to-hockey" → ["experience", "how-to-hockey"]
function pathParts(path: string): string[] {
  return path.replace("~/", "").split("/").filter(Boolean);
}

export function handleCommand(cmd: string, ctx: CommandContext) {
  const { appendHistory, unlockHiddenOptions, activateMenuItem, currentPath, setCurrentPath } = ctx;

  const trimmed = cmd.trim();
  const lower = trimmed.toLowerCase();
  const parts = trimmed.split(/\s+/);
  const base = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");
  const argsLower = args.toLowerCase();

  const levels = pathParts(currentPath);
  const inSection = levels[0]; // "experience", "projects", etc.
  const inJobSlug = levels[1]; // e.g. "how-to-hockey" (when inside a job dir)

  const fullPath = currentPath === "~"
    ? "/home/visitor/hadensystem"
    : `/home/visitor/hadensystem/${currentPath.replace("~/", "")}`;

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

    // ── number shortcuts ───────────────────────────────────────────────────────
    case trimmed === "1": case trimmed === "2": case trimmed === "3":
    case trimmed === "4": case trimmed === "5": case trimmed === "6":
    case trimmed === "7": {
      const idx = parseInt(trimmed, 10) - 1;
      activateMenuItem(idx);
      break;
    }

    // ── ls variants ───────────────────────────────────────────────────────────
    case lower === "ls": {
      if (inSection === "projects" && !inJobSlug) {
        appendHistory(out(projectSlugs.slice(0, Math.ceil(projectSlugs.length / 2)).join("  ")));
        appendHistory(out(projectSlugs.slice(Math.ceil(projectSlugs.length / 2)).join("  ")));
      } else if (inSection === "experience" && !inJobSlug) {
        appendHistory(out(jobSlugs.join("  ")));
      } else if (inSection === "experience" && inJobSlug) {
        appendHistory(out("role.txt  highlights.txt  stack.txt"));
      } else if (inSection === "knowledge") {
        appendHistory(out(knowledgeSlugs.join("  ")));
      } else if (inSection === "about") {
        appendHistory(out("family.txt  craft.txt  play.txt"));
        appendHistory(out("hint: try ls -a to reveal hidden files"));
      } else if (inSection === "contact") {
        appendHistory(out("email:    hi@hadenhiles.com"));
        appendHistory(out("linkedin: linkedin.com/in/hadenhiles"));
        appendHistory(out("github:   github.com/HadenHiles"));
      } else {
        appendHistory(out("projects  experience  knowledge  about  gui  contact"));
      }
      break;
    }

    case lower === "ls -a" || lower === "ls -la" || lower === "ls -al": {
      if (inSection === "about") {
        unlockHiddenOptions();
        appendHistory(out("-rw-r--r--  family.txt"));
        appendHistory(out("-rw-r--r--  craft.txt"));
        appendHistory(out("-rw-r--r--  play.txt"));
        appendHistory(out("-rw-------  .hobbies       [permission: 600]"));
        appendHistory(out("-rw-------  .homelab       [permission: 600]"));
        appendHistory(out("-rw-------  .gear          [permission: 600]"));
        appendHistory(out("-rw-------  .behind-scenes [permission: 600]"));
        appendHistory(out("hint: sudo cat <file> to read restricted files"));
      } else if (inSection === "experience" && inJobSlug) {
        appendHistory(out("-rw-r--r--  role.txt"));
        appendHistory(out("-rw-r--r--  highlights.txt"));
        appendHistory(out("-rw-r--r--  stack.txt"));
      } else if (inSection === "experience") {
        appendHistory(out(`total ${jobSlugs.length}`));
        for (const slug of jobSlugs) {
          appendHistory(out(`drwxr-xr-x  ${slug}/`));
        }
      } else if (inSection === "projects") {
        appendHistory(out(projectSlugs.slice(0, Math.ceil(projectSlugs.length / 2)).join("  ")));
        appendHistory(out(projectSlugs.slice(Math.ceil(projectSlugs.length / 2)).join("  ")));
      } else if (inSection === "knowledge") {
        appendHistory(out(knowledgeSlugs.join("  ")));
      } else if (inSection === "contact") {
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
      if (inSection === "projects") {
        appendHistory(out(`total ${projectSlugs.length}`));
        for (const slug of projectSlugs) appendHistory(out(`drwxr-xr-x  ${slug}/`));
      } else if (inSection === "experience" && !inJobSlug) {
        appendHistory(out(`total ${jobSlugs.length}`));
        for (const job of jobs) {
          appendHistory(out(`drwxr-xr-x  ${job.slug}/    # ${job.role} · ${job.dateRange}`));
        }
      } else if (inSection === "experience" && inJobSlug) {
        appendHistory(out("total 3"));
        appendHistory(out("-rw-r--r--  role.txt"));
        appendHistory(out("-rw-r--r--  highlights.txt"));
        appendHistory(out("-rw-r--r--  stack.txt"));
      } else if (inSection === "knowledge") {
        appendHistory(out(`total ${knowledgeSlugs.length}`));
        for (const slug of knowledgeSlugs) appendHistory(out(`drwxr-xr-x  ${slug}/`));
      } else if (inSection === "about") {
        appendHistory(out("total 3"));
        appendHistory(out("-rw-r--r--  family.txt"));
        appendHistory(out("-rw-r--r--  craft.txt"));
        appendHistory(out("-rw-r--r--  play.txt"));
      } else {
        appendHistory(out("total 6"));
        for (const sec of SECTIONS) appendHistory(out(`drwxr-xr-x  ${sec}/`));
      }
      break;
    }

    // ── pwd ───────────────────────────────────────────────────────────────────
    case lower === "pwd":
      appendHistory(out(fullPath));
      break;

    // ── cd ────────────────────────────────────────────────────────────────────
    case base === "cd": {
      const dest = argsLower.replace(/\/$/, "");
      if (!dest || dest === "~" || dest === "/home/visitor" || dest === "/home/visitor/hadensystem") {
        setCurrentPath("~");
        appendHistory(out("~"));
      } else if (dest === ".." || dest === "../") {
        if (currentPath === "~") {
          appendHistory(out("~ (already at root)"));
        } else if (inJobSlug) {
          // go up from job dir to experience/
          setCurrentPath("~/experience");
          appendHistory(out("~/experience"));
        } else {
          setCurrentPath("~");
          appendHistory(out("~"));
        }
      } else if (dest === "/" || dest === "./") {
        setCurrentPath("~");
        appendHistory(out("~"));
      } else if (SECTIONS.includes(dest.replace(/^\.\//, ""))) {
        const section = dest.replace(/^\.\//, "");
        setCurrentPath(`~/${section}`);
        appendHistory(out(`~/hadensystem/${section}`));
      } else if (inSection === "experience" && !inJobSlug && jobSlugs.includes(dest)) {
        // cd into a specific job directory
        setCurrentPath(`~/experience/${dest}`);
        const job = jobs.find((j) => j.slug === dest);
        appendHistory(out(`~/experience/${dest}  # ${job?.company ?? dest}`));
        appendHistory(out("files: role.txt  highlights.txt  stack.txt"));
      } else if (dest.startsWith("experience/")) {
        const slug = dest.replace("experience/", "");
        if (jobSlugs.includes(slug)) {
          setCurrentPath(`~/experience/${slug}`);
          const job = jobs.find((j) => j.slug === slug);
          appendHistory(out(`~/experience/${slug}  # ${job?.company ?? slug}`));
          appendHistory(out("files: role.txt  highlights.txt  stack.txt"));
        } else {
          appendHistory(err(`cd: ${args}: No such file or directory`));
        }
      } else {
        appendHistory(err(`cd: ${args}: No such file or directory`));
        if (inSection === "experience" && !inJobSlug) {
          appendHistory(out(`available: ${jobSlugs.join(", ")}`));
        }
      }
      break;
    }

    // ── whoami ────────────────────────────────────────────────────────────────
    case lower === "whoami":
      appendHistory(out("haden hiles — software & devops engineer."));
      appendHistory(out("full stack engineer who designs from the user down"));
      appendHistory(out("and builds the system to match."));
      break;

    // ── cat — hidden file permission errors ───────────────────────────────────
    case base === "cat" && (argsLower === ".hobbies" || argsLower === ".homelab" || argsLower === ".gear" || argsLower === ".behind-scenes"):
      appendHistory(err(`cat: ${args}: Permission denied`));
      appendHistory(out("hint: sudo cat <file> to read restricted files"));
      break;

    // ── cat role.txt (inside a job dir) ──────────────────────────────────────
    case lower === "cat role.txt" && inSection === "experience" && !!inJobSlug: {
      const job = jobs.find((j) => j.slug === inJobSlug);
      if (job) {
        appendHistory(out(`# ${job.company}`));
        appendHistory(out(`role:  ${job.role}`));
        appendHistory(out(`dates: ${job.dateRange}`));
        appendHistory(out(""));
        appendHistory(out(job.summary));
      } else {
        appendHistory(err("cat: role.txt: file not found"));
      }
      break;
    }

    // ── cat highlights.txt (inside a job dir) ─────────────────────────────────
    case lower === "cat highlights.txt" && inSection === "experience" && !!inJobSlug: {
      const job = jobs.find((j) => j.slug === inJobSlug);
      if (job) {
        appendHistory(out(`# ${job.company} — highlights`));
        appendHistory(out(""));
        for (const h of job.highlights) {
          appendHistory(out(`  · ${h}`));
        }
      } else {
        appendHistory(err("cat: highlights.txt: file not found"));
      }
      break;
    }

    // ── cat stack.txt (inside a job dir) ─────────────────────────────────────
    case lower === "cat stack.txt" && inSection === "experience" && !!inJobSlug: {
      const job = jobs.find((j) => j.slug === inJobSlug);
      if (job) {
        appendHistory(out(`# ${job.company} — primary skills`));
        appendHistory(out(""));
        appendHistory(out(job.primarySkills.join(" · ")));
      } else {
        appendHistory(err("cat: stack.txt: file not found"));
      }
      break;
    }

    // ── cat — about text files ─────────────────────────────────────────────────
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
        if (inSection === "about") {
          appendHistory(out("available files: family.txt, craft.txt, play.txt"));
          appendHistory(out("hint: ls -a to see hidden files"));
        } else if (inSection === "experience" && inJobSlug) {
          appendHistory(out("available files: role.txt, highlights.txt, stack.txt"));
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
      appendHistory(out("  serve specs       — show specs / stats"));
      appendHistory(out("  serve knowledge   — open knowledge section"));
      appendHistory(out("  serve projects    — open projects section"));
      appendHistory(out("  serve experience  — open experience section"));
      appendHistory(out("  serve about       — open about section"));
      appendHistory(out("  serve gui         — switch to GUI"));
      appendHistory(out("  serve contact     — open contact modal"));
      break;

    case lower === "serve specs":
      appendHistory(out("serving specs..."));
      setTimeout(() => activateMenuItem(0), 300);
      break;

    case lower === "serve knowledge":
      appendHistory(out("serving knowledge..."));
      setTimeout(() => activateMenuItem(1), 300);
      break;

    case lower === "serve projects" || lower === "serve work":
      appendHistory(out("serving projects..."));
      setTimeout(() => activateMenuItem(2), 300);
      break;

    case lower === "serve experience":
      appendHistory(out("serving experience..."));
      setTimeout(() => activateMenuItem(3), 300);
      break;

    case lower === "serve about":
      appendHistory(out("serving about..."));
      setTimeout(() => activateMenuItem(4), 300);
      break;

    case lower === "serve gui":
      appendHistory(out("switching to GUI..."));
      setTimeout(() => activateMenuItem(5), 300);
      break;

    case lower === "serve contact":
      appendHistory(out("opening contact..."));
      setTimeout(() => activateMenuItem(6), 300);
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

    case lower === "top" || lower === "htop":
      appendHistory(out("top - hadensystem load: 0.01 0.01 0.00"));
      appendHistory(out("Tasks: 5 total, 1 running, 4 sleeping"));
      appendHistory(out("CPU:  2.0% user  0.1% sys  97.9% idle"));
      appendHistory(out("Mem:  ████░░░░░░░░░░░░  (mostly portfolio data)"));
      appendHistory(out("press q to quit  (or just type another command)"));
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

    case base === "curl" || base === "wget":
      appendHistory(out(`${base}: fetching... (this is a fictional shell)`));
      appendHistory(out("response: 200 OK — but there's nothing to fetch here."));
      appendHistory(out("try the GUI instead: type 'exit'"));
      break;

    case base === "ssh":
      appendHistory(err("ssh: connect to host failed: this is a portfolio, not a server."));
      break;

    case base === "mkdir":
      appendHistory(out(`mkdir: cannot create directory '${args || "?"}': read-only filesystem`));
      break;

    case base === "touch":
      appendHistory(out(`touch: cannot touch '${args || "?"}': read-only filesystem`));
      break;

    case lower === "sudo rm -rf ." || lower === "sudo rm -rf /" || lower === "sudo rm -rf *"
      || lower === "rm -rf ." || lower === "rm -rf /" || lower === "rm -rf *"
      || lower === "sudo rm -rf ~" || lower === "rm -rf ~":
      appendHistory(out("nice try."));
      appendHistory(out("this shell is entirely fictional."));
      break;

    case base === "rm":
      appendHistory(err(`rm: cannot remove '${args || "?"}': read-only filesystem`));
      break;

    case base === "cp" || base === "mv":
      appendHistory(err(`${base}: cannot operate: read-only filesystem`));
      break;

    case base === "chmod" || base === "chown":
      appendHistory(err(`${base}: operation not permitted`));
      break;

    case base === "find":
      appendHistory(out("./projects"));
      appendHistory(out("./experience"));
      for (const slug of jobSlugs) appendHistory(out(`./experience/${slug}`));
      appendHistory(out("./knowledge"));
      appendHistory(out("./about"));
      appendHistory(out("./contact"));
      break;

    case base === "grep":
      appendHistory(out("grep: this filesystem contains only good code."));
      appendHistory(out("no matches found for bad practices."));
      break;

    case base === "which":
      if (["node", "npm", "npx"].includes(args)) {
        appendHistory(out(`/usr/local/bin/${args}`));
      } else {
        appendHistory(err(`${base}: ${args}: not found`));
      }
      break;

    case lower === "env" || lower === "printenv":
      appendHistory(out("SHELL=/bin/hadenshell"));
      appendHistory(out("USER=visitor"));
      appendHistory(out("HOME=/home/visitor"));
      appendHistory(out("TERM=xterm-256color"));
      appendHistory(out("THEME=dark"));
      appendHistory(out("ACCENT=#8A5CFF"));
      appendHistory(out("NODE_ENV=production"));
      break;

    case lower === "history":
      appendHistory(out("use arrow keys to navigate the menu above."));
      appendHistory(out("command history is not persisted in this shell."));
      break;

    case lower === "clear":
      break;

    case lower === "exit" || lower === "quit" || lower === "q":
      appendHistory(out("handoff: guiRenderer engaged → projects"));
      setTimeout(() => activateMenuItem(4), 400);
      break;

    case lower === "vim" || lower === "vi" || lower === "nano" || lower === "emacs" || lower === "code":
      appendHistory(err(`${lower}: editor not available in this environment`));
      appendHistory(out("(there's nothing to edit here anyway)"));
      break;

    case lower === "git log" || lower === "git log --oneline":
      appendHistory(out("commit a4f2e91 — ship portfolio v4.0"));
      appendHistory(out("commit 3c8b012 — add TUI boot sequence"));
      appendHistory(out("commit 7f1d443 — wire up animated handoff"));
      appendHistory(out("commit d3ad1f8 — update sudo pw: DogsRule123"));
      appendHistory(out("commit 2a9c887 — redesign with minimalist inspiration"));
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

    case base === "sudo":
      if (!args) {
        appendHistory(err("sudo: usage: sudo <command>"));
      } else {
        appendHistory(err(`sudo: ${args}: command not found`));
        appendHistory(out("(not everything is available, even as root)"));
      }
      break;

    case base === "man":
      if (!args) {
        appendHistory(err("man: what manual page do you want?"));
      } else {
        appendHistory(out(`No manual entry for ${args} in this environment.`));
        appendHistory(out("try: help"));
      }
      break;

    // ── tree ──────────────────────────────────────────────────────────────────
    case lower === "tree": {
      appendHistory(out("."));
      appendHistory(out("├── projects/"));
      for (let i = 0; i < projectSlugs.length; i++) {
        const c = i < projectSlugs.length - 1 ? "│   ├──" : "│   └──";
        appendHistory(out(`${c} ${projectSlugs[i]}/`));
      }
      appendHistory(out("├── experience/"));
      for (let i = 0; i < jobs.length; i++) {
        const last = i === jobs.length - 1;
        const c = last ? "│   └──" : "│   ├──";
        const pipe = last ? "        " : "│       ";
        appendHistory(out(`${c} ${jobs[i].slug}/`));
        appendHistory(out(`${pipe}├── role.txt`));
        appendHistory(out(`${pipe}├── highlights.txt`));
        appendHistory(out(`${pipe}└── stack.txt`));
      }
      appendHistory(out("├── knowledge/"));
      for (let i = 0; i < knowledgeSlugs.length; i++) {
        const c = i < knowledgeSlugs.length - 1 ? "│   ├──" : "│   └──";
        appendHistory(out(`${c} ${knowledgeSlugs[i]}/`));
      }
      appendHistory(out("├── about/"));
      appendHistory(out("│   ├── family.txt"));
      appendHistory(out("│   ├── craft.txt"));
      appendHistory(out("│   └── play.txt"));
      appendHistory(out("└── contact/"));
      appendHistory(out(`${projectSlugs.length + jobs.length + knowledgeSlugs.length} directories, many commits, zero regrets.`));
      break;
    }

    // ── neofetch ──────────────────────────────────────────────────────────────
    case lower === "neofetch":
      appendHistory(out("               visitor@hadensystem"));
      appendHistory(out("               ─────────────────────────────────"));
      appendHistory(out("  █████████    OS:      HadenOS 4.0.0"));
      appendHistory(out("  █░░░░░░░█    Host:    hadensystem"));
      appendHistory(out("  █░░░░░░░█    Shell:   hadenshell 4.0"));
      appendHistory(out("  █░░░░░░░█    Stack:   Next.js · Framer · Zustand"));
      appendHistory(out("  █░░░░░░░█    Theme:   dark (obviously)"));
      appendHistory(out("  █░░░░░░░█    Accent:  #8A5CFF"));
      appendHistory(out("  █████████    Uptime:  since first commit"));
      appendHistory(out("               Terminal: TUI v4.0"));
      break;

    case lower === "uptime":
      appendHistory(out("up since first commit, load average: 0.00 0.00 0.00"));
      appendHistory(out("no downtime. ever. (this is a static site)"));
      break;

    case lower === "df" || lower === "df -h":
      appendHistory(out("Filesystem       Size  Used  Avail  Use%  Mounted on"));
      appendHistory(out("/dev/portfolio   100G   42G    58G   42%  /"));
      appendHistory(out("tmpfs/brain       inf   inf    inf    —   /ideas"));
      appendHistory(out("(most space taken up by opinions about UX)"));
      break;

    case lower === "ifconfig" || lower === "ip addr" || lower === "ip a":
      appendHistory(out("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>"));
      appendHistory(out("      inet 127.0.0.1  netmask 255.255.255.0"));
      appendHistory(out("      (connected to the internet of good ideas)"));
      break;

    case lower === "reboot" || lower === "shutdown" || lower === "shutdown -h now" || lower === "sudo reboot":
      appendHistory(out("rebooting... just kidding. this is a static portfolio."));
      break;

    case lower === "sl":
      appendHistory(out("      ====        ________                ___________"));
      appendHistory(out("  _D _|  |_______/        \\__I_I_____===__|_________|"));
      appendHistory(out(" |(_)---  |   H\\________/ |   |        =|___ ___|   "));
      appendHistory(out(" /     |  |   H  |  |     |   |         ||_| |_||   "));
      appendHistory(out("|      |  |   H  |__--------------------| [___] |   "));
      appendHistory(out("| ________|___H__/__|_____/[][]~\\_______|       |   "));
      appendHistory(out("|/ |   |-----------I_____I [][] []  D   |=======|__/"));
      appendHistory(out(" \\_/____/=======    )-/\\-\\-\\-|         |_/___/"));
      appendHistory(out("  steam locomotive — you meant ls, didn't you?"));
      break;

    case lower === "fortune":
      appendHistory(out("\"The best interface is no interface.\""));
      appendHistory(out("  — Golden Krishna (but also just good engineering)"));
      break;

    case lower === "matrix":
      appendHistory(out("follow the white rabbit."));
      appendHistory(out("(there's no spoon, but there are hidden files — try ls -a in ~/about)"));
      break;

    case lower === "alias":
      appendHistory(out("alias ll='ls -la'"));
      appendHistory(out("alias gs='git status'"));
      appendHistory(out("alias build='npm run build'"));
      appendHistory(out("alias vibes='ps | grep vibes'"));
      break;

    case lower === "cat /etc/passwd":
      appendHistory(out("root:x:0:0:root:/root:/bin/bash"));
      appendHistory(out("visitor:x:1000:1000:Portfolio Visitor:/home/visitor:/bin/hadenshell"));
      appendHistory(out("haden:x:1001:1001:Haden Hiles,Software Engineer:/home/haden:/bin/zsh"));
      break;

    case lower === "cat /etc/hostname" || lower === "cat /proc/version":
      appendHistory(out("hadensystem"));
      break;

    case lower === "bash" || lower === "sh" || lower === "zsh" || lower === "/bin/bash":
      appendHistory(out("spawning new shell..."));
      appendHistory(out("wait, you're already in one. this is it."));
      appendHistory(out("there is no deeper terminal. this goes all the way down."));
      break;

    case lower === "sudo !!":
      appendHistory(err("sudo: !!: command not found"));
      appendHistory(out("(bash history expansion doesn't work here — type the full command)"));
      break;

    case base === "less" || base === "more":
      if (!args) {
        appendHistory(err(`${base}: missing file operand`));
      } else {
        appendHistory(err(`${base}: ${args}: No such file or directory`));
        appendHistory(out("try cat instead — this shell doesn't need a pager"));
      }
      break;

    default:
      appendHistory(err(`command not found: ${cmd}`));
      appendHistory(out("type 'help' for available commands."));
  }
}
