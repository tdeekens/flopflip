export default (BaseComponent, hocName) => {
  const previousDisplayName = BaseComponent.displayName || BaseComponent.name;

  return `${hocName}(${previousDisplayName})`;
};
