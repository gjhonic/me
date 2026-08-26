(() => {
	'use strict';

	const VIEW_W = 1600;
	const VIEW_H = 240;
	const GROUND_Y = 170;
	const GRAVITY = 2000;
	const JUMP_VELOCITY = 620;
	const PLAYER_X = 100;
	const PLAYER_W = 40;
	const PLAYER_H = 66;
	const BASE_SPEED = 500;
	const MAX_SPEED = 1000;
	const SPEED_RAMP = 13;
	const MIN_GAP = 390;
	const MAX_GAP = 760;
	const HI_KEY = 'gjhonicRunnerHi';

	const OBSTACLE_TYPES = ['goomba', 'invader', 'ghost', 'spiketurtle'];

	const HILL_BASE_SPEED = 18;
	const CLOUD_BASE_SPEED = 8;
	const HILL_TILE_W = 400;
	const CLOUD_TILE_W = 500;

	let canvas, ctx, section, scoreEl, hiEl;
	let sectionInView = false;
	let lastTime = 0;

	const state = {
		mode: 'idle', // idle | running | gameOver
		elapsed: 0,
		score: 0,
		hi: 0,
	};

	let player = { y: 0, vy: 0, onGround: true, animT: 0 };
	const bg = { hills: 0, clouds: 0 };
	let obstacles = [];
	let distSinceSpawn = 0;
	let nextGap = randGap();

	function randGap() {
		return MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);
	}

	function resetPlayer() {
		player = { y: GROUND_Y - PLAYER_H, vy: 0, onGround: true, animT: 0 };
	}

	function startRun() {
		state.mode = 'running';
		state.elapsed = 0;
		state.score = 0;
		obstacles = [];
		distSinceSpawn = 0;
		nextGap = randGap();
		resetPlayer();
	}

	function jump() {
		if (player.onGround) {
			player.vy = -JUMP_VELOCITY;
			player.onGround = false;
		}
	}

	function handleAction() {
		if (state.mode === 'idle' || state.mode === 'gameOver') {
			startRun();
		} else if (state.mode === 'running') {
			jump();
		}
	}

	function currentSpeed() {
		return Math.min(MAX_SPEED, BASE_SPEED + state.elapsed * SPEED_RAMP);
	}

	function spawnObstacle() {
		const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
		const sizes = {
			goomba: { w: 44, h: 44 },
			invader: { w: 47, h: 39 },
			ghost: { w: 42, h: 50 },
			spiketurtle: { w: 47, h: 42 },
		};
		const s = sizes[type];
		obstacles.push({ type, x: VIEW_W + 20, w: s.w, h: s.h, y: GROUND_Y - s.h });
	}

	function aabbOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
		return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
	}

	function update(dt) {
		const parallaxSpeed = state.mode === 'running' ? currentSpeed() : 0;
		bg.hills -= (HILL_BASE_SPEED + parallaxSpeed * 0.08) * dt;
		bg.clouds -= (CLOUD_BASE_SPEED + parallaxSpeed * 0.03) * dt;

		if (state.mode !== 'running') {
			player.animT += dt;
			player.y = GROUND_Y - PLAYER_H + Math.sin(player.animT * 2.4) * 3;
			return;
		}

		state.elapsed += dt;
		const speed = currentSpeed();
		state.score += speed * dt * 0.045;

		player.vy += GRAVITY * dt;
		player.y += player.vy * dt;
		if (player.y >= GROUND_Y - PLAYER_H) {
			player.y = GROUND_Y - PLAYER_H;
			player.vy = 0;
			player.onGround = true;
		} else {
			player.onGround = false;
		}
		player.animT += dt;

		distSinceSpawn += speed * dt;
		if (distSinceSpawn >= nextGap) {
			distSinceSpawn = 0;
			nextGap = randGap();
			spawnObstacle();
		}

		for (let i = obstacles.length - 1; i >= 0; i--) {
			const o = obstacles[i];
			o.x -= speed * dt;
			if (o.x + o.w < -10) {
				obstacles.splice(i, 1);
				continue;
			}
			const inset = 8;
			if (
				aabbOverlap(
					PLAYER_X + inset, player.y + inset, PLAYER_W - inset * 2, PLAYER_H - inset * 2,
					o.x + inset, o.y + inset, o.w - inset * 2, o.h - inset * 2
				)
			) {
				endRun();
				break;
			}
		}

		scoreEl.textContent = pad(Math.floor(state.score));
	}

	function endRun() {
		state.mode = 'gameOver';
		const finalScore = Math.floor(state.score);
		if (finalScore > state.hi) {
			state.hi = finalScore;
			localStorage.setItem(HI_KEY, String(state.hi));
			hiEl.textContent = pad(state.hi);
		}
	}

	function pad(n) {
		return String(Math.max(0, n)).padStart(5, '0');
	}

	/* ---------------- Rendering ---------------- */
	function drawParallaxTile(offset, tileWidth, drawTile) {
		let x = (offset % tileWidth) - tileWidth;
		while (x < VIEW_W) {
			ctx.save();
			ctx.translate(x, 0);
			drawTile();
			ctx.restore();
			x += tileWidth;
		}
	}

	function drawPixelMountain(cx, baseY, width, height) {
		const steps = 5;
		for (let i = 0; i < steps; i++) {
			const w = width * (1 - i / steps);
			const y = baseY - (height * (i + 1)) / steps;
			ctx.fillRect(cx - w / 2, y, w, height / steps + 1);
		}
	}

	function drawHillsTile() {
		ctx.fillStyle = '#AAB9CC';
		drawPixelMountain(70, GROUND_Y, 140, 60);
		drawPixelMountain(260, GROUND_Y, 110, 42);
		ctx.fillStyle = '#8E9FB6';
		drawPixelMountain(170, GROUND_Y, 100, 38);
	}

	function drawPixelCloud(cx, cy) {
		ctx.fillRect(cx - 18, cy, 40, 10);
		ctx.fillRect(cx - 10, cy - 8, 24, 8);
		ctx.fillRect(cx + 6, cy - 4, 16, 6);
	}

	function drawCloudsTile() {
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		drawPixelCloud(70, 30);
		drawPixelCloud(320, 52);
	}

	function drawGround() {
		ctx.fillStyle = '#379B3B';
		ctx.fillRect(0, GROUND_Y, VIEW_W, 8);
		ctx.fillStyle = '#9C2A1B';
		ctx.fillRect(0, GROUND_Y + 8, VIEW_W, VIEW_H - GROUND_Y - 8);
	}

	function drawPlayer() {
		const x = PLAYER_X;
		const y = player.y;
		const running = state.mode === 'running' && player.onGround;
		const legSwing = running ? Math.sin(player.animT * 16) * 6 : 0;

		ctx.save();
		ctx.translate(x + PLAYER_W / 2, y);

		// legs (dark pants) + shoes
		ctx.fillStyle = '#232838';
		ctx.fillRect(-12, 52, 9, 10 - legSwing * 0.3);
		ctx.fillRect(3, 52, 9, 10 + legSwing * 0.3);
		ctx.fillStyle = '#111318';
		ctx.fillRect(-12, 62, 9, 4);
		ctx.fillRect(3, 62, 9, 4);

		// plaid jacket sleeves
		ctx.fillStyle = '#C4000D';
		ctx.fillRect(-20, 28, 6, 20);
		ctx.fillRect(14, 28, 6, 20);
		ctx.fillStyle = '#181818';
		ctx.fillRect(-20, 36, 6, 3);
		ctx.fillRect(14, 36, 6, 3);

		// plaid jacket torso (red/black buffalo check)
		ctx.fillStyle = '#C4000D';
		ctx.fillRect(-16, 26, 32, 28);
		ctx.fillStyle = '#181818';
		ctx.fillRect(-16, 34, 32, 4);
		ctx.fillRect(-16, 46, 32, 4);
		ctx.fillRect(-2, 26, 4, 28);

		// black undershirt collar
		ctx.fillStyle = '#181818';
		ctx.fillRect(-6, 20, 12, 10);

		// neck + face (skin)
		ctx.fillStyle = '#E8B48C';
		ctx.fillRect(-6, 18, 12, 6);
		ctx.fillRect(-11, 2, 22, 20);
		ctx.fillStyle = '#D9A379';
		ctx.fillRect(9, 10, 4, 6);

		// messy brown hair
		ctx.fillStyle = '#3A2A1E';
		ctx.fillRect(-13, -8, 26, 12);
		ctx.fillRect(-15, -2, 6, 10);
		ctx.fillRect(9, -4, 8, 12);
		ctx.fillRect(-4, -12, 14, 8);

		ctx.restore();
	}

	function drawObstacle(o) {
		const cx = o.x + o.w / 2;
		ctx.save();
		ctx.translate(cx, o.y);
		switch (o.type) {
			case 'goomba': {
				ctx.fillStyle = '#8B4A2B';
				ctx.beginPath();
				ctx.ellipse(0, o.h * 0.45, o.w / 2, o.h * 0.45, 0, Math.PI, 0);
				ctx.fill();
				ctx.fillRect(-o.w / 2, o.h * 0.45, o.w, o.h * 0.35);
				ctx.fillStyle = '#3A2213';
				ctx.fillRect(-o.w / 2 + 2, o.h - 6, 8, 6);
				ctx.fillRect(o.w / 2 - 10, o.h - 6, 8, 6);
				ctx.fillStyle = '#fff';
				ctx.fillRect(-8, o.h * 0.35, 6, 6);
				ctx.fillRect(2, o.h * 0.35, 6, 6);
				break;
			}
			case 'invader': {
				ctx.fillStyle = '#2C7A2F';
				ctx.fillRect(-o.w / 2, 4, o.w, o.h - 8);
				ctx.fillRect(-o.w / 2 - 4, 10, 6, 8);
				ctx.fillRect(o.w / 2 - 2, 10, 6, 8);
				ctx.fillRect(-o.w / 2 + 4, o.h - 4, 6, 6);
				ctx.fillRect(o.w / 2 - 10, o.h - 4, 6, 6);
				ctx.fillStyle = '#fff';
				ctx.fillRect(-8, 10, 5, 5);
				ctx.fillRect(3, 10, 5, 5);
				break;
			}
			case 'ghost': {
				ctx.fillStyle = 'rgba(255,255,255,0.95)';
				ctx.beginPath();
				ctx.arc(0, o.h * 0.4, o.w / 2, Math.PI, 0);
				ctx.lineTo(o.w / 2, o.h);
				for (let i = 0; i < 3; i++) {
					ctx.lineTo(o.w / 2 - (i + 0.5) * (o.w / 3), o.h - 6);
					ctx.lineTo(o.w / 2 - (i + 1) * (o.w / 3), o.h);
				}
				ctx.lineTo(-o.w / 2, o.h * 0.4);
				ctx.closePath();
				ctx.fill();
				ctx.fillStyle = '#333';
				ctx.fillRect(-8, o.h * 0.3, 5, 6);
				ctx.fillRect(3, o.h * 0.3, 5, 6);
				break;
			}
			case 'spiketurtle': {
				ctx.fillStyle = '#2C7A2F';
				ctx.beginPath();
				ctx.ellipse(0, o.h * 0.5, o.w / 2, o.h * 0.5, 0, Math.PI, 0);
				ctx.fill();
				ctx.fillRect(-o.w / 2, o.h * 0.5, o.w, o.h * 0.3);
				ctx.fillStyle = '#1A1A1A';
				for (let i = -1; i <= 1; i++) {
					ctx.beginPath();
					ctx.moveTo(i * 10 - 4, o.h * 0.3);
					ctx.lineTo(i * 10, o.h * 0.05);
					ctx.lineTo(i * 10 + 4, o.h * 0.3);
					ctx.closePath();
					ctx.fill();
				}
				ctx.fillStyle = '#0f4d12';
				ctx.fillRect(-o.w / 2 + 2, o.h - 6, 7, 6);
				ctx.fillRect(o.w / 2 - 9, o.h - 6, 7, 6);
				break;
			}
			default:
				break;
		}
		ctx.restore();
	}

	function render() {
		ctx.clearRect(0, 0, VIEW_W, VIEW_H);
		drawParallaxTile(bg.clouds, CLOUD_TILE_W, drawCloudsTile);
		drawParallaxTile(bg.hills, HILL_TILE_W, drawHillsTile);
		drawGround();
		obstacles.forEach(drawObstacle);
		drawPlayer();

		if (state.mode === 'idle') {
			drawCenterText('НАЖМИ SPACE ИЛИ ТАПНИ');
		} else if (state.mode === 'gameOver') {
			drawCenterText('GAME OVER');
		}
	}

	function drawCenterText(text) {
		ctx.save();
		ctx.fillStyle = 'rgba(26,26,26,0.85)';
		ctx.textAlign = 'center';
		ctx.font = '12px "Press Start 2P", monospace';
		ctx.fillText(text, VIEW_W / 2, VIEW_H * 0.32);
		ctx.restore();
	}

	function loop(ts) {
		if (!lastTime) lastTime = ts;
		let dt = (ts - lastTime) / 1000;
		lastTime = ts;
		if (dt > 1 / 30) dt = 1 / 30;

		update(dt);
		render();

		requestAnimationFrame(loop);
	}

	function wireInput() {
		window.addEventListener('keydown', (e) => {
			if (!sectionInView) return;
			if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') {
				e.preventDefault();
				handleAction();
			}
		});

		canvas.addEventListener('pointerdown', (e) => {
			e.preventDefault();
			handleAction();
		});
	}

	function init() {
		canvas = document.getElementById('runnerCanvas');
		ctx = canvas.getContext('2d');
		section = document.getElementById('runnerSection');
		scoreEl = document.getElementById('runnerScore');
		hiEl = document.getElementById('runnerHi');

		state.hi = Number(localStorage.getItem(HI_KEY) || 0);
		hiEl.textContent = pad(state.hi);
		scoreEl.textContent = pad(0);

		resetPlayer();
		wireInput();

		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(
				(entries) => entries.forEach((entry) => { sectionInView = entry.isIntersecting; }),
				{ threshold: 0.3 }
			);
			io.observe(section);
		} else {
			sectionInView = true;
		}

		requestAnimationFrame(loop);
	}

	document.addEventListener('DOMContentLoaded', init);
})();
