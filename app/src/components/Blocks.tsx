import '../App.css';
import { useEffect, useState } from 'react';
import Block from "./Block";
import ValidatorCard from './ValidatorCard';
import { iBlock, iValidator } from '../types';

interface iBlocksProps {
  blocks: Array<iBlock>;
  validators: Array<iValidator>;
}

const Blocks = (props: iBlocksProps) => {
  const [staleBlock, setStaleBlock] = useState<iBlock | undefined>()

  useEffect(() => {
    if (props.blocks.length >= 9) {
      setStaleBlock(props.blocks[(props.blocks.length-1)])
    }
  }, [props.blocks])

  return (
    <div className="blocks-container">
      <div className='flex-column'>

        <div className='bold section-head'>Latest Blocks:</div>
        <div className='flex-row blocks-row' key={props.blocks.length > 0 ? props.blocks[0].height : 0}>
          {(props.blocks.length !== 0) && (<div className='fade-i'><Block key={props.blocks[0].height} {...props.blocks[0]} /></div>)}
          {
            staleBlock ?
            props.blocks.slice(1, props.blocks.length-1).map(block => <Block key={block.height} {...block} />)
            : props.blocks.slice(1, props.blocks.length).map(block => <Block key={block.height} {...block} />)
          }
          {staleBlock ? <div className='fade-o'><Block key={staleBlock.height} {...staleBlock} /></div> : <></>}

        </div>
          <div className='ruler' />
          <div className='flex-column validator-column'>

              <div className='bold section-head'>Total Validators: {props.validators.length}</div>

              {props.validators.map(validator => {
                return (
                  <ValidatorCard key={validator.address} {...validator} />
                )}
              )}

          </div>

      </div>
    </div>
  )
}

export default Blocks