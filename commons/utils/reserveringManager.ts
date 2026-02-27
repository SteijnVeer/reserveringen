import type { Reservering, ReserveringData, ReserveringManagerOptions, ReserveringUpdateListener } from '../types/reservering';

export default class ReserveringManager {
  private updateListeners: Map<number, ReserveringUpdateListener> = new Map();
  private onReserveringenUpdated() {
    for (const listener of this.updateListeners.values())
      listener(this);
  }
  public addUpdateListener(listener: ReserveringUpdateListener): number {
    const id = Math.round(Math.random() * 1000000);
    this.updateListeners.set(id, listener);
    return id;
  }
  public removeUpdateListener(id: number): boolean {
    return this.updateListeners.delete(id);
  }

  private date: string;
  private dbUrl: string;
  private apiKey: string;
  constructor({ date, dbUrl, apiKey, reserveringUpdateListener }: ReserveringManagerOptions) {
    this.date = date;
    this.dbUrl = dbUrl;
    this.apiKey = apiKey;
    if (reserveringUpdateListener)
      this.addUpdateListener(reserveringUpdateListener);
    this.fetchReserveringenData();
  }
  private reserveringenData: ReserveringData[] = [];
  private checkIfChanged(newDataJsonString: string) {
    return JSON.stringify(this.reserveringenData) !== newDataJsonString;
  }

  private fetchReserveringenData() {
    // Implement the logic to fetch reserveringen from the database using dbUrl and apiKey
    // After fetching, update this.reserveringenData and call this.onReserveringenUpdated()
    const newDataJsonString = '[]'; // response.text()
    if (!this.checkIfChanged(newDataJsonString))
      return;
    this.reserveringenData = []; // response.json()
    this.onReserveringenUpdated();
  }

  private markAsArrived(id: number) {
    // Implement logic to mark as arrived in the database
    this.fetchReserveringenData();
  }
  private markAsNotArrived(id: number) {
    // Implement logic to mark as not arrived in the database
    this.fetchReserveringenData();
  }
  private deleteReservering(id: number) {
    // Implement logic to delete the reservering from the database
    this.fetchReserveringenData();
  }
  
  public getReserveringen(): Reservering[] {
    return this.reserveringenData.map(data => ({
      ...data,
      markAsArrived: () => this.markAsArrived(data.id),
      markAsNotArrived: () => this.markAsNotArrived(data.id),
      delete: () => this.deleteReservering(data.id),
    }));
  }
}
