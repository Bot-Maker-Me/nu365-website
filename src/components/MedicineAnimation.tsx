/**
 * Decorative hero background.
 * Pure CSS animation (transform only) so it runs on the GPU instead of the JS thread.
 * Keyframes live in tailwind.config.js; animations switch off for reduced-motion users.
 */

const GRADIENT = [
  'radial-gradient(ellipse 50% 40% at 30% 40%, rgba(59,130,246,0.18), transparent 70%)',
  'radial-gradient(ellipse 45% 40% at 70% 70%, rgba(139,92,246,0.15), transparent 70%)',
].join(',');

/** A hexagonal molecule: ring of atoms around a larger central atom. */
function Molecule({ className }: { className: string }) {
  const ring = ['50,10', '85,30', '85,70', '50,90', '15,70', '15,30'];
  return (
    <svg viewBox="0 0 100 100" className={`absolute h-64 w-64 text-white opacity-10 ${className}`}>
      <polygon points={ring.join(' ')} fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {ring.map((point) => {
        const [cx, cy] = point.split(',');
        return <circle key={point} cx={cx} cy={cy} r="4" fill="currentColor" />;
      })}
    </svg>
  );
}

/** A small floating vial. `fill` is the colour of the liquid. */
function Vial({ className, fill }: { className: string; fill: string }) {
  return (
    <svg viewBox="0 0 100 150" className={`absolute animate-float opacity-20 ${className}`}>
      <rect x="35" y="10" width="30" height="20" fill="white" />
      <rect x="30" y="30" width="40" height="110" rx="5" fill="white" />
      <rect x="35" y="40" width="30" height="90" rx="3" fill={fill} opacity="0.5" />
    </svg>
  );
}

export function MedicineAnimation() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden motion-reduce:[&_*]:!animate-none">
      <div className="absolute -inset-[20%] animate-drift" style={{ background: GRADIENT }} />
      <Molecule className="left-[8%] top-[18%] animate-spin-slow" />
      <Molecule className="bottom-[10%] right-[10%] animate-spin-slow-reverse" />
      <Vial className="right-20 top-20 h-24 w-16" fill="#3B82F6" />
      <Vial className="bottom-32 left-16 h-[4.5rem] w-12 [animation-delay:1s]" fill="#8B5CF6" />
    </div>
  );
}
