export interface Option {
  value: string | undefined;
  label: string | undefined;
  isLeaf?: boolean;
  loading?: boolean;
  children?: Option[];
  disabled?: boolean;
}
