'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface WarningsBoxProps {
  warnings: string[];
}

export default function WarningsBox({ warnings }: WarningsBoxProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!warnings || warnings.length === 0 || dismissed) {
    return null;
  }

  return (
    <div className="relative rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded-full p-1 text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50"
        aria-label="Dismiss warnings"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            Important Notices
          </h3>
          <ul className="mt-2 space-y-1">
            {warnings.map((warning, index) => (
              <li
                key={index}
                className="text-sm text-amber-700 dark:text-amber-300"
              >
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
