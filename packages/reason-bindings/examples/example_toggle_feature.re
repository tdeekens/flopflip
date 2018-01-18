let component = ReasonReact.statelessComponent("ExampleToggleFeature");

let make = _children => {
  ...component,
  render: _self =>
    <FlopFlip_ReactBroadcast.ToggleFeature
      flag="foo" variate=Js.Null_undefined.undefined>
      (
        match =>
          match ?
            ReasonReact.stringToElement("I'm enabled") :
            ReasonReact.stringToElement("I not visible")
      )
    </FlopFlip_ReactBroadcast.ToggleFeature>
};