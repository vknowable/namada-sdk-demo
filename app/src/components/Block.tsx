import '../App.css';
import { iBlock } from '../types';

const Block = (props: iBlock) => {
  const localDateTime = new Date(props.time)
  const addZero = (time: number) => time < 10 ? "0".concat(time.toString()) : time.toString()

  return (
    <div className="block-card">
      <div className='block-header bold'>
        {props.height}
      </div>
      <div className='bold card-item'>{localDateTime.getFullYear()}/{localDateTime.getMonth()}/{localDateTime.getDate()}</div>
      <div className='bold card-item'>{addZero(localDateTime.getHours())}:{addZero(localDateTime.getMinutes())}:{addZero(localDateTime.getSeconds())}</div>
      <div className='bold card-item'>Num of txs: {props.tx_array?.length ?? "0"}</div>
      <div></div>
    </div>
  )
}

export default Block