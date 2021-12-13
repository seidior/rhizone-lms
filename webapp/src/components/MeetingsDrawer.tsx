import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, { Component, Fragment } from 'react';

import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting } from '../types/api';

interface MeetingsDrawerProps {
  open: boolean;
  loggedIn: boolean | null;
  handleCalendarClick: () => void;
  updateLoggedIn: (isLoggedIn: boolean) => void;
}

interface MeetingsDrawerState {
  allMeetings: Meeting[];
  upcomingMeetings: Meeting[];
  pastMeetings: Meeting[];
}

class MeetingsDrawer extends Component<
  MeetingsDrawerProps,
  MeetingsDrawerState
> {
  constructor(props: MeetingsDrawerProps) {
    super(props);
    this.state = {
      allMeetings: [],
      upcomingMeetings: [],
      pastMeetings: [],
    };
  }

  componentDidMount() {
    this.fetchMeetingsInfoList();
  }

  fetchMeetingsInfoList = async () => {
    const fetchMeetings = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/meetings`,
      { credentials: 'include' }
    );
    if (fetchMeetings.status === 401) {
      this.props.updateLoggedIn(false);
    }
    if (fetchMeetings.ok) {
      const { data: allMeetings } = await fetchMeetings.json();
      this.props.updateLoggedIn(true);
      let startIndexOfPastMeeting;
      for (let i = 0; i < allMeetings.length; i++) {
        if (Date.parse(allMeetings[i].starts_at) < Date.now()) {
          startIndexOfPastMeeting = i;
          break;
        }
      }
      if (!startIndexOfPastMeeting) {
        this.setState({
          upcomingMeetings: allMeetings
        })
      } else if (startIndexOfPastMeeting === 0) {
        this.setState({
          pastMeetings: allMeetings
        })
      } else {
        this.setState({
          upcomingMeetings: allMeetings
            .slice(0, startIndexOfPastMeeting)
            .reverse(),
          pastMeetings: allMeetings.slice(startIndexOfPastMeeting),
        });
      }
    }
  };

  render() {
    return (
      <Drawer
        variant="persistent"
        anchor="right"
        open={this.props.open}
        transitionDuration={400}
        PaperProps={{
          sx: {
            '@media (max-width: 360px)': { width: '100vw' },
            width: '360px',
          },
        }}
      >
        <List sx={{ pt: 0 }}>
          <ListItem
            sx={{
              backgroundColor: 'primary.main',
              color: 'common.white',
              p: 1,
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => this.props.handleCalendarClick()}
          >
            <ArrowRightIcon />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              backgroundColor: 'primary.main',
              py: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: 'common.white' }}>
              Upcoming meetings
            </Typography>
          </ListItem>
          {this.state.upcomingMeetings.map(meeting => (
            <Fragment key={meeting.id}>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={formatDate(meeting.starts_at)}
                  secondary={formatTime(meeting.starts_at)}
                />
              </ListItem>
            </Fragment>
          ))}
          <Divider />
          <ListItem
            sx={{
              backgroundColor: 'primary.main',
              py: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: 'common.white' }}>
              Past meetings
            </Typography>
          </ListItem>

          {this.state.pastMeetings.map(meeting => (
            <Fragment key={meeting.id}>
              <ListItem>
                <ListItemText
                  primary={formatDate(meeting.starts_at)}
                  secondary={formatTime(meeting.starts_at)}
                />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Drawer>
    );
  }
}

export default MeetingsDrawer;
