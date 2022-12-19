/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  VCRegistry,
  VCRegistryInterface,
} from "../../contracts/VCRegistry";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authenticatedAddress",
        type: "address",
      },
    ],
    name: "AuthenticatedPerson",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ContractRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "PersonAuthenticatedContract",
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
    inputs: [],
    name: "BANK_ROLE",
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
    inputs: [
      {
        internalType: "address",
        name: "_bankAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_bankName",
        type: "string",
      },
    ],
    name: "authenticateBank",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_bankAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_bankName",
        type: "string",
      },
    ],
    name: "changeBankName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timeValid",
        type: "uint256",
      },
    ],
    name: "checkAuthenticated",
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
        name: "_address",
        type: "address",
      },
    ],
    name: "checkAuthenticatedOnce",
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
        name: "_bankAddress",
        type: "address",
      },
    ],
    name: "getBankName",
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
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getBankOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
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
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "revokeAuthenticationContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "revokeAuthenticationPerson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "bank",
        type: "address",
      },
    ],
    name: "revokeBank",
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
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setAuthenticatedContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setAuthenticatedPerson",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001c60003361004b565b6100467f591fa5458fe051cc8c02c405479bd38e00713c98dbd3db209d982048f1e638fa3361004b565b6100ea565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166100e6576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556100a53390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b611262806100f96000396000f3fe608060405234801561001057600080fd5b50600436106100fc5760003560e01c806301da7b311461010157806301ffc9a71461012a5780630eb714321461014d578063248a9ca314610170578063265967b4146101835780632f2ff15d1461019857806336568abe146101ab5780635909f2e3146101be5780635c7c363b146101d1578063656f2f5f146101e457806384c75367146102285780638938119e1461023b5780638f2839701461024e57806391d148541461026157806391e6afa714610274578063a217fddf14610287578063d13626fb1461028f578063d547741f146102a2578063f1801c99146102b5578063f4f3d37b146102c8575b600080fd5b61011461010f366004610e3e565b6102db565b6040516101219190610e7d565b60405180910390f35b61013d610138366004610eb0565b610387565b6040519015158152602001610121565b61016260008051602061120d83398151915281565b604051908152602001610121565b61016261017e366004610eda565b6103be565b610196610191366004610e3e565b6103d3565b005b6101966101a6366004610ef3565b610481565b6101966101b9366004610ef3565b6104a2565b6101966101cc366004610f1f565b610520565b6101966101df366004610e3e565b61055c565b6102106101f2366004610e3e565b6001600160a01b039081166000908152600160205260409020541690565b6040516001600160a01b039091168152602001610121565b610196610236366004610f1f565b610687565b610196610249366004610e3e565b6106bc565b61019661025c366004610e3e565b6107fb565b61013d61026f366004610ef3565b610814565b610196610282366004610e3e565b61083d565b610162600081565b61019661029d366004610e3e565b61096e565b6101966102b0366004610ef3565b610982565b61013d6102c3366004610e3e565b61099e565b61013d6102d6366004610fa1565b610a21565b6001600160a01b038116600090815260036020526040902080546060919061030290610fcb565b80601f016020809104026020016040519081016040528092919081815260200182805461032e90610fcb565b801561037b5780601f106103505761010080835404028352916020019161037b565b820191906000526020600020905b81548152906001019060200180831161035e57829003601f168201915b50505050509050919050565b60006001600160e01b03198216637965db0b60e01b14806103b857506301ffc9a760e01b6001600160e01b03198316145b92915050565b60009081526020819052604090206001015490565b6001600160a01b038181166000908152600160205260409020541633146104645760405162461bcd60e51b815260206004820152603a60248201527f4f6e6c79207468652062616e6b20746861742061757468656e74696361746564604482015279081d1a19481859191c995cdcc818d85b881c995d9bdad9481a5d60321b60648201526084015b60405180910390fd5b6001600160a01b0316600090815260016020819052604082200155565b61048a826103be565b61049381610b22565b61049d8383610b2c565b505050565b6001600160a01b03811633146105125760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161045b565b61051c8282610bb0565b5050565b6001600160a01b0383166000908152600360205260409020610543828483611069565b5061049d60008051602061120d83398151915284610481565b33600090815260016020819052604090912001546105c85760405162461bcd60e51b8152602060048201526024808201527f4d73672e73656e646572206e6565647320746f2062652061757468656e746963604482015263185d195960e21b606482015260840161045b565b6001600160a01b0381811660009081526002602052604090205416156106305760405162461bcd60e51b815260206004820152601e60248201527f436f6e747261637420616c72656164792061757468656e746963617465640000604482015260640161045b565b6001600160a01b03811660008181526002602052604080822080546001600160a01b0319163390811790915590519092917f6923f8bdded817154d389a68dd1653189da4bb64316742f2e8715f5666fe765291a350565b600061069281610b22565b6001600160a01b03841660009081526003602052604090206106b5838583611069565b5050505050565b60008051602061120d8339815191526106d481610b22565b6001600160a01b038281166000908152600160205260409020541615610783576001600160a01b038281166000908152600160205260409020541633146107835760405162461bcd60e51b815260206004820152603e60248201527f41206e65772062616e6b2063616e206e6f742061757468656e7469636174652060448201527f612077616c6c6574206f776e656420627920616e6f746865722062616e6b0000606482015260840161045b565b6040805180820182523381524260208083019182526001600160a01b038681166000818152600193849052868120955186546001600160a01b03191693169290921785559251939091019290925591517fa9586a145b7f42b11f0f9c50b278e7859233b30d9908848bc7c43e3c3a6895c29190a25050565b610806600082610481565b610811600033610982565b50565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b6001600160a01b0380821660009081526002602090815260408083205484168084526001909252909120549091163382148061088157506001600160a01b03811633145b6109015760405162461bcd60e51b815260206004820152604560248201527f4f6e6c7920746865206f776e6572206f662074686520636f6e7472616374206f60448201527f7220697427732062616e6b2063616e207265766f6b652061757468656e74696360648201526430ba34b7b760d91b608482015260a40161045b565b6001600160a01b038084166000818152600260205260408082205490519316927f23dd6441bb4f9d75ec0b57c0dcc3825318a042cb2b024bb8c89dfaf77dbe0e5a9190a350506001600160a01b0316600090815260026020526040902080546001600160a01b0319169055565b61081160008051602061120d833981519152825b61098b826103be565b61099481610b22565b61049d8383610bb0565b6000806109b960008051602061120d83398151915284610814565b806109ca57506109ca600084610814565b6001600160a01b0384811660008181526002602090815260408083205460019283905292200154939450909116151591151590158280610a075750815b80610a0f5750835b80610a175750805b9695505050505050565b6000610a3b60008051602061120d83398151915284610814565b80610a4c5750610a4c600084610814565b15610a59575060016103b8565b6001600160a01b038381166000908152600260205260409020541615610ab3576001600160a01b038084166000908152600260209081526040808320549093168252600190819052919020015415610ab3575060016103b8565b6001600160a01b0383166000908152600160208190526040909120015415610b19576001600160a01b03831660009081526001602081905260408220015490610afc848361113e565b905060008083118015610b0e57508142105b93506103b892505050565b50600092915050565b6108118133610c15565b610b368282610814565b61051c576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055610b6c3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610bba8282610814565b1561051c576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b610c1f8282610814565b61051c57610c2c81610c6e565b610c37836020610c80565b604051602001610c48929190611151565b60408051601f198184030181529082905262461bcd60e51b825261045b91600401610e7d565b60606103b86001600160a01b03831660145b60606000610c8f8360026111c0565b610c9a90600261113e565b6001600160401b03811115610cb157610cb1611005565b6040519080825280601f01601f191660200182016040528015610cdb576020820181803683370190505b509050600360fc1b81600081518110610cf657610cf66111df565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610d2557610d256111df565b60200101906001600160f81b031916908160001a9053506000610d498460026111c0565b610d5490600161113e565b90505b6001811115610dcc576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610d8857610d886111df565b1a60f81b828281518110610d9e57610d9e6111df565b60200101906001600160f81b031916908160001a90535060049490941c93610dc5816111f5565b9050610d57565b508315610e1b5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161045b565b9392505050565b80356001600160a01b0381168114610e3957600080fd5b919050565b600060208284031215610e5057600080fd5b610e1b82610e22565b60005b83811015610e74578181015183820152602001610e5c565b50506000910152565b6020815260008251806020840152610e9c816040850160208701610e59565b601f01601f19169190910160400192915050565b600060208284031215610ec257600080fd5b81356001600160e01b031981168114610e1b57600080fd5b600060208284031215610eec57600080fd5b5035919050565b60008060408385031215610f0657600080fd5b82359150610f1660208401610e22565b90509250929050565b600080600060408486031215610f3457600080fd5b610f3d84610e22565b925060208401356001600160401b0380821115610f5957600080fd5b818601915086601f830112610f6d57600080fd5b813581811115610f7c57600080fd5b876020828501011115610f8e57600080fd5b6020830194508093505050509250925092565b60008060408385031215610fb457600080fd5b610fbd83610e22565b946020939093013593505050565b600181811c90821680610fdf57607f821691505b602082108103610fff57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b601f82111561049d57600081815260208120601f850160051c810160208610156110425750805b601f850160051c820191505b818110156110615782815560010161104e565b505050505050565b6001600160401b0383111561108057611080611005565b6110948361108e8354610fcb565b8361101b565b6000601f8411600181146110c857600085156110b05750838201355b600019600387901b1c1916600186901b1783556106b5565b600083815260209020601f19861690835b828110156110f957868501358255602094850194600190920191016110d9565b50868210156111165760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103b8576103b8611128565b76020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b815260008351611183816017850160208801610e59565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516111b4816028840160208801610e59565b01602801949350505050565b60008160001904831182151516156111da576111da611128565b500290565b634e487b7160e01b600052603260045260246000fd5b60008161120457611204611128565b50600019019056fe591fa5458fe051cc8c02c405479bd38e00713c98dbd3db209d982048f1e638faa2646970667358221220579b09178749da9e216d84c1b85bffb8cd7c10b86c0806b4396c3b8bf6ae4c6664736f6c63430008100033";

type VCRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VCRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VCRegistry__factory extends ContractFactory {
  constructor(...args: VCRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<VCRegistry> {
    return super.deploy(overrides || {}) as Promise<VCRegistry>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): VCRegistry {
    return super.attach(address) as VCRegistry;
  }
  override connect(signer: Signer): VCRegistry__factory {
    return super.connect(signer) as VCRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VCRegistryInterface {
    return new utils.Interface(_abi) as VCRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VCRegistry {
    return new Contract(address, _abi, signerOrProvider) as VCRegistry;
  }
}