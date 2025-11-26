import log from "./logging.ts";
import { ansi_color } from "./logging.ts";


const svelte_projects = {
	arya: "aryadee.dev",
	nathalie: "nathaliektherapy.com",
};

const rust_projects = {
	heifer: "heifer",
};

if (import.meta.main) {
	log.set_level(log.level.INFO);
	log.set_dir("logs", 3);

	// ensure the current directory is the repo root
	Deno.chdir(decodeURIComponent(new URL(".", import.meta.url).pathname));
	log.info("Building the project...");
	log.clear_console();

	for (const [_name, path] of Object.entries(svelte_projects)) {
		build_svelte(path);
		log.clear_console();
	}
	for (const [_name, path] of Object.entries(rust_projects)) {
		build_rust(path);
		log.clear_console();
	}
	log.info("Build complete.");
}

function build_svelte(relative_project_path: string) {
	// temporarily change directory to the project path
	const original_dir = Deno.cwd();
	Deno.chdir(relative_project_path);

	log.info(
		`Building Svelte project at ${ansi_color.blue}${relative_project_path}${ansi_color.reset}...`,
	);

	const command = new Deno.Command("deno", {
		args: ["task", "build"],
		stdout: "inherit",
		stderr: "inherit",
	});

	const output = command.outputSync();

	// change back to the original directory
	Deno.chdir(original_dir);

	if (!output.success) {
		log.error(
			`Failed to build Svelte project at ${ansi_color.blue}${relative_project_path}${ansi_color.reset}.`,
		);
		Deno.exit(1);
	} else {
		log.info(
			`Successfully built Svelte project at ${ansi_color.blue}${relative_project_path}${ansi_color.reset}.`,
		);
	}
}

function build_rust(relative_project_path: string) {
	// temporarily change directory to the project path
	const original_dir = Deno.cwd();

	Deno.chdir(relative_project_path);

	log.info(
		`Building Rust project at ${ansi_color.blue}${relative_project_path}${ansi_color.reset}...`,
	);

	const command = new Deno.Command("cargo", {
		args: ["build", "--release"],
		stdout: "inherit",
		stderr: "inherit",
	});

	const output = command.outputSync();

	// change back to the original directory
	Deno.chdir(original_dir);

	if (!output.success) {
		log.error(
			`Failed to build Rust project at ${ansi_color.blue}${relative_project_path}${ansi_color.reset}.`,
		);
		Deno.exit(1);
	} else {
		log.info(
			`Successfully built Rust project at ${ansi_color.blue}${relative_project_path}${ansi_color.reset}.`,
		);
	}
}
