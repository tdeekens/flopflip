open FlopFlip__Types;

module Subscriber = {
  [@bs.module "react-broadcast"]
  external reactClass : ReasonReact.reactClass = "Subscriber";
  let make = (~channel: string, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass,
      ~props={"channel": channel},
      children
    );
};

[@bs.module "@flopflip/react"]
external isFeatureEnabled :
  (
    ~flagName: string,
    ~flagVariation: Js.Nullable.t(flagVariation)=?,
    Js.t({..})
  ) =>
  bool =
  "";

let allFlagsPropKey = "@flopflip/flags";

let component = ReasonReact.statelessComponent("ToggleFeature");

let make = (~flag, ~variate: Js.Nullable.t(flagVariation), children) => {
  ...component,
  render: _self =>
    <Subscriber channel=allFlagsPropKey>
      (
        data => {
          let isEnabled =
            isFeatureEnabled(~flagName=flag, ~flagVariation=variate, data);
          children[0](isEnabled);
        }
      )
    </Subscriber>
};