import { DataService } from './data-service';

export class LeaguesService extends DataService {
  constructor() {
    super('League', '/leagues')
  }
}

export const leaguesService = new LeaguesService();
