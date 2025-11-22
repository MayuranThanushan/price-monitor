import React from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// Clean replacement for Section without stray literal \n artifact.
export function SectionClean({ title, description, actions, children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`w-full ${className}`}>
      {(title || actions || description) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight text-brandBlack/90">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-500 leading-relaxed max-w-prose">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export default SectionClean;
