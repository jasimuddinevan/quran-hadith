import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface Word {
  id: number;
  position: number;
  text_uthmani: string;
  char_type_name: 'word' | 'end';
  translation?: { text: string };
  transliteration?: { text: string };
}

interface WordPopoverProps {
  word: Word;
  isHighlighted: boolean;
  onWordClick?: () => void;
  children: React.ReactNode;
}

const WordPopover: React.FC<WordPopoverProps> = ({
  word,
  isHighlighted,
  onWordClick,
  children,
}) => {
  // Don't show popover for end markers (verse numbers)
  if (word.char_type_name === 'end') {
    return <>{children}</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild onClick={onWordClick}>
        <span
          className={`quran-word ${isHighlighted ? 'highlighted' : ''}`}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="center" side="top">
        <div className="text-center space-y-3">
          {/* Arabic word - large */}
          <p className="arabic-text text-3xl text-primary">
            {word.text_uthmani}
          </p>
          
          {/* Transliteration */}
          {word.transliteration?.text && (
            <p className="text-sm italic text-muted-foreground">
              {word.transliteration.text}
            </p>
          )}
          
          {/* Translation */}
          {word.translation?.text && (
            <p className="text-sm font-medium text-foreground border-t pt-2">
              {word.translation.text}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WordPopover;
