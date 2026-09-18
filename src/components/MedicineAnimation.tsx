import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function MedicineAnimation() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating particles - reduced for better performance
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(ellipse 70% 50% at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 70%, rgba(139,92,246,0.12) 0%, transparent 60%), #050505',
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 30% 80%, rgba(139,92,246,0.15) 0%, transparent 60%), #050505',
            'radial-gradient(ellipse 70% 50% at 70% 30%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 60%, rgba(139,92,246,0.12) 0%, transparent 60%), #050505',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0"
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + particle.delay,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Molecular structure animations */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {/* Hexagonal molecular structure */}
          <polygon
            points="200,100 250,150 250,220 200,270 150,220 150,150"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="200" cy="185" r="15" fill="white" />
          <circle cx="150" cy="150" r="8" fill="white" />
          <circle cx="250" cy="150" r="8" fill="white" />
          <circle cx="150" cy="220" r="8" fill="white" />
          <circle cx="250" cy="220" r="8" fill="white" />
          <circle cx="200" cy="270" r="8" fill="white" />
        </motion.g>

        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80% 60%' }}
        >
          {/* Another molecular structure */}
          <polygon
            points="600,200 650,250 650,320 600,370 550,320 550,250"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="600" cy="285" r="12" fill="white" />
          <circle cx="550" cy="250" r="6" fill="white" />
          <circle cx="650" cy="250" r="6" fill="white" />
          <circle cx="550" cy="320" r="6" fill="white" />
          <circle cx="650" cy="320" r="6" fill="white" />
          <circle cx="600" cy="370" r="6" fill="white" />
        </motion.g>
      </svg>

      {/* Floating vials/medicine bottles */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-48 opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <rect x="35" y="10" width="30" height="20" fill="white" />
          <rect x="30" y="30" width="40" height="110" rx="5" fill="white" />
          <rect x="35" y="40" width="30" height="90" rx="3" fill="#3B82F6" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 w-24 h-36 opacity-15"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <rect x="35" y="10" width="30" height="20" fill="white" />
          <rect x="30" y="30" width="40" height="110" rx="5" fill="white" />
          <rect x="35" y="40" width="30" height="90" rx="3" fill="#8B5CF6" opacity="0.5" />
        </svg>
      </motion.div>

      {/* DNA helix animation */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <motion.path
          d="M0,300 Q100,250 200,300 T400,300 T600,300 T800,300 T1000,300"
          stroke="white"
          strokeWidth="2"
          fill="none"
          animate={{
            d: [
              'M0,300 Q100,250 200,300 T400,300 T600,300 T800,300 T1000,300',
              'M0,300 Q100,350 200,300 T400,300 T600,300 T800,300 T1000,300',
              'M0,300 Q100,250 200,300 T400,300 T600,300 T800,300 T1000,300',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0,300 Q100,350 200,300 T400,300 T600,300 T800,300 T1000,300"
          stroke="white"
          strokeWidth="2"
          fill="none"
          animate={{
            d: [
              'M0,300 Q100,350 200,300 T400,300 T600,300 T800,300 T1000,300',
              'M0,300 Q100,250 200,300 T400,300 T600,300 T800,300 T1000,300',
              'M0,300 Q100,350 200,300 T400,300 T600,300 T800,300 T1000,300',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Pulsing medical cross */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-16 h-16 opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="40" y="20" width="20" height="60" fill="white" />
          <rect x="20" y="40" width="60" height="20" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
}