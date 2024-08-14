import React from 'react'

const Card = ({card,handleSelected,rotated,disabled}) => {
  
  const handleClick=() =>{
    if(!disabled){
        handleSelected(card)
    }
  }
  
  
    return (
    <div className="w-[150px] card">
          <div className={rotated ? "rotated" : ""}>
          <img className={`front`} src={card.path} />
          <img className="back" onClick={handleClick} src="/img/mystery.png"/>
          </div>
        </div>
  )
}

export default Card