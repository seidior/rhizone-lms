import { listCompetencies, createCompetency } from '../competenciesService';
import { mockQuery } from '../mockDb';

describe('competenciesService', () => {
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
        'select `id`, `label`, `description` from `competencies` limit ? offset ?',
        [limit, offset],
        competencies
      );
      expect(await listCompetencies(limit, offset)).toEqual(competencies);
    });
  });

  describe('createCompetency', () => {
    it('should create a given competency in the system', async () => {
      const principalId = 2;
      const label = 'label';
      const description = 'description';
      const competencyId = 3;
      mockQuery(
        'insert into `competencies` (`description`, `label`, `principal_id`) values (?, ?, ?)',
        [description, label, principalId],
        [competencyId]
      );
      expect(await createCompetency(principalId, label, description)).toEqual({
        id: competencyId,
      });
    });
  });
});
