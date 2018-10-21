import { DataService } from './data-service';

export class LeagueDataService extends DataService {
  constructor() {
    super('League', '/leagues')
  }

  fetchLeagues() {
    return this.getAll();
  }
}

export const leagueDataService = new LeagueDataService();
