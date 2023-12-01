import './App.css';
import Query from "@namada/shared";
import { init as initShared } from "@namada/shared/src/init";
import { useState, useEffect } from 'react';

import Header from './components/Header';
import Info from './components/Info';
import Blocks from './components/Blocks';

import { iBlock, iInfo, iValidator } from './types';

function App() {
  const [blocks, setBlocks] = useState<Array<iBlock>>([])
  const [validators, setValidators] = useState<Array<iValidator>>([])
  const [info, setInfo] = useState<iInfo>({chainId: "", epoch: "", height: ""})
  const [loading, setLoading] = useState<boolean>(true)
  const [query, setQuery] = useState<Query | undefined>()

  const queryParamsNewBlock = {
    query: "tm.event='NewBlock'",
  }
  const wsEndpoint = "wss://rpc.luminara.icu:443/websocket"
  const queryEndpoint = "https://rpc.luminara.icu:443"

  function initWs() {
    console.log("Initializing websocket...")
    const wsNewBlock = new WebSocket(wsEndpoint)

    wsNewBlock.onopen = () => {
      console.log("Websocket is open")
      //send subscription
      wsNewBlock.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          params: queryParamsNewBlock,
          id: 1,
        })
      )
    }

    wsNewBlock.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        // console.log(event.data)
        if (
          parsedData.result &&
          parsedData.result.query === queryParamsNewBlock.query
        ) {

          const newBlock: iBlock = {
            height: parseInt(parsedData.result.data.value.block.header.height),
            time: parsedData.result.data.value.block.header.time,
            tx_array: parsedData.result.data.value.block.data.txs
          }
          setBlocks(current => [newBlock, ...current.slice(0,9)])
          queryChain(newBlock.height)
        }
      } catch (err) {
        console.warn("error:", err)
      }
    }

    return () => {
      wsNewBlock.close()
    }
  }

  function queryChain(height?: number) {
    const lastEpoch = info.epoch ?? 0
    const epoch = query?.query_epoch()
    const status = fetch(queryEndpoint.concat("/status")).then(res => res.json())
    Promise.all([epoch, status])
      .then(values => {
        const newInfo = {
          chainId: values[1].result.node_info.network ?? "",
          epoch: values[0]?.toString() ?? "",
          height: height?.toString() ?? ""
        }
        setInfo(newInfo)
        if (newInfo.epoch > lastEpoch)
        {
          const allValidators: Promise<any> | undefined = query?.query_all_validator_addresses()

          allValidators?.then((validatorSet: Array<string>) => {
            //array of all promises
            const promises = validatorSet.map((validator: string) => {
              //return the promise for each query_validator_metadata call
              return query?.query_validator_metadata(validator)
                .then(metadata => {
                  //also query for stake
                  return query?.query_validator_stake(validator)
                    .then(stake => {
                      const entry: iValidator = {
                        address: validator,
                        email: metadata.email,
                        website: metadata.website,
                        description: metadata.description,
                        discord: metadata.discord,
                        state: metadata.state,
                        stake: parseInt(stake)
                      }
                      return entry
                    })
                })
            })
      
            Promise.all(promises)
              .then(updatedSet => {
                // Filter out undefined values
                const filteredSet = updatedSet.filter((validator) => validator !== undefined) as iValidator[]
                // Sort the array alphabetically by the address field
                const sortedSet = filteredSet.sort((a, b) => a.address.localeCompare(b.address));
                setValidators(sortedSet);
              })
              .catch(error => console.warn(error))
          })
        }
      })
  }

  useEffect(() => {
    if (!loading) {
      return initWs()
    }
  }, [loading])

  useEffect(() => {
    async function initWasm() {
      await initShared()
      setQuery(new Query(queryEndpoint))
      setLoading(false)
      queryChain()
    }
    initWasm()
  }, [])

  if (loading) {
    return <div className='loading'>Loading...</div>
  }

  return (
    <div className="App">
      <div>
        <Header />
        <Info {...info} />
        <hr />
        <Blocks blocks={blocks} validators={validators} />
      </div>
    </div>
  )
}

export default App;