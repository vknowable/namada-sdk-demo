import { iInfo } from "../types";

const Info = (props: iInfo) => {

  return (
    <div>
      <p className="bold">Chain-id: <span className="info-item">{props.chainId}</span></p>
      <p className="bold">Epoch: <span className="info-item">{props.epoch}</span></p>
      <p className="bold">Height: <span className="info-item">{props.height}</span></p>
    </div>
  )
}

export default Info