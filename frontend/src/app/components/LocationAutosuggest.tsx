import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

interface LocationAutosuggestProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  onEnter: () => void;
  suggestions: string[];
  excludeValues?: string[];
  placeholder?: string;
}

export function LocationAutosuggest({
  value,
  onChange,
  onSelect,
  onEnter,
  suggestions,
  excludeValues = [],
  placeholder,
}: LocationAutosuggestProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const query = value.trim().toLowerCase();
  const excluded = new Set(excludeValues.map((v) => v.toLowerCase()));
  const filtered = suggestions
    .filter((s) => !excluded.has(s.toLowerCase()))
    .filter((s) => !query || s.toLowerCase().includes(query));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setOpen(false);
            onEnter();
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filtered.map((location) => (
            <button
              type="button"
              key={location}
              onClick={() => {
                onSelect(location);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#00AEEF]/10"
            >
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
