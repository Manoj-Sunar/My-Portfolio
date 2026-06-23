import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = React.memo(({ level = 1, className = '', children, ...props }) => {
  const Tag = `h${level}` as any;
  
  const baseStyles = {
    1: 'text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white',
    2: 'text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white',
    3: 'text-xl sm:text-2xl font-bold text-slate-900 dark:text-white',
    4: 'text-lg sm:text-xl font-bold text-slate-900 dark:text-white',
    5: 'text-base font-bold text-slate-900 dark:text-white',
    6: 'text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400',
  }[level] || '';

  return (
    <Tag className={`${baseStyles} ${className}`} {...props}>
      {children}
    </Tag>
  );
});

Heading.displayName = 'Heading';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export const Paragraph: React.FC<ParagraphProps> = React.memo(({ className = '', children, ...props }) => {
  return (
    <p className={`text-slate-600 dark:text-slate-400 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
});

Paragraph.displayName = 'Paragraph';

interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children: React.ReactNode;
}

export const Span: React.FC<SpanProps> = React.memo(({ className = '', children, ...props }) => {
  return (
    <span className={`${className}`} {...props}>
      {children}
    </span>
  );
});

Span.displayName = 'Span';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = React.memo(({ className = '', children, ...props }) => {
  return (
    <label className={`block text-xs font-bold text-slate-705 dark:text-slate-350 uppercase tracking-wide ${className}`} {...props}>
      {children}
    </label>
  );
});

Label.displayName = 'Label';

