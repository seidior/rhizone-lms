import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as ReactRouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useContext, useState } from 'react';

import { EntityId, Meeting as APIMeeting } from '../types/api';
import { formatDate, formatTime } from '../helpers/dateTime';
import SessionContext from './SessionContext';
import useApiData from '../helpers/useApiData';

interface MeetingQuickViewProps {
  meeting: APIMeeting;
}

const MeetingQuickView = ({ meeting }: MeetingQuickViewProps) => {
  const { principalId } = useContext(SessionContext);
  const [changedMeetingNoteIds, setChangedMeetingNoteIds] = useState<
    EntityId[]
  >([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSavingMeetingNote, setIsSavingMeetingNote] = useState(false);
  const [isSuccessIndicated, setIsSuccessIndicated] = useState(false);
  const [meetingNoteText, setMeetingNoteText] = useState('');
  const [saveMeetingNoteError, setSaveMeetingNoteError] = useState(null);

  const { data: meetingWithNotes, error } = useApiData<APIMeeting>({
    deps: [changedMeetingNoteIds],
    path: `/meetings/${meeting.id}`,
    sendCredentials: true,
  });
  if (error) {
    return <div>There was an error loading the meeting.</div>;
  }
  if (!meetingWithNotes) {
    return null;
  }
  const currentParticipantId = meetingWithNotes.participants.find(
    ({ principal_id }) => principal_id === principalId
  )?.id;
  let nextMeetingNoteSortOrder = 1;
  for (let i = meetingWithNotes.meeting_notes.length - 1; i >= 0; i--) {
    const meetingNote = meetingWithNotes.meeting_notes[i];
    if (meetingNote.agenda_owning_participant_id === currentParticipantId) {
      nextMeetingNoteSortOrder = meetingNote.sort_order + 1;
      break;
    }
  }
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingMeetingNote(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings/${meeting.id}/notes`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agenda_owning_participant_id: currentParticipantId,
        note_text: meetingNoteText,
        sort_order: nextMeetingNoteSortOrder,
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingMeetingNote(false);
        setSaveMeetingNoteError(error || null);
        if (data) {
          setMeetingNoteText('');
          setIsSuccessIndicated(true);
          setTimeout(() => {
            setIsSuccessIndicated(false);
          }, 2000);
          setChangedMeetingNoteIds([...changedMeetingNoteIds, data.id]);
        }
      })
      .catch(error => {
        setIsSavingMeetingNote(false);
        setSaveMeetingNoteError(error);
      });
  };
  return (
    <Accordion
      expanded={isExpanded}
      onChange={(event, newIsExpanded) => setIsExpanded(newIsExpanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '&:hover': {
            backgroundColor: 'grey.200',
          },
        }}
      >
        <MuiLink
          component={ReactRouterLink}
          to={`/meetings/${meeting.id}`}
          underline="none"
          sx={{ color: 'text.primary' }}
          onClick={event => {
            event.stopPropagation();
          }}
        >
          <Typography>Meeting on {formatDate(meeting.starts_at)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatTime(meeting.starts_at)}
          </Typography>
        </MuiLink>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack spacing={1}>
            {meetingWithNotes.meeting_notes.map(
              (meetingNote, index, meetingNotes) => (
                <React.Fragment key={meetingNote.id}>
                  {(index === 0 ||
                    meetingNote.agenda_owning_participant_id !==
                      meetingNotes[index - 1].agenda_owning_participant_id) && (
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {meetingNote.agenda_owning_participant_id === null
                        ? 'Action items'
                        : meetingNote.agenda_owning_participant_id ===
                          currentParticipantId
                        ? 'My agenda items'
                        : 'Their agenda items'}
                    </Typography>
                  )}
                  <Typography variant="body2" pl={1}>
                    {meetingNote.note_text}
                  </Typography>
                </React.Fragment>
              )
            )}
          </Stack>
          <form onSubmit={onSubmit}>
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }}>
                Add an agenda item
              </Typography>
              <TextField
                fullWidth
                multiline
                required
                onChange={event => setMeetingNoteText(event.target.value)}
                size="small"
                value={meetingNoteText}
              />
              {saveMeetingNoteError && (
                <Alert
                  onClose={() => setSaveMeetingNoteError(null)}
                  severity="error"
                >
                  Item was not added.
                </Alert>
              )}
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSavingMeetingNote}
                color={isSuccessIndicated ? 'success' : 'primary'}
                startIcon={isSuccessIndicated ? <CheckCircleOutlineIcon /> : ''}
              >
                {isSuccessIndicated ? 'Saved' : 'Save Agenda Item'}
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default MeetingQuickView;