interface SubmitButtonProps{
    SubmitHandler:()=>void;
}

const SubmitButton:React.FC<SubmitButtonProps>=({
    SubmitHandler
})=>{
    return(
        <button
            onClick={SubmitHandler}
            className="form-submit-button"
        >
            Login!
        </button>
    );
}

export default SubmitButton;