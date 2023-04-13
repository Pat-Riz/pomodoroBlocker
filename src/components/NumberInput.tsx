interface Props {
  value: number;
  error: string;
  name: string;
  label: string;
  handleChange?(e: React.ChangeEvent<HTMLInputElement>): void;
}

const NumberInput = ({ value, error, name, label, handleChange }: Props) => {
  return (
    <div className='w-full max-w-xs mx-auto'>
      <label
        className='block text-gray-700 text-sm font-bold mb-1'
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className='shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        id={name}
        type='number'
        value={value}
        // onChange={handleChange}
      />
      {error && <p className='text-red-500 text-xs italic mt-1'>{error}</p>}
    </div>
  );
};

export default NumberInput;
