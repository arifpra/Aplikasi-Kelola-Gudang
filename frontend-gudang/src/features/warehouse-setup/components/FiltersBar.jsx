import { Search } from 'lucide-react';
import Input from '../../../shared/ui/Input';

export default function FiltersBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  leftSlot = null,
  rightSlot = null,
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_auto] md:items-end">
      <div className="flex flex-wrap items-end gap-3">
        {leftSlot}
        <div className="relative min-w-[220px] flex-1">
          <Input
            label="Search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-10"
          />
          <Search className="pointer-events-none absolute left-3 top-[42px]" size={16} color="#64748B" />
        </div>
      </div>
      <div className="flex items-end justify-start md:justify-end">{rightSlot}</div>
    </div>
  );
}
