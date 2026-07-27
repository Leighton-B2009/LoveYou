(() => {
    function start() {
        // Clear page
        document.body.innerHTML = "";

        // Page styling
        Object.assign(document.documentElement.style, {
            margin: "0",
            width: "100%",
            height: "100%",
            background: "#000"
        });

        Object.assign(document.body.style, {
            margin: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            background: "#000"
        });

        // Create canvas
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        Object.assign(canvas.style, {
            position: "fixed",
            inset: "0",
            width: "100%",
            height: "100%",
            display: "block",
            background: "#000"
        });

        const ctx = canvas.getContext("2d");

        let width;
        let height;
        let points = [];

        // ❤️ Heart equation
        function heart(t) {
            return {
                x: 16 * Math.pow(Math.sin(t), 3),

                y:
                    13 * Math.cos(t) -
                    5 * Math.cos(2 * t) -
                    2 * Math.cos(3 * t) -
                    Math.cos(4 * t)
            };
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createHeart();
        }

        function createHeart() {
            points = [];

            /*
             * Increase this for MORE "I love you" text.
             * 900 works well on most phones.
             */
            const amount = 900;

            for (let i = 0; i < amount; i++) {
                const t = Math.random() * Math.PI * 2;

                const p = heart(t);

                /*
                 * Random value fills the entire inside
                 * of the heart instead of only the edge.
                 */
                const fill = Math.sqrt(Math.random());

                points.push({
                    x: p.x * fill,
                    y: p.y * fill,

                    // Animation starts randomly
                    startX: (Math.random() - 0.5) * width * 1.5,
                    startY: (Math.random() - 0.5) * height * 1.5,

                    delay: Math.random() * 1500,
                    speed: 800 + Math.random() * 1000
                });
            }
        }

        function easeOutCubic(x) {
            return 1 - Math.pow(1 - x, 3);
        }

        const startTime = performance.now();

        function draw(time) {
            ctx.clearRect(0, 0, width, height);

            // Black background
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);

            /*
             * Makes the heart take up most
             * of the phone screen.
             */
            const scale = Math.min(
                width / 37,
                height / 34
            );

            const centerX = width / 2;

            // Slightly higher than centre
            const centerY = height / 2 - height * 0.03;

            // Heartbeat after formation
            const elapsed = time - startTime;

            let pulse = 1;

            if (elapsed > 2200) {
                const beat = Math.sin(elapsed * 0.005);

                pulse =
                    1 +
                    Math.pow(
                        Math.max(0, beat),
                        10
                    ) * 0.035;
            }

            // Text settings
            const fontSize = Math.max(
                6,
                Math.min(width, height) * 0.014
            );

            ctx.font =
                `bold ${fontSize}px Arial, sans-serif`;

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            for (const point of points) {
                let progress =
                    (elapsed - point.delay) /
                    point.speed;

                progress = Math.max(
                    0,
                    Math.min(1, progress)
                );

                progress = easeOutCubic(progress);

                // Final heart position
                const finalX =
                    centerX +
                    point.x *
                    scale *
                    pulse;

                const finalY =
                    centerY -
                    point.y *
                    scale *
                    pulse;

                // Animate from random position
                const x =
                    centerX +
                    point.startX * (1 - progress) +
                    (finalX - centerX) * progress;

                const y =
                    centerY +
                    point.startY * (1 - progress) +
                    (finalY - centerY) * progress;

                // Fade in
                ctx.globalAlpha = progress;

                // Mostly pink with occasional bright text
                if (Math.random() > 0.97) {
                    ctx.fillStyle = "#ffffff";
                } else {
                    ctx.fillStyle = "#ff4f9a";
                }

                ctx.fillText(
                    "I love you",
                    x,
                    y
                );
            }

            ctx.globalAlpha = 1;

            requestAnimationFrame(draw);
        }

        resize();

        window.addEventListener(
            "resize",
            resize
        );

        requestAnimationFrame(draw);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            start
        );
    } else {
        start();
    }
})();