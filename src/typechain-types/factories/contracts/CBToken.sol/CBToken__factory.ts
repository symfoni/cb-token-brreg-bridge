/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  CBToken,
  CBTokenInterface,
} from "../../../contracts/CBToken.sol/CBToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "vcRegistryAddress_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "BURNER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001bbd38038062001bbd833981016040819052620000349162000521565b8383600362000044838262000653565b50600462000053828262000653565b5062000065915060009050336200012d565b620000917f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6336200012d565b620000bd7f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848336200012d565b6006805460ff191660ff84161790556301dfe200600755600880546001600160a01b0319166001600160a01b03831617905562000123336200010160065460ff1690565b6200010e90600a62000832565b6200011d90620f42406200084a565b6200013d565b50505050620008a6565b62000139828262000212565b5050565b6001600160a01b038216620001995760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b620001a7600083836200029c565b8060026000828254620001bb91906200086c565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6200021e82826200036b565b620001395760008281526005602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620002583390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b620002b48383836200036660201b6200040d1760201c565b620002bf8362000398565b6200030d5760405162461bcd60e51b815260206004820152601860248201527f53656e646572206e6f742061757468656e746963617465640000000000000000604482015260640162000190565b620003188262000428565b620003665760405162461bcd60e51b815260206004820152601b60248201527f526563697069656e74206e6f742061757468656e746963617465640000000000604482015260640162000190565b505050565b60008281526005602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b60006001600160a01b038216158062000392575060085460075460405163f4f3d37b60e01b81526001600160a01b038581166004830152602482019290925291169063f4f3d37b906044015b602060405180830381865afa15801562000402573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000392919062000882565b60085460405163f1801c9960e01b81526001600160a01b038381166004830152600092169063f1801c9990602401620003e4565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200048457600080fd5b81516001600160401b0380821115620004a157620004a16200045c565b604051601f8301601f19908116603f01168101908282118183101715620004cc57620004cc6200045c565b81604052838152602092508683858801011115620004e957600080fd5b600091505b838210156200050d5785820183015181830184015290820190620004ee565b600093810190920192909252949350505050565b600080600080608085870312156200053857600080fd5b84516001600160401b03808211156200055057600080fd5b6200055e8883890162000472565b955060208701519150808211156200057557600080fd5b50620005848782880162000472565b935050604085015160ff811681146200059c57600080fd5b60608601519092506001600160a01b0381168114620005ba57600080fd5b939692955090935050565b600181811c90821680620005da57607f821691505b602082108103620005fb57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200036657600081815260208120601f850160051c810160208610156200062a5750805b601f850160051c820191505b818110156200064b5782815560010162000636565b505050505050565b81516001600160401b038111156200066f576200066f6200045c565b6200068781620006808454620005c5565b8462000601565b602080601f831160018114620006bf5760008415620006a65750858301515b600019600386901b1c1916600185901b1785556200064b565b600085815260208120601f198616915b82811015620006f057888601518255948401946001909101908401620006cf565b50858210156200070f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115620007765781600019048211156200075a576200075a6200071f565b808516156200076857918102915b93841c93908002906200073a565b509250929050565b6000826200078f5750600162000392565b816200079e5750600062000392565b8160018114620007b75760028114620007c257620007e2565b600191505062000392565b60ff841115620007d657620007d66200071f565b50506001821b62000392565b5060208310610133831016604e8410600b841016171562000807575081810a62000392565b62000813838362000735565b80600019048211156200082a576200082a6200071f565b029392505050565b60006200084360ff8416836200077e565b9392505050565b60008160001904831182151516156200086757620008676200071f565b500290565b808201808211156200039257620003926200071f565b6000602082840312156200089557600080fd5b815180151581146200084357600080fd5b61130780620008b66000396000f3fe608060405234801561001057600080fd5b50600436106101125760003560e01c806301ffc9a71461011757806306fdde031461013f578063095ea7b31461015457806318160ddd1461016757806323b872dd14610179578063248a9ca31461018c578063282c51f31461019f5780632f2ff15d146101b4578063313ce567146101c957806336568abe146101de57806339509351146101f157806340c10f191461020457806370a082311461021757806391d148541461024057806395d89b41146102535780639dc29fac1461025b578063a217fddf1461026e578063a457c2d714610276578063a9059cbb14610289578063d53913931461029c578063d547741f146102b1578063dd62ed3e146102c4575b600080fd5b61012a610125366004610f8e565b6102d7565b60405190151581526020015b60405180910390f35b61014761030e565b6040516101369190610fdc565b61012a61016236600461102b565b6103a0565b6002545b604051908152602001610136565b61012a610187366004611055565b6103b8565b61016b61019a366004611091565b6103dc565b61016b60008051602061127283398151915281565b6101c76101c23660046110aa565b6103f1565b005b60065460405160ff9091168152602001610136565b6101c76101ec3660046110aa565b610412565b61012a6101ff36600461102b565b610495565b6101c761021236600461102b565b6104b7565b61016b6102253660046110d6565b6001600160a01b031660009081526020819052604090205490565b61012a61024e3660046110aa565b6104d9565b610147610504565b6101c761026936600461102b565b610513565b61016b600081565b61012a61028436600461102b565b610535565b61012a61029736600461102b565b6105b0565b61016b60008051602061129283398151915281565b6101c76102bf3660046110aa565b6105be565b61016b6102d23660046110f1565b6105da565b60006001600160e01b03198216637965db0b60e01b148061030857506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606003805461031d9061111b565b80601f01602080910402602001604051908101604052809291908181526020018280546103499061111b565b80156103965780601f1061036b57610100808354040283529160200191610396565b820191906000526020600020905b81548152906001019060200180831161037957829003601f168201915b5050505050905090565b6000336103ae818585610605565b5060019392505050565b6000336103c6858285610729565b6103d18585856107a3565b506001949350505050565b60009081526005602052604090206001015490565b6103fa826103dc565b61040381610940565b61040d838361094d565b505050565b6001600160a01b03811633146104875760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61049182826109d3565b5050565b6000336103ae8185856104a883836105da565b6104b2919061116b565b610605565b6000805160206112928339815191526104cf81610940565b61040d8383610a3a565b60009182526005602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60606004805461031d9061111b565b60008051602061127283398151915261052b81610940565b61040d8383610af3565b6000338161054382866105da565b9050838110156105a35760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b606482015260840161047e565b6103d18286868403610605565b6000336103ae8185856107a3565b6105c7826103dc565b6105d081610940565b61040d83836109d3565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166106675760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161047e565b6001600160a01b0382166106c85760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161047e565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061073584846105da565b9050600019811461079d57818110156107905760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161047e565b61079d8484848403610605565b50505050565b6001600160a01b0383166108075760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161047e565b6001600160a01b0382166108695760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161047e565b610874838383610c1f565b6001600160a01b038316600090815260208190526040902054818110156108ec5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161047e565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290926000805160206112b2833981519152910160405180910390a361079d565b61094a8133610cc2565b50565b61095782826104d9565b6104915760008281526005602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561098f3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6109dd82826104d9565b156104915760008281526005602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6001600160a01b038216610a905760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161047e565b610a9c60008383610c1f565b8060026000828254610aae919061116b565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481526000805160206112b2833981519152910160405180910390a35050565b6001600160a01b038216610b535760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b606482015260840161047e565b610b5f82600083610c1f565b6001600160a01b03821660009081526020819052604090205481811015610bd35760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b606482015260840161047e565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192916000805160206112b2833981519152910160405180910390a3505050565b610c2883610d1b565b610c6f5760405162461bcd60e51b815260206004820152601860248201527714d95b99195c881b9bdd08185d5d1a195b9d1a58d85d195960421b604482015260640161047e565b610c7882610da7565b61040d5760405162461bcd60e51b815260206004820152601b60248201527a149958da5c1a595b9d081b9bdd08185d5d1a195b9d1a58d85d1959602a1b604482015260640161047e565b610ccc82826104d9565b61049157610cd981610dda565b610ce4836020610dec565b604051602001610cf592919061117e565b60408051601f198184030181529082905262461bcd60e51b825261047e91600401610fdc565b60006001600160a01b0382161580610308575060085460075460405163f4f3d37b60e01b81526001600160a01b038581166004830152602482019290925291169063f4f3d37b906044015b602060405180830381865afa158015610d83573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061030891906111ed565b60085460405163f1801c9960e01b81526001600160a01b038381166004830152600092169063f1801c9990602401610d66565b60606103086001600160a01b03831660145b60606000610dfb83600261120f565b610e0690600261116b565b6001600160401b03811115610e1d57610e1d61122e565b6040519080825280601f01601f191660200182016040528015610e47576020820181803683370190505b509050600360fc1b81600081518110610e6257610e62611244565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610e9157610e91611244565b60200101906001600160f81b031916908160001a9053506000610eb584600261120f565b610ec090600161116b565b90505b6001811115610f38576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610ef457610ef4611244565b1a60f81b828281518110610f0a57610f0a611244565b60200101906001600160f81b031916908160001a90535060049490941c93610f318161125a565b9050610ec3565b508315610f875760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161047e565b9392505050565b600060208284031215610fa057600080fd5b81356001600160e01b031981168114610f8757600080fd5b60005b83811015610fd3578181015183820152602001610fbb565b50506000910152565b6020815260008251806020840152610ffb816040850160208701610fb8565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461102657600080fd5b919050565b6000806040838503121561103e57600080fd5b6110478361100f565b946020939093013593505050565b60008060006060848603121561106a57600080fd5b6110738461100f565b92506110816020850161100f565b9150604084013590509250925092565b6000602082840312156110a357600080fd5b5035919050565b600080604083850312156110bd57600080fd5b823591506110cd6020840161100f565b90509250929050565b6000602082840312156110e857600080fd5b610f878261100f565b6000806040838503121561110457600080fd5b61110d8361100f565b91506110cd6020840161100f565b600181811c9082168061112f57607f821691505b60208210810361114f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561030857610308611155565b76020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8152600083516111b0816017850160208801610fb8565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516111e1816028840160208801610fb8565b01602801949350505050565b6000602082840312156111ff57600080fd5b81518015158114610f8757600080fd5b600081600019048311821515161561122957611229611155565b500290565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008161126957611269611155565b50600019019056fe3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a8489f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa264697066735822122095d47cc969c6a297f6aa3e67bb4131b7d486760df5b157fad80d448857b1782d64736f6c63430008100033";

type CBTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CBTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CBToken__factory extends ContractFactory {
  constructor(...args: CBTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    decimals_: PromiseOrValue<BigNumberish>,
    vcRegistryAddress_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CBToken> {
    return super.deploy(
      name_,
      symbol_,
      decimals_,
      vcRegistryAddress_,
      overrides || {}
    ) as Promise<CBToken>;
  }
  override getDeployTransaction(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    decimals_: PromiseOrValue<BigNumberish>,
    vcRegistryAddress_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name_,
      symbol_,
      decimals_,
      vcRegistryAddress_,
      overrides || {}
    );
  }
  override attach(address: string): CBToken {
    return super.attach(address) as CBToken;
  }
  override connect(signer: Signer): CBToken__factory {
    return super.connect(signer) as CBToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CBTokenInterface {
    return new utils.Interface(_abi) as CBTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CBToken {
    return new Contract(address, _abi, signerOrProvider) as CBToken;
  }
}