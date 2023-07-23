export interface FilterOption {
  optionName: string;
  optionIdentifier: string;
}

export interface Filter {
  filterType: string;
  options: FilterOption[];
}
