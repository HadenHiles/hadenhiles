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

  switch (true) {
    case cmd === "help":
      appendHistory(out("available commands:"));
      appendHistory(out("  help              — show this list"));
      appendHistory(out("  ls                — list sections"));
      appendHistory(out("  ls -a             — list all options"));
      appendHistory(out("  whoami            — about the operator"));
      appendHistory(out("  cat projects.yml  — project manifest"));
      appendHistory(out("  clear             — clear history"));
      appendHistory(out("  exit              — switch to GUI"));
      break;

    case cmd === "ls":
      appendHistory(out("projects  experience  knowledge  about  gui  contact"));
      break;

    case cmd === "ls -a":
      unlockHiddenOptions();
      appendHistory(out("projects  experience  knowledge  about  gui  contact"));
      appendHistory(out("[unlocked] hobbies  homelab  gear  behind-the-scenes"));
      appendHistory(out("hint: explore the GUI — some of these have hidden entries."));
      break;

    case cmd === "whoami":
      appendHistory(out("haden hiles — engineer, creator, builder."));
      appendHistory(out("writes systems that work. shoots content that lands."));
      appendHistory(out("does both. on purpose."));
      break;

    case cmd === "cat projects.yml":
      appendHistory(out("# projects manifest"));
      appendHistory(out("---"));
      appendHistory(out("  - Update projects.json with your real projects"));
      appendHistory(out("  - Keep 'id' fields stable — they're used as keys"));
      appendHistory(out("---"));
      appendHistory(out("use Projects from the menu for the full breakdown."));
      break;

    case cmd === "exit":
      appendHistory(out("handoff: guiRenderer engaged → projects"));
      setTimeout(() => activateMenuItem(4), 400);
      break;

    case cmd === "sudo rm -rf ." || cmd === "sudo rm -rf /" || cmd === "sudo rm -rf *":
      appendHistory(out("sudo: nice try."));
      appendHistory(out("sudo: this shell is entirely fictional."));
      appendHistory(out("sudo: the portfolio is safe. you are safe."));
      break;

    case cmd === "vim" || cmd === "vi" || cmd === "nano" || cmd === "emacs":
      appendHistory(err(`${cmd}: editor not available in this environment`));
      appendHistory(out("(relax, there's nothing to edit here anyway)"));
      break;

    case cmd === "git log":
      appendHistory(out("commit a4f2e91 — ship portfolio v1.0"));
      appendHistory(out("commit 3c8b012 — add morph handoff transition"));
      appendHistory(out("commit 7f1d443 — wire up tui boot sequence"));
      appendHistory(out("commit 2a9c887 — initial commit"));
      break;

    case cmd.startsWith("sudo"):
      appendHistory(err(`sudo: command not found`));
      appendHistory(out("type 'help' for available commands."));
      break;

    default:
      appendHistory(err(`command not found: ${cmd}`));
      appendHistory(out("type 'help' for available commands."));
  }
}
