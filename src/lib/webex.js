/**
 *
 * @param {string} accessToken
 *
 * @returns {Promise<Webex>}
 */
export const initializeWebex = (accessToken) =>
  new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line no-undef
      const webex = new Webex({
        config: {
          logger: { level: 'silent' },
          meetings: { reconnection: { enabled: true } }
        },
        credentials: { access_token: accessToken }
      });
      resolve(webex);
    } catch (e) {
      reject(`Could not initialize Webex: ${e}`);
    }
  });

/**
 *
 * @param {Webex} webex
 *
 * @returns {Promise<Webex>}
 */
export const registerDevice = (webex) =>
  new Promise((resolve, reject) => {
    try {
      if (!webex.meetings.registered) {
        webex.meetings.register().then(() => resolve(webex));
      } else {
        resolve(webex);
      }
    } catch (e) {
      reject(`Could not register device. ${e}`);
    }
  });
/**
 *
 * @param {Webex} webex
 * @param {string} destination
 * @param {HTMLVideoElement} localVideo
 * @param {HTMLAudioElement} remoteAudio
 * @param {HTMLVideoElement} remoteVideo
 * @param {HTMLButtonElement} hangupButton
 *
 * @return {Promise<Meeting>}
 */
export const startMeeting = (webex, destination, localVideo, remoteAudio, remoteVideo, hangupButton) =>
  new Promise((resolve, reject) => {
    try {
      webex.meetings.create(destination).then((meeting) => {
        // Call our helper function for binding events to meetings
        bindMeetingEvents(meeting, localVideo, remoteAudio, remoteVideo, hangupButton);
        joinMeeting(meeting);
        resolve(meeting);
      });
    } catch (e) {
      reject(`Could not start meeting. ${e}`);
    }
  });

/**
 *
 * @param {Meeting} meeting
 * @param {HTMLVideoElement} localVideo
 * @param {HTMLAudioElement} remoteAudio
 * @param {HTMLVideoElement} remoteVideo
 * @param {HTMLButtonElement} hangupButton
 *
 * @return void
 */
function bindMeetingEvents(meeting, localVideo, remoteAudio, remoteVideo, hangupButton) {
  meeting.on('error', (err) => {
    console.error(err);
  });

  // Handle media streams changes to ready state
  meeting.on('media:ready', (media) => {
    if (!media) {
      return;
    }

    if (localVideo && media.type === 'local') {
      localVideo.srcObject = media.stream;
    }
    if (remoteAudio && media.type === 'remoteAudio') {
      remoteAudio.srcObject = media.stream;
    }
    if (remoteVideo && media.type === 'remoteVideo') {
      remoteVideo.srcObject = media.stream;
    }
  });

  // Handle media streams stopping
  meeting.on('media:stopped', (media) => {
    // Remove media streams
    if (localVideo && media.type === 'local') {
      localVideo.srcObject = null;
    }
    if (remoteAudio && media.type === 'remoteAudio') {
      remoteAudio.srcObject = null;
    }
    if (remoteVideo && media.type === 'remoteVideo') {
      remoteVideo.srcObject = null;
    }
  });

  // Of course, we'd also like to be able to leave the meeting:
  if (hangupButton) {
    hangupButton.onclick = () => {
      meeting.leave();
    };
  }
}

/**
 *
 * @param {Meeting} meeting
 *
 * @returns {*}
 */
function joinMeeting(meeting) {
  return meeting.join().then(() => {
    const mediaSettings = {
      receiveVideo: true,
      receiveAudio: true,
      receiveShare: false,
      sendVideo: true,
      sendAudio: true,
      sendShare: false
    };
    // Get our local media stream and add it to the meeting
    return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
      const [localStream, localShare] = mediaStreams;
      meeting.addMedia({
        localShare,
        localStream,
        mediaSettings
      });
    });
  });
}

export const listenMessage = (webex) => {
  webex.messages.list('baburao.wxsd@ashessin.xyz').then((e) => console.log(e));
  webex.messages
    .listen()
    .then(() => {
      console.log('listening to message events');
      webex.messages.on('created', (event) => console.log('created:', event));
      webex.messages.on('deleted', (event) => console.log('deleted:', event));
    })
    .catch((e) => console.error(`Unable to register for message events: ${e}`));
};
