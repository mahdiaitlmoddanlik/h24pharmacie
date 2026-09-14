"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/Icons";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({
  items,
  defaultOpenIndex = 0,
}: {
  items: FaqItem[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (defaultOpenIndex !== null && defaultOpenIndex >= 0 && defaultOpenIndex < items.length) {
      initial.add(defaultOpenIndex);
    }
    return initial;
  });

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        const answerId = `faq-answer-${i}`;
        const buttonId = `faq-btn-${i}`;

        return (
          <div
            key={i}
            className={`rounded-xl border transition-all duration-200 ${
              isOpen
                ? "border-primary/40 bg-surface shadow-xs"
                : "border-border/80 bg-surface hover:border-primary/30"
            }`}
          >
            <button
              id={buttonId}
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold text-foreground transition-colors hover:text-primary-dark sm:px-5 sm:py-4 sm:text-base rtl:text-right"
            >
              <span className="flex-1">{item.question}</span>
              <span
                className={`inline-flex shrink-0 transform transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-primary-dark" : "text-muted"
                }`}
                aria-hidden="true"
              >
                <ChevronDownIcon className="text-base sm:text-lg" />
              </span>
            </button>

            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-border/50 px-4 pb-4 pt-3 text-xs leading-relaxed text-muted sm:px-5 sm:text-sm"
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
