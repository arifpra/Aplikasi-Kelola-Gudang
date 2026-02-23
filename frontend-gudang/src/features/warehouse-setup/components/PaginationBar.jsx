import Button from '../../../shared/ui/Button';

const limitOptions = [10, 25, 50];

export default function PaginationBar({ total = 0, limit = 10, offset = 0, onLimitChange, onOffsetChange }) {
  const canPrev = offset > 0;
  const canNext = offset + limit < total;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePrev = () => {
    if (!canPrev) return;
    onOffsetChange(Math.max(0, offset - limit));
  };

  const handleNext = () => {
    if (!canNext) return;
    onOffsetChange(offset + limit);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Rows per page</span>
        <select
          className="rounded-2xl border px-3 py-2 text-sm"
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
        >
          {limitOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button type="button" variant="secondary" onClick={handlePrev} disabled={!canPrev}>
          Prev
        </Button>
        <Button type="button" variant="secondary" onClick={handleNext} disabled={!canNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
