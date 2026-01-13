import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="frosted-card rounded-3xl overflow-hidden border border-white/70"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/80 transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-slate-900">{item.question}</span>
            <ChevronDown
              size={20}
              className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ml-4 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 pb-6 text-slate-600 border-t border-white/60 bg-white/60">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
