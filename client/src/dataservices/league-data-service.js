import { DataService } from './data-service';

export class LeagueDataService extends DataService {
  constructor() {
    super('League', '/leagues')
  }
}

export const leagueDataService = new LeagueDataService();
