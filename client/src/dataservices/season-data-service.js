import { DataService } from './data-service';

export class SeasonDataService extends DataService {
  constructor() {
    super('Season', '/:leagueSlug/seasons', '/seasons')
  }

  fetchSeasons(leagueSlug) {
    return super.getList({ leagueSlug });
  }

  fetchSeasonEntities(leagueSlug) {
    return super.getList({ leagueSlug }, '/entities')
  }
}

export const seasonDataService = new SeasonDataService();
