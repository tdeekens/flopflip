export default hocName => BaseComponent => {
  const previousDisplayName = BaseComponent.displayName || BaseComponent.name;

  BaseComponent['displayName'] = `${hocName}(${previousDisplayName})`;

  return BaseComponent;
};
