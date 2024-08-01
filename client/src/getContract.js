import TodoList from './contracts/TodoList.json';

const getContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = TodoList.networks[networkId];
  const contract = new web3.eth.Contract(
    TodoList.abi,
    deployedNetwork && deployedNetwork.address,
  );
  return contract;
};

export default getContract;
