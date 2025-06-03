'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Define Particle class outside so it can be used by connectParticles
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5; // Smaller particles for better performance
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * 0.3 - 0.15;
    
    // Using deeper hues of blue and purple for a more cyberpunk feel
    const colors = [
      'rgba(59, 130, 246, 0.25)',  // Blue
      'rgba(124, 58, 237, 0.25)',  // Purple
      'rgba(79, 70, 229, 0.25)',   // Indigo
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off edges
    if (this.x > canvasWidth || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvasHeight || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Define AuroraParticle class outside as well
class AuroraParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  time: number;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight - Math.random() * (canvasHeight * 0.5);
    this.vx = Math.random() * 0.05 - 0.025;
    this.vy = -Math.random() * 0.1 - 0.05;
    this.radius = Math.random() * 2 + 1;
    
    // Cyberpunk aurora colors
    const colors = [
      'rgba(66, 211, 170, 0.3)',  // Cyan
      'rgba(111, 76, 255, 0.3)',  // Purple
      'rgba(66, 153, 225, 0.3)',  // Blue
      'rgba(236, 72, 153, 0.3)'   // Pink
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.time = Math.random() * 100;
  }
  
  update(canvasWidth: number, canvasHeight: number) {
    this.time += 0.01;
    this.x += this.vx + Math.sin(this.time * 0.1) * 0.2;
    this.y += this.vy;
    
    // Wrap around
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;
  }
}

// Enhanced animated background component
const AnimatedBackground = () => {
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    setIsMounted(true);
    
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particle arrays
    const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000)); // Dynamic count based on screen size
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
    
    // Create aurora particles
    const auroraCount = 200;
    const auroraParticles: AuroraParticle[] = [];
    for (let i = 0; i < auroraCount; i++) {
      auroraParticles.push(new AuroraParticle(canvas.width, canvas.height));
    }
    
    // Animation variables
    let angle = 0;
    
    // Performance optimization: Use requestAnimationFrame with throttling on slower devices
    let lastTime = 0;
    const fps = 30; // Target fps
    const fpsInterval = 1000 / fps;
    
    // Animation loop
    const animate = (timestamp: number) => {
      // Throttle frame rate on slower devices
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp - (elapsed % fpsInterval);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw aurora borealis effect
      drawAurora(ctx, canvas.width, canvas.height, angle);
      
      // Update and draw aurora particles
      auroraParticles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
      });
      
      // Draw subtle grid pattern
      angle += 0.001; // Slower animation
      drawGrid(ctx, canvas.width, canvas.height, angle);
      
      // Draw and update particles
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });
      
      // Connect nearby particles
      connectParticles(particles, ctx);
      
      // Draw floating shapes
      drawFloatingShapes(ctx, canvas.width, canvas.height, angle);
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Only render on client side to avoid hydration mismatch
  if (!isMounted) return null;
  
  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

