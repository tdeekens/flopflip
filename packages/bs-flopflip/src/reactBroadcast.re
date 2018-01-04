type any;

/* Since in ReasonReact we can't pass a component module as a prop (*),
   we need to pass it as a function, which is still a React component.
   https://reasonml.github.io/reason-react/docs/en/component-as-prop.html

   (*) well, we kind of can 😅
   [from the Discord channel:
     "Sure you can, just give it a signature"
     https://astrada.github.io/reason-react-playground/?reason=LYewJgrgNgpgBAFwJ4Ad4CUQQfAvHAbwCg45YE5gBDAaxgC44AKAPxSoQAt6BnBAJwCWAOwDmAGjhV+-KkiboYVHiGGKqAYwQA6fkq0BRWMBjCEASnNxcAPjjqVa-To0hgKVaYQKlj9Vu0+DhhYHh5JB1V-HWEQRQQqERgwAAV+EBRw+18o521NBEFVUJ5zAG4iAF8KolBIWHssHH5rQhIyGApXd08zVsinAsCEnBKAYTcPYS8mACJMbBh+WfL28kpaPGY9YTAlxiY66AwmmCtbbOVcob0CoxgTM3O7YlJSbQ-uqa9xdtI-uA7Pb8RgAfR4IQAZtYXgDSOt0ot+ABlEZbWbAJCo4KzCpvN5wyjgY6NRatV74t7rL69Cj4AbRYbBcaTWlzBY4FZ4ynwzobOitVjsLiSUEaTiCKBgHbPNo8-EfbQ06ZmX7ygnq0hA-ZwcFQmGE-EASAAPGBBAA3GyGt5Go0+K6DAJ8IRiAAqIHuj28iOa2JwcAA1IG4MLOJYbaRTQB6c1Wm2VQnVQmE7X8Q7Ehoc+CMbOrfGJnntZPJojRAAiAHkALKKXSmYEer1eADqgi4AEkwEx2ibs-xrQqPkwR0cs6dLAaeaa44PKUbSH3TqGOJxcLNo1RZnBo3PjYvsyuuOvowAjbe7m0m2OWmzmXvR-s2SSzFB6C2CGAAdy5QA
   ]
   */
type reactClassForComponentProp = unit => ReasonReact.reactElement;

type flagName = string;

type flagVariation;

type flag = {
  .
  "flag": flagName,
  "variation": option(flagVariation)
};

type flags = Js.Dict.t(flagVariation);

type adapterArgs = {
  .
  "clientSideId": string,
  "user": Js.Nullable.t({. "key": Js.Nullable.t(string)})
};

type adapter = {
  .
  "configure": adapterArgs => Js.Promise.t(any),
  "reconfigure": adapterArgs => Js.Promise.t(any)
};

/* Helpers */
let optionToBool = optional =>
  switch optional {
  | Some(_) => true
  | _ => false
  };

external toAny : 'a => any = "%identity";

/* Module definitions (the actual bindings) */
module ConfigureFlopFlip = {
  [@bs.module "@flopflip/react-broadcast"]
  external reactClass : ReasonReact.reactClass = "ConfigureFlopFlip";
  let make =
      (
        ~shouldDeferAdapterConfiguration: option(bool)=?,
        ~defaultFlags: option(flags)=?,
        ~adapterArgs: adapterArgs,
        ~adapter: adapter,
        children
      ) =>
    ReasonReact.wrapJsForReason(
      ~reactClass,
      ~props={
        "shouldDeferAdapterConfiguration":
          Js.Boolean.to_js_boolean(
            optionToBool(shouldDeferAdapterConfiguration)
          ),
        "defaultFlags": Js.Null_undefined.from_opt(defaultFlags),
        "adapterArgs": adapterArgs,
        "adapter": adapter
      },
      children
    );
};

module ToggleFeature = {
  [@bs.module "@flopflip/react-broadcast"]
  external reactClass : ReasonReact.reactClass = "ToggleFeature";
  let make =
      (
        ~flag: flagName,
        ~variation: option(flagVariation)=?,
        ~untoggledComponent: option(reactClassForComponentProp)=?,
        ~toggledComponent: option(reactClassForComponentProp)=?,
        ~render: option(unit => ReasonReact.reactElement)=?,
        children
      ) =>
    ReasonReact.wrapJsForReason(
      ~reactClass,
      ~props={
        "flag": flag,
        "flagVariation": Js.Null_undefined.from_opt(variation),
        "untoggledComponent": Js.Null_undefined.from_opt(untoggledComponent),
        "toggledComponent": Js.Null_undefined.from_opt(toggledComponent),
        "render": Js.Null_undefined.from_opt(render)
      },
      children
    );
};