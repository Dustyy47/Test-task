import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";

enum ParamInputType {
  string,
}

type ParamInputValue = string;

interface Color {
  value: string;
}
interface Param {
  id: number;
  name: string;
  type: ParamInputType;
}

interface ParamValue {
  paramId: number;
  value: ParamInputValue;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

const mockParameters: Param[] = [
  {
    id: 1,
    name: "Назначение",
    type: ParamInputType.string,
  },
  {
    id: 2,
    name: "Длина",
    type: ParamInputType.string,
  },
];

function App() {
  const [model, setModel] = useState<Model>({
    paramValues: [],
    colors: [],
  });

  return (
    <div className="App">
      <ParamEditor params={mockParameters} model={model} getModel={setModel} />
      <pre>{JSON.stringify(model, null, 2)}</pre>
    </div>
  );
}

interface ParamEditorProps {
  params: Param[];
  model: Model;
  getModel: (model: Model) => any;
}

export function ParamEditor({ params, model, getModel }: ParamEditorProps) {
  const [paramValues, setNewParamValues] = useState<ParamValue[]>(
    model.paramValues
  );

  function handleChangeValue(newParam: ParamValue) {
    setNewParamValues((prev) => [
      ...prev.filter((v) => v.paramId !== newParam.paramId),
      newParam,
    ]);
  }

  return (
    <div>
      {params.map((param) => (
        <ParamInputGroup
          param={param}
          type={param.type}
          key={param.id}
          value={
            model.paramValues.find(
              (paramValue) => param.id === paramValue.paramId
            )?.value || ""
          }
          onChange={(value) => handleChangeValue(value)}
        />
      ))}
      <button onClick={() => getModel({ ...model, paramValues })}>
        Get model!
      </button>
    </div>
  );
}

interface ParamInputGroupProps {
  type: ParamInputType;
  param: Param;
  value: ParamInputValue;
  onChange: (value: ParamValue) => any;
}

export function ParamInputGroup({
  type,
  param,
  value,
  onChange,
}: ParamInputGroupProps) {
  const inputComponent: ReactNode = useMemo(() => {
    switch (type) {
      case ParamInputType.string:
        return (
          <Input
            defaultValue={value}
            onChange={(e) =>
              onChange({ paramId: param.id, value: e.target.value })
            }
          />
        );
    }
  }, [type]);

  return (
    <div>
      <label>{param.name}</label>
      {inputComponent}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ ...inputProps }: InputProps) {
  return <input {...inputProps} />;
}

export function ParamTextInput() {}

export default App;
