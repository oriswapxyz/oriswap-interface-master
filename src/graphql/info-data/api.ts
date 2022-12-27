/* eslint-disable */
// @ts-nocheck
import BigNumber from 'bignumber.js'
import { client, blockClient } from './client'
import { GET_BLOCKS, GLOBAL_DATA } from './query'

interface FactoryData {
  totalVolumeUSD: string
}

interface GlobalData extends FactoryData {
  oneDayVolumeUSD: string
  mintDogTokens: string
  totalLiquidityUSD: string;
}

export async function getGlobalData() {
  let data: GlobalData = {
    totalVolumeUSD: '0',
    oneDayVolumeUSD: '0',
    mintDogTokens: '0',
    totalLiquidityUSD: '0',
  }
  let oneDayData: FactoryData = {
    totalVolumeUSD: '0',
  }
  let twoDayData: FactoryData = {
    totalVolumeUSD: '0',
  }

  let oneDayVolumeUSD = 0;

  const ONE_DAY_TIMESTAMP = 24 * 3600

  try {
    // get timestamps for the days
    const utcCurrentTime = Math.floor(new Date().getTime() / 1000)
    const utcOneDayBack = utcCurrentTime - ONE_DAY_TIMESTAMP
    const utcTwoDaysBack = utcCurrentTime - ONE_DAY_TIMESTAMP * 2

    // get the blocks needed for time travel queries
    let [oneDayBlock, twoDayBlock] = await getBlocksFromTimestamps([utcOneDayBack, utcTwoDaysBack])

    // fetch the global data
    let result = await client.query({
      query: GLOBAL_DATA(),
      fetchPolicy: "no-cache",
    })
    data = result.data.dogeswapFactories[0] as GlobalData

    // fetch the historical data
    let oneDayResult = await client.query({
      query: GLOBAL_DATA(oneDayBlock?.number),
      fetchPolicy: "no-cache",
    })
    oneDayData = oneDayResult.data.dogeswapFactories[0] as FactoryData

    let twoDayResult = await client.query({
      query: GLOBAL_DATA(twoDayBlock?.number),
      fetchPolicy: "no-cache",
    })

    twoDayData = twoDayResult.data.dogeswapFactories[0]

    if (data && oneDayData && twoDayData) {
      let [oneDayVolumeUSDData, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData.totalVolumeUSD ? oneDayData.totalVolumeUSD : 0,
        twoDayData.totalVolumeUSD ? twoDayData.totalVolumeUSD : 0
      )

      oneDayVolumeUSD = oneDayVolumeUSDData
    }
  } catch (err) {
    console.error(err)
  }

  return {
    ...data,
    oneDayVolumeUSD,
  }
}

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    let sliced = list.slice(skip, end)
    let result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first',
    })
    fetchedData = {
      ...fetchedData,
      ...result.data,
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(timestamps, skipCount = 500) {
  if (timestamps?.length === 0) {
    return []
  }

  let fetchedData = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)

  let blocks = []
  if (fetchedData) {
    for (var t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0]['number'],
        })
      }
    }
  }
  return blocks
}

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo): [string, number] => {
  // get volume info for both 24 hour periods
  let currentChange = new BigNumber(valueNow).minus(value24HoursAgo)
  let previousChange = new BigNumber(value24HoursAgo).minus(value48HoursAgo)

  const adjustedPercentChange = currentChange.minus(previousChange).dividedBy(previousChange).multipliedBy(100)

  if (adjustedPercentChange.isNaN() || !isFinite(adjustedPercentChange.toNumber())) {
    return [currentChange.toString(), 0]
  }
  return [currentChange.toString(), adjustedPercentChange.toNumber()]
}
