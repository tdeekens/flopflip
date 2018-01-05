open FlopFlipTypes;

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