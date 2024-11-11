'use client';

import { HTMLMotionProps, motion } from 'framer-motion';

type ComponentProps = JSX.IntrinsicElements['div'] &
  HTMLMotionProps<'div'> & { duration?: number; delay?: number };

export function FadeUp({ duration, delay, ...props }: ComponentProps) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0, scale: 0.99 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ amount: 0.3, once: true }}
      transition={{ ease: 'easeOut', delay: delay || 0.3, duration: duration || 0.25 }}
      {...props}
    />
  );
}

export function FadeDown({ duration, delay, ...props }: ComponentProps) {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0, scale: 0.99 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ amount: 0.3, once: true }}
      transition={{ ease: 'easeOut', delay: delay || 0.3, duration: duration || 0.25 }}
      {...props}
    />
  );
}
