/**
 * To avoid having to rely on node-uuid and crypto.
 *
 * Credit: https://gist.github.com/antonioaguilar/6135f84658328d399ed656ba3169e558
 */
export default () => {
  let date = new Date().getTime();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const random = ((date + Math.random() * 16) % 16) | 0;

    date = Math.floor(date / 16);

    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });

  return uuid;
};
