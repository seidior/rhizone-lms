import { Box, Container, Typography } from '@mui/material';

import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import MeetingsDrawer from './MeetingsDrawer';
import MeetingPage from './MeetingPage';
import Reflections from './Reflections';

interface AppState {
  loggedIn: boolean | null;
  isMeetingDrawerOpen: boolean;
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      loggedIn: null,
      isMeetingDrawerOpen: false,
    };
  }

  async componentDidMount() {
    const fetchSessionInfo = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/auth/session`,
      { credentials: 'include' }
    );
    if (fetchSessionInfo.ok) {
      const { data: sessionInfo } = await fetchSessionInfo.json();
      this.setState({ loggedIn: sessionInfo.authenticated });
    }
  }

  toggleMeetingDrawerOpen = () => {
    this.setState({ isMeetingDrawerOpen: !this.state.isMeetingDrawerOpen });
  };

  render() {
    return (
      <>
        <Navbar
          loggedIn={this.state.loggedIn}
          onCalendarClick={this.toggleMeetingDrawerOpen}
        />
        <Container fixed>
          {this.state.loggedIn === true && (
            <Router>
              <Routes>
                <Route path="/" element={<Reflections />} />
                <Route path="/meetings/:id" element={<MeetingPage />} />
              </Routes>
              <MeetingsDrawer
                isDrawerOpen={this.state.isMeetingDrawerOpen}
                onClose={this.toggleMeetingDrawerOpen}
              />
            </Router>
          )}
          <Box sx={{ my: 12 }}>
            <Typography align="center">
              <small>© OpenTree Education Inc.</small>
            </Typography>
          </Box>
        </Container>
      </>
    );
  }
}

export default App;
