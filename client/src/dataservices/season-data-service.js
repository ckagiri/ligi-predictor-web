import { DataService } from './data-service';

export class SeasonDataService extends DataService {
  constructor() {
    super('Season', '/leagues/:leagueSlug/seasons', '/seasons')
  }

  fetchSeasons(leagueSlug) {
    return super.getAll({ leagueSlug });
  }

  fetchSeasonEntities(leagueSlug, seasonSlug) {
    return super.getAll({ leagueSlug, seasonSlug }, '/:seasonSlug/entities')
  }
}

export const seasonDataService = new SeasonDataService();
