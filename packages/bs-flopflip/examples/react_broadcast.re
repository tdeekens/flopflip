/* Make all the module  */
open ReactBroadcast;

module UntoggledComponent = {
  let component = ReasonReact.statelessComponent("UntoggledComponent");
  let make = _children => {
    ...component,
    render: _self =>
      <div>
        (ReasonReact.stringToElement("At least there is a fallback!"))
      </div>
  };
};

/* ConfigureFlopFlip */
module ExampleConfigureFlopFlip = {
  let adapter: adapter = {
    "configure": _args => Js.Promise.resolve(toAny("ok")),
    "reconfigure": _args => Js.Promise.resolve(toAny("ok"))
  };
  let component = ReasonReact.statelessComponent("ExampleConfigureFlopFlip");
  let make = _children => {
    ...component,
    render: _self =>
      <ConfigureFlopFlip
        adapter
        adapterArgs={
          "clientSideId": "123",
          "user": Js.Nullable.return({"key": Js.Nullable.return("123")})
        }>
        <div />
      </ConfigureFlopFlip>
  };
};

/* ToggleFeature: https://github.com/tdeekens/flopflip#togglefeature */
module ExampleToggleFeature = {
  /* https://reasonml.github.io/reason-react/docs/en/component-as-prop.html */
  let untoggledComponent = () => <UntoggledComponent />;
  let component = ReasonReact.statelessComponent("ExampleToggleFeature");
  let make = _children => {
    ...component,
    render: _self =>
      <ToggleFeature flag="profile" untoggledComponent>
        (ReasonReact.stringToElement("I might be gone or there!"))
      </ToggleFeature>
  };
};