import { iValidator } from "../types";

const ValidatorCard = (props: iValidator) => {

  return (
    <div className="validator-card fade-i bold">
      <div className="validator-header">
        <span>{props.address}</span>
      </div>
      <ul>
        <li>State: {props.state}</li>
        <li>Stake: {props.stake}</li>
        <li>Email: {props.email}</li>
        <li>Website: {props.website}</li>
        <li>Description: {props.description}</li>
        <li>Discord: {props.discord}</li>
      </ul>
    </div>
  )
}

export default ValidatorCard