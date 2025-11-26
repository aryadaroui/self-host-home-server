
export const ansi_color = {
  reset: "\u001b[0m",
  gray: "\u001b[90m",
  red: "\u001b[31m",
  yellow: "\u001b[33m",
  green: "\u001b[32m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
};

enum LogLevel {
  ERROR = 0,
  WARN,
  INFO,
  DEBUG,
  TRACE,
}

const level_colors: Record<LogLevel, string> = {
  [LogLevel.ERROR]: ansi_color.red,
  [LogLevel.WARN]: ansi_color.yellow,
  [LogLevel.INFO]: ansi_color.green,
  [LogLevel.DEBUG]: ansi_color.blue,
  [LogLevel.TRACE]: ansi_color.magenta,
};

class Logger {
  public readonly level = LogLevel;
  private current_level: LogLevel = LogLevel.INFO;
  private zulu: boolean = false;
  private file_path?: string;
  private dir?: string;
  private max_files: number = 10;
  /**
   * Program name determined at startup.
   * Prefers the first CLI argument (Deno.args[0]) if present,
   * then falls back to the basename of Deno.mainModule, and finally "unknown".
   */
  private program: string = (() => {
    try {
      // Prefer first CLI argument if provided
      const arg0 = typeof Deno !== "undefined" ? Deno.args?.[0] : undefined;
      if (arg0) {
        const parts = arg0.split(/[\\/]/);
        return parts[parts.length - 1] || arg0;
      }

      // Fallback to the basename of the main module (file:///... paths)
      if (typeof Deno !== "undefined" && typeof (Deno as { mainModule?: string }).mainModule === "string") {
        try {
          const url = new URL((Deno as { mainModule?: string }).mainModule!);
          const path = url.pathname;
          const parts = path.split("/");
          return parts[parts.length - 1] || (Deno as { mainModule?: string }).mainModule!;
        } catch {
          // ignore and continue to final fallback
        }
      }

      return "unknown";
    } catch {
      return "unknown";
    }
  })();

  /** Sets the log level. */
  set_level(level: LogLevel) {
    this.current_level = level;
  }

  /** Enables Zulu (UTC) time for timestamps. */
  set_zulu() {
    this.zulu = true;
  }

  /** Sets the file path for logging. */
  set_file(path: string) {
    this.file_path = path;
  }

  /** Sets the directory for logging with optional max files for rotation. */
  set_dir(dir: string, max_files?: number) {
    this.dir = dir;
    this.max_files = max_files ?? 10;
  }

  /** Sets the program name. */
  set_program(name: string) {
    this.program = name;
  }

  /** Checks if the given log level should be logged based on the current level. */
  private should_log(level: LogLevel): boolean {
    return level <= this.current_level;
  }

  /** Generates the timestamp string for logging. */
  private get_timestamp(): string {
    const now = new Date();
    if (this.zulu) {
      return now.toISOString();
    } else {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
    }
  }

  /** Writes the log message to the configured file or directory. */
  private async write_to_file(message: string) {
    try {
      if (this.file_path) {
        await Deno.writeTextFile(this.file_path, message + '\n', { append: true });
      } else if (this.dir) {
        await Deno.mkdir(this.dir, { recursive: true });
        const date = new Date().toISOString().slice(0, 19);
        const file = `${this.dir}/${date}_${this.program}.log`;
        await Deno.writeTextFile(file, message + '\n', { append: true });
        await this.rotate_logs();
      }
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  /** Rotates log files by deleting the oldest ones if the max files limit is exceeded. */
  private async rotate_logs() {
    if (!this.dir) return;
    try {
      const entries: { name: string; mtime: Date }[] = [];
      for await (const entry of Deno.readDir(this.dir)) {
        if (entry.isFile && entry.name.endsWith('.log')) {
          const stat = await Deno.stat(`${this.dir}/${entry.name}`);
          entries.push({ name: entry.name, mtime: stat.mtime! });
        }
      }
      entries.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      if (entries.length > this.max_files) {
        for (let i = this.max_files; i < entries.length; i++) {
          try {
            await Deno.remove(`${this.dir}/${entries[i].name}`);
          } catch (error) {
            // Ignore NotFound errors - file may have already been deleted by concurrent rotation
            if (error instanceof Deno.errors.NotFound) {
              continue;
            }
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Failed to rotate logs:", error);
    }
  }

  /** Logs a message at the specified level. */
  private log(level: LogLevel, ...args: unknown[]) {
    if (!this.should_log(level)) return;
    const message = args.map(arg => typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg)).join(' ');
    const timestamp = this.get_timestamp();
    const level_str = LogLevel[level].toUpperCase().padStart(5);
    const level_color = level_colors[level];
    const colored_level = `${level_color}${level_str}${ansi_color.reset}`;
    const program = `${ansi_color.cyan}${this.program}${ansi_color.reset}`;
    const gray_timestamp = `${ansi_color.gray}${timestamp}${ansi_color.reset}`;
    const full_message = `${gray_timestamp} ${colored_level} ${program} ${message}`;
    console.log(full_message);
    this.write_to_file(`${timestamp} ${level_str} ${this.program} ${message}`);
  }

  /** Logs an error message. */
  error(...args: unknown[]) {
    this.log(LogLevel.ERROR, ...args);
  }

  /** Logs a warning message. */
  warn(...args: unknown[]) {
    this.log(LogLevel.WARN, ...args);
  }

  /** Logs an info message. */
  info(...args: unknown[]) {
    this.log(LogLevel.INFO, ...args);
  }

  /** Logs a debug message. */
  debug(...args: unknown[]) {
    this.log(LogLevel.DEBUG, ...args);
  }

  /** Logs a trace message. */
  trace(...args: unknown[]) {
    this.log(LogLevel.TRACE, ...args);
  }

  /** Clears the console without clearing scrollback */
  clear_console() {
    console.log("\u001b[2J\u001b[H");
  }
}


/**
 * Singleton logger instance for convenient logging.
 *
 * ## Usage
 *
 * Import the logger:
 * ```typescript
 * import log from "./logging.ts";
 * ```
 *
 * Configure the logger:
 * ```typescript
 * log.set_program("myapp"); // Optional: set program name
 * log.set_level(log.level.INFO); // Set log level (ERROR, WARN, INFO, DEBUG, TRACE)
 * log.set_zulu(); // Optional: use UTC time instead of local
 * log.set_file("/path/to/log.txt"); // Log to a single file
 * // Or log to a directory with rotation:
 * log.set_dir("/logs", 5); // Keep max 5 log files
 * ```
 *
 * Log messages:
 * ```typescript
 * log.error("This is an error", { key: "value" });
 * log.warn("This is a warning");
 * log.info("This is info");
 * log.debug("This is debug");
 * log.trace("This is trace");
 * ```
 *
 * Log methods accept multiple arguments like console.log, automatically formatting objects as JSON.
 *
 * ## Output Format
 * Console: `<gray timestamp> <colored level> <cyan program> <message>`
 * File: `<timestamp> <LEVEL> <program> <message>` (no colors)
 *
 * Timestamps include milliseconds. Zulu time includes 'Z' suffix.
 * Log levels are colored in console: ERROR=red, WARN=yellow, INFO=green, DEBUG=blue, TRACE=magenta.
 */
const log = new Logger();

export default log;
