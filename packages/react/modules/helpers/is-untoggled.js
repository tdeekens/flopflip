const isUntoggled = (flagName, flagVariate = true) => props =>
  props[flagName] !== flagVariate;

export default isUntoggled;
