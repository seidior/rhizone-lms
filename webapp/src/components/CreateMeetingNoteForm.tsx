import { Alert, Snackbar, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { FormEventHandler, useState } from 'react';

import { EntityId } from '../types/api';
interface CreateMeetingNoteFormProps {
  agendaOwningParticipantId: EntityId;
  meetingId: EntityId;
  onMeetingNoteChanged?: (id: EntityId) => void;
  sortOrder: number | undefined;
}

const CreateMeetingNoteForm = ({
  agendaOwningParticipantId,
  meetingId,
  onMeetingNoteChanged,
  sortOrder,
}: CreateMeetingNoteFormProps) => {
  const [isSavingMeetingNote, setIsSavingMeetingNote] = useState(false);
  const [saveMeetingNoteError, setSaveMeetingNoteError] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [meetingNoteText, setMeetingNoteText] = useState('');
  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    setIsSavingMeetingNote(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/meetings/${meetingId}/notes`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agenda_owning_participant_id: agendaOwningParticipantId,
        note_text: meetingNoteText,
        sort_order: sortOrder,
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsSavingMeetingNote(false);
        if (error) {
          setSaveMeetingNoteError(error);
        } else {
          setSaveMeetingNoteError(null);
        }
        if (data) {
          setIsSuccessMessageVisible(true);
          setMeetingNoteText('');
          if (onMeetingNoteChanged) {
            onMeetingNoteChanged(data.id);
          }
        }
      })
      .catch(error => {
        setIsSavingMeetingNote(false);
        setSaveMeetingNoteError(error);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
        Add an agenda Item
      </Typography>
      <TextField
        fullWidth
        multiline
        required
        sx={{
          mt: 2,
          mb: 2,
        }}
        onChange={event => setMeetingNoteText(event.target.value)}
        value={meetingNoteText}
      />
      {saveMeetingNoteError && (
        <div>
          <Alert onClose={() => setSaveMeetingNoteError(null)} severity="error">
            Item was not added.
          </Alert>
        </div>
      )}
      <LoadingButton
        fullWidth
        type="submit"
        variant="contained"
        loading={isSavingMeetingNote}
      >
        Save Agenda Item
      </LoadingButton>
      {isSuccessMessageVisible && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setIsSuccessMessageVisible(false)}
        >
          <Alert
            onClose={() => setIsSuccessMessageVisible(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            The meeting note was saved.
          </Alert>
        </Snackbar>
      )}
    </form>
  );
};

export default CreateMeetingNoteForm;