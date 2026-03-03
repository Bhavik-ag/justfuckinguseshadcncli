#!/usr/bin/env node

import { execa } from "execa";
import { existsSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

async function detectPM(): Promise<string> {
  const lockFiles: Record<string, string> = {
    pnpm: "pnpm-lock.yaml",
    yarn: "yarn.lock",
    bun: "bun.lockb",
    npm: "package-lock.json",
  };

  for (const [pm, lockFile] of Object.entries(lockFiles)) {
    if (existsSync(resolve(cwd(), lockFile))) {
      return pm;
    }
  }
  return "npm";
}

async function main() {
  try {
    console.log("🎉 Just Use shadcn\n");
    const pm = await detectPM();
    console.log(`📦 Using ${pm}\n`);

    console.log("1️⃣ Initializing shadcn/ui...");
    if (pm === "npm") {
      await execa("npx", ["shadcn@latest", "init", "-y"], {
        stdio: "inherit",
      });
    } else if (pm === "pnpm") {
      await execa("pnpm", ["dlx", "shadcn@latest", "init", "-y"], {
        stdio: "inherit",
      });
    } else if (pm === "yarn") {
      await execa("yarn", ["shadcn@latest", "init", "-y"], {
        stdio: "inherit",
      });
    } else if (pm === "bun") {
      await execa("bunx", ["--bun", "shadcn@latest", "init", "-y"], {
        stdio: "inherit",
      });
    }

    console.log("\n2️⃣ Adding ALL components...");
    if (pm === "npm") {
      await execa("npx", ["shadcn@latest", "add", "-a", "-y"], {
        stdio: "inherit",
      });
    } else if (pm === "pnpm") {
      await execa("pnpm", ["dlx", "shadcn@latest", "add", "-a", "-y"], {
        stdio: "inherit",
      });
    } else if (pm === "yarn") {
      await execa("yarn", ["shadcn@latest", "add", "-a", "-y"], {
        stdio: "inherit",
      });
    } else if (pm === "bun") {
      await execa("bunx", ["--bun", "shadcn@latest", "add", "-a", "-y"], {
        stdio: "inherit",
      });
    }

    console.log("\n✅ Done! Now just use shadcn 🚀");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
