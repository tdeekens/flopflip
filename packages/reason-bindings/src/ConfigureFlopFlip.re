open FlopFlipTypes;

[@bs.module "@flopflip/react-broadcast"]
external reactClass : ReasonReact.reactClass = "ConfigureFlopFlip";

let make =
    (
      ~adapter: adapter,
      ~adapterArgs: adapterArgs,
      ~defaultFlags: option(flags)=?,
      ~shouldDeferAdapterConfiguration: option(bool)=?,
      children
    ) =>
  ReasonReact.wrapJsForReason(
    ~reactClass,
    ~props={
      "adapter": adapter,
      "adapterArgs": adapterArgs,
      "defaultFlags": Js.Null_undefined.from_opt(defaultFlags),
      "shouldDeferAdapterConfiguration":
        Js.Boolean.to_js_boolean(optionToBool(shouldDeferAdapterConfiguration))
    },
    children
  );