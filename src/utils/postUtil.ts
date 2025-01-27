import { CreatedFilter } from "../globals";

export const addDateRangeFilter = (
  field: CreatedFilter,
  filter: { start: string; end: string }
) => ({
  [field]: { gte: new Date(filter.start), lte: new Date(filter.end) }
});
