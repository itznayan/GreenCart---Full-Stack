import { motion } from "motion/react";
import { useEffect, useState } from "react";

const Layer = (WrappedComponent) => {
  const LayerComponent = (props) => {
    const [showLayer, setShowLayer] = useState(true);

    const parentVariants = {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };

    const getChildVariants = (delay) => ({
      hidden: { opacity: 1, scaleY: 1 },
      visible: {
        opacity: 1,
        scaleY: 0,
        transition: { duration: 0.6, delay },
      },
      exit: {
        scaleY: 1,
        transition: { duration: 0.6 },
      },
    });

    return (
      <>
        {showLayer && (
          <motion.div
            className="fixed inset-0 h-full w-full flex  gap-0 z-[100000] pointer-events-none"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={parentVariants}
            onAnimationComplete={() => {
              // Hide the layer after animation completes
              setTimeout(() => setShowLayer(false), 100);
            }}
          >
            {" "}
            {/* First child (left side) */}
            <motion.div
              className="bg-black h-full flex-1 origin-top"
              variants={getChildVariants(0)}
            ></motion.div>
            {/* Second child */}
            <motion.div
              className="bg-black h-full flex-1 origin-top"
              variants={getChildVariants(0.15)}
            ></motion.div>
            {/* Third child */}
            <motion.div
              className="bg-black h-full flex-1 origin-top"
              variants={getChildVariants(0.3)}
            ></motion.div>
            {/* Fourth child */}
            <motion.div
              className="bg-black h-full flex-1 origin-top"
              variants={getChildVariants(0.45)}
            ></motion.div>
          </motion.div>
        )}

        <WrappedComponent {...props} />
      </>
    );
  };

  LayerComponent.displayName = `Layer(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return LayerComponent;
};

export default Layer;