// New function to draw aurora borealis effect
const drawAurora = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
  // Create a gradient background for aurora
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(12, 12, 14, 0)');
  gradient.addColorStop(1, 'rgba(9, 9, 12, 0.4)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw multiple aurora waves
  const auroraColors = [
    [0, 10, 20, 0.02],    // Deep blue base
    [66, 211, 170, 0.04], // Cyan
    [111, 76, 255, 0.03], // Purple
    [66, 153, 225, 0.04], // Blue
    [236, 72, 153, 0.03]  // Pink
  ];
  
  auroraColors.forEach((color, i) => {
    const amplitude = height * 0.1 + i * 5;
    const frequency = 0.002 - i * 0.0002;
    const timeOffset = time + i * 10;
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Draw aurora wave with perlin noise like effect
    for (let x = 0; x < width; x += 3) {
      const normalizedX = x / width;
      const normalizedY = Math.sin((x * frequency) + timeOffset) * 0.5 + 0.5;
      const y = height - normalizedY * amplitude - 
                Math.sin((x * 0.01) + (timeOffset * 0.2)) * (amplitude * 0.2);
      
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.closePath();
    
    // Create gradient for each aurora wave
    const waveGradient = ctx.createLinearGradient(0, 0, 0, height);
    waveGradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] * 2})`);
    waveGradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
    waveGradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
    
    ctx.fillStyle = waveGradient;
    ctx.fill();
  });
};

// Helper function to draw grid (refined for subtlety)
const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
  const gridSize = 70; // Larger grid cells
  const lineWidth = 0.3; // Thinner lines
  
  ctx.strokeStyle = 'rgba(75, 85, 99, 0.07)'; // More subtle grid
  ctx.lineWidth = lineWidth;
  
  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Animated diagonal line (just one for better performance)
  ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
  ctx.lineWidth = 0.5;
  
  ctx.beginPath();
  const diagonalY = Math.sin(angle * 0.5) * height;
  ctx.moveTo(0, height - diagonalY);
  ctx.lineTo(width, diagonalY);
  ctx.stroke();
};

// Helper function to draw floating shapes (optimized)
const drawFloatingShapes = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
  // Draw fewer shapes based on screen size
  const shapesCount = Math.min(3, Math.max(1, Math.floor(width / 500)));
  
  if (shapesCount >= 1) {
    // Draw circle with glow effect
    const circleX = width * 0.2 + Math.sin(angle * 0.5) * 30;
    const circleY = height * 0.3 + Math.cos(angle * 0.6) * 30;
    const circleSize = Math.min(120, width * 0.15) + Math.sin(angle) * 10;
    
    // Create radial gradient for glow effect
    const gradient = ctx.createRadialGradient(
      circleX, circleY, 0,
      circleX, circleY, circleSize
    );
    gradient.addColorStop(0, 'rgba(66, 153, 225, 0.2)');
    gradient.addColorStop(0.5, 'rgba(66, 153, 225, 0.1)');
    gradient.addColorStop(1, 'rgba(66, 153, 225, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  if (shapesCount >= 2) {
    // Draw hexagon with glow
    ctx.fillStyle = 'rgba(124, 58, 237, 0.08)';
    const hexX = width * 0.7 + Math.cos(angle * 0.3) * 20;
    const hexY = height * 0.7 + Math.sin(angle * 0.4) * 20;
    const hexSize = Math.min(80, width * 0.1) + Math.sin(angle * 1.2) * 8;
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const hexAngle = (Math.PI / 3) * i;
      const x = hexX + hexSize * Math.cos(hexAngle + angle * 0.1);
      const y = hexY + hexSize * Math.sin(hexAngle + angle * 0.1);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }
  
  if (shapesCount >= 3) {
    // Draw triangle with pulse effect
    const triOpacity = (Math.sin(angle * 2) + 1) * 0.04 + 0.04; // Pulsing opacity
    ctx.fillStyle = `rgba(236, 72, 153, ${triOpacity})`;
    
    const triX = width * 0.4 + Math.sin(angle * 0.4) * 25;
    const triY = height * 0.2 + Math.cos(angle * 0.3) * 25;
    const triSize = Math.min(100, width * 0.12);
    
    ctx.beginPath();
    ctx.moveTo(triX, triY - triSize/2);
    ctx.lineTo(triX + triSize/2, triY + triSize/2);
    ctx.lineTo(triX - triSize/2, triY + triSize/2);
    ctx.closePath();
    ctx.fill();
  }
};

// Helper function to connect particles (optimized)
const connectParticles = (particles: Particle[], ctx: CanvasRenderingContext2D) => {
  const maxDistance = Math.min(150, window.innerWidth * 0.1); // Dynamic connection distance
  
  // Only connect a subset of particles for better performance
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j += 2) { // Skip every other particle
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        // Opacity based on distance
        const opacity = (1 - (distance / maxDistance)) * 0.15; // Lower max opacity
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
};

// New helper function to draw animated waves (optimized)
const drawWaves = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
  // Use fewer waves and points for better performance
  const waveColors = [
    'rgba(79, 70, 229, 0.05)',
    'rgba(124, 58, 237, 0.04)'
  ];
  
  waveColors.forEach((color, i) => {
    const amplitude = 40 + i * 15;
    const period = 0.008 - i * 0.001;
    const offsetY = height * (0.5 + i * 0.2);
    const offsetAngle = i * Math.PI / 4;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Use larger step for better performance
    const step = Math.max(5, Math.floor(width / 200));
    for (let x = 0; x < width; x += step) {
      const y = Math.sin((x * period) + angle + offsetAngle) * amplitude + offsetY;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  });
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Hide navbar and footer
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formControls = [
    {
      id: 'email-address',
      name: 'email',
      type: 'email',
      autoComplete: 'email',
      placeholder: 'Email address',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      className: "rounded-t-md"
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      autoComplete: 'current-password',
      placeholder: 'Password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      className: "rounded-b-md"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-['Inter',sans-serif] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 z-0"></div>
      
      {/* Animated glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Centered content */}
      <motion.div
        className="max-w-md w-full relative z-10"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        {/* Logo with pulsing animation */}
        <motion.div 
          className="flex justify-center"
          variants={slideUp}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Pulsing rings */}
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-70 blur-sm"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.2, 0.7]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-60 blur-md"
              animate={{ 
                scale: [1.1, 1.3, 1.1],
                opacity: [0.6, 0.1, 0.6]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_30px_rgba(99,102,241,0.5)] relative z-10">
              R
            </div>
          </div>
        </motion.div>
        
        {/* Form container */}
        <motion.div 
          className="mt-8 bg-[#0a0a0a]/80 backdrop-blur-md p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] border border-gray-800"
          variants={slideUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div variants={slideUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-center text-3xl font-extrabold text-white mb-1">
              Welcome Back
            </h2>
            <p className="text-center text-sm text-gray-400 mb-6">
              Sign in to your account
            </p>
          </motion.div>
          
          {error && (
            <motion.div 
              className="mb-6 bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg relative"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-px">
              {formControls.map((control, index) => (
                <motion.div
                  key={control.id}
                  variants={slideUp}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <label htmlFor={control.id} className="sr-only">
                    {control.placeholder}
                  </label>
                  <input
                    id={control.id}
                    name={control.name}
                    type={control.type}
                    autoComplete={control.autoComplete}
                    required
                    value={control.value}
                    onChange={control.onChange}
                    className={`appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-400 bg-[#1a1a1a] text-white ${control.className} focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:z-10 text-base transition-all duration-300 hover:border-gray-500`}
                    placeholder={control.placeholder}
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center"
                variants={slideUp}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 bg-[#1a1a1a] border-gray-700 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </motion.div>

              <motion.div
                variants={slideUp}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </motion.div>
            </div>

            <motion.div
              variants={slideUp}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:scale-[1.02] transition-all duration-300"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Sign in"}
              </button>
            </motion.div>
            
            <motion.div 
              className="text-center mt-6"
              variants={slideUp}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
      
      {/* Add style for blob animation */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}