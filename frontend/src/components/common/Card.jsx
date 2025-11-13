import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = true }) => {
  const content = (
    <div className={`bg-dark-800 rounded-lg shadow-xl border border-dark-700 ${className}`}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
};

export default Card;