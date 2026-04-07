import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

export function StatsCard({ value, label, prefix = '', suffix = '' }: StatsCardProps) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/,/g, ''));

  useEffect(() => {
    if (isNaN(target)) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
        {prefix}
        {isNaN(target) ? value : count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-gray-600 text-lg">{label}</div>
    </motion.div>
  );
}
