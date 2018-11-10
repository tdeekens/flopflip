export default nextDisplayName => BaseComponent => {
  BaseComponent['displayName'] = nextDisplayName;

  return BaseComponent;
};
