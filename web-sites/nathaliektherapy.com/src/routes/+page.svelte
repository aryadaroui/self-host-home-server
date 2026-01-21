<svelte:head>
	<title>Nathalie Kaoumi</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@300;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="page">
	<section class="card">
		<div class="hero">
			<img src="/me.jpeg" alt="Portrait of Nathalie Kaoumi" />
			<div class="identity">
				<h1>Nathalie Kaoumi</h1>
				<p class="credentials">Marriage & Family Therapist Associate, MA, AMFT #145289</p>
				<p class="credentials-secondary">Supervised by Nancy Caltagirone, M.A., LMFT MFC4714</p>
				<dl class="details">
					<div class="detail">
						<dt>Phone</dt>
						<dd><a href="tel:9495290522">(949) 529-0522</a></dd>
					</div>
					<div class="detail">
						<dt>Email</dt>
						<dd>
							<a href="mailto:nathaliekaoumi.therapy@gmail.com">nathaliekaoumi.therapy@gmail.com</a>
						</dd>
					</div>
					<div class="detail">
						<dt>Location</dt>
						<dd>Orange County, CA</dd>
					</div>
				</dl>
			</div>
		</div>

		<div class="bio">
			<p>
				Check out my Psychology Today profile for more information about my therapeutic
				approach and the populations I work with.
			</p>
			<a
				class="cta"
				href="https://www.psychologytoday.com/us/therapists/nathalie-kaoumi-tustin-ca/1342988"
				target="_blank"
				rel="noreferrer"
			>
				Psychology Today profile
			</a>
		</div>
	</section>
</main>

<style>
	:global(:root) {
		--ink: #1a2a2f;
		--muted: #5b6b73;
		--accent: #c97b63;
		--paper: #f6f2ee;
		--glow: #f3d7c7;
	}

	:global(body) {
		margin: 0;
		font-family: 'Manrope', sans-serif;
		color: var(--ink);
		background:
			radial-gradient(900px 600px at 10% 90%, rgba(117, 170, 198, 0.28) 0%, transparent 62%),
			radial-gradient(1200px 700px at 85% 0%, #fbe8dd 0%, transparent 60%),
			linear-gradient(160deg, #f6f2ee 0%, #f0ede8 50%, #f7f4f0 100%);
		min-height: 100vh;
	}

	.page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 56px 20px;
	}

	.card {
		width: min(920px, 100%);
		background: var(--paper);
		border-radius: 28px;
		padding: 48px;
		box-shadow: 0 24px 60px rgba(27, 37, 44, 0.12);
		position: relative;
		overflow: hidden;
		animation: rise 800ms ease both;
	}

	.card::before {
		content: '';
		position: absolute;
		top: -120px;
		right: -80px;
		width: 260px;
		height: 260px;
		background: radial-gradient(circle, var(--glow) 0%, rgba(243, 215, 199, 0) 70%);
		opacity: 0.8;
		pointer-events: none;
	}

	.hero {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 32px;
		align-items: center;
	}

	img {
		width: 100%;
		display: block;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		border-radius: 20px;
		box-shadow: 0 18px 40px rgba(31, 33, 36, 0.18);
		animation: rise 900ms ease 120ms both;
	}

	.identity {
		min-width: 0;
	}

	h1 {
		margin: 0 0 10px;
		font-family: 'Fraunces', serif;
		font-size: clamp(2rem, 3vw, 2.8rem);
		letter-spacing: 0.5px;
	}

	.credentials {
		margin: 0;
		font-size: 0.95rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		overflow-wrap: anywhere;
	}

	.credentials-secondary {
		margin: 6px 0 0;
		font-size: 0.88rem;
		letter-spacing: 0.02em;
		color: rgba(91, 107, 115, 0.85);
		overflow-wrap: anywhere;
	}

	.details {
		margin: 10px 0 0;
		display: grid;
		gap: 6px;
		font-size: 0.95rem;
		color: var(--muted);
		min-width: 0;
	}

	.detail {
		margin: 0;
		display: grid;
		grid-template-columns: 90px 1fr;
		gap: 10px;
		align-items: baseline;
	}

	dt {
		margin: 0;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-size: 0.78rem;
		color: rgba(91, 107, 115, 0.8);
	}

	dd {
		margin: 0;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.details a {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid rgba(91, 107, 115, 0.4);
		padding-bottom: 2px;
		transition:
			color 200ms ease,
			border-color 200ms ease;
		overflow-wrap: anywhere;
	}

	.details a:hover {
		color: var(--ink);
		border-color: rgba(26, 42, 47, 0.6);
	}

	.bio {
		margin-top: 32px;
		border-top: 1px solid rgba(91, 107, 115, 0.2);
		padding-top: 24px;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--muted);
	}

	.bio p {
		margin: 0 0 18px;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		text-decoration: none;
		color: var(--accent);
		border-bottom: 2px solid rgba(201, 123, 99, 0.4);
		padding-bottom: 4px;
		transition:
			color 200ms ease,
			border-color 200ms ease;
	}

	.cta:hover {
		color: #a8614d;
		border-color: rgba(168, 97, 77, 0.6);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 720px) {
		.card {
			padding: 32px 24px;
		}

		.hero {
			grid-template-columns: 1fr;
		}

		img {
			width: min(100%, 320px);
			margin: 0 auto;
		}

		.detail {
			grid-template-columns: 1fr;
			gap: 2px;
		}

		.credentials {
			letter-spacing: 0.06em;
		}
	}
</style>
