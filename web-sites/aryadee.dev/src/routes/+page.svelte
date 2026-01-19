<!-- <script context="module">
	export const prerender = true;
</script> -->

<script>
	let hobbies = [
		'a person from planet earth',
		'n-dimensional array lover',
		'visualization enthusiast',
		'dataframe wizard',
		'spaghetti code chef',
		'workflow optimizer',
		'parallelization desirer',
		'signal processing nerd',
		'fake film photographer',
		'Java disliker',
		'Python lover',
		'TypeScript fan',
		'Rust evangelist',
		'big data explorer',
		'music maker',
		'graduate degree waster',
		'email replier',
		'sadistic tester',
		'circuit solderer',
		'tape loop maker',
		'pedal builder',
		'reverb inundator',
		'video game hoarder',
		// 'keyboard collector',
		'synth experimentalist',
		'jazzmaster fiddler',
		'tube amp denier',
		'data structure over thinker',
		'FFT admirer',
		'UNIX apologist',
		'server desirer',
		'RISC-V believer',
		'Intel GPU hoper',
		'web assembly dreamer',
		'Windows begrudger',
		'web standard abuser',
		'WebGPU waiter',
		'SCSS truster',
		'SvelteKit aficionado',
		'React denier',
		'JS framework skeptic',
		'prod destroyer',
		// 'VS Code zealot',
		'vim tolerator',
		'git command forgetter',
		'machine teacher',
		'tabs enjoyer',
		'snake_case_user',
		'table joiner',
		'violin plot fanatic',
		'gaussian respecter',
		'typography appreciator',
		'dark mode demander',
		'GUI designer',
		'UI tinkerer',
		'UX critic',
		'color palette maker',
		'kanban tasker',
		'commit overwriter',
		'Rust evangelist',
		'PR reviewer',
		'GitHub star collector',
		'diagram drawer',
		'math explainer',
		'self-host-er',
		'lowercase lover',
		'air cooling preferer',
		'segfault debugger',
		'readme skimmer',
		'protobuf serializer',
		'cache invalidator',
		'version bumper',
		'issue opener',
		'signal decoder',
		'protcol designer',
		'linter appeaser',
	];

	let hobby_idx = $state(0);

	// randomly choose index every 1.5 seconds
	setInterval(() => {
		hobby_idx = Math.floor(Math.random() * hobbies.length);
	}, 1500);
</script>

<title>aryadee</title>

<main>
	<h1>arya<span class="accent">dee</span></h1>
	<p>computer engineer. spacecraft software developer. <br /> {hobbies[hobby_idx]}.</p>
	<p>
		<a href="https://photos.aryadee.dev">photos</a> | <span class="dead">blog</span> |
		<span class="dead">projects</span>
		| <span class="dead">creative</span>
	</p>

	<p class="tiny">
		I am now self-hosting this blog. I'll migrate the rest of the content at some point.
		<br />
		<br />
		<!-- Please be gentle. This is running on a very small computer. -->
	</p>
</main>

<style lang="scss">
	@use '../lib/styles/main.scss';
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.accent {
		color: main.$accent-color;
	}

	.tiny {
		font-size: 0.9rem;
	}

	h1 {
		font-size: 2rem;
	}

	p {
		font-size: 1.5rem;
		text-align: center;
	}
</style>
