import { Button, Theme, makeStyles } from '@material-ui/core';
import { Send as SendIcon, Stop as StopIcon } from '@material-ui/icons';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import React from 'react';

import AudioMediaRecorder from '../audio-media-recorder';
import ChatController from '../chat-controller';
import { AudioActionRequest, AudioActionResponse } from '../chat-types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    '& > *': {
      flex: '1 1 auto',
      minWidth: 0,
    },
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const MuiAudioInput = ({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: AudioActionRequest;
}): React.ReactElement => {
  const classes = useStyles();
  const chatCtl = chatController;
  const [audioRec] = React.useState(AudioMediaRecorder.getInstance());
  const [stopped, setStopped] = React.useState(true);
  const [audio, setAudio] = React.useState<Blob | undefined>();
  const [error, setError] = React.useState<Error | undefined>();

  const handleStart = async (): Promise<void> => {
    try {
      await audioRec.initialize();
      await audioRec.startRecord();
      setStopped(false);
    } catch (e) {
      setError(e);
    }
  };

  const handleStop = async (): Promise<void> => {
    try {
      const a = await audioRec.stopRecord();
      setAudio(a);
      setStopped(true);
    } catch (e) {
      setError(e);
    }
  };

  const sendResponse = (): void => {
    if (audio) {
      const value: AudioActionResponse = {
        type: 'audio',
        value: 'Audio',
        audio,
      };
      chatCtl.setActionResponse(actionRequest, value);
    }
  };

  if (error) {
    const value: AudioActionResponse = {
      type: 'audio',
      value: error.message,
      error,
    };
    chatCtl.setActionResponse(actionRequest, value);
  }

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <div className={classes.container}>
      {stopped && (
        <Button
          type="button"
          onClick={handleStart}
          disabled={!stopped}
          variant="contained"
          color="primary"
          startIcon={<KeyboardVoiceIcon />}
        >
          Rec start
        </Button>
      )}
      {!stopped && (
        <Button
          type="button"
          onClick={handleStop}
          disabled={stopped}
          variant="contained"
          color="primary"
          startIcon={<StopIcon />}
        >
          Rec stop
        </Button>
      )}
      <Button
        type="button"
        onClick={sendResponse}
        disabled={!audio}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        {sendButtonText}
      </Button>
    </div>
  );
};

export default MuiAudioInput;
