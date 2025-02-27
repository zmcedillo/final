function Button({type, text, onClick}){
    return(
        <button className="btn block-cube block-cube-hover" type={type} onClick={onClick}>
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
        <div className="text">{text}</div>
      </button>
    )
}

export default Button;
