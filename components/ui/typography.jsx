import React from 'react';

export function Header({ level = 1, children, className, centered = false }) {
  const levels = {
    1: {
      Component: 'h1',
      classes: 'text-3xl font-bold tracking-tight text-gray-900',
    },
  };

  const { Component, classes } = levels[level];

  return (
    <Component
      className={`${classes} ${className}`}
      style={{ textAlign: centered && 'center' }}
    >
      {children}
    </Component>
  );
}

export function Paragraph({ level, children }) {
  const levels = {
    1: {
      Component: 'p',
    },
  };

  const { Component } = levels[level];

  return <Component>{children}</Component>;
}
