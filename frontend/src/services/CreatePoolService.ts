import { AbiItem } from 'web3-utils'
import factoryAbi from '../abi/factory.json'
import erc20Abi from '../abi/erc20.json'
import { clearTransaction, handleTransaction, TransactionType } from '../variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'
import {factoryAddress} from '../config'
import { notifyError } from '../services/NotificationService'

export const createPool = async (ownerAddress: string, chainId: number, rewardAddr: string, tokenAddr: string, supply: number, endDate: number, lockedTime: number, node: boolean, isNFT: boolean) => {
    let w_ret = false;

    const web3 = initializeWeb3(chainId, node)
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], rewardAddr);
    const contractMinter = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress) 
    const rewardTokenDecimals = await contractErc20.methods.decimals().call();

    const num256 = supply * 10 ** rewardTokenDecimals
    const _bigSupply = '0x' + num256.toString(16)

    try{
        await contractErc20.methods.increaseAllowance(factoryAddress, _bigSupply).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        });
        await contractMinter.methods.createNewTokenContract(rewardAddr, tokenAddr, _bigSupply, endDate, lockedTime, isNFT).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })    
        w_ret = true;
    }
    catch(e) {
        console.log(e)
    }

    return w_ret;
}

export const isExistPool = async (chainId: number, node: boolean, isNFT: boolean) => {
    let w_ret = false;
    const web3 = initializeWeb3(chainId, node);    

    const contractMinter = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);
    
    if (isNFT) {
        w_ret = await contractMinter.methods.isCreatedNFTStakingPool().call();
    } else {
        w_ret = await contractMinter.methods.isCreatedTokenStakingPool().call();
    }
   
    return w_ret;
}

export const removePool = async (chainId: number, ownerAddress: string, node: boolean, isNFT: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    

    const contractMinter = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);

    try{
        await contractMinter.methods.removeTokenContract(isNFT).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })    
        return true;
    } catch(e) {
        notifyError('Locked Time')
    }

    return false;
}
