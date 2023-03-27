import { mockQuery } from '../mockDb';

import {
  constructFacilitatorAssessmentSummary,
  constructParticipantAssessmentSummary,
  createAssessmentSubmission,
  createCurriculumAssessment,
  createProgramAssessment,
  deleteCurriculumAssessment,
  deleteProgramAssessment,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listParticipantProgramAssessmentSubmissions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../assessmentsService';

import {
  assessmentResponsesRowGraded,
  assessmentSubmissionsRowGraded,
  exampleAssessmentSubmissionGraded,
  exampleProgramAssessment,
  exampleProgramAssessmentsRow,
  exampleProgramParticipantRoleFacilitatorRow,
  exampleProgramParticipantRoleParticipantRow,
  facilitatorPrincipalId,
  participantPrincipalId,
  matchingCurriculumAssessmentRows,
  curriculumAssessmentId,
  matchinglistAssessmentQuestionsRows,
  matchinglistAssessmentQuestionsRow,
  istAssessmentAnswers,
  assessmenttype,
  matchingCurriculumAssessmentRowsWithType,
} from '../../assets/data';

describe('assessmentsService', () => {
  describe('constructFacilitatorAssessmentSummary', () => {});

  describe('constructParticipantAssessmentSummary', () => {});

  describe('createAssessmentSubmission', () => {});

  describe('createCurriculumAssessment', () => {});

  describe('createProgramAssessment', () => {});

  describe('deleteCurriculumAssessment', () => {});

  describe('deleteProgramAssessment', () => {});

  describe('getAssessmentSubmission', () => {
    it('should get assessment submission based on given submission ID', async () => {
      const assessmentSubmissionId = exampleAssessmentSubmissionGraded.id;
      const responsesIncluded = true;
      const gradingsIncluded = true;

      mockQuery(
        'select `assessment_id`, `principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
        [assessmentSubmissionId],
        [assessmentSubmissionsRowGraded]
      );

      mockQuery(
        'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
        [assessmentSubmissionId],
        [assessmentResponsesRowGraded]
      );

      expect(
        await getAssessmentSubmission(
          assessmentSubmissionId,
          responsesIncluded,
          gradingsIncluded
        )
      ).toEqual(exampleAssessmentSubmissionGraded);
    });
  });

  describe('findProgramAssessment', () => {
    it('should get program assessment for a given program assessment ID', async () => {
      mockQuery(
        'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
        [exampleProgramAssessment.id],
        [exampleProgramAssessmentsRow]
      );

      expect(await findProgramAssessment(exampleProgramAssessment.id)).toEqual(
        exampleProgramAssessment
      );
    });
  });

  describe('getPrincipalProgramRole', () => {
    it('should return the correct role for a facilitator based on principal ID and program ID', async () => {
      mockQuery(
        'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
        [facilitatorPrincipalId, exampleProgramAssessment.program_id],
        [exampleProgramParticipantRoleFacilitatorRow]
      );

      expect(
        await getPrincipalProgramRole(
          facilitatorPrincipalId,
          exampleProgramAssessment.program_id
        )
      ).toEqual('Facilitator');
    });

    it('should return the correct role for a participant based on principal ID and program ID', async () => {
      mockQuery(
        'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
        [participantPrincipalId, exampleProgramAssessment.program_id],
        [exampleProgramParticipantRoleParticipantRow]
      );

      expect(
        await getPrincipalProgramRole(
          participantPrincipalId,
          exampleProgramAssessment.program_id
        )
      ).toEqual('Participant');
    });
  });

  describe('getCurriculumAssessment', () => {
    it('should select curriculum assessment based on given programAssessmentId', async () => {
      const questionsAndAllAnswersIncluded = true,
        questionsAndCorrectAnswersIncluded = true;

      mockQuery(
        'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
        [curriculumAssessmentId],
        [matchingCurriculumAssessmentRows]
      );
      mockQuery(
        'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
        [matchingCurriculumAssessmentRows.activity_id],
        [assessmenttype]
      );
      mockQuery(
        'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ?',
        [curriculumAssessmentId],
        [matchinglistAssessmentQuestionsRow]
      );

      mockQuery(
        'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` in (?)',
        [matchinglistAssessmentQuestionsRow.id],
        [istAssessmentAnswers]
      );

      expect(
        await getCurriculumAssessment(
          curriculumAssessmentId,
          questionsAndAllAnswersIncluded,
          questionsAndCorrectAnswersIncluded
        )
      ).toEqual(matchinglistAssessmentQuestionsRows);
    });
  });

  describe('listParticipantProgramAssessmentSubmissions', () => {});

  describe('listPrincipalEnrolledProgramIds', () => {});

  describe('listProgramAssessments', () => {});

  describe('updateAssessmentSubmission', () => {});

  describe('updateCurriculumAssessment', () => {});

  describe('updateProgramAssessment', () => {});
});
