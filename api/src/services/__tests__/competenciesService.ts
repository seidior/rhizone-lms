import {
  countCompetencies,
  listCompetencies,
  createCompetency,
} from '../competenciesService';
import { mockQuery } from '../mockDb';

describe('competenciesService', () => {
  describe('countCompetencies', () => {
    it('should count all the competencies in the database', async () => {
      const competenciesCount = 2;
      mockQuery(
        'select count(*) as `total_count` from `competencies`',
        [],
        [{ total_count: competenciesCount }]
      );
      expect(await countCompetencies()).toEqual(competenciesCount);
    });
  });

  describe('listCompetencies', () => {
    it('should query the lists of the competencies in the database with their labels and descriptions', async () => {
      const competencies = [
        {
          id: 2,
          label: 'label',
          description: 'description',
        },
      ];
      const limit = 3;
      const offset = 4;
      mockQuery(
        'select `id`, `label`, `description` from `competencies` order by `label` asc, `id` asc limit ? offset ?',
        [limit, offset],
        competencies
      );
      expect(await listCompetencies(limit, offset)).toEqual(competencies);
    });
  });

  describe('createCompetency', () => {
    it('should create a competency and model competency in a transaction', async () => {
      const principalId = 2;
      const label = 'label';
      const description = 'description';
      const competencyId = 3;
      const model_competency_id = 4;
      mockQuery('BEGIN;');
      mockQuery(
        'insert into `competencies` (`description`, `label`, `principal_id`) values (?, ?, ?)',
        [description, label, principalId],
        [competencyId]
      );
      mockQuery(
        'insert into `model_competencies` (`competency_id`, `principal_id`) values (?, ?)',
        [competencyId, principalId],
        [model_competency_id]
      );
      mockQuery('COMMIT;');
      expect(await createCompetency(principalId, label, description)).toEqual({
        id: competencyId,
      });
    });
  });
});