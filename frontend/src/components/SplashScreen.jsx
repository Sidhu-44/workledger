// // SplashScreen.jsx
// //
// // In-app startup animation shown while React mounts and auth state is
// // restored. Pairs with a native Android/iOS splash screen that should use
// // the same #081A33 background so there's no color flash at the handoff.
// //
// // Usage:
// //   <SplashScreen isReady={authRestored} />
// //   render this once at the root of the app, above your router/providers.
// //   `isReady` should flip to true once auth state has finished restoring.

// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";

// import logo from "../assets/logo.png";

// const BACKGROUND_COLOR = "#081A33";
// const GLOW_COLOR = "rgba(56, 189, 248, 0.35)"; // soft cyan

// // The splash stays visible at least this long even if `isReady` resolves
// // instantly, so the intro animation is never clipped mid-motion.
// const MIN_VISIBLE_MS = 2200;
// const EXIT_DURATION_S = 0.9;

// // Cinematic "expo out" curve -- decelerates smoothly, no spring physics.
// const PREMIUM_EASE = [0.16, 1, 0.3, 1];

// // The whole card animates as ONE timeline: fade+scale in, then 2-3
// // decreasing "click" bounces as it settles -- done with tween keyframes
// // (not spring), so the motion stays smooth and controlled rather than loose.
// // Keyframes: enter -> overshoot -> settle -> tiny overshoot -> rest.
// // const CARD_SCALE_KEYFRAMES = [0.85, 1.06, 0.97, 1.02, 0.99, 1];
// const CARD_SCALE_KEYFRAMES = [
//   0.86,
//   1.03,
//   0.995,
//   1.01,
//   1,
// ];
// const CARD_SCALE_TIMES = [0, 0.32, 0.5, 0.66, 0.82, 1];
// const CARD_TOTAL_DURATION = 1.4; // seconds, covers entrance + all clicks

// // Logo/glow fade in during the card's initial entrance, then ride along
// // with the rest of the settle since they're children of the card.
// const CONTENT_FADE_DURATION = 0.5;

// export default function SplashScreen({ isReady = false }) {
//   const [visible, setVisible] = useState(true);
//   const [mountedAt] = useState(() => Date.now());

//   useEffect(() => {
//     if (!isReady) return;

//     const elapsed = Date.now() - mountedAt;
//     const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
//     const timer = setTimeout(() => setVisible(false), remaining);
//     return () => clearTimeout(timer);
//   }, [isReady, mountedAt]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           key="splash"
//           className="fixed inset-0 z-[9999] flex items-center justify-center"
//           style={{ backgroundColor: BACKGROUND_COLOR }}
//           // Exit: full, dramatic zoom-out + fade -- the whole splash pulls
//           // away into the app rather than just nudging bigger.
//           exit={{ opacity: 0, scale: 1.9 }}
//           transition={{ duration: EXIT_DURATION_S, ease: PREMIUM_EASE }}
//         >
//           {/* Outlined "floating glass" container */}
//           <motion.div
//             className="relative flex items-center justify-center rounded-[28px] border border-white/15 bg-transparent shadow-2xl"
//             style={{
//     boxShadow:
//       "0 18px 50px rgba(0,0,0,.45), 0 0 30px rgba(56,189,248,.12)",
// }}
//             style={{ width: 150, height: 150 }}
//             initial={{ opacity: 0, scale: 0.85 }}
//             animate={{ opacity: 1, scale: CARD_SCALE_KEYFRAMES }}
//             transition={{
//               opacity: { duration: CONTENT_FADE_DURATION, ease: PREMIUM_EASE },
//               scale: { duration: CARD_TOTAL_DURATION, times: CARD_SCALE_TIMES, ease: "easeInOut" },
//             }}
//           >
//             <motion.div
//               aria-hidden
//               className="absolute rounded-full"
//               style={{
//                 width: 190,
//                 height: 190,
//                 background: `radial-gradient(circle, ${GLOW_COLOR} 0%, rgba(56,189,248,0) 70%)`,
//                 filter: "blur(22px)",
//               }}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               transition={{ duration: CONTENT_FADE_DURATION, ease: PREMIUM_EASE, delay: 0.15 }}
//             />

//             <motion.img
//               src={logo}
//               alt="WorkMate"
//               className="relative w-24 h-24 select-none pointer-events-none"
//               draggable={false}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: CONTENT_FADE_DURATION, ease: PREMIUM_EASE, delay: 0.15 }}
//             />
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }


import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const BACKGROUND_COLOR = "#081A33";
const GLOW_COLOR = "rgba(56,189,248,0.22)";

const MIN_VISIBLE_MS = 2200;
const EXIT_DURATION_S = 0.7;

const PREMIUM_EASE = [0.16, 1, 0.3, 1];

const CARD_SCALE_KEYFRAMES = [
  0.82,
  1.08,
  0.94,
  1.04,
  0.985,
  1.015,
  1,
];

const CARD_SCALE_TIMES = [
  0,
  0.20,
  0.40,
  0.60,
  0.78,
  0.92,
  1,
];

const CARD_TOTAL_DURATION = 1.75;
const CONTENT_FADE_DURATION = 0.55;

export default function SplashScreen({ isReady = false }) {
  const [visible, setVisible] = useState(true);
  const [mountedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!isReady) return;

    const elapsed = Date.now() - mountedAt;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    const timer = setTimeout(() => {
      setVisible(false);
    }, remaining);

    return () => clearTimeout(timer);
  }, [isReady, mountedAt]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundColor: BACKGROUND_COLOR,
          }}
          exit={{
  opacity:0,
  scale:1.35,
}}


          transition={{
            duration: EXIT_DURATION_S,
            ease: PREMIUM_EASE,
          }}
        >
          <motion.div
            className="relative flex items-center justify-center rounded-[30px] border border-white/10"
            style={{
              width: 150,
              height: 150,
              boxShadow:
"0 25px 80px rgba(0,0,0,.55), 0 0 50px rgba(56,189,248,.12)",
            }}
            initial={{
              opacity: 0,
              scale: 0.86,
              y: 22,
            }}
            animate={{
              opacity: 1,
              scale: CARD_SCALE_KEYFRAMES,
              y: 0,
            }}
            transition={{
              opacity: {
                duration: CONTENT_FADE_DURATION,
                ease: PREMIUM_EASE,
              },
              y: {
                duration: 0.8,
                ease: PREMIUM_EASE,
              },
              scale: {
                duration: CARD_TOTAL_DURATION,
                times: CARD_SCALE_TIMES,
                ease: "easeInOut",
              },
            }}
          >
            <motion.div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 220,
                height: 220,
                background: `radial-gradient(circle, ${GLOW_COLOR} 0%, rgba(56,189,248,0) 72%)`,
                filter: "blur(24px)",
              }}
              initial={{
  opacity: 0,
  scale: 0.6,
}}

animate={{
  opacity: [0, 0.55, 0.42],
  scale: [0.6, 1.15, 1],
}}


              transition={{
                duration: 0.9,
                ease: PREMIUM_EASE,
                delay: 0.1,
              }}
            />

            <motion.img
  src={logo}
  alt="WorkMate"
  className="relative w-28 h-28 select-none pointer-events-none"
  draggable={false}
  initial={{
    opacity: 0,
    scale: 0.78,
  }}
  animate={{
    opacity: 1,
    scale: [
      0.78,
      1.08,
      0.96,
      1.03,
      0.99,
      1,
    ],
  }}
  transition={{
    duration: 1.45,
    delay: 0.12,
    ease: "easeInOut",
  }}
/>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}