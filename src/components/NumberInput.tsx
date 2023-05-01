import ErrorText from "./ErrorText";
import Label from "./Label";

interface Props {
  value: number;
  error: string;
  name: string;
  label: string;
  handleChange?(e: React.ChangeEvent<HTMLInputElement>): void;
}

const NumberInput = ({ value, error, name, label, handleChange }: Props) => {
  return (
    <div className='w-full max-w-xs mx-auto flex flex-col'>
      <Label htmlFor={name} label={label} />
      <input
        className='shadow appearance-none border rounded w-24 py-2 px-3 h-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        id={name}
        type='number'
        value={value}
        onChange={handleChange}
        min={0}
        max={30}
        onFocus={(e) => e.target.select()}
      />
      {error && <ErrorText error={error} />}
    </div>
  );
};

export default NumberInput;
