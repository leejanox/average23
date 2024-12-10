interface InputProps{
    onChange:React.ChangeEventHandler<HTMLInputElement>;
    id?:string;
    type:string;
    name:string; 
    value?:string|number|undefined;
    pattern?:string|undefined;
    placeholder?:string;
    title?:string;
}

const Input:React.FC<InputProps>=({
    onChange,
    id,
    type,
    name,
    value,
    placeholder,
    pattern
})=>{
    return(
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            pattern={pattern}
            onChange={onChange}
            className="form-input"
            autoComplete="off"
            required
        />
    );
}

export default Input;