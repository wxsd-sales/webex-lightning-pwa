/**
 *
 * @param {Webex} webex
 * @param {function(event) : boolean} filter
 * @param {function(event) : boolean} onCreate
 * @param {function(event) : boolean} onDelete
 */
export const messageConnection = (webex, filter, onCreate, onDelete) => {
  webex.messages
    .listen()
    .then(() => {
      webex.messages.on('created', (event) => onCreate(event));
      webex.messages.on('deleted', (event) => onDelete(event));
    })
    .catch((e) => console.error(`Unable to register for message events: ${e}`));
};
