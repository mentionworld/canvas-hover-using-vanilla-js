window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx =canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // const image1= document.getElementById('image1');

    class Particle {
        constructor (effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            // this.y = Math.random() * this.effect.height;
            this.y = 0;
            // this.x = x;
            // this.y = y;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.color = color;
            // this.size = 4;
            this.size = this.effect.gap;
            // this.vx = Math.random() * 2 - 1;
            this.vx = 0;
            // this.vy = Math.random() * 2 - 1;
            this.vy = 0;
            this.ease = .2;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
            this.friction = .95;
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size);
        }
        update () {

            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance =  this.dx * this.dx + this.dy * this.dy; 
            this.force = - this.effect.mouse.radius / this.distance;

            if(this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle); 
                this.vy += this.force * Math.sin(this.angle);
            }

            // this.x += this.vx;
            // this.y += this.vy;

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y +=  (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }

        wrap () {
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            // this.ease = .05;
        }
    }

    class Effect {
        constructor(width, height) {
            this.height = height;
            this.width = width;
            this.particlesArray = [];
            this.image = document.getElementById('image1');
            this.centerX = this.width * .5;
            this.centerY = this.height * .5;
            this.x = this.centerX - this.image.width * .5;
            this.y = this.centerY - this.image.height * .5;
            this.gap = 3;

            this.mouse = {
                radius: 3000,
                x: undefined,
                y: undefined
            }
            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y =  event.y;
                // console.log(this.mouse.x, this.mouse.y);
            });
        }
        init(context) {
            // for(let i = 0; i < 100; i++) {
            //     this.particlesArray.push(new Particle(this));
            // }
            context.drawImage(this.image, this.x, this.y);
            const pixels = context.getImageData(0, 0, this.width, this.height).data;
            for( let y = 0; y < this.height; y += this.gap) {
                for( let x = 0; x < this.width; x +=this.gap) {
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const alpha = pixels[index + 3];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    if(alpha > 0) {
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }
            }
        }

        draw(context) {
            this.particlesArray.forEach(particle => particle.draw(context));
        }
        update() {
            this.particlesArray.forEach(particle => particle.update());
        }

        wrap() {
            this.particlesArray.forEach(particle => particle.wrap());

        }
    }

    const effect = new Effect(canvas.width, canvas.height);
    effect.init(ctx);
    // effect.draw(ctx);
    // effect.update();

    // console.log(effect.particlesArray);
    // const particle1 = new Particle();
    
    // particle1.draw();
    function animate () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.draw(ctx);
        effect.update();
        requestAnimationFrame(animate);
    }
    animate();

    // ctx.fillRect(120, 100, 100, 200);
    // ctx.drawImage(image1, 100, 100);


    const wrapButton = this.document.getElementById('wrapButton');
    wrapButton.addEventListener('click', function() {
        effect.wrap();
    });
});