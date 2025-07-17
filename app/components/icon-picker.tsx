import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import * as TablerIcons from "@tabler/icons-react";
import { cn } from "~/lib/utils";

interface IconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const iconNames = Object.keys(TablerIcons).filter((key) =>
  key.startsWith("Icon")
);
const ICONS_PER_PAGE = 50;

const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onValueChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleIcons, setVisibleIcons] = useState(ICONS_PER_PAGE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return iconNames;
    }
    return iconNames.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const iconsToRender = useMemo(() => {
    return filteredIcons.slice(0, visibleIcons);
  }, [filteredIcons, visibleIcons]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        // Load more when near the bottom
        setVisibleIcons((prev) =>
          Math.min(prev + ICONS_PER_PAGE, filteredIcons.length)
        );
      }
    }
  };

  useEffect(() => {
    setVisibleIcons(ICONS_PER_PAGE);
  }, [searchTerm]);

  const SelectedIcon =
    (TablerIcons as any)[value] || TablerIcons.IconQuestionMark;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <SelectedIcon size={16} />
            <span>{value}</span>
          </div>
          <TablerIcons.IconChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <div className="flex flex-col gap-0 items-center justify-center">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="grid grid-cols-4 gap-2 h-80 overflow-y-auto p-3"
          >
            {iconsToRender.map((iconName) => {
              const IconComponent = (TablerIcons as any)[iconName];
              return (
                <Button
                  key={iconName}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-20 w-20 p-0",
                    value === iconName && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onValueChange(iconName);
                    setIsOpen(false);
                  }}
                >
                  <IconComponent size={30} />
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
