import type { Branded } from './generic';

export type DateString = Branded<string, 'DateString'>; // Format: YYYY-MM-DD
export type TimeString = Branded<string, 'TimeString'>; // Format: HH:mm
export type ReserveringId = Branded<number, 'ReserveringId'>;
export type TableNumber = Branded<number, 'TableNumber'>;

export type ReserveringData = {
  id: ReserveringId;
  branch: string;
  name: string;
  date: DateString;
  time: TimeString;
  table: TableNumber;
  hasArrived: boolean;
  numberOfPeople: number;
  numberOfChildren: number;
  numberOfChildrenUnder3: number;
  details: string;
  notes: string[];
  tags: string[];
};

export type Reservering = Readonly<ReserveringData & {
  markAsArrived: () => void;
  markAsNotArrived: () => void;
  delete: () => void;
  // methods for updating the reservering can be added here
}>;

declare class ReserveringManager {}

export type ReserveringUpdateListener = (reserveringManager: ReserveringManager) => void;

export interface ReserveringManagerOptions {
  date: DateString;
  dbUrl: string;
  apiKey: string;
  reserveringUpdateListener?: ReserveringUpdateListener;
}
